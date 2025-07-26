function toggleForm(type) {
  document.getElementById('login-form').style.display = type === 'login' ? 'block' : 'none';
  document.getElementById('signup-form').style.display = type === 'signup' ? 'block' : 'none';
}

function signupUser(e) {
  e.preventDefault();
  const name = document.getElementById('signup-name').value;
  const email = document.getElementById('signup-email').value;
  const password = document.getElementById('signup-password').value;

  const user = { name, email, password };
  localStorage.setItem('user', JSON.stringify(user));
  alert('Sign Up successful! Please log in.');
  toggleForm('login');
}

function loginUser(e) {
  e.preventDefault();
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;

  const storedUser = JSON.parse(localStorage.getItem('user'));
  if (storedUser && storedUser.email === email && storedUser.password === password) {
    localStorage.setItem('loggedIn', 'true');
    alert('Login successful!');
    window.location.href = 'index.html';
  } else {
    alert('Invalid credentials');
  }
}
