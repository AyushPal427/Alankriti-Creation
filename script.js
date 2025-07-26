// ===== Toast Notification =====
function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 3000);
}

// ===== Open Modals =====
document.getElementById("loginBtn").addEventListener("click", () => {
  document.getElementById("loginModal").style.display = "block";
});
document.getElementById("signupBtn").addEventListener("click", () => {
  document.getElementById("signupModal").style.display = "block";
});

// ===== Close Modals =====
document.querySelectorAll(".close").forEach(closeBtn => {
  closeBtn.addEventListener("click", () => {
    closeBtn.closest(".modal").style.display = "none";
  });
});

// ===== Signup Form Handling =====
document.getElementById("signupForm").addEventListener("submit", e => {
  e.preventDefault();
  const name = document.getElementById("signupName").value.trim();
  const email = document.getElementById("signupEmail").value.trim();
  const pass = document.getElementById("signupPassword").value;
  const confirm = document.getElementById("signupConfirmPassword").value;

  if (!name || !email || !pass || !confirm) {
    showToast("Please fill all fields");
    return;
  }

  if (pass !== confirm) {
    showToast("Passwords do not match");
    return;
  }

  // Save to localStorage
  localStorage.setItem("user", JSON.stringify({ name, email, password: pass }));
  localStorage.setItem("isLoggedIn", "true");

  document.getElementById("signupModal").style.display = "none";
  updateAuthUI();
  showToast("Signup successful! Logged in.");
});

// ===== Login Form Handling =====
document.getElementById("loginForm").addEventListener("submit", e => {
  e.preventDefault();
  const email = document.getElementById("loginEmail").value.trim();
  const pass = document.getElementById("loginPassword").value;

  const user = JSON.parse(localStorage.getItem("user"));

  if (!user || user.email !== email || user.password !== pass) {
    showToast("Invalid credentials");
    return;
  }

  localStorage.setItem("isLoggedIn", "true");
  document.getElementById("loginModal").style.display = "none";
  updateAuthUI();
  showToast("Login successful!");
});

// ===== Logout =====
document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.setItem("isLoggedIn", "false");
  updateAuthUI();
  showToast("Logged out!");
});

// ===== Auth UI Update =====
function updateAuthUI() {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  const user = JSON.parse(localStorage.getItem("user")) || {};

  const loginBtn = document.getElementById("loginBtn");
  const signupBtn = document.getElementById("signupBtn");
  const logoutBtn = document.getElementById("logoutBtn");
  const greeting = document.getElementById("user-greeting");

  if (isLoggedIn && user.name) {
    loginBtn.style.display = "none";
    signupBtn.style.display = "none";
    logoutBtn.style.display = "inline-block";
    greeting.textContent = `👋 Hi, ${user.name.split(" ")[0]}`;
    greeting.style.display = "inline-block";
  } else {
    loginBtn.style.display = "inline-block";
    signupBtn.style.display = "inline-block";
    logoutBtn.style.display = "none";
    greeting.textContent = "";
    greeting.style.display = "none";
  }
}

// ===== Close modal on click outside =====
window.addEventListener("click", e => {
  document.querySelectorAll(".modal").forEach(modal => {
    if (e.target === modal) modal.style.display = "none";
  });
});

// ===== Init =====
document.addEventListener("DOMContentLoaded", () => {
  updateAuthUI();
});
