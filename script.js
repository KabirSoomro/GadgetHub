// ==================== DATA ====================
const products = [
  {
    id: 1,
    name: "Wireless Headphones",
    price: 14000, // PKR
    category: "Electronics",
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?q=80&w=688&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    description: "High-quality wireless headphones with noise cancellation."
  },
  {
    id: 2,
    name: "Leather Backpack",
    price: 22400,
    category: "Fashion",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1549943872-f7ff0b2b51be?q=80&w=688&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D=Backpack",
    description: "Genuine leather backpack, perfect for daily use."
  },
  {
    id: 3,
    name: "Smart Watch",
    price: 36400,
    category: "Electronics",
    rating: 4.3,
    image: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?q=80&w=1172&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D=Smart+Watch",
    description: "Track your fitness and notifications in style."
  },
  {
    id: 4,
    name: "Running Shoes",
    price: 25200,
    category: "Footwear",
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D=Shoes",
    description: "Lightweight and comfortable running shoes."
  },
  {
    id: 5,
    name: "Coffee Maker",
    price: 11200,
    category: "Home Appliances",
    rating: 4.4,
    image: "https://images.unsplash.com/photo-1680539882932-559b099446cc?q=80&w=666&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D=Coffee+Maker",
    description: "Brew fresh coffee every morning with ease."
  },
  {
    id: 6,
    name: "Yoga Mat",
    price: 7000,
    category: "Sports",
    rating: 4.6,
    image: "https://plus.unsplash.com/premium_photo-1723759271930-3514bb76abb4?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D=Yoga+Mat",
    description: "Eco-friendly, non-slip yoga mat."
  }
];

const categories = ["Electronics", "Fashion", "Footwear", "Home Appliances", "Sports"];

const categoryIcons = {
  Electronics: "fa-microchip",
  Fashion: "fa-tshirt",
  Footwear: "fa-shoe-prints",
  "Home Appliances": "fa-blender",
  Sports: "fa-futbol"
};

// ==================== STATE ====================
let cart = JSON.parse(localStorage.getItem("cart")) || [];
let currentFilter = "all";
let searchQuery = "";

// ==================== DOM ELEMENTS ====================
const app = document.getElementById("app");
const themeToggle = document.getElementById("themeToggle");
const heroImage = document.getElementById("heroImage");
const hamburger = document.getElementById("hamburger");
const navMenu = document.getElementById("navMenu");
const navLinks = document.querySelectorAll(".nav-link");
const cartIcon = document.getElementById("cartIcon");
const cartSidebar = document.getElementById("cartSidebar");
const closeCart = document.getElementById("closeCart");
const overlay = document.getElementById("overlay");
const cartItemsContainer = document.getElementById("cartItems");
const cartCount = document.getElementById("cartCount");
const cartTotal = document.getElementById("cartTotal");
const checkoutBtn = document.getElementById("checkoutBtn");
const checkoutModal = document.getElementById("checkoutModal");
const closeModal = document.getElementById("closeModal");
const orderSummaryItems = document.getElementById("orderSummaryItems");
const orderTotal = document.getElementById("orderTotal");
const checkoutForm = document.getElementById("checkoutForm");
const contactForm = document.getElementById("contactForm");
const yearSpan = document.getElementById("year");
const globalSearch = document.getElementById("globalSearch");
const searchBtn = document.getElementById("searchBtn");

// ==================== THEME ====================
function setTheme(theme) {
  if (theme === "dark") {
    document.body.classList.add("dark-theme");
    themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    if (heroImage) heroImage.style.animation = "spinIn 0.6s ease";
  } else {
    document.body.classList.remove("dark-theme");
    themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    if (heroImage) heroImage.style.animation = "spinIn 0.6s ease";
  }
  localStorage.setItem("theme", theme);
}

function toggleTheme() {
  if (document.body.classList.contains("dark-theme")) {
    setTheme("light");
  } else {
    setTheme("dark");
  }
}

const savedTheme = localStorage.getItem("theme") || "light";
setTheme(savedTheme);
themeToggle.addEventListener("click", toggleTheme);

