import React from "react";
import OGResInfo from "../../components/ogResArmComponent/modViewOGRes.js";
import OGSelector from "../../components/ogSelectionComponent/ogSelection.js";
import { OGProvider } from "../../components/ogSelectionComponent/ogContext.js";
import ViewOGLand from "../../components/ogResArmComponent/npcViewOGLand.js";
import LandTransfer from "../../components/landTransferComponent/landTransfer.js";

const NPCBattleOutcomePage = () => {
  return (
    <div style={{ padding: "2rem", maxWidth: "600px", margin: "auto" }}>
      <OGProvider>
        <div className="page">
          <OGSelector />
          <OGResInfo />
          <ViewOGLand />
          <LandTransfer />
        </div>
      </OGProvider>
    </div>
  );
};

export default NPCBattleOutcomePage;