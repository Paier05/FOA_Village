import React from "react";
import GameTimerDisplay from "../../components/timerComponent/timerDisplay.js";
import Leaderboard from "../../components/leaderboardComponent/leaderboard.js";
import "../authPages/authPage.css";
import EventDisplay from "../../components/eventsComponent/eventDisplay.js";
import AllResSumInfo from "../../components/ogResArmComponent/allResWithheld.js";
import MarketRatesInfo from "../../components/marketComponent/viewMarket.js";

const ModeratorHomePage = () => {
  return (
    <div className="auth-page-background">
      <Leaderboard />
      <GameTimerDisplay />
      <EventDisplay />
      <AllResSumInfo />
      <MarketRatesInfo />
    </div>
  );
};

export default ModeratorHomePage;