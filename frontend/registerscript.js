document.getElementById("registerForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;

  const errorElem = document.getElementById("registerError");

  if (password !== confirmPassword) {
    errorElem.innerText = "Passwords do not match.";
    return;
  }

  try {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();

    if (res.ok) {
      // Registration successful, redirect to login
      window.location.href = "index.html";
    } else {
      errorElem.innerText = data.message || "Registration failed.";
    }
  } catch (err) {
    errorElem.innerText = "Something went wrong.";
  }
});

function togglePassword(id) {
  const input = document.getElementById(id);
  input.type = input.type === "password" ? "text" : "password";
}