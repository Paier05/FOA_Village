import React from "react";
import { useGameTimer } from "./timerLogic.js";
import "./timerDisplay.css";
import { BsClockHistory, BsFlagFill } from "react-icons/bs";
import MedievalSpinner from "../loadingComponent/spinner.js";

const NEXT_PHASE = {
    "1st 发展期": "1st 缓冲时间",
    "1st 缓冲时间": "1st 战争期",
    "1st 战争期": "2nd 发展期",
    "2nd 发展期": "2nd 缓冲时间",
    "2nd 缓冲时间": "2nd 战争期",
    "2nd 战争期": "游戏结束",
};

const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
};

const GameTimerDisplay = () => {
    const { phase, timeLeft } = useGameTimer();

    if (!phase) return <MedievalSpinner />;

    const isEnding = timeLeft <= 60 && timeLeft > 0;
    const isEnded = timeLeft <= 0;

    return (
        <div className="timer-container">
            <h2 className="timer-phase-title">
                <BsFlagFill style={{ marginRight: "8px", color: "#5e4228" }} />
                {phase}
            </h2>

            {isEnded ? (
                <>
                    <div className="timer-ended-msg">{phase} 已结束</div>
                    <div className="timer-wait-msg">下一个阶段未开始，请耐心等待...</div>
                </>
            ) : (
                <>
                    <div className={`timer-value digital-font ${isEnding ? "timer-warning" : ""}`}>
                        {formatTime(timeLeft)}
                    </div>
                    <div className="next-phase">
                        <BsClockHistory style={{ marginRight: "6px" }} />
                        下个阶段: {NEXT_PHASE[phase]}
                    </div>
                </>
            )}
        </div>
    );
};

export default GameTimerDisplay;