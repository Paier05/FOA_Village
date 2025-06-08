document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value;

  try {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();

    if (res.ok) {
      window.location.href = "og.html"; // redirect to OG page
    } else {
      document.getElementById("loginError").innerText = data.message || "Login failed.";
    }
  } catch (err) {
    document.getElementById("loginError").innerText = "Something went wrong.";
  }
});

function togglePassword(id) {
  const input = document.getElementById(id);
  input.type = input.type === "password" ? "text" : "password";
}
