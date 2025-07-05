import React from "react";
import "../authPages/authPage.css";
import FreelandInfo from "../../components/ogResArmComponent/allFreeLand.js";
import ForceSetFreeland from "../../components/developLandComponent/forceSetFreeland.js";
import AllDevelopedLandInfo from "../../components/ogResArmComponent/allDevelopedLand.js";

const AdminSetFreelandPage = () => {
  return (
    <div className="auth-page-background">
      <FreelandInfo />
      <AllDevelopedLandInfo />
      <ForceSetFreeland />
    </div>
  );
};

export default AdminSetFreelandPage;