import React, { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import "./eventDisplay.css";
import { GiAnvil, GiBrickWall, GiSheep, GiSpinningWheel, GiWheat, GiWoodPile } from "react-icons/gi";
import MedievalSpinner from "../loadingComponent/spinner";

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
