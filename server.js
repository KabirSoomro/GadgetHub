require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const nodemailer = require('nodemailer');
const { v4: uuidv4 } = require('uuid');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

const app = express();
const PORT = process.env.PORT || 3000;

// Database setup
const adapter = new FileSync('orders.json');
const db = low(adapter);
db.defaults({ orders: [] }).write();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ---------- API Endpoints ----------

// 1. Create payment intent (for card payments)
app.post('/api/create-payment-intent', async (req, res) => {
  const { amount } = req.body; // amount in rupees
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // convert to paisa
      currency: 'pkr',
      automatic_payment_methods: { enabled: true },
    });
    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. Place order (COD or after successful card payment)
app.post('/api/place-order', async (req, res) => {
  const { customer, items, total, paymentMethod, paymentIntentId } = req.body;

  const orderId = uuidv4().slice(0, 8).toUpperCase();
  const trackingNumber = 'GH' + Date.now().toString().slice(-8);

  const newOrder = {
    orderId,
    trackingNumber,
    customer,
    items,
    total,
    paymentMethod,
    paymentIntentId: paymentIntentId || null,
    status: 'pending',
    createdAt: new Date().toISOString(),
    updates: [
      { status: 'pending', timestamp: new Date().toISOString(), note: 'Order received' }
    ]
  };

  db.get('orders').push(newOrder).write();

  // Send email to store owner
  const ownerMail = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_USER,
    subject: `New Order #${orderId}`,
    html: `
      <h2>New Order Received</h2>
      <p><strong>Order ID:</strong> ${orderId}</p>
      <p><strong>Tracking:</strong> ${trackingNumber}</p>
      <p><strong>Customer:</strong> ${customer.name}, ${customer.phone}, ${customer.address}</p>
      <p><strong>Payment:</strong> ${paymentMethod}</p>
      <h3>Items:</h3>
      <ul>
        ${items.map(i => `<li>${i.name} x ${i.quantity} = Rs. ${i.price * i.quantity}</li>`).join('')}
      </ul>
      <p><strong>Total:</strong> Rs. ${total}</p>
    `
  };

  // Send email to customer
  const customerMail = {
    from: process.env.EMAIL_USER,
    to: customer.email,
    subject: `Your Gadget Hub Order #${orderId}`,
    html: `
      <h2>Thank you for your order!</h2>
      <p><strong>Order ID:</strong> ${orderId}</p>
      <p><strong>Tracking Number:</strong> ${trackingNumber}</p>
      <p>You can track your order here: <a href="${process.env.BASE_URL}/track?order=${orderId}">${process.env.BASE_URL}/track?order=${orderId}</a></p>
      <h3>Items:</h3>
      <ul>
        ${items.map(i => `<li>${i.name} x ${i.quantity} = Rs. ${i.price * i.quantity}</li>`).join('')}
      </ul>
      <p><strong>Total:</strong> Rs. ${total}</p>
      <p>We'll notify you when your order ships.</p>
    `
  };

  try {
    await transporter.sendMail(ownerMail);
    await transporter.sendMail(customerMail);
  } catch (err) {
    console.error('Email error:', err);
  }

  res.json({ success: true, orderId, trackingNumber });
});

// 3. Track order by orderId or trackingNumber
app.get('/api/track-order', (req, res) => {
  const { id } = req.query;
  const order = db.get('orders')
    .find(o => o.orderId === id || o.trackingNumber === id)
    .value();

  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }

  res.json({
    orderId: order.orderId,
    trackingNumber: order.trackingNumber,
    status: order.status,
    updates: order.updates,
    estimatedDelivery: '3-5 business days'
  });
});

// 4. (Optional) Update order status (admin)
app.post('/api/update-order-status', (req, res) => {
  const { orderId, status, note } = req.body;
  const order = db.get('orders').find({ orderId }).value();
  if (!order) return res.status(404).json({ error: 'Order not found' });

  order.status = status;
  order.updates.push({ status, timestamp: new Date().toISOString(), note });
  db.get('orders').find({ orderId }).assign(order).write();

  res.json({ success: true });
});

app.listen(PORT, () => {
  console.log(`✅ Backend running on port ${PORT}`);
});