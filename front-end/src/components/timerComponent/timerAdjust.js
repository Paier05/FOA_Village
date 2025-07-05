import React, { useState } from "react";
import axiosInstance from "../../api/axiosInstance.js";
import "./timerControl.css";

const TimerAdjustControl = () => {
    const [minutes, setMinutes] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (!minutes || isNaN(minutes) || Number(minutes) < 0) {
            alert("请输入大于或等于零的分钟数");
            return;
        }

        try {
            setLoading(true);
            await axiosInstance.put("/apr/gamephasetime", { time: Number(minutes) });
            alert(`阶段倒计时已设定为 ${minutes} 分钟`);
            setMinutes("");
        } catch (err) {
            alert("更新倒计时失败: " + (err.response?.data?.message || err.message));
            console.error("Timer update error:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="admin-phase-controls">
            <h3 className="phase-header">设定现游戏阶段时长</h3>
            <div className="timer-adjust-form">
                <input
                    type="number"
                    placeholder="分钟数"
                    min="0"
                    value={minutes}
                    onChange={(e) => setMinutes(e.target.value)}
                    className="adjust-input"
                />
                <button
                    onClick={handleSubmit}
                    className="modal-btn confirm"
                    disabled={loading}
                >
                    {loading ? "提交中..." : "设定时间"}
                </button>
            </div>
        </div>
    );
};

export default TimerAdjustControl;