// ==================== TYPING EFFECT ====================
function initTyping() {
  const typingElement = document.getElementById("typing-text");
  if (!typingElement) return;
  const words = ["Latest Gadgets", "Premium Electronics", "Trendy Accessories", "Unbeatable Deals"];
  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  function typeEffect() {
    const currentWord = words[wordIndex];
    if (isDeleting) {
      typingElement.textContent = currentWord.substring(0, charIndex - 1);
      charIndex--;
    } else {
      typingElement.textContent = currentWord.substring(0, charIndex + 1);
      charIndex++;
    }

    if (!isDeleting && charIndex === currentWord.length) {
      isDeleting = true;
      setTimeout(typeEffect, 1500);
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % words.length;
      setTimeout(typeEffect, 500);
    } else {
      setTimeout(typeEffect, isDeleting ? 50 : 100);
    }
  }
  typeEffect();
}

// ==================== COUNT-UP ANIMATION ====================
function initCountUp() {
  const statNumbers = document.querySelectorAll(".stat-number");
  if (!statNumbers.length) return;
  let counted = false;
  function countUp() {
    statNumbers.forEach((stat) => {
      const target = parseInt(stat.getAttribute("data-target"));
      let current = 0;
      const increment = target / 50;
      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          stat.textContent = target;
          clearInterval(timer);
        } else {
          stat.textContent = Math.floor(current);
        }
      }, 20);
    });
  }
  const heroSection = document.querySelector(".hero");
  if (heroSection) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !counted) {
            countUp();
            counted = true;
          }
        });
      },
      { threshold: 0.5 }
    );
    observer.observe(heroSection);
  }
}

// ==================== SCROLL REVEAL ====================
function initScrollReveal() {
  const sections = document.querySelectorAll("section:not(.hero)");
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("revealed");
        }
      });
    },
    { threshold: 0.2 }
  );
  sections.forEach((section) => {
    section.classList.add("fade-up");
    revealObserver.observe(section);
  });
}

// ==================== ACTIVE LINK HIGHLIGHT ====================
function updateActiveLink() {
  const currentHash = window.location.hash || "#/";
  navLinks.forEach(link => {
    link.classList.remove("active");
    if (link.getAttribute("href") === currentHash) {
      link.classList.add("active");
    }
  });
}

// ==================== MOBILE MENU ====================
hamburger.addEventListener("click", () => {
  navMenu.classList.toggle("active");
  hamburger.classList.toggle("active");
});

navLinks.forEach(link => {
  link.addEventListener("click", () => {
    navMenu.classList.remove("active");
    hamburger.classList.remove("active");
  });
});

// ==================== CART FUNCTIONS ====================
function addToCart(productId) {
  const product = products.find(p => p.id === productId);
  const existing = cart.find(item => item.id === productId);

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  updateCart();
  saveCart();
  openCartSidebar();
}

function removeFromCart(productId) {
  cart = cart.filter(item => item.id !== productId);
  updateCart();
  saveCart();
}

function updateQuantity(productId, delta) {
  const item = cart.find(item => item.id === productId);
  if (item) {
    item.quantity += delta;
    if (item.quantity <= 0) {
      removeFromCart(productId);
    } else {
      updateCart();
      saveCart();
    }
  }
}

function updateCart() {
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartCount.textContent = totalItems;

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = "<p>Your cart is empty.</p>";
    cartTotal.textContent = "Rs. 0";
  } else {
    cartItemsContainer.innerHTML = cart.map(item => `
      <div class="cart-item">
        <img src="${item.image}" alt="${item.name}">
        <div class="cart-item-details">
          <div class="cart-item-title">${item.name}</div>
          <div class="cart-item-price">Rs. ${item.price.toLocaleString()}</div>
          <div class="cart-item-quantity">
            <button class="quantity-btn" data-id="${item.id}" data-delta="-1">-</button>
            <span>${item.quantity}</span>
            <button class="quantity-btn" data-id="${item.id}" data-delta="1">+</button>
            <i class="fas fa-trash remove-item" data-id="${item.id}"></i>
          </div>
        </div>
      </div>
    `).join("");

    document.querySelectorAll(".quantity-btn").forEach(btn => {
      btn.addEventListener("click", e => {
        e.stopPropagation();
        const id = parseInt(btn.dataset.id);
        const delta = parseInt(btn.dataset.delta);
        updateQuantity(id, delta);
      });
    });

    document.querySelectorAll(".remove-item").forEach(btn => {
      btn.addEventListener("click", e => {
        e.stopPropagation();
        const id = parseInt(btn.dataset.id);
        removeFromCart(id);
      });
    });

    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    cartTotal.textContent = `Rs. ${total.toLocaleString()}`;
  }
}

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function openCartSidebar() {
  cartSidebar.classList.add("open");
  overlay.classList.add("active");
}

