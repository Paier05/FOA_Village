import React, { useEffect, useState, useRef } from "react";
import axiosInstance from '../../api/axiosInstance.js';
import "./ogResArmInfo.css";
import MedievalSpinner from "../loadingComponent/spinner.js";

import {
    GiWheat, GiAnvil, GiSheep, GiBrickWall, GiWoodPile, GiSpinningWheel
} from "react-icons/gi";

const getIcon = (type) => {
    const icons = {
        wheat: <GiWheat className="res-icon" />,
        ore: <GiAnvil className="res-icon" />,
        textiles: <GiSpinningWheel className="res-icon" />,
        bricks: <GiBrickWall className="res-icon" />,
        wood: <GiWoodPile className="res-icon" />,
        livestock: <GiSheep className="res-icon" />,
    };
    return icons[type] || <span className="res-icon">📦</span>;
};

const resourceLabels = {
    wheat: "稻米",
    ore: "矿石",
    textiles: "纺织品",
    bricks: "砖块",
    wood: "木头",
    livestock: "牲畜",
};

const FreelandInfo = () => {
    const [freeland, setFreeland] = useState(null);
    const prevValues = useRef({});
    const valueRefs = useRef({});

    const fetchFreeland = async () => {
        try {
            const res = await axiosInstance.get("/allpr/allfreeland");
            const newData = res.data.data;

            Object.entries(newData).forEach(([key, newValue]) => {
                if (prevValues.current[key] !== undefined && prevValues.current[key] !== newValue) {
                    const el = valueRefs.current[key];
                    if (el) {
                        el.classList.remove("animate-update");
                        void el.offsetWidth; // force reflow
                        el.classList.add("animate-update");
                    }
                }
                prevValues.current[key] = newValue;
            });

            setFreeland(newData);
        } catch (err) {
            console.error("Error fetching total resources withheld info:", err);
        }
    };

    useEffect(() => {
        fetchFreeland();
        const poll = setInterval(fetchFreeland, 5000);
        return () => clearInterval(poll);
    }, []);

    if (!freeland) return <MedievalSpinner />;

    return (
        <div className="res-container fancy-dashboard">
            <h2 className="res-header">所剩未开发场地数量</h2>
            <div className="res-grid">
                {Object.entries(freeland).map(([key, value]) => (
                    <div className="res-card" key={key}>
                        {getIcon(key)}
                        <div className="res-label">{resourceLabels[key] || key}</div>
                        <div
                            className="res-value"
                            ref={el => (valueRefs.current[key] = el)}
                            id={`total-res-value-${key}`}
                        >
                            {value}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FreelandInfo;
