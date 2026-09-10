const registerForm = document.querySelector("#register-form");
const registerMessage = document.querySelector("#message");
const passwordInput = document.querySelector("#register-password");
const meterBar = document.querySelector("#meter-bar");

redirectIfAuthenticated();

function updatePasswordMeter() {
  const password = passwordInput.value;
  let score = 0;

  if (password.length >= 8) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  meterBar.style.width = `${score * 25}%`;
}

passwordInput.addEventListener("input", updatePasswordMeter);

registerForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  clearFieldErrors(registerForm);
  registerMessage.hidden = true;

  const username = normalizeUsername(registerForm.username.value);
  const email = normalizeEmail(registerForm.email.value);
  const password = registerForm.password.value;

  let valid = true;

  if (!username) {
    setFieldError(registerForm, "register-username", "Username is required.");
    valid = false;
  } else if (!/^[a-z0-9._-]{3,30}$/i.test(username)) {
    setFieldError(registerForm, "register-username", "Use 3–30 letters, numbers, dots, underscores, or hyphens.");
    valid = false;
  }

  if (!email) {
    setFieldError(registerForm, "register-email", "Email is required.");
    valid = false;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    setFieldError(registerForm, "register-email", "Enter a valid email address.");
    valid = false;
  }

  if (!password) {
    setFieldError(registerForm, "register-password", "Password is required.");
    valid = false;
  } else if (password.length < 8 || !/[0-9]/.test(password)) {
    setFieldError(registerForm, "register-password", "Password needs at least 8 characters and 1 number.");
    valid = false;
  }

  if (!valid) {
    showMessage(registerMessage, "Please fix the highlighted fields.");
    return;
  }

  const users = getUsers();

  const duplicate = users.some(
    (user) => user.username === username || user.email === email
  );

  if (duplicate) {
    showMessage(registerMessage, "An account with that username or email already exists.");
    return;
  }

  const passwordHash = await hashPassword(password);

  users.push({
    id: crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`,
    username,
    email,
    passwordHash,
    createdAt: new Date().toISOString()
  });

  saveUsers(users);

  showMessage(registerMessage, "Registration successful. Redirecting to login…", "success");

  setTimeout(() => {
    window.location.replace("index.html");
  }, 700);
});
