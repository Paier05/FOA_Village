import React from "react";
import "../authPages/authPage.css";
import GameRules from "../../components/gameInfoComponent/gameRules.js";
import GameNotes from "../../components/gameInfoComponent/gameNotes.js";

const OGGameRulesPage = () => {
  return (
    <div className="auth-page-background">
      <GameNotes />
      <GameRules />
    </div>
  );
};

export default OGGameRulesPage;