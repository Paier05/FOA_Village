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

    document.getElementById("fetchResult").innerText = 
      `Score: ${data.data.score}, Army: ${data.data.army}, FDCX: ${data.data.fdcx}, ` +
      `FDCX+: ${data.data.fdcx_plus}, MLMF: ${data.data.mlmf}, ` +
      `SMMF: ${data.data.smmf}, SMMF+: ${data.data.smmf_plus}`;
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
        li.textContent = `ID: ${og.id}, Score: ${og.score}, Army: ${og.army}, FDCX: ${og.fdcx}, ` +
          `FDCX+: ${og.fdcx_plus}, MLMF: ${og.mlmf}, ` +
          `SMMF: ${og.smmf}, SMMF+: ${og.smmf_plus}`;
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

  const id = document.getElementById("updateId").value;
  const field = document.getElementById("updateField").value;
  const value = parseInt(document.getElementById("updateValue").value);
  const updateResult = document.getElementById("updateResult");

  if (!field) {
    updateResult.innerText = "Please select a field to update.";
    return;
  }

  try {
    const response = await fetch(`/api/ogs/${id}/${field}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ [field]: value }),
      credentials: "include"
    });

    const data = await response.json();

    if (response.ok) {
      updateResult.innerText = `OG ${field} updated successfully!`;
    } else {
      updateResult.innerText = `Error: ${data.message || "Something went wrong."}`;
    }
  } catch (err) {
    updateResult.innerText = `Request failed: ${err.message}`;
  }

  e.target.reset();
});