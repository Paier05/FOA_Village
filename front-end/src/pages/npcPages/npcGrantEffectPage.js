import React from "react";
import OGResInfo from "../../components/ogResArmComponent/modViewOGRes.js";
import OGSelector from "../../components/ogSelectionComponent/ogSelection.js";
import { OGProvider } from "../../components/ogSelectionComponent/ogContext.js";
import PayForEffect from "../../components/addEffectsComponent/payForEffect.js";
import NPCViewInventory from "../../components/viewInventoryComponent/npcViewInventory.js";
import "../authPages/authPage.css";
import NPCViewOGConsInfo from "../../components/viewInventoryComponent/npcViewConstraints.js";

const NPCGrantEffectPage = () => {
  return (
    <div className="auth-page-background">
      <OGProvider>
        <OGSelector />
        <OGResInfo />
        <NPCViewInventory />
        <NPCViewOGConsInfo />
        <PayForEffect />
      </OGProvider>
    </div>
  );
};

export default NPCGrantEffectPage;