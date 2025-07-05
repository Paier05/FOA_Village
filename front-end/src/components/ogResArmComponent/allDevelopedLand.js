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

const AllDevelopedLandInfo = () => {
    const [devdland, setDevdland] = useState(null);
    const prevValues = useRef({});
    const valueRefs = useRef({});

    const fetchDevdland = async () => {
        try {
            const res = await axiosInstance.get("/apr/totaldevlands");
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

            setDevdland(newData);
        } catch (err) {
            console.error("无法读取已开发产地总数资料：", err);
        }
    };

    useEffect(() => {
        fetchDevdland();
        const poll = setInterval(fetchDevdland, 5000);
        return () => clearInterval(poll);
    }, []);

    if (!devdland) return <MedievalSpinner />;

    return (
        <div className="res-container fancy-dashboard">
            <h2 className="res-header">总共已开发产地数量</h2>
            <div className="res-grid">
                {Object.entries(devdland).map(([key, value]) => (
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

export default AllDevelopedLandInfo;