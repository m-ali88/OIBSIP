const loginForm = document.querySelector("#login-form");
const loginMessage = document.querySelector("#message");

redirectIfAuthenticated();

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  clearFieldErrors(loginForm);
  loginMessage.hidden = true;

  const identifier = loginForm.identifier.value.trim();
  const password = loginForm.password.value;

  let valid = true;

  if (!identifier) {
    setFieldError(loginForm, "login-identifier", "Please enter your username or email.");
    valid = false;
  }

  if (!password) {
    setFieldError(loginForm, "login-password", "Please enter your password.");
    valid = false;
  }

  if (!valid) {
    showMessage(loginMessage, "Please complete all required fields.");
    return;
  }

  const users = getUsers();
  const normalizedIdentifier = identifier.toLowerCase();

  const user = users.find(
    (item) =>
      item.username === normalizedIdentifier ||
      item.email === normalizedIdentifier
  );

  const passwordHash = await hashPassword(password);

  // Deliberately use the same generic message whether the identifier or password fails.
  if (!user || user.passwordHash !== passwordHash) {
    showMessage(loginMessage, "Invalid username/email or password.");
    return;
  }

  setSession(user.id);
  window.location.replace("dashboard.html");
});
