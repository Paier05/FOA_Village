import React from "react";
import GameTimerDisplay from "../../components/timerComponent/timerDisplay.js";
import Leaderboard from "../../components/leaderboardComponent/leaderboard.js";
import "../authPages/authPage.css";
import EventDisplay from "../../components/eventsComponent/eventDisplay.js";
import FreelandInfo from "../../components/ogResArmComponent/allFreeLand.js";
import AllResSumInfo from "../../components/ogResArmComponent/allResWithheld.js";
import MarketRatesInfo from "../../components/marketComponent/viewMarket.js";

const NPCHomePage = () => {
  return (
    <div className="auth-page-background">
      <Leaderboard />
      <GameTimerDisplay />
      <EventDisplay />
      <AllResSumInfo />
      <FreelandInfo />
      <MarketRatesInfo />
    </div>
  );
};

export default NPCHomePage;