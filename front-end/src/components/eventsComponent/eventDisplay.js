import React, { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import "./eventDisplay.css";
import { GiAnvil, GiBrickWall, GiSheep, GiSpinningWheel, GiWheat, GiWoodPile } from "react-icons/gi";
import MedievalSpinner from "../loadingComponent/spinner";

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
    "织女降凡": "织女传来神秘技艺，纺织品资源翻倍，锦缎辉映王宫。",
    "和平期": "王国安宁，圣剑守护下，众人安居乐业，资源恢复常态。"
};

const EVENT_RESOURCE_ICONS = {
    "干旱": <GiWheat />,
    "丰收时期": <GiWheat />,
    "瘟疫蔓延": <GiSheep />,
    "畜牧繁荣": <GiSheep />,
    "森林失火": <GiWoodPile />,
    "伐木盛年": <GiWoodPile />,
    "矿井坍塌": <GiAnvil />,
    "富矿突现": <GiAnvil />,
    "王室修城令": <GiBrickWall />,
    "千锤百炼": <GiBrickWall />,
    "蛾灾肆虐": <GiSpinningWheel />,
    "织女降凡": <GiSpinningWheel />,
};

const POSITIVE_EVENTS = [
    "丰收时期", "畜牧繁荣", "伐木盛年", "富矿突现", "千锤百炼", "织女降凡"
];

const NEGATIVE_EVENTS = [
    "干旱", "瘟疫蔓延", "森林失火", "矿井坍塌", "王室修城令", "蛾灾肆虐"
];

const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
};

const EventDisplay = () => {
    const [eventData, setEventData] = useState(null);
    const [timeLeft, setTimeLeft] = useState(0);

    const fetchEvent = async () => {
        try {
            const res = await axiosInstance.get("/allpr/events");
            const event = res.data.data;

            if (!event || !event.expiry) {
                setEventData(null);
                setTimeLeft(0);
                return;
            }

            const [h, m, s] = event.expiry.split(":").map(Number);
            const now = new Date();
            const expiryUTC = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), h, m, s));
            const remaining = Math.max(0, Math.floor((expiryUTC - now) / 1000));
            setEventData(event);
            setTimeLeft(remaining);
        } catch (err) {
            console.error("Failed to fetch event:", err);
            setEventData(null);
        }
    };

    useEffect(() => {
        fetchEvent();

        const countdown = setInterval(() => {
            setTimeLeft((prev) => Math.max(0, prev - 1));
        }, 1000);

        const poll = setInterval(fetchEvent, 5000);

        return () => {
            clearInterval(countdown);
            clearInterval(poll);
        };
    }, []);

    const isExpired = timeLeft <= 0;

    let icon = null;
    let nameClass = "";

    if (!isExpired && eventData) {
        icon = EVENT_RESOURCE_ICONS[eventData.event];
        const isPositive = POSITIVE_EVENTS.includes(eventData.event);
        const isNegative = NEGATIVE_EVENTS.includes(eventData.event);
        nameClass = isPositive ? "blink-green" : isNegative ? "blink-brown" : "";
    }

    if (!eventData) return <MedievalSpinner />;

    return (
        <div className="event-container">
            {isExpired ? (
                <div className="event-peace">
                    <div className="event-name blink-blue">
                        <span>和平期</span>
                    </div>
                    <div className="event-description">
                        {EVENT_DESCRIPTIONS["和平期"]}
                    </div>
                </div>
                
            ) : (
                <>
                    <div className={`event-name ${nameClass}`}>
                        <span className={`event-icon ${nameClass}`}>{icon}</span>
                        {eventData.event}
                        <span className={`event-icon ${nameClass}`}>{icon}</span>
                    </div>
                    <div className={`event-countdown ${timeLeft <= 60 ? "blink-red" : ""}`}>
                        {formatTime(timeLeft)}
                    </div>
                    <div className="event-description">
                        {EVENT_DESCRIPTIONS[eventData.event]}
                    </div>
                </>
            )}
        </div>
    );
};

export default EventDisplay;
