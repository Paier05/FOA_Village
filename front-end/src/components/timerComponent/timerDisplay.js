import React from "react";
import { useGameTimer } from "./timerLogic.js";
import "./timerDisplay.css";
import { BsClockHistory, BsFlagFill } from "react-icons/bs";

const NEXT_PHASE = {
    "1st Development Phase": "1st Og War",
    "1st Og War": "2nd Development Phase",
    "2nd Development Phase": "2nd Og War",
    "2nd Og War": "Final Development Phase",
    "Final Development Phase": "Final Og War",
    "Final Og War": "Game End",
};

const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
};

const GameTimerDisplay = () => {
    const { phase, timeLeft } = useGameTimer();

    if (!phase) return <div className="timer-container">Loading Timer...</div>;

    const isEnding = timeLeft <= 60 && timeLeft > 0;
    const isEnded = timeLeft <= 0;

    return (
        <div className="timer-container neon-box">
            <h2 className="timer-phase-title">
                <BsFlagFill style={{ marginRight: "8px", color: "#ffffffcc" }} />
                {phase}
            </h2>

            {isEnded ? (
                <>
                    <div className="timer-ended-msg">{phase} Ended</div>
                    <div className="timer-wait-msg">Waiting for Admin to start the next phase</div>
                </>
            ) : (
                <>
                    <div className={`timer-value digital-font ${isEnding ? "timer-warning" : ""}`}>
                        {formatTime(timeLeft)}
                    </div>
                    <div className="next-phase">
                        <BsClockHistory style={{ marginRight: "6px" }} />
                        Next: {NEXT_PHASE[phase]}
                    </div>
                </>
            )}
        </div>
    );
};

export default GameTimerDisplay;