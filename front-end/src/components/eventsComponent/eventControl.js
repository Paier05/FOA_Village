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
    "干旱": "久旱无雨，仿佛天神暂隐，农田枯萎，无法收割稻米。",
    "丰收时期": "大地恩赐丰收，仿若圣剑显现，庄稼茁壮，稻米资源翻倍。",
    "瘟疫蔓延": "瘟疫如暗影笼罩，牲畜纷纷倒地，牧场陷入死寂。",
    "畜牧繁荣": "牧场繁荣，牲畜健康成长，数量倍增，如同亚瑟王的骑士们英勇强盛。",
    "森林失火": "神秘火焰吞噬森林，木头采集被迫停止，宛若恶龙喷焰。",
    "伐木盛年": "伐木工艺精进，木材资源如魔法般倍增。",
    "矿井坍塌": "矿井轰然坍塌，矿石资源暂时失去，似古堡崩塌。",
    "富矿突现": "隐藏矿脉被发现，矿石产量倍增，仿佛找到了亚瑟的秘密宝藏。",
    "王室修城令": "王室发布修城令，砖块资源紧张，战士铠甲制造停滞。",
    "千锤百炼": "砖匠百炼成钢，砖块资源翻倍，如同圣剑铸成。",
    "蛾灾肆虐": "蛾虫大肆侵袭，纺织品产出锐减，织布工人忧心忡忡。",
    "织女降凡": "织女传来神秘技艺，纺织品资源翻倍，锦缎辉映王宫。"
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
