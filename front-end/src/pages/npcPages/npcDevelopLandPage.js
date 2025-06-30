import React from "react";
import OGResInfo from "../../components/ogResArmComponent/modViewOGRes.js";
import OGSelector from "../../components/ogSelectionComponent/ogSelection.js";
import { OGProvider } from "../../components/ogSelectionComponent/ogContext.js";
import DevelopLand from "../../components/developLandComponent/developLand.js";
import ViewOGLand from "../../components/ogResArmComponent/npcViewOGLand.js";
import "../authPages/authPage.css";

const NPCDevelopLandPage = () => {
  return (
    <div className="auth-page-background">
      <OGProvider>
        <OGSelector />
        <OGResInfo />
        <ViewOGLand />
        <DevelopLand />
      </OGProvider>
    </div>
  );
};

export default NPCDevelopLandPage;