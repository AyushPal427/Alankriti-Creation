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
    setTimeout(() => toast.classList.remove("show"), 3000);
  }
}

function closeLoginModal() {
  document.getElementById("loginModal").style.display = "none";
}

function updateCartCount() {
  const count = cart.reduce((total, item) => total + item.qty, 0);
  const counter = document.getElementById('cart-count');
  if (counter) counter.innerText = count;
}

function openLoginModal() {
  document.getElementById("loginModal").style.display = "block";
}

function toggleMenu() {
  const sideMenu = document.getElementById("sideMenu");
  sideMenu.classList.toggle("show");
}

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
  if (cart[index].qty <= 0) cart.splice(index, 1);
  saveCart();
  renderCart();
}

function removeItem(index) {
  cart.splice(index, 1);
  saveCart();
  renderCart();
}

// Razorpay Checkout
function checkoutRazorpay() {
  const totalAmount = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const options = {
    key: "YOUR_RAZORPAY_KEY",
    amount: totalAmount * 100,
    currency: "INR",
    name: "Alankriti Creations",
    description: "Tote Bag Order",
    image: "images/logo.png",
    handler: function (response) {
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

// WhatsApp Checkout
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

// On page load
document.addEventListener('DOMContentLoaded', () => {
  updateCartCount();
  renderCart?.();

  const user = JSON.parse(localStorage.getItem('user'));
  const loggedIn = localStorage.getItem('loggedIn') === 'true';

  if (loggedIn && user?.name) {
    const userGreeting = document.getElementById('user-greeting');
    if (userGreeting) userGreeting.textContent = `Hi, ${user.name}`;

    const authButtons = document.getElementById('authButtons');
    if (authButtons) authButtons.style.display = 'none';

    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) logoutBtn.style.display = 'inline-block';
  }
});

// Toggle Login/Signup
function toggleLogin() {
  const loginForm = document.getElementById("loginForm");
  const signupForm = document.getElementById("signupForm");
  const loginTitle = document.getElementById("loginTitle");
  const toggleLink = document.getElementById("toggleLogin");

  const isLogin = loginForm.style.display !== "none";
  loginForm.style.display = isLogin ? "none" : "block";
  signupForm.style.display = isLogin ? "block" : "none";
  loginTitle.innerText = isLogin ? "Sign Up" : "Login";
  toggleLink.innerText = isLogin ? "Already have an account? Login" : "Don't have an account? Sign up";
}

// Signup
function registerUser() {
  const name = document.getElementById("signupName").value.trim();
  const email = document.getElementById("signupEmail").value.trim();
  const password = document.getElementById("signupPassword").value;
  const confirm = document.getElementById("signupConfirm").value;

  if (!name || !email || !password || !confirm) return alert("Please fill in all fields.");
  if (password !== confirm) return alert("Passwords do not match.");

  const user = { name, email, password };
  localStorage.setItem("user", JSON.stringify(user));
  localStorage.setItem("loggedIn", "true");
  alert("Signup successful!");
  window.location.href = "index.html";
}

// Login
function loginUser() {
  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value;
  const savedUser = JSON.parse(localStorage.getItem("user"));

  if (savedUser && savedUser.email === email && savedUser.password === password) {
    localStorage.setItem("loggedIn", "true");
    alert("Login successful!");
    window.location.href = "index.html";
  } else {
    alert("Invalid email or password.");
  }
}

// Logout
function logoutUser() {
  localStorage.removeItem("loggedIn");
  window.location.href = "index.html";
}
