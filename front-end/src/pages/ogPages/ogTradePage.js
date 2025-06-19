import React from "react";
import OGTrade from "../../components/tradingComponent/ogTrading.js";
import OGResArmInfo from "../../components/ogResArmComponent/ogResArmInfo.js";
import OGOwnInventory from "../../components/viewInventoryComponent/ogViewInventory.js";

const OGTradePage = () => {
  return (
    <div style={{ padding: "2rem", maxWidth: "600px", margin: "auto" }}>
      <OGOwnInventory />
      <OGResArmInfo />
      <OGTrade />
    </div>
  );
};

export default OGTradePage;