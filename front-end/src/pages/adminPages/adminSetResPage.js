import React from "react";
import OGSelector from "../../components/ogSelectionComponent/ogSelection.js";
import { OGProvider } from "../../components/ogSelectionComponent/ogContext.js";
import "../authPages/authPage.css";
import ForceSetResources from "../../components/modAddResComponent/forceSetRes.js";
import OGResInfo from "../../components/ogResArmComponent/modViewOGRes.js";

const AdminSetResourcesPage = () => {
  return (
    <div className="auth-page-background">
      <OGProvider>
        <OGSelector />
        <OGResInfo />
        <ForceSetResources />
      </OGProvider>
    </div>
  );
};

export default AdminSetResourcesPage;