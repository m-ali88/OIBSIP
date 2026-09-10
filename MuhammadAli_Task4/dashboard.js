const currentUser = getCurrentUser();

if (!currentUser) {
  window.location.replace("index.html");
} else {
  document.querySelector("#username").textContent = currentUser.username;
  document.querySelector("#avatar").textContent = currentUser.username.charAt(0).toUpperCase();
}

document.querySelector("#logout-button").addEventListener("click", logout);
