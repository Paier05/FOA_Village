import React from "react";
import GameTimerDisplay from "../../components/timerComponent/timerDisplay.js";
import Leaderboard from "../../components/leaderboardComponent/leaderboard.js";
import OGResInfo from "../../components/ogResArmComponent/modViewOGRes.js";
import OGSelector from "../../components/ogSelectionComponent/ogSelection.js";
import { OGProvider } from "../../components/ogSelectionComponent/ogContext.js";
import DevelopLand from "../../components/developLandComponent/developLand.js";
import ViewOGLand from "../../components/ogResArmComponent/npcViewOGLand.js";

const NPCDevelopLandPage = () => {
  return (
    <div style={{ padding: "2rem", maxWidth: "600px", margin: "auto" }}>
      <OGProvider>
        <div className="page">
          <OGSelector />
          <OGResInfo />
          <ViewOGLand />
          <DevelopLand />
        </div>
      </OGProvider>
    </div>
  );
};

export default NPCDevelopLandPage;