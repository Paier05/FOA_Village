import React from "react";
import GameTimerDisplay from "../../components/timerComponent/timerDisplay.js";
import AllResSumInfo from "../../components/ogResArmComponent/allResWithheld.js";
import Leaderboard from "../../components/leaderboardComponent/leaderboard.js";
import "../authPages/authPage.css";
import FreelandInfo from "../../components/ogResArmComponent/allFreeLand.js";
import EventDisplay from "../../components/eventsComponent/eventDisplay.js";
import MarketRatesInfo from "../../components/marketComponent/viewMarket.js";

const OGHomePage = () => {
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

export default OGHomePage;