import React from "react";
import "../authPages/authPage.css";
import Register from "../../components/authorizationComponent/registerComponent.js";

const AdminRegisterPage = () => {
  return (
    <div className="auth-page-background">
      <Register />
    </div>
  );
};

export default AdminRegisterPage;