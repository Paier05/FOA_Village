import React from "react";
import OGResInfo from "../../components/ogResArmComponent/modViewOGRes.js";
import OGSelector from "../../components/ogSelectionComponent/ogSelection.js";
import { OGProvider } from "../../components/ogSelectionComponent/ogContext.js";
import NPCViewInventory from "../../components/viewInventoryComponent/npcViewInventory.js";
import ViewOGLand from "../../components/ogResArmComponent/npcViewOGLand.js";

const NPCViewInfoPage = () => {
  return (
    <div style={{ padding: "2rem", maxWidth: "600px", margin: "auto" }}>
      <OGProvider>
        <div className="page">
          <OGSelector />
          <OGResInfo />
          <ViewOGLand />
          <NPCViewInventory />
        </div>
      </OGProvider>
    </div>
  );
};

export default NPCViewInfoPage;