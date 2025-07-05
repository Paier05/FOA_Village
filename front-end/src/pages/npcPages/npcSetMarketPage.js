import React from "react";
import "../authPages/authPage.css";
import SetMarket from "../../components/marketComponent/setMarketPrice.js";
import MarketRatesInfo from "../../components/marketComponent/viewMarket.js";

const NPCSetMarketPage = () => {
  return (
    <div className="auth-page-background">
      <MarketRatesInfo />
      <SetMarket />
    </div>
  );
};

export default NPCSetMarketPage;