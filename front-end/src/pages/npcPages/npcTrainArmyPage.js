import React from "react";
import OGResInfo from "../../components/ogResArmComponent/modViewOGRes.js";
import OGSelector from "../../components/ogSelectionComponent/ogSelection.js";
import { OGProvider } from "../../components/ogSelectionComponent/ogContext.js";
import TrainArmy from "../../components/trainArmyComponent/trainArmy.js";

const NPCTrainArmyPage = () => {
  return (
    <div style={{ padding: "2rem", maxWidth: "600px", margin: "auto" }}>
      <OGProvider>
        <div className="page">
          <OGSelector />
          <OGResInfo />
          <TrainArmy />
        </div>
      </OGProvider>
    </div>
  );
};

export default NPCTrainArmyPage;