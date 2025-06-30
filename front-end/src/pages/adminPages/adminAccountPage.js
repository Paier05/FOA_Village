import React from "react";
import AccountManager from "../../components/accountsComponent/accountManager.js";
import "../authPages/authPage.css";

const AdminAccountsPage = () => {
  return (
    <div className="auth-page-background">
      <AccountManager />
    </div>
  );
};

export default AdminAccountsPage;