function closeCartSidebar() {
  cartSidebar.classList.remove("open");
  overlay.classList.remove("active");
}

cartIcon.addEventListener("click", openCartSidebar);
closeCart.addEventListener("click", closeCartSidebar);
overlay.addEventListener("click", closeCartSidebar);

// ==================== CHECKOUT ====================
checkoutBtn.addEventListener("click", () => {
  if (cart.length === 0) {
    alert("Your cart is empty!");
    return;
  }

  orderSummaryItems.innerHTML = cart.map(item => `
    <div>${item.name} x ${item.quantity} - Rs. ${(item.price * item.quantity).toLocaleString()}</div>
  `).join("");
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  orderTotal.textContent = `Rs. ${total.toLocaleString()}`;

  checkoutModal.classList.add("show");
  overlay.classList.add("active");
  closeCartSidebar();
});

closeModal.addEventListener("click", () => {
  checkoutModal.classList.remove("show");
  overlay.classList.remove("active");
});

checkoutForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const name = checkoutForm.querySelector('input[placeholder="Full Name"]').value;
  const address = checkoutForm.querySelector('input[placeholder="Address"]').value;
  const phone = checkoutForm.querySelector('input[placeholder="Phone Number"]').value;

  let orderDetails = `New Order from ${name}%0AAddress: ${address}%0APhone: ${phone}%0A%0AItems:%0A`;
  cart.forEach(item => {
    orderDetails += `${item.name} x ${item.quantity} = Rs. ${(item.price * item.quantity).toLocaleString()}%0A`;
  });
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  orderDetails += `%0ATotal: Rs. ${total.toLocaleString()}`;

  window.open(`https://wa.me/923168465697?text=${orderDetails}`, "_blank");

  cart = [];
  updateCart();
  saveCart();
  checkoutModal.classList.remove("show");
  overlay.classList.remove("active");
  checkoutForm.reset();
});

// ==================== CONTACT FORM ====================
if (contactForm) {
  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = contactForm.querySelector('input[placeholder="Your Name"]').value;
    const email = contactForm.querySelector('input[placeholder="Your Email"]').value;
    const message = contactForm.querySelector('textarea').value;
    const whatsappMsg = `Message from ${name} (${email}):%0A${message}`;
    window.open(`https://wa.me/923168465697?text=${whatsappMsg}`, "_blank");
  });
}

// ==================== FOOTER YEAR ====================
yearSpan.textContent = new Date().getFullYear();

// ==================== SEARCH ====================
function performSearch(query) {
  if (!query.trim()) return products;
  const q = query.toLowerCase();
  return products.filter(p =>
    p.name.toLowerCase().includes(q) ||
    p.category.toLowerCase().includes(q) ||
    (p.description && p.description.toLowerCase().includes(q))
  );
}

searchBtn.addEventListener("click", () => {
  const query = globalSearch.value.trim();
  if (query) {
    searchQuery = query;
    window.location.hash = "#/search";
  }
});

globalSearch.addEventListener("keypress", (e) => {
  if (e.key === "Enter") searchBtn.click();
});

// ==================== ROUTER ====================
function navigateTo(url) {
  const hash = url.split("#")[1] || "/";
  renderPage(hash);
  updateActiveLink();
}

function renderPage(route) {
  if (route.startsWith("/product/")) {
    const id = parseInt(route.split("/")[2]);
    renderProductDetail(id);
  } else if (route === "/search") {
    renderSearchPage();
  } else {
    switch(route) {
      case "/":
      case "/home":
        renderHome();
        break;
      case "/products":
        renderProductsPage();
        break;
      case "/categories":
        renderCategoriesPage();
        break;
      case "/about":
        renderAbout();
        break;
      case "/contact":
        renderContact();
        break;
      default:
        renderHome();
    }
  }
  // Re-run animations after render
  initTyping();
  initCountUp();
  initScrollReveal();
}

