import React from "react";
import OGSelector from "../../components/ogSelectionComponent/ogSelection.js";
import { OGProvider } from "../../components/ogSelectionComponent/ogContext.js";
import UseEffect from "../../components/useEffectsComponent/useEffects.js";
import "../authPages/authPage.css";

const AdminUseEffectPage = () => {
  return (
    <div className="auth-page-background">
      <OGProvider>
        <OGSelector />
        <UseEffect />
      </OGProvider>
    </div>
  );
};

export default AdminUseEffectPage;