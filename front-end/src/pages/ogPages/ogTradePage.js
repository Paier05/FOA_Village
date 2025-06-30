import React from "react";
import OGTrade from "../../components/tradingComponent/ogTrading.js";
import OGResArmInfo from "../../components/ogResArmComponent/ogResArmInfo.js";
import OGOwnInventory from "../../components/viewInventoryComponent/ogViewInventory.js";
import "../authPages/authPage.css";

const OGTradePage = () => {
  return (
    <div className="auth-page-background">
      <OGOwnInventory />
      <OGResArmInfo />
      <OGTrade />
    </div>
  );
};

export default OGTradePage;