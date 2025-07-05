import React from "react";
import "../authPages/authPage.css";
import ForceSetEffectsConstraints from "../../components/addEffectsComponent/forceSetEffectsConstraints.js";
import { OGProvider } from "../../components/ogSelectionComponent/ogContext.js";
import OGSelector from "../../components/ogSelectionComponent/ogSelection.js";
import NPCViewOGConsInfo from "../../components/viewInventoryComponent/npcViewConstraints.js";

const AdminSetEffectsConstraintsPage = () => {
  return (
    <div className="auth-page-background">
      <OGProvider>
        <OGSelector />
        <NPCViewOGConsInfo />
        <ForceSetEffectsConstraints />
      </OGProvider>
    </div>
  );
};

export default AdminSetEffectsConstraintsPage;