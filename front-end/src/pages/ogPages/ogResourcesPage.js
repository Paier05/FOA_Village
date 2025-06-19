import React from "react";
import OGResArmInfo from "../../components/ogResArmComponent/ogResArmInfo.js";
import OGOwnInventory from "../../components/viewInventoryComponent/ogViewInventory.js";
import OGLandOwned from "../../components/ogResArmComponent/ogLandOwned.js";

const OGResourcesPage = () => {
  return (
    <div style={{ padding: "2rem", maxWidth: "600px", margin: "auto" }}>
      <OGOwnInventory />
      <OGLandOwned />
      <OGResArmInfo />
    </div>
  );
};

export default OGResourcesPage;