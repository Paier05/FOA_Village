import React from "react";
import { OGProvider } from "../../components/ogSelectionComponent/ogContext.js";
import OGSelector from "../../components/ogSelectionComponent/ogSelection.js";
import OGResInfo from "../../components/ogResArmComponent/modViewOGRes.js";
import OGResourceAddition from "../../components/modAddResComponent/addOGRes.js";
import "../authPages/authPage.css";

const ModeratorPrizePage = () => {
  return (
    <div className="auth-page-background">
      <OGProvider>
        <OGSelector />
        <OGResInfo />
        <OGResourceAddition />
      </OGProvider>
    </div>
  );
};

export default ModeratorPrizePage;