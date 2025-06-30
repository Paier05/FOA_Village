import React from "react";
import OGResInfo from "../../components/ogResArmComponent/modViewOGRes.js";
import OGSelector from "../../components/ogSelectionComponent/ogSelection.js";
import { OGProvider } from "../../components/ogSelectionComponent/ogContext.js";
import NPCViewInventory from "../../components/viewInventoryComponent/npcViewInventory.js";
import ViewOGLand from "../../components/ogResArmComponent/npcViewOGLand.js";
import "../authPages/authPage.css";

const NPCViewInfoPage = () => {
  return (
    <div className="auth-page-background">
      <OGProvider>
        <OGSelector />
        <OGResInfo />
        <ViewOGLand />
        <NPCViewInventory />
      </OGProvider>
    </div>
  );
};

export default NPCViewInfoPage;