// ==================== PAGE RENDERERS ====================
function renderHome() {
  app.innerHTML = `
    <section class="hero">
      <div class="container hero-container">
        <div class="hero-content">
          <span class="hero-greeting">Welcome to Gadget Hub</span>
          <h1 class="hero-title">Your <span class="gradient-text">One‑Stop Shop</span> for Everything</h1>
          <div class="hero-typing">
            <span id="typing-text"></span><span class="cursor">|</span>
          </div>
          <p class="hero-description">Discover amazing products at unbeatable prices. Shop the latest trends!</p>
          <div class="hero-stats">
            <div class="stat-item">
              <span class="stat-number" data-target="50">0</span><span>+</span>
              <span class="stat-label">Products</span>
            </div>
            <div class="stat-item">
              <span class="stat-number" data-target="200">0</span><span>+</span>
              <span class="stat-label">Happy Customers</span>
            </div>
            <div class="stat-item">
              <span class="stat-number" data-target="2">0</span><span>+</span>
              <span class="stat-label">Years</span>
            </div>
          </div>
          <div class="hero-buttons">
            <a href="#/products" class="btn btn-primary" data-link>Shop Now</a>
            <a href="#/contact" class="btn btn-outline" data-link>Contact Us</a>
          </div>
        </div>
        <div class="hero-image">
          <div class="floating-image" id="heroImage"></div>
          <span class="experience-badge">2+ Years of Trust</span>
        </div>
      </div>
    </section>
    <section class="featured-categories">
      <div class="container">
        <h2 class="section-header">Shop by <span class="gradient-text">Category</span></h2>
        <div class="categories-grid" id="homeCategories"></div>
      </div>
    </section>
    <section class="featured-products">
      <div class="container">
        <h2 class="section-header">Featured <span class="gradient-text">Products</span></h2>
        <div class="products-grid" id="featuredProducts"></div>
      </div>
    </section>
  `;
  renderCategoriesGrid(document.getElementById("homeCategories"));
  renderFeaturedProducts();
}

function renderProductsPage() {
  app.innerHTML = `
    <section class="products-page" style="padding-top:120px">
      <div class="container">
        <h1 class="section-header">All <span class="gradient-text">Products</span></h1>
        <div class="products-toolbar">
          <input type="text" id="productSearch" placeholder="Search products..." class="search-input">
          <select id="sortSelect">
            <option value="default">Default</option>
            <option value="priceAsc">Price: Low to High</option>
            <option value="priceDesc">Price: High to Low</option>
            <option value="rating">Rating</option>
          </select>
        </div>
        <div class="category-filters" id="categoryFilters"></div>
        <div class="products-grid" id="productsGrid"></div>
      </div>
    </section>
  `;
  renderCategoryFilters();
  renderAllProducts();
  document.getElementById("productSearch").addEventListener("input", filterProducts);
  document.getElementById("sortSelect").addEventListener("change", filterProducts);
}

function renderCategoriesPage() {
  app.innerHTML = `
    <section style="padding-top:120px">
      <div class="container">
        <h1 class="section-header">Shop by <span class="gradient-text">Category</span></h1>
        <div class="categories-grid" id="allCategories"></div>
        <div class="features-grid">
          <div class="feature-card">
            <i class="fas fa-truck"></i>
            <h3>Fast Delivery</h3>
            <p>Free shipping on orders over Rs. 5,000</p>
          </div>
          <div class="feature-card">
            <i class="fas fa-shield-alt"></i>
            <h3>Secure Payments</h3>
            <p>100% secure transactions</p>
          </div>
          <div class="feature-card">
            <i class="fas fa-headset"></i>
            <h3>24/7 Support</h3>
            <p>We're here to help anytime</p>
          </div>
          <div class="feature-card">
            <i class="fas fa-undo-alt"></i>
            <h3>Easy Returns</h3>
            <p>7-day return policy</p>
          </div>
        </div>
      </div>
    </section>
  `;
  renderCategoriesGrid(document.getElementById("allCategories"));
}

function renderAbout() {
  app.innerHTML = `
    <section class="about">
      <div class="container about-container">
        <div class="about-text">
          <h2>About <span class="gradient-text">Us</span></h2>
          <p>"We are a passionate team dedicated to bringing you the best products at unbeatable prices. From electronics to fashion, we ensure quality and customer satisfaction."</p>
          <p><strong>Founded:</strong> 2023</p>
          <p><strong>Owner:</strong> Kabeer Soomro</p>
          <p><strong>Location:</strong> Karachi, Pakistan</p>
          <div class="owner-contact">
            <a href="tel:+923168465697"><i class="fas fa-phone-alt"></i> +92 316 8465697</a>
            <a href="mailto:gkabeersoomro@email.com"><i class="fas fa-envelope"></i> gkabeersoomro@email.com</a>
          </div>
        </div>
        <div class="about-features">
          <div class="feature-card">
            <i class="fas fa-box-open"></i>
            <h3>Quality Products</h3>
            <p>We handpick every item</p>
          </div>
          <div class="feature-card">
            <i class="fas fa-tags"></i>
            <h3>Affordable Prices</h3>
            <p>Best prices in town</p>
          </div>
          <div class="feature-card">
            <i class="fas fa-rocket"></i>
            <h3>Fast Delivery</h3>
            <p>Same-day dispatch</p>
          </div>
          <div class="feature-card">
            <i class="fas fa-smile"></i>
            <h3>Excellent Support</h3>
            <p>We care about you</p>
          </div>
        </div>
      </div>
    </section>
  `;
}

