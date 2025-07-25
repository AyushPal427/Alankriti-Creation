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
  alert("Redirecting to Razorpay...");
  window.open("https://rzp.io/l/your-payment-link", "_blank");
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
  renderCart(); // Only works if on cart.html
});
