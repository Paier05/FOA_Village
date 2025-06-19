import React from "react";
import { OGProvider } from "../../components/ogSelectionComponent/ogContext.js";
import OGSelector from "../../components/ogSelectionComponent/ogSelection.js";
import OGResInfo from "../../components/ogResArmComponent/modViewOGRes.js";
import OGResourceAddition from "../../components/modAddResComponent/addOGRes.js";

const ModeratorPrizePage = () => {
  return (
    <div style={{ padding: "2rem", maxWidth: "600px", margin: "auto" }}>
      <OGProvider>
        <div className="page">
          <OGSelector />
          <OGResInfo />
          <OGResourceAddition />
        </div>
      </OGProvider>
    </div>
  );
};

export default ModeratorPrizePage;