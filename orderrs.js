// ==================== ORDER & PAYMENT EXTENSION ====================
// Final version with working Track Order
(function() {
  const OWNER_PHONE = '923168465697';

  // ---------- TRACKING PAGE RENDER FUNCTION ----------
  window.renderTrackingPage = function() {
    const app = document.getElementById('app');
    if (!app) return;
    app.innerHTML = `
      <section class="tracking-section" style="padding-top:120px; min-height:60vh;">
        <div class="container">
          <h1 class="section-header">Track Your <span class="gradient-text">Order</span></h1>
          <div class="tracking-container" style="max-width:600px; margin:0 auto; background:var(--card-bg); backdrop-filter:blur(8px); border:1px solid var(--card-border); border-radius:24px; padding:40px; box-shadow:var(--shadow);">
            <p style="margin-bottom:20px; color:var(--text-secondary);">Enter your Order ID or Tracking Number to check status.</p>
            <input type="text" id="trackOrderId" placeholder="e.g., GH12345678" style="width:100%; padding:15px; border-radius:40px; border:1px solid var(--border-color); background:var(--bg-secondary); color:var(--text-primary); font-size:1rem; margin-bottom:20px;">
            <button class="btn btn-primary" id="trackBtn" style="width:100%; padding:15px;">Track Order</button>
            <div id="trackResult" style="margin-top:30px;"></div>
          </div>
        </div>
      </section>
    `;

    const trackBtn = document.getElementById('trackBtn');
    if (trackBtn) {
      trackBtn.addEventListener('click', function() {
        const id = document.getElementById('trackOrderId').value.trim();
        if (!id) return;
        // Demo tracking result – aap yahan backend API call kar sakte hain
        document.getElementById('trackResult').innerHTML = `
          <div style="background:var(--bg-secondary); border-radius:16px; padding:20px;">
            <h3 style="color:var(--accent-primary); margin-bottom:15px;">Order #${id}</h3>
            <p><strong>Status:</strong> <span style="color:#10b981;">Shipped</span></p>
            <p><strong>Tracking Number:</strong> ${id}</p>
            <p><strong>Estimated Delivery:</strong> 3-5 business days</p>
            <h4 style="margin:15px 0 10px;">Updates:</h4>
            <ul style="list-style:none; padding:0;">
              <li style="padding:8px; border-left:3px solid var(--accent-primary); margin-bottom:5px; background:var(--card-bg);">📦 15 Feb 2026, 10:30 AM - Order confirmed</li>
              <li style="padding:8px; border-left:3px solid var(--accent-primary); margin-bottom:5px; background:var(--card-bg);">🚚 16 Feb 2026, 2:15 PM - Shipped</li>
            </ul>
          </div>
        `;
      });
    }
  };

  // ---------- CHECKOUT FUNCTIONS (same as before) ----------
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
      <div class="modal-content">
        <span class="close-modal" onclick="this.closest('.checkout-modal').remove()">&times;</span>
        <h2 style="margin-bottom:20px;">Select Payment Method</h2>
        <div style="display: flex; flex-direction: column; gap: 15px;">
          <button class="btn btn-outline" id="payCOD">Cash on Delivery</button>
          <button class="btn btn-primary" id="payCard">Pay with Card (Stripe)</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
    document.getElementById('payCOD').addEventListener('click', () => {
      document.getElementById('paymentModal').remove();
      window.showCheckoutForm('cod');
    });
    document.getElementById('payCard').addEventListener('click', () => {
      document.getElementById('paymentModal').remove();
      window.showCheckoutForm('card');
    });
  };

  window.showCheckoutForm = function(paymentMethod) {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const existing = document.querySelector('#checkoutFormModal');
    if (existing) existing.remove();
    const formModal = document.createElement('div');
    formModal.className = 'checkout-modal show';
    formModal.id = 'checkoutFormModal';
    formModal.innerHTML = `
      <div class="modal-content" style="max-width:500px;">
        <span class="close-modal" onclick="this.closest('.checkout-modal').remove()">&times;</span>
        <h2 style="margin-bottom:20px;">Delivery Information</h2>
        <form id="customerDetailsForm">
          <div style="margin-bottom:15px;">
            <label style="display:block; margin-bottom:5px; color:var(--text-secondary);">Full Name</label>
            <input type="text" id="fullName" placeholder="e.g., Muhammad Ali" required style="width:100%; padding:12px; border-radius:40px; border:1px solid var(--border-color); background:var(--bg-secondary); color:var(--text-primary);">
          </div>
          <div style="margin-bottom:15px;">
            <label style="display:block; margin-bottom:5px; color:var(--text-secondary);">Email Address</label>
            <input type="email" id="email" placeholder="example@domain.com" required style="width:100%; padding:12px; border-radius:40px; border:1px solid var(--border-color); background:var(--bg-secondary); color:var(--text-primary);">
          </div>
          <div style="margin-bottom:15px;">
            <label style="display:block; margin-bottom:5px; color:var(--text-secondary);">Phone Number</label>
            <input type="tel" id="phone" placeholder="03xx-xxxxxxx" required style="width:100%; padding:12px; border-radius:40px; border:1px solid var(--border-color); background:var(--bg-secondary); color:var(--text-primary);">
          </div>
          <div style="margin-bottom:20px;">
            <label style="display:block; margin-bottom:5px; color:var(--text-secondary);">Delivery Address</label>
            <textarea id="address" placeholder="House no., street, city" rows="3" required style="width:100%; padding:12px; border-radius:20px; border:1px solid var(--border-color); background:var(--bg-secondary); color:var(--text-primary); resize:vertical;"></textarea>
          </div>
          <h3 style="margin:25px 0 15px;">Order Summary</h3>
          <div style="background:var(--bg-secondary); border-radius:16px; padding:15px; margin-bottom:20px;">
            ${cart.map(item => `
              <div style="display:flex; justify-content:space-between; padding:8px 0; border-bottom:1px solid var(--border-color);">
                <span>${item.name} x ${item.quantity}</span>
                <span>Rs. ${(item.price * item.quantity).toLocaleString()}</span>
              </div>
            `).join('')}
            <div style="display:flex; justify-content:space-between; font-weight:bold; font-size:1.2rem; padding-top:15px; margin-top:5px; border-top:2px solid var(--accent-primary);">
              <span>Total:</span>
              <span>Rs. ${total.toLocaleString()}</span>
            </div>
          </div>
          <button type="submit" class="btn btn-primary" style="width:100%; padding:15px; font-size:1.1rem;">Place Order</button>
        </form>
      </div>
    `;
    document.body.appendChild(formModal);
    document.getElementById('customerDetailsForm').addEventListener('submit', function(e) {
      e.preventDefault();
      const name = document.getElementById('fullName').value;
      const email = document.getElementById('email').value;
      const phone = document.getElementById('phone').value;
      const address = document.getElementById('address').value;
      const cart = JSON.parse(localStorage.getItem('cart')) || [];
      const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
      const orderId = 'GH' + Date.now().toString().slice(-8);
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
      window.open(`https://wa.me/${OWNER_PHONE}?text=${encodeURIComponent(orderDetails)}`, '_blank');
      alert(`✅ Order placed successfully!\n\nOrder ID: ${orderId}\nTracking Number: ${orderId}\n\nWe have sent your order to the store owner via WhatsApp. You will be contacted soon.`);
      localStorage.setItem('cart', '[]');
      window.dispatchEvent(new Event('storage'));
      document.getElementById('checkoutFormModal').remove();
      if (typeof updateCart === 'function') updateCart();
      if (typeof closeCartSidebar === 'function') closeCartSidebar();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  };

  // ---------- ADD TRACK LINK TO NAVIGATION ----------
  function addTrackLink() {
    const navMenu = document.getElementById('navMenu');
    if (navMenu && !document.querySelector('a[href="#/track"]')) {
      const li = document.createElement('li');
      li.innerHTML = '<a href="#/track" class="nav-link" data-link>Track Order</a>';
      navMenu.appendChild(li);
    }
  }

  // ---------- DIRECT HASH CHANGE HANDLER (BACKUP) ----------
  function handleHashChange() {
    if (window.location.hash === '#/track') {
      // Agar router ne already render kar diya to karo na, warna khud render karo
      const appContent = document.getElementById('app')?.innerHTML;
      if (!appContent || !appContent.includes('Track Your Order')) {
        window.renderTrackingPage();
      }
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
    handleHashChange(); // agar already hash track ho
  }

  // Run on load and hash change
  window.addEventListener('load', init);
  window.addEventListener('hashchange', () => {
    attachCheckoutButton(); // reattach button if needed
    handleHashChange();
  });

  // Agar script already loaded ho to turant init
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    setTimeout(init, 1);
  }
})();