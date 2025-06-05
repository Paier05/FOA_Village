// Handle form submission for adding OG
document.getElementById("ogForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = document.getElementById("name").value.trim();
  const score = parseInt(document.getElementById("score").value);

  try {
    const response = await fetch("/api/ogs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, score }),
    });

    const data = await response.json();

    if (response.ok) {
      document.getElementById("addResult").innerText = "OG added successfully!";
    } else {
      document.getElementById("addResult").innerText = `Error: ${data.error}`;
    }
  } catch (err) {
    document.getElementById("addResult").innerText = `Request failed: ${err.message}`;
  }

  // Clear the form
  e.target.reset(); 
});


async function fetchOG() {
  const id = document.getElementById("ogId").value;

  try {
    const response = await fetch(`/api/ogs/${id}`);
    const data = await response.json();
    console.log("Fetched data:", data);
    
    if (!response.ok) {
      document.getElementById("fetchResult").innerText = "OG not found!";
      return;
    }

    document.getElementById("fetchResult").innerText = `Name: ${data.data.name}, Score: ${data.data.score}`;
  } catch (error) {
    document.getElementById("fetchResult").innerText = "Error fetching OG.";
  }
};


async function fetchAllOGs() {
  try {
    const response = await fetch("/api/ogs");
    const data = await response.json();

    const list = document.getElementById("allOgsList");
    list.innerHTML = "";

    if (Array.isArray(data.data)) {
      data.data.forEach((og) => {
        const li = document.createElement("li");
        li.textContent = `ID: ${og.id}, Name: ${og.name}, Score: ${og.score}`;
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
  const name = document.getElementById("updateName").value.trim();
  const score = parseInt(document.getElementById("updateScore").value);

  try {
    const response = await fetch(`/api/ogs/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, score }),
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


document.getElementById("deleteOgForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const id = parseInt(document.getElementById("deleteId").value);

  try {
    const response = await fetch(`/api/ogs/${id}`, {
      method: "DELETE"
    });

    const data = await response.json();

    if (response.ok) {
      document.getElementById("deleteResult").innerText = "OG deleted successfully!";
    } else {
      document.getElementById("deleteResult").innerText = `Error: ${data.error}`;
    }
  } catch (err) {
    document.getElementById("deleteResult").innerText = `Request failed: ${err.message}`;
  }

  e.target.reset();
});