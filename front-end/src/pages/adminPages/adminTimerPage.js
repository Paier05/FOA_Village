import React from "react";
import GameTimerDisplay from "../../components/timerComponent/timerDisplay.js";
import TimerControls from "../../components/timerComponent/timerControl.js";
import "../authPages/authPage.css";
import TimerAdjustControl from "../../components/timerComponent/timerAdjust.js";

const AdminTimerPage = () => {
  return (
    <div className="auth-page-background">
      <GameTimerDisplay />
      <TimerAdjustControl />
      <TimerControls />
    </div>
  );
};

export default AdminTimerPage;