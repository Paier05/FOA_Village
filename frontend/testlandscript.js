async function fetchOGLand() {
  const id = document.getElementById("ogId").value;

  try {
    const response = await fetch(`/api/land/${id}`);
    const data = await response.json();
    console.log("Fetched data:", data);
    
    if (!response.ok) {
      document.getElementById("fetchLandResult").innerText = "OG not found!";
      return;
    }

    document.getElementById("fetchLandResult").innerText = `Wood: ${data.data.wood}, Bricks: ${data.data.bricks}, Livestock: ${data.data.livestock}, Wheat: ${data.data.wheat}, Ore: ${data.data.ore}, Textiles: ${data.data.textiles}`;
  } catch (error) {
    document.getElementById("fetchLandResult").innerText = "Error fetching OG land.";
  }
};


async function fetchAllOGLand() {
  try {
    const response = await fetch("/api/land");
    const data = await response.json();

    const list = document.getElementById("allOgLandList");
    list.innerHTML = "";

    if (Array.isArray(data.data)) {
      data.data.forEach((og) => {
        const li = document.createElement("li");
        li.textContent = `ID: ${og.id}, Wood: ${og.wood}, Bricks: ${og.bricks}, Livestock: ${og.livestock}, Wheat: ${og.wheat}, Ore: ${og.ore}, Textiles: ${og.textiles}`;
        list.appendChild(li);
      });
    } else {
      list.innerHTML = "<li>No OG Land found.</li>";
    }
  } catch (err) {
    document.getElementById("allOgLandList").innerHTML = `<li>Error fetching all OG land.</li>`;
  }
};


document.getElementById("updateOgLandForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const id = parseInt(document.getElementById("updateId").value);
  const wood = parseInt(document.getElementById("updateWood").value);
  const bricks = parseInt(document.getElementById("updateBricks").value);
  const livestock = parseInt(document.getElementById("updateLivestock").value);
  const wheat = parseInt(document.getElementById("updateWheat").value);
  const ore = parseInt(document.getElementById("updateOre").value);
  const textiles = parseInt(document.getElementById("updateTextiles").value);

  try {
    const response = await fetch(`/api/land/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ wood, bricks, livestock, wheat, ore, textiles }),
    });

    const data = await response.json();

    if (response.ok) {
      document.getElementById("updateLandResult").innerText = "OG land updated successfully!";
    } else {
      document.getElementById("updateLandResult").innerText = `Error: ${data.error}`;
    }
  } catch (err) {
    document.getElementById("updateLandResult").innerText = `Request failed: ${err.message}`;
  }

  e.target.reset();
});