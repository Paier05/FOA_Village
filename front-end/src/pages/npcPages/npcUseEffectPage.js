import React from "react";
import OGSelector from "../../components/ogSelectionComponent/ogSelection.js";
import { OGProvider } from "../../components/ogSelectionComponent/ogContext.js";
import ChangeLand from "../../components/changeLandTypeComponent/changeLand.js";
import UseEffect from "../../components/useEffectsComponent/useEffects.js";

const NPCUseEffectPage = () => {
  return (
    <div style={{ padding: "2rem", maxWidth: "600px", margin: "auto" }}>
      <OGProvider>
        <div className="page">
          <OGSelector />
          <UseEffect />
          <ChangeLand />
        </div>
      </OGProvider>
    </div>
  );
};

export default NPCUseEffectPage;