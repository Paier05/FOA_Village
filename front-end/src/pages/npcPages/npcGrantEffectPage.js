import React from "react";
import OGResInfo from "../../components/ogResArmComponent/modViewOGRes.js";
import OGSelector from "../../components/ogSelectionComponent/ogSelection.js";
import { OGProvider } from "../../components/ogSelectionComponent/ogContext.js";
import PayForEffect from "../../components/addEffectsComponent/payForEffect.js";
import NPCViewInventory from "../../components/viewInventoryComponent/npcViewInventory.js";

const NPCGrantEffectPage = () => {
  return (
    <div style={{ padding: "2rem", maxWidth: "600px", margin: "auto" }}>
      <OGProvider>
        <div className="page">
          <OGSelector />
          <OGResInfo />
          <NPCViewInventory />
          <PayForEffect />
        </div>
      </OGProvider>
    </div>
  );
};

export default NPCGrantEffectPage;