async function fetchOG() {
  const id = document.getElementById("ogId").value;

  try {
    const response = await fetch(`/api/ogs/${id}`, {credentials: "include"});
    const data = await response.json();
    console.log("Fetched data:", data);
    
    if (!response.ok) {
      document.getElementById("fetchResult").innerText = "OG not found!";
      return;
    }

    document.getElementById("fetchResult").innerText = `Score: ${data.data.score}`;
  } catch (error) {
    document.getElementById("fetchResult").innerText = "Error fetching OG.";
  }
};


async function fetchAllOGs() {
  try {
    const response = await fetch("/api/ogs", {credentials: "include"});
    const data = await response.json();

    const list = document.getElementById("allOgsList");
    list.innerHTML = "";

    if (Array.isArray(data.data)) {
      data.data.forEach((og) => {
        const li = document.createElement("li");
        li.textContent = `ID: ${og.id}, Score: ${og.score}`;
        list.appendChild(li);
      });
    } else {
      list.innerHTML = "<li>No OGs found.</li>";
    }
  } catch (err) {
    document.getElementById("allOgsList").innerHTML = `<li>Error fetching OGs.</li>`;
  }
};


document.getElementById("updateOgForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const id = parseInt(document.getElementById("updateId").value);
  const score = parseInt(document.getElementById("updateScore").value);

  try {
    const response = await fetch(`/api/ogs/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ score }),
      credentials: "include"
    });

    const data = await response.json();

    if (response.ok) {
      document.getElementById("updateResult").innerText = "OG updated successfully!";
    } else {
      document.getElementById("updateResult").innerText = `Error: ${data.error}`;
    }
  } catch (err) {
    document.getElementById("updateResult").innerText = `Request failed: ${err.message}`;
  }

  e.target.reset();
});