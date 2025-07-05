import React, { useState } from "react";
import axiosInstance from '../../api/axiosInstance.js';
import { GiWoodPile, GiBrickWall, GiSheep, GiWheat, GiAnvil, GiSpinningWheel } from "react-icons/gi";
import "./eventControl.css";

const resourceIcons = {
    wood: <GiWoodPile />,
    bricks: <GiBrickWall />,
    livestock: <GiSheep />,
    wheat: <GiWheat />,
    ore: <GiAnvil />,
    textiles: <GiSpinningWheel />
};

const EVENTS = [
    { name: "干旱", resource: "wheat" },
    { name: "丰收时期", resource: "wheat" },
    { name: "瘟疫蔓延", resource: "livestock" },
    { name: "畜牧繁荣", resource: "livestock" },
    { name: "森林失火", resource: "wood" },
    { name: "伐木盛年", resource: "wood" },
    { name: "矿井坍塌", resource: "bricks" },
    { name: "富矿突现", resource: "bricks" },
    { name: "王室修城令", resource: "ore" },
    { name: "千锤百炼", resource: "ore" },
    { name: "蛾灾肆虐", resource: "textiles" },
    { name: "织女降凡", resource: "textiles" }
];

const EVENT_DESCRIPTIONS = {
    "干旱": "稻米产地无法产出稻米资源！",
    "丰收时期": "稻米产地产出双倍的稻米数量！",
    "瘟疫蔓延": "牲畜产地无法产出牲畜资源！",
    "畜牧繁荣": "牲畜产地产出双倍的牲畜数量！",
    "森林失火": "木头产地无法产出木头资源！",
    "伐木盛年": "木头产地产出双倍的木头数量！",
    "矿井坍塌": "矿石产地无法产出矿石资源！",
    "富矿突现": "矿石产地产出双倍的矿石数量！",
    "王室修城令": "砖块产地无法产出砖块资源！",
    "千锤百炼": "砖块产地产出双倍的砖块数量！",
    "蛾灾肆虐": "纺织品产地无法产出纺织品资源！",
    "织女降凡": "纺织品产地产出双倍的纺织品数量！",
    "和平期": "所有产地正常产出！"
};

const EventControl = () => {
    const [confirmEvent, setConfirmEvent] = useState(null);

    const handleStartEvent = async () => {
        try {
            await axiosInstance.put("/apr/events", { event: confirmEvent.name });
            alert(`突发事件 "${confirmEvent.name}" 已成功启动！`);
        } catch (err) {
            alert(`突发事件启动失败: ${err.response?.data?.message || err.message}`);
            console.error("Start event error:", err);
        } finally {
            setConfirmEvent(null);
        }
    };

    return (
        <>
        <div className="admin-event-controls">
            <h3 className="admin-event-control-header">设定突发事件</h3>
            <div className="admin-event-list">
            {EVENTS.map((ev) => (
                <button
                key={ev.name}
                className="admin-event-button"
                onClick={() => setConfirmEvent(ev)}
                >
                <span className="admin-event-icon">{resourceIcons[ev.resource]}</span>
                <div className="admin-event-info">
                    <span className="admin-event-name">{ev.name}</span>
                    <span className="admin-event-desc">{EVENT_DESCRIPTIONS[ev.name]}</span>
                </div>
                </button>
            ))}
            </div>
        </div>

        {confirmEvent && (
            <div className="admin-event-modal-overlay">
            <div className="admin-event-modal-content">
                <h4>确认启动事件</h4>
                <p>您确定要设定突发事件 <strong>"{confirmEvent.name}"</strong> 吗？</p>
                <p>{EVENT_DESCRIPTIONS[confirmEvent.name]}</p>
                <div className="admin-event-modal-actions">
                <button className="admin-event-modal-btn confirm" onClick={handleStartEvent}>确定</button>
                <button className="admin-event-modal-btn cancel" onClick={() => setConfirmEvent(null)}>取消</button>
                </div>
            </div>
            </div>
        )}
        </>
    );
};

export default EventControl;
