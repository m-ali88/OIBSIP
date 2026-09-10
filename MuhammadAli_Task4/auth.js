const USERS_KEY = "securegate-users";
const SESSION_KEY = "securegate-session";

function getUsers() {
  try {
    const savedUsers = localStorage.getItem(USERS_KEY);
    return savedUsers ? JSON.parse(savedUsers) : [];
  } catch {
    return [];
  }
}

function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function normalizeUsername(username) {
  return username.trim().toLowerCase();
}

function normalizeEmail(email) {
  return email.trim().toLowerCase();
}

async function hashPassword(password) {
  const data = new TextEncoder().encode(password);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

function setSession(userId) {
  sessionStorage.setItem(SESSION_KEY, JSON.stringify({
    userId,
    loggedInAt: new Date().toISOString()
  }));
}

function getSession() {
  try {
    const session = sessionStorage.getItem(SESSION_KEY);
    return session ? JSON.parse(session) : null;
  } catch {
    return null;
  }
}

function getCurrentUser() {
  const session = getSession();

  if (!session) {
    return null;
  }

  return getUsers().find((user) => user.id === session.userId) || null;
}

function logout() {
  sessionStorage.removeItem(SESSION_KEY);
  window.location.replace("index.html");
}

function redirectIfAuthenticated() {
  if (getCurrentUser()) {
    window.location.replace("dashboard.html");
  }
}

function showMessage(element, text, type = "error") {
  element.textContent = text;
  element.className = `message ${type}`;
  element.hidden = false;
}

function clearFieldErrors(form) {
  form.querySelectorAll(".field-error").forEach((element) => {
    element.textContent = "";
  });

  form.querySelectorAll("input").forEach((input) => {
    input.removeAttribute("aria-invalid");
  });
}

function setFieldError(form, inputId, message) {
  const input = form.querySelector(`#${inputId}`);
  const error = form.querySelector(`[data-error-for="${inputId}"]`);

  if (input) {
    input.setAttribute("aria-invalid", "true");
  }

  if (error) {
    error.textContent = message;
  }
}
