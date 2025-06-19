import React from "react";
import GameTimerDisplay from "../../components/timerComponent/timerDisplay.js";
import AllResSumInfo from "../../components/ogResArmComponent/allResWithheld.js";
import Leaderboard from "../../components/leaderboardComponent/leaderboard.js";

const OGHomePage = () => {
  return (
    <div style={{ padding: "2rem", maxWidth: "600px", margin: "auto" }}>
      <Leaderboard />
      <GameTimerDisplay />
      <AllResSumInfo />
    </div>
  );
};

export default OGHomePage;