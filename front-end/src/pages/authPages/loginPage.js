import React from "react";
import Login from "../../components/authorizationComponent/loginComponent";
import "./authPage.css";

const LoginPage = () => {
  return (
    <div className="auth-page-background">
      <Login />
    </div>
  );
};

export default LoginPage;