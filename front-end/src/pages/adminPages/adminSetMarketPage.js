import React from "react";
import "../authPages/authPage.css";
import SetMarket from "../../components/marketComponent/setMarketPrice.js";
import MarketRatesInfo from "../../components/marketComponent/viewMarket.js";

const AdminSetMarketPage = () => {
  return (
    <div className="auth-page-background">
      <MarketRatesInfo />
      <SetMarket />
    </div>
  );
};

export default AdminSetMarketPage;