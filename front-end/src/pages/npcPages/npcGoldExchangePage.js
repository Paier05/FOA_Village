import React from "react";
import OGSelector from "../../components/ogSelectionComponent/ogSelection.js";
import { OGProvider } from "../../components/ogSelectionComponent/ogContext.js";
import "../authPages/authPage.css";
import GoldExchange from "../../components/goldCoinComponent/goldExchange.js";
import OGResInfo from "../../components/ogResArmComponent/modViewOGRes.js";
import MarketRatesInfo from "../../components/marketComponent/viewMarket.js";

const NPCGoldExchangePage = () => {
  return (
    <div className="auth-page-background">
      <OGProvider>
        <OGSelector />
        <OGResInfo />
        <MarketRatesInfo />
        <GoldExchange />
      </OGProvider>
    </div>
  );
};

export default NPCGoldExchangePage;