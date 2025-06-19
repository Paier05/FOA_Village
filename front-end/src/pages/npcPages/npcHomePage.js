import React from "react";
import GameTimerDisplay from "../../components/timerComponent/timerDisplay.js";
import Leaderboard from "../../components/leaderboardComponent/leaderboard.js";

const NPCHomePage = () => {
  return (
    <div style={{ padding: "2rem", maxWidth: "600px", margin: "auto" }}>
      <Leaderboard />
      <GameTimerDisplay />
    </div>
  );
};

export default NPCHomePage;