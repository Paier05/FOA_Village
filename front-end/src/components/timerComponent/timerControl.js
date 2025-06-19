import React, { useState } from "react";
import axiosInstance from '../../api/axiosInstance.js';
import "./timerControl.css";
import { FaHammer, FaFire } from "react-icons/fa";

const PHASES = [
    "1st Development Phase",
    "1st Og War",
    "2nd Development Phase",
    "2nd Og War",
    "Final Development Phase",
    "Final Og War",
];

const TimerControls = () => {
    const [confirmPhase, setConfirmPhase] = useState(null);

    const handleStartPhase = async () => {
        try {
            await axiosInstance.post("/apr/gamephase", { phase: confirmPhase });
            alert(`Started phase: ${confirmPhase}`);
        } catch (err) {
            alert("Failed to start phase: " + (err.response?.data?.message || err.message));
            console.error("Start phase error:", err);
        } finally {
            setConfirmPhase(null);
        }
    };

    const getIcon = (phase) => {
        return phase.includes("Development") ? <FaHammer className="icon-phase" /> : <FaFire className="icon-phase" />;
    };

    return (
        <>
            <div className="admin-phase-controls neon-box">
                <h3 className="phase-header">Start a Game Phase</h3>
                <div className="phase-buttons">
                    {PHASES.map((phase, index) => (
                        <button
                            key={index}
                            className="phase-button"
                            onClick={() => setConfirmPhase(phase)}
                        >
                            {getIcon(phase)} {phase}
                        </button>
                    ))}
                </div>
            </div>

            {/* Custom Modal */}
            {confirmPhase && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h4>Confirm Start</h4>
                        <p>
                            Are you sure you want to start <strong>"{confirmPhase}"</strong>?
                            {confirmPhase.includes("Development") && (
                                <>
                                    <br />
                                    <em>This will also reset the effects inventory.</em>
                                </>
                            )}
                        </p>
                        <div className="modal-actions">
                            <button className="modal-btn confirm" onClick={handleStartPhase}>Confirm</button>
                            <button className="modal-btn cancel" onClick={() => setConfirmPhase(null)}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default TimerControls;
