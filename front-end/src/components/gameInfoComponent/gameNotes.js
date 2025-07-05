import React from "react";
import { GiSwordman, GiHillFort, GiScrollUnfurled } from "react-icons/gi";
import "./gameNotes.css";

const GameNotes = () => {
  return (
    <div className="gameinfo-container">
      <h2 className="gameinfo-title">
        <GiScrollUnfurled className="gameinfo-icon" /> 游戏提示
      </h2>

      <div className="gameinfo-message">
        <div className="gameinfo-message-title">
          <GiSwordman className="gameinfo-icon" /> 军队训练
        </div>
        <div className="gameinfo-message-body">
          训练一支军队需要耗费每种资源各 5 个。
        </div>
      </div>

      <div className="gameinfo-message">
        <div className="gameinfo-message-title">
          <GiHillFort className="gameinfo-icon" /> 产地开发
        </div>
        <div className="gameinfo-message-body">
          开发产地需要耗费与产地对应的资源 20 个，以及其他资源各 10 个。
        </div>
      </div>
    </div>
  );
};

export default GameNotes;
