import React from "react";
import OGSelector from "../../components/ogSelectionComponent/ogSelection.js";
import { OGProvider } from "../../components/ogSelectionComponent/ogContext.js";
import "../authPages/authPage.css";
import ForceAddEffect from "../../components/addEffectsComponent/forceAddEffect.js";
import NPCViewInventory from "../../components/viewInventoryComponent/npcViewInventory.js";

const AdminAddEffectPage = () => {
  return (
    <div className="auth-page-background">
      <OGProvider>
        <OGSelector />
        <NPCViewInventory />
        <ForceAddEffect />
      </OGProvider>
    </div>
  );
};

export default AdminAddEffectPage;