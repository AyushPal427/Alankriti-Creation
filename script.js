// Toggle menu
function toggleMenu() {
  const sideMenu = document.getElementById('sideMenu');
  sideMenu.classList.toggle('active');
}

// Login/Signup Modal Functions
function openLoginModal() {
  document.getElementById('loginModal').style.display = 'block';
  showLoginForm();
}

function closeLoginModal() {
  document.getElementById('loginModal').style.display = 'none';
}

function toggleLogin() {
  const loginForm = document.getElementById('loginForm');
  const signupForm = document.getElementById('signupForm');
  const loginTitle = document.getElementById('loginTitle');
  const toggleText = document.getElementById('toggleLogin');

  if (loginForm.style.display === 'none') {
    showLoginForm();
  } else {
    loginForm.style.display = 'none';
    signupForm.style.display = 'block';
    loginTitle.innerText = 'Sign Up';
    toggleText.innerText = 'Already have an account? Login';
  }
}

function showLoginForm() {
  document.getElementById('loginForm').style.display = 'block';
  document.getElementById('signupForm').style.display = 'none';
  document.getElementById('loginTitle').innerText = 'Login';
  document.getElementById('toggleLogin').innerText = "Don't have an account? Sign up";
}

// Register User
function registerUser() {
  const name = document.getElementById('signupName').value;
  const email = document.getElementById('signupEmail').value;
  const password = document.getElementById('signupPassword').value;
  const confirm = document.getElementById('signupConfirm').value;

  if (password !== confirm) {
    alert("Passwords do not match");
    return;
  }

  const user = { name, email, password };
  localStorage.setItem('user', JSON.stringify(user));
  localStorage.setItem('isLoggedIn', 'true');
  updateUI();
  closeLoginModal();
}

// Login User
function loginUser() {
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;

  const storedUser = JSON.parse(localStorage.getItem('user'));

  if (storedUser && storedUser.email === email && storedUser.password === password) {
    localStorage.setItem('isLoggedIn', 'true');
    updateUI();
    closeLoginModal();
  } else {
    alert("Invalid credentials");
  }
}

// Update UI after login/signup
function updateUI() {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  const authButtons = document.getElementById('authButtons');
  const userAuth = document.getElementById('userAuth');
  const greeting = document.getElementById('user-greeting');
  const user = JSON.parse(localStorage.getItem('user'));

  if (isLoggedIn && user) {
    authButtons.style.display = 'none';
    userAuth.style.display = 'block';
    greeting.innerText = `Hello, ${user.name}`;
  } else {
    authButtons.style.display = 'block';
    userAuth.style.display = 'none';
  }
}

// Logout
function logoutUser() {
  localStorage.setItem('isLoggedIn', 'false');
  updateUI();
}

// Initial UI Check
window.onload = function () {
  updateUI();
};
