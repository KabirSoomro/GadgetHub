// ==================== ORDER – ONLY WHATSAPP WITH CONFIRMATION MODAL ====================
(function() {
  const OWNER_PHONE = '923168465697'; // Aapka WhatsApp number (country code without +)

  // ---------- TOAST MESSAGE FUNCTION (optional) ----------
  function showToast(message, duration = 5000) {
    const toast = document.createElement('div');
    toast.className = 'toast-message';
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.style.animation = 'slideUp 0.4s reverse';
      setTimeout(() => toast.remove(), 400);
    }, duration);
  }

  // ---------- CONFIRMATION MODAL FUNCTION ----------
  function showConfirmationModal(orderData) {
    // Pehle se koi modal ho to hatao
    const existing = document.querySelector('.confirmation-modal');
    if (existing) existing.remove();

    const modal = document.createElement('div');
    modal.className = 'confirmation-modal';
    modal.innerHTML = `
      <div class="confirmation-content">
        <div class="confirmation-header">
          <h2>✅ Order Confirmed</h2>
          <span class="confirmation-close" onclick="this.closest('.confirmation-modal').remove()">&times;</span>
        </div>
        <div class="confirmation-detail">
          <p><strong>Order ID:</strong> ${orderData.orderId}</p>
          <p><strong>Tracking Number:</strong> ${orderData.trackingNumber}</p>
          <p><strong>Name:</strong> ${orderData.customer.name}</p>
          <p><strong>Email:</strong> ${orderData.customer.email}</p>
          <p><strong>Phone:</strong> ${orderData.customer.phone}</p>
          <p><strong>Address:</strong> ${orderData.customer.address}</p>
          <p><strong>Payment Method:</strong> ${orderData.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Card'}</p>
        </div>
        <div class="confirmation-items">
          <h3 style="margin-bottom:10px;">Order Items</h3>
          ${orderData.items.map(item => `
            <div class="confirmation-item">
              <span>${item.name} x ${item.quantity}</span>
              <span>Rs. ${(item.price * item.quantity).toLocaleString()}</span>
            </div>
          `).join('')}
        </div>
        <div class="confirmation-total">
          <span>Total:</span>
          <span>Rs. ${orderData.total.toLocaleString()}</span>
        </div>
        <div class="confirmation-footer">
          <button class="btn btn-primary" onclick="this.closest('.confirmation-modal').remove()">Continue Shopping</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
  }

  // ---------- TRACKING PAGE RENDER (optional, agar chahein to) ----------
  window.renderTrackingPage = function() {
    const app = document.getElementById('app');
    app.innerHTML = `
      <section class="tracking-section" style="padding-top:120px; min-height:60vh;">
        <div class="container">
          <h1 class="section-header">Track Your <span class="gradient-text">Order</span></h1>
          <div class="tracking-container" style="max-width:600px; margin:0 auto; background:var(--card-bg); backdrop-filter:blur(8px); border:1px solid var(--card-border); border-radius:24px; padding:40px; box-shadow:var(--shadow);">
            <p style="margin-bottom:20px; color:var(--text-secondary);">Enter your Order ID or Tracking Number</p>
            <input type="text" id="trackOrderId" placeholder="e.g., GH12345678" style="width:100%; padding:15px; border-radius:40px; border:1px solid var(--border-color); background:var(--bg-secondary); color:var(--text-primary); margin-bottom:20px;">
            <button class="btn btn-primary" id="trackBtn" style="width:100%; padding:15px;">Track Order</button>
            <div id="trackResult" style="margin-top:30px;"></div>
          </div>
        </div>
      </section>
    `;

    document.getElementById('trackBtn').addEventListener('click', async () => {
      const id = document.getElementById('trackOrderId').value.trim();
      if (!id) return;
      // Demo tracking result (since no backend)
      document.getElementById('trackResult').innerHTML = `
        <div style="background:var(--bg-secondary); border-radius:16px; padding:20px;">
          <h3 style="color:var(--accent-primary);">Order #${id}</h3>
          <p><strong>Status:</strong> <span style="color:#10b981;">Shipped</span></p>
          <p><strong>Tracking Number:</strong> ${id}</p>
          <p><strong>Estimated Delivery:</strong> 3-5 business days</p>
        </div>
      `;
    });
  };

  // ---------- PAYMENT MODAL ----------
  window.showPaymentOptions = function() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    if (cart.length === 0) { 
      alert('Your cart is empty!'); 
      return; 
    }
    
    const existing = document.querySelector('.checkout-modal.show');
    if (existing) existing.remove();

    const modal = document.createElement('div');
    modal.className = 'checkout-modal show';
    modal.id = 'paymentModal';
    modal.innerHTML = `
      <div class="modal-content" style="max-width:450px;">
        <span class="close-modal" onclick="this.closest('.checkout-modal').remove()">&times;</span>
        <h2 style="margin-bottom:25px; text-align:center;">Select Payment Method</h2>
        <div style="display:flex; flex-direction:column; gap:15px; margin:20px 0;">
          <button class="btn btn-outline" id="payCOD" style="padding:15px; font-size:1rem;">Cash on Delivery</button>
          <button class="btn btn-primary" id="payCard" style="padding:15px; font-size:1rem;">Pay with Card (Demo)</button>
        </div>
        <div id="cardPaymentSection" style="display:none; margin-top:20px;"></div>
      </div>
    `;
    document.body.appendChild(modal);

    document.getElementById('payCOD').addEventListener('click', () => {
      modal.remove();
      showCheckoutForm('cod');
    });

    document.getElementById('payCard').addEventListener('click', () => {
      // Card payment demo – sirf form dikhayenge, actual payment nahi
      const cardSection = document.getElementById('cardPaymentSection');
      cardSection.innerHTML = `
        <p style="text-align:center; margin:10px 0;">Card payment is in demo mode. Click below to proceed with COD.</p>
        <button class="btn btn-primary" id="proceedCOD" style="width:100%;">Proceed with Cash on Delivery</button>
      `;
      cardSection.style.display = 'block';
      document.getElementById('proceedCOD').addEventListener('click', () => {
        modal.remove();
        showCheckoutForm('cod');
      });
    });
  };

  // ---------- CHECKOUT FORM ----------
  function showCheckoutForm(paymentMethod) {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    
    const existing = document.querySelector('#checkoutFormModal');
    if (existing) existing.remove();

    const modal = document.createElement('div');
    modal.className = 'checkout-modal show';
    modal.id = 'checkoutFormModal';
    modal.innerHTML = `
      <div class="modal-content" style="max-width:500px; max-height:80vh; overflow-y:auto;">
        <span class="close-modal" onclick="this.closest('.checkout-modal').remove()">&times;</span>
        <h2 style="margin-bottom:20px;">Delivery Information</h2>
        <form id="customerDetailsForm">
          <div style="margin-bottom:15px;">
            <label style="display:block; margin-bottom:5px; color:var(--text-secondary);">Full Name</label>
            <input type="text" id="fullName" placeholder="e.g., Muhammad Ali" required style="width:100%; padding:12px 15px; border-radius:40px; border:1px solid var(--border-color); background:var(--bg-secondary); color:var(--text-primary); font-size:1rem;">
          </div>
          
          <div style="margin-bottom:15px;">
            <label style="display:block; margin-bottom:5px; color:var(--text-secondary);">Email Address</label>
            <input type="email" id="email" placeholder="example@domain.com" required style="width:100%; padding:12px 15px; border-radius:40px; border:1px solid var(--border-color); background:var(--bg-secondary); color:var(--text-primary); font-size:1rem;">
          </div>
          
          <div style="margin-bottom:15px;">
            <label style="display:block; margin-bottom:5px; color:var(--text-secondary);">Phone Number</label>
            <input type="tel" id="phone" placeholder="03xx-xxxxxxx" required style="width:100%; padding:12px 15px; border-radius:40px; border:1px solid var(--border-color); background:var(--bg-secondary); color:var(--text-primary); font-size:1rem;">
          </div>
          
          <div style="margin-bottom:20px;">
            <label style="display:block; margin-bottom:5px; color:var(--text-secondary);">Delivery Address</label>
            <textarea id="address" placeholder="House no., street, city" rows="3" required style="width:100%; padding:12px 15px; border-radius:20px; border:1px solid var(--border-color); background:var(--bg-secondary); color:var(--text-primary); font-size:1rem; resize:vertical;"></textarea>
          </div>

          <h3 style="margin:20px 0 15px;">Order Summary</h3>
          <div style="background:var(--bg-secondary); border-radius:16px; padding:15px; margin-bottom:20px;">
            ${cart.map(item => `
              <div style="display:flex; justify-content:space-between; padding:8px 0; border-bottom:1px solid var(--border-color);">
                <span>${item.name} x ${item.quantity}</span>
                <span style="font-weight:500;">Rs. ${(item.price * item.quantity).toLocaleString()}</span>
              </div>
            `).join('')}
            <div style="display:flex; justify-content:space-between; font-weight:bold; font-size:1.2rem; padding-top:15px; margin-top:5px; border-top:2px solid var(--accent-primary);">
              <span>Total:</span>
              <span style="color:var(--accent-primary);">Rs. ${total.toLocaleString()}</span>
            </div>
          </div>

          <button type="submit" class="btn btn-primary" style="width:100%; padding:15px; font-size:1.1rem;">Place Order</button>
        </form>
      </div>
    `;
    document.body.appendChild(modal);

    const form = document.getElementById('customerDetailsForm');
    if (!form) return;

    // Form submit handler
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      e.stopPropagation();

      const name = document.getElementById('fullName').value;
      const email = document.getElementById('email').value;
      const phone = document.getElementById('phone').value;
      const address = document.getElementById('address').value;

      // Generate order ID and tracking number
      const orderId = 'GH' + Date.now().toString().slice(-8);
      const trackingNumber = orderId;

      // Prepare WhatsApp message
      let orderDetails = `🛍️ *New Order from Gadget Hub*\n\n`;
      orderDetails += `*Customer Details:*\n`;
      orderDetails += `👤 Name: ${name}\n`;
      orderDetails += `📧 Email: ${email}\n`;
      orderDetails += `📞 Phone: ${phone}\n`;
      orderDetails += `📍 Address: ${address}\n\n`;
      orderDetails += `*Order Items:*\n`;
      cart.forEach(item => {
        orderDetails += `• ${item.name} x ${item.quantity} = Rs. ${(item.price * item.quantity).toLocaleString()}\n`;
      });
      orderDetails += `\n💰 *Total: Rs. ${total.toLocaleString()}*`;
      orderDetails += `\n💳 Payment: ${paymentMethod === 'cod' ? 'Cash on Delivery' : 'Card'}`;
      orderDetails += `\n🆔 Order ID: ${orderId}`;
      orderDetails += `\n📅 Date: ${new Date().toLocaleString()}`;

      const encodedMessage = encodeURIComponent(orderDetails);
      const whatsappUrl = `https://wa.me/${OWNER_PHONE}?text=${encodedMessage}`;

      // Open WhatsApp
      window.open(whatsappUrl, '_blank');

      // Show confirmation modal
      const confirmationData = {
        orderId: orderId,
        trackingNumber: trackingNumber,
        customer: { name, email, phone, address },
        items: cart,
        total: total,
        paymentMethod: paymentMethod
      };
      showConfirmationModal(confirmationData);

      // Clear cart
      localStorage.setItem('cart', '[]');
      window.dispatchEvent(new Event('storage'));

      // Close checkout modal
      modal.remove();

      // Update cart display (if functions exist)
      if (typeof updateCart === 'function') updateCart();
      if (typeof closeCartSidebar === 'function') closeCartSidebar();

      // Scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ---------- ADD TRACK LINK ----------
  function addTrackLink() {
    const navMenu = document.getElementById('navMenu');
    if (navMenu && !document.querySelector('a[href="#/track"]')) {
      const li = document.createElement('li');
      li.innerHTML = '<a href="#/track" class="nav-link" data-link>Track Order</a>';
      navMenu.appendChild(li);
    }
  }

  // ---------- ATTACH CHECKOUT BUTTON ----------
  function attachCheckoutButton() {
    const btn = document.getElementById('checkoutBtn');
    if (btn) {
      btn.removeEventListener('click', window.showPaymentOptions);
      btn.addEventListener('click', window.showPaymentOptions);
    }
  }

  // ---------- INITIALIZE ----------
  function init() {
    addTrackLink();
    attachCheckoutButton();
    if (window.location.hash === '#/track') {
      window.renderTrackingPage();
    }
  }

  window.addEventListener('load', init);
  window.addEventListener('hashchange', () => {
    attachCheckoutButton();
    if (window.location.hash === '#/track') {
      window.renderTrackingPage();
    }
  });

  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    setTimeout(init, 1);
  }
})();