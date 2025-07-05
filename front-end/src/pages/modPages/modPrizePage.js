import React from "react";
import { OGProvider } from "../../components/ogSelectionComponent/ogContext.js";
import OGSelector from "../../components/ogSelectionComponent/ogSelection.js";
import OGResInfo from "../../components/ogResArmComponent/modViewOGRes.js";
import OGResourceAddition from "../../components/modAddResComponent/addOGRes.js";
import "../authPages/authPage.css";
import OGSpinWheel from "../../components/wheelComponent/wheel.js";

const ModeratorPrizePage = () => {
  return (
    <div className="auth-page-background">
      <OGProvider>
        <OGSelector />
        <OGResInfo />
        <OGSpinWheel />
        <OGResourceAddition />
      </OGProvider>
    </div>
  );
};

export default ModeratorPrizePage;