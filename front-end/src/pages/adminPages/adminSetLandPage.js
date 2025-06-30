import React from "react";
import OGSelector from "../../components/ogSelectionComponent/ogSelection.js";
import { OGProvider } from "../../components/ogSelectionComponent/ogContext.js";
import ViewOGLand from "../../components/ogResArmComponent/npcViewOGLand.js";
import "../authPages/authPage.css";
import ForceSetLand from "../../components/developLandComponent/forceSetLand.js";

const AdminSetLandPage = () => {
  return (
    <div className="auth-page-background">
      <OGProvider>
        <OGSelector />
        <ViewOGLand />
        <ForceSetLand />
      </OGProvider>
    </div>
  );
};

export default AdminSetLandPage;