function renderContact() {
  app.innerHTML = `
    <section class="contact">
      <div class="container contact-container">
        <div class="contact-info">
          <h3>Contact Information</h3>
          <p><i class="fas fa-phone-alt"></i> +92 316 8465697</p>
          <p><i class="fas fa-envelope"></i> gkabeersoomro@email.com</p>
          <p><i class="fas fa-map-marker-alt"></i> Karachi, Pakistan</p>
          <div class="social-links">
            <a href="https://www.facebook.com/share/1CKG5LAYZV/" target="_blank"><i class="fab fa-facebook-f"></i></a>
            <a href="https://www.instagram.com/kabeer_soomro55?igsh=YTFsMW45MGhwM2ow&utm_source=qr" target="_blank"><i class="fab fa-instagram"></i></a>
            <a href="https://www.linkedin.com/in/kabeer-soomro-010a42244?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app" target="_blank"><i class="fab fa-linkedin-in"></i></a>
            <a href="https://wa.me/923168465697" target="_blank"><i class="fab fa-whatsapp"></i></a>
          </div>
          <a href="https://wa.me/923168465697" class="btn btn-outline whatsapp-cta" target="_blank"><i class="fab fa-whatsapp"></i> Chat on WhatsApp</a>
        </div>
        <div class="contact-form">
          <form id="contactForm">
            <input type="text" name="name" placeholder="Your Name" required>
            <input type="email" name="email" placeholder="Your Email" required>
            <textarea name="message" rows="5" placeholder="Your Message" required></textarea>
            <button type="submit" class="btn btn-primary">Send Message <i class="fab fa-whatsapp"></i></button>
          </form>
        </div>
      </div>
    </section>
  `;
  // Rebind contact form
  document.getElementById("contactForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.querySelector('input[name="name"]').value;
    const email = document.querySelector('input[name="email"]').value;
    const message = document.querySelector('textarea[name="message"]').value;
    const whatsappMsg = `Message from ${name} (${email}):%0A${message}`;
    window.open(`https://wa.me/923168465697?text=${whatsappMsg}`, "_blank");
  });
}

function renderSearchPage() {
  const results = performSearch(searchQuery);
  app.innerHTML = `
    <section style="padding-top:120px">
      <div class="container">
        <h1 class="section-header">Search Results for "${searchQuery}"</h1>
        <div class="products-grid" id="searchResults">
          ${results.length ? renderProductCards(results) : "<p>No products found.</p>"}
        </div>
      </div>
    </section>
  `;
  if (results.length) {
    document.querySelectorAll(".add-to-cart").forEach(btn => {
      btn.addEventListener("click", e => {
        const id = parseInt(btn.dataset.id);
        addToCart(id);
      });
    });
  }
}

function renderProductDetail(id) {
  const product = products.find(p => p.id === id);
  const related = products.filter(p => p.category === product.category && p.id !== id).slice(0, 3);
  app.innerHTML = `
    <section style="padding-top:120px">
      <div class="container">
        <div class="product-detail" style="display:grid; grid-template-columns:1fr 1fr; gap:50px; align-items:start;">
          <img src="${product.image}" alt="${product.name}" style="width:100%; border-radius:24px;">
          <div>
            <h1>${product.name}</h1>
            <div class="product-rating">${generateStars(product.rating)} (${product.rating})</div>
            <p class="product-price" style="font-size:2rem;">Rs. ${product.price.toLocaleString()}</p>
            <p>${product.description}</p>
            <button class="btn btn-primary add-to-cart" data-id="${product.id}" style="margin-top:20px;">Add to Cart</button>
          </div>
        </div>
        <h2 style="margin:50px 0 30px;">Related Products</h2>
        <div class="products-grid">
          ${renderProductCards(related)}
        </div>
      </div>
    </section>
  `;
  document.querySelectorAll(".add-to-cart").forEach(btn => {
    btn.addEventListener("click", e => {
      const id = parseInt(btn.dataset.id);
      addToCart(id);
    });
  });
}

