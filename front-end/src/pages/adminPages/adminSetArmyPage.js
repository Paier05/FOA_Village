import React from "react";
import OGResInfo from "../../components/ogResArmComponent/modViewOGRes.js";
import OGSelector from "../../components/ogSelectionComponent/ogSelection.js";
import { OGProvider } from "../../components/ogSelectionComponent/ogContext.js";
import "../authPages/authPage.css";
import ForceSetArmy from "../../components/trainArmyComponent/forceSetArmy.js";

const AdminSetArmyPage = () => {
  return (
    <div className="auth-page-background">
      <OGProvider>
        <OGSelector />
        <OGResInfo />
        <ForceSetArmy />
      </OGProvider>
    </div>
  );
};

export default AdminSetArmyPage;