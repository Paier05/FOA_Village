import React from "react";
import OGResInfo from "../../components/ogResArmComponent/modViewOGRes.js";
import OGSelector from "../../components/ogSelectionComponent/ogSelection.js";
import { OGProvider } from "../../components/ogSelectionComponent/ogContext.js";
import TrainArmy from "../../components/trainArmyComponent/trainArmy.js";
import "../authPages/authPage.css";

const NPCTrainArmyPage = () => {
  return (
    <div className="auth-page-background">
      <OGProvider>
        <OGSelector />
        <OGResInfo />
        <TrainArmy />
      </OGProvider>
    </div>
  );
};

export default NPCTrainArmyPage;