import React, { useState } from "react";
import axiosInstance from '../../api/axiosInstance.js';
import "./timerControl.css";
import { FaHammer, FaFire } from "react-icons/fa";

const PHASES = [
    "1st 发展期",
    "1st 缓冲时间",
    "1st 战争期",
    "2nd 发展期",
    "2nd 缓冲时间",
    "2nd 战争期",
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
        return phase.includes("发展") ? <FaHammer className="icon-phase" /> : <FaFire className="icon-phase" />;
    };

    return (
        <>
            <div className="admin-phase-controls">
                <h3 className="phase-header">开启新的游戏阶段</h3>
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
                        <h4>确认开启阶段</h4>
                        <p>
                            您确定要开启 <strong>"{confirmPhase}"</strong> 吗？
                            {confirmPhase.includes("发展") && (
                                <>
                                    <br />
                                    <em>这也会清除所有 OG 的特殊技能哦！</em>
                                </>
                            )}
                        </p>
                        <div className="modal-actions">
                            <button className="modal-btn confirm" onClick={handleStartPhase}>确定</button>
                            <button className="modal-btn cancel" onClick={() => setConfirmPhase(null)}>退出</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default TimerControls;
