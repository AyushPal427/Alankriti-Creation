function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  document.getElementById('cart-count').textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
}

function addToCart(name, price, image) {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const existing = cart.find(item => item.name === name);
  if (existing) {
    existing.quantity++;
  } else {
    cart.push({ name, price, image, quantity: 1 });
  }
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
  alert(`${name} added to cart!`);
}

function displayCart() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const container = document.getElementById('cart-items');
  const totalDiv = document.getElementById('cart-total');
  container.innerHTML = '';

  if (cart.length === 0) {
    container.innerHTML = '<p>Your cart is empty.</p>';
    totalDiv.textContent = '';
    return;
  }

  let total = 0;
  cart.forEach((item, index) => {
    const itemDiv = document.createElement('div');
    itemDiv.className = 'cart-item';

    itemDiv.innerHTML = `
      <img src="${item.image}" alt="${item.name}" />
      <div class="cart-info">
        <strong>${item.name}</strong><br>₹${item.price} x ${item.quantity}
      </div>
      <div class="cart-actions">
        <button onclick="changeQuantity(${index}, -1)">−</button>
        <button onclick="changeQuantity(${index}, 1)">+</button>
        <button onclick="removeItem(${index})">Remove</button>
      </div>
    `;

    container.appendChild(itemDiv);
    total += item.price * item.quantity;
  });

  totalDiv.textContent = `Total: ₹${total}`;
}

function changeQuantity(index, delta) {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  cart[index].quantity += delta;
  if (cart[index].quantity < 1) cart[index].quantity = 1;
  localStorage.setItem('cart', JSON.stringify(cart));
  displayCart();
  updateCartCount();
}

function removeItem(index) {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  cart.splice(index, 1);
  localStorage.setItem('cart', JSON.stringify(cart));
  displayCart();
  updateCartCount();
}

// On page load
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('cart-items')) {
    displayCart();
  }
  updateCartCount();
});
