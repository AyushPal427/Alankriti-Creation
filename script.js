// Load cart from localStorage
let cart = JSON.parse(localStorage.getItem('cart')) || [];

function saveCart() {
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
}

function addToCart(name, price, image) {
  const existing = cart.find(item => item.name === name);
  if (existing) {
    existing.qty++;
  } else {
    cart.push({ name, price, image, qty: 1 });
  }
  saveCart();
  showToast(`${name} added to cart!`); 
}

function showToast(message) {
  const toast = document.getElementById("toast");
  if (toast) {
    toast.innerText = message;
    toast.classList.add("show");
    setTimeout(() => {
      toast.classList.remove("show");
    }, 3000);
  }
}

// Update cart icon count
function updateCartCount() {
  const count = cart.reduce((total, item) => total + item.qty, 0);
  const counter = document.getElementById('cart-count');
  if (counter) counter.innerText = count;
}

function toggleMenu() {
  const sideMenu = document.getElementById("sideMenu");
  sideMenu.classList.toggle("show");
}

// Render cart items in cart.html
function renderCart() {
  const cartItemsDiv = document.getElementById('cart-items');
  const cartTotalSpan = document.getElementById('cart-total');
  if (!cartItemsDiv || !cartTotalSpan) return;

  cartItemsDiv.innerHTML = '';

  if (cart.length === 0) {
    cartItemsDiv.innerHTML = '<p>Your cart is empty.</p>';
    cartTotalSpan.innerText = '0';
    return;
  }

  let total = 0;

  cart.forEach((item, index) => {
    const itemTotal = item.price * item.qty;
    total += itemTotal;

    const itemDiv = document.createElement('div');
    itemDiv.className = 'cart-item';
    itemDiv.innerHTML = `
      <img src="${item.image}" alt="${item.name}" />
      <div class="item-info">
        <h4>${item.name}</h4>
        <p>Price: ₹${item.price}</p>
        <div class="qty-controls">
          <button onclick="changeQty(${index}, -1)">-</button>
          <span>${item.qty}</span>
          <button onclick="changeQty(${index}, 1)">+</button>
        </div>
        <button onclick="removeItem(${index})" class="remove-btn">Remove</button>
      </div>
    `;
    cartItemsDiv.appendChild(itemDiv);
  });

  cartTotalSpan.innerText = total;
}

function changeQty(index, delta) {
  cart[index].qty += delta;
  if (cart[index].qty <= 0) {
    cart.splice(index, 1);
  }
  saveCart();
  renderCart();
}

function removeItem(index) {
  cart.splice(index, 1);
  saveCart();
  renderCart();
}

// Checkout via Razorpay
function checkoutRazorpay() {
  const totalAmount = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  const options = {
    key: "YOUR_RAZORPAY_KEY", // Replace with your actual key
    amount: totalAmount * 100, // Amount in paise
    currency: "INR",
    name: "Alankriti Creations",
    description: "Tote Bag Order",
    image: "images/logo.png", // Optional logo
    handler: function (response) {
  // Save order info for manual tracking
  const orderInfo = {
    paymentId: response.razorpay_payment_id,
    amount: totalAmount,
    status: "success",
    date: new Date().toLocaleString()
  };
  localStorage.setItem("lastOrder", JSON.stringify(orderInfo));

  localStorage.removeItem("cart");
  window.location.href = "success.html";
},
    modal: {
  ondismiss: function () {
    const failedOrder = {
      status: "failed",
      amount: totalAmount,
      date: new Date().toLocaleString()
    };
    localStorage.setItem("lastOrder", JSON.stringify(failedOrder));
    window.location.href = "failure.html";
  }
},
    prefill: {
      name: "",
      email: "",
      contact: ""
    },
    theme: {
      color: "#333"
    }
  };

  const rzp = new Razorpay(options);
  rzp.open();
}

// Checkout via WhatsApp
function checkoutWhatsApp() {
  let message = 'Hello, I want to order:\n';
  cart.forEach(item => {
    message += `${item.name} x${item.qty} = ₹${item.price * item.qty}\n`;
  });
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  message += `Total = ₹${total}`;
  const encoded = encodeURIComponent(message);
  window.open(`https://wa.me/919999999999?text=${encoded}`, '_blank');
}

// Run on page load
document.addEventListener('DOMContentLoaded', () => {
  updateCartCount();
  renderCart?.(); // Only works if on cart.html and will not throw error if not present

  // 🆕 Login greeting feature
  const user = JSON.parse(localStorage.getItem('user'));
  const loggedIn = localStorage.getItem('loggedIn') === 'true';

  if (loggedIn && user?.name) {
    const userGreeting = document.getElementById('user-greeting');
    if (userGreeting) {
      userGreeting.textContent = `Hi, ${user.name}`;
    }
  }
});

// Handle login/signup form
document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");
  const toggle = document.getElementById("toggleLogin");

  if (toggle) {
    toggle.addEventListener("click", () => {
      const isSignup = loginForm.dataset.signup === "true";
      loginForm.dataset.signup = !isSignup;
      loginForm.querySelector("button").textContent = isSignup ? "Login" : "Sign Up";
      toggle.textContent = isSignup
        ? "Don't have an account? Sign up"
        : "Already have an account? Login";
    });
  }

  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = loginForm.username.value.trim();
      const email = loginForm.email.value.trim();
      const password = loginForm.password.value;

      const isSignup = loginForm.dataset.signup === "true";

      if (isSignup) {
        const user = { name, email, password };
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("loggedIn", "true");
        alert("Signup successful!");
        window.location.href = "index.html";
      } else {
        const savedUser = JSON.parse(localStorage.getItem("user"));
        if (
          savedUser &&
          savedUser.email === email &&
          savedUser.password === password
        ) {
          localStorage.setItem("loggedIn", "true");
          alert("Login successful!");
          window.location.href = "index.html";
        } else {
          alert("Invalid credentials.");
        }
      }
    });
  }
});
