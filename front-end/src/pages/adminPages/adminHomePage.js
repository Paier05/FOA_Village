import React from "react";
import GameTimerDisplay from "../../components/timerComponent/timerDisplay.js";
import TimerControls from "../../components/timerComponent/timerControl.js";
import Leaderboard from "../../components/leaderboardComponent/leaderboard.js";
import "../authPages/authPage.css";
import EventDisplay from "../../components/eventsComponent/eventDisplay.js";
import EventControl from "../../components/eventsComponent/eventControl.js";

const AdminHomePage = () => {
  return (
    <div className="auth-page-background">
      <Leaderboard />
      <GameTimerDisplay />
      <EventDisplay />
      <TimerControls />
      <EventControl />
    </div>
  );
};

export default AdminHomePage;