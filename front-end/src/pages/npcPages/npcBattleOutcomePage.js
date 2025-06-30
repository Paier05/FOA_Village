import React from "react";
import OGResInfo from "../../components/ogResArmComponent/modViewOGRes.js";
import OGSelector from "../../components/ogSelectionComponent/ogSelection.js";
import { OGProvider } from "../../components/ogSelectionComponent/ogContext.js";
import ViewOGLand from "../../components/ogResArmComponent/npcViewOGLand.js";
import LandTransfer from "../../components/landTransferComponent/landTransfer.js";
import "../authPages/authPage.css";

const NPCBattleOutcomePage = () => {
  return (
    <div className="auth-page-background">
      <OGProvider>
        <OGSelector />
        <OGResInfo />
        <ViewOGLand />
        <LandTransfer />
      </OGProvider>
    </div>
  );
};

export default NPCBattleOutcomePage;