// ==================== HELPER FUNCTIONS ====================
function generateStars(rating) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5 ? 1 : 0;
  const empty = 5 - full - half;
  return "★".repeat(full) + (half ? "½" : "") + "☆".repeat(empty);
}

function renderProductCards(prods) {
  return prods.map(p => `
    <div class="product-card">
      <a href="#/product/${p.id}" style="text-decoration:none; color:inherit;" data-link>
        <img src="${p.image}" alt="${p.name}" class="product-image">
      </a>
      <div class="product-info">
        <a href="#/product/${p.id}" style="text-decoration:none; color:inherit;" data-link>
          <h3 class="product-title">${p.name}</h3>
        </a>
        <div class="product-price">Rs. ${p.price.toLocaleString()}</div>
        <div class="product-rating">
          ${generateStars(p.rating)} <span>(${p.rating})</span>
        </div>
        <span class="product-category">${p.category}</span>
        <button class="add-to-cart" data-id="${p.id}">Add to Cart</button>
      </div>
    </div>
  `).join("");
}

function renderCategoriesGrid(container) {
  if (!container) return;
  container.innerHTML = categories.map(cat => `
    <div class="category-card" data-category="${cat}">
      <i class="fas ${categoryIcons[cat]}"></i>
      <h3>${cat}</h3>
    </div>
  `).join("");
  document.querySelectorAll(".category-card").forEach(card => {
    card.addEventListener("click", () => {
      const cat = card.dataset.category;
      window.location.hash = "#/products";
      // After navigating, set filter
      setTimeout(() => {
        const btns = document.querySelectorAll(".filter-btn");
        btns.forEach(btn => {
          if (btn.dataset.category === cat) {
            btn.click();
          }
        });
      }, 100);
    });
  });
}

function renderFeaturedProducts() {
  const featured = document.getElementById("featuredProducts");
  if (featured) {
    featured.innerHTML = renderProductCards(products.slice(0, 3));
    featured.querySelectorAll(".add-to-cart").forEach(btn => {
      btn.addEventListener("click", e => {
        const id = parseInt(btn.dataset.id);
        addToCart(id);
      });
    });
  }
}

function renderCategoryFilters() {
  const container = document.getElementById("categoryFilters");
  if (!container) return;
  container.innerHTML = '<button class="filter-btn active" data-category="all">All</button>';
  categories.forEach(cat => {
    container.innerHTML += `<button class="filter-btn" data-category="${cat}">${cat}</button>`;
  });
  document.querySelectorAll(".filter-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      currentFilter = btn.dataset.category;
      filterProducts();
    });
  });
}

function renderAllProducts() {
  const grid = document.getElementById("productsGrid");
  if (grid) {
    grid.innerHTML = renderProductCards(products);
    grid.querySelectorAll(".add-to-cart").forEach(btn => {
      btn.addEventListener("click", e => {
        const id = parseInt(btn.dataset.id);
        addToCart(id);
      });
    });
  }
}

function filterProducts() {
  const searchInput = document.getElementById("productSearch");
  const sortSelect = document.getElementById("sortSelect");
  const grid = document.getElementById("productsGrid");
  if (!grid) return;

  let filtered = products;
  const searchTerm = searchInput ? searchInput.value.toLowerCase() : "";
  if (searchTerm) {
    filtered = filtered.filter(p =>
      p.name.toLowerCase().includes(searchTerm) ||
      p.category.toLowerCase().includes(searchTerm)
    );
  }
  if (currentFilter !== "all") {
    filtered = filtered.filter(p => p.category === currentFilter);
  }

  const sortBy = sortSelect ? sortSelect.value : "default";
  if (sortBy === "priceAsc") {
    filtered.sort((a, b) => a.price - b.price);
  } else if (sortBy === "priceDesc") {
    filtered.sort((a, b) => b.price - a.price);
  } else if (sortBy === "rating") {
    filtered.sort((a, b) => b.rating - a.rating);
  }

  grid.innerHTML = renderProductCards(filtered);
  grid.querySelectorAll(".add-to-cart").forEach(btn => {
    btn.addEventListener("click", e => {
      const id = parseInt(btn.dataset.id);
      addToCart(id);
    });
  });
}

// ==================== INIT ====================
window.addEventListener("load", () => {
  navigateTo(window.location.hash || "#/");
  updateCart();
});

window.addEventListener("hashchange", () => navigateTo(window.location.hash));