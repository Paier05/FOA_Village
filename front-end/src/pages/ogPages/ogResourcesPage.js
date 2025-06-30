import React from "react";
import OGResArmInfo from "../../components/ogResArmComponent/ogResArmInfo.js";
import OGOwnInventory from "../../components/viewInventoryComponent/ogViewInventory.js";
import OGLandOwned from "../../components/ogResArmComponent/ogLandOwned.js";
import "../authPages/authPage.css";

const OGResourcesPage = () => {
  return (
    <div className="auth-page-background">
      <OGOwnInventory />
      <OGLandOwned />
      <OGResArmInfo />
    </div>
  );
};

export default OGResourcesPage;