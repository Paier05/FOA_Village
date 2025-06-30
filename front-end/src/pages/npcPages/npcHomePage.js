import React from "react";
import GameTimerDisplay from "../../components/timerComponent/timerDisplay.js";
import Leaderboard from "../../components/leaderboardComponent/leaderboard.js";
import "../authPages/authPage.css";
import EventDisplay from "../../components/eventsComponent/eventDisplay.js";

const NPCHomePage = () => {
  return (
    <div className="auth-page-background">
      <Leaderboard />
      <GameTimerDisplay />
      <EventDisplay />
    </div>
  );
};

export default NPCHomePage;