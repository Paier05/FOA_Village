import React, { useEffect, useState, useRef } from "react";
import axiosInstance from "../../api/axiosInstance.js";
import {
    GiWheat, GiSheep, GiBrickWall, GiWoodPile, GiAnvil, GiSpinningWheel, 
} from "react-icons/gi";
import { MdMilitaryTech } from "react-icons/md";
import "./ogResArmInfo.css";
import MedievalSpinner from "../loadingComponent/spinner.js";

const getIcon = (type) => {
    const icons = {
        wheat: <GiWheat className="res-icon" />,
        ore: <GiAnvil className="res-icon" />,
        textiles: <GiSpinningWheel className="res-icon" />,
        bricks: <GiBrickWall className="res-icon" />,
        wood: <GiWoodPile className="res-icon" />,
        livestock: <GiSheep className="res-icon" />,
        army: <MdMilitaryTech className="res-icon military-icon" />
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
    army: "军队"
};

const OGResArmInfo = () => {
    const [resarm, setResarm] = useState(null);
    const prevValues = useRef({});

    useEffect(() => {
        const fetchResArm = async () => {
            try {
                const res = await axiosInstance.get("/ogpr/ogresarm");
                const newData = res.data.data;

                // Detect value changes
                Object.entries(newData).forEach(([key, newValue]) => {
                    if (prevValues.current[key] !== undefined && prevValues.current[key] !== newValue) {
                        const el = document.getElementById(`res-value-${key}`);
                        if (el) {
                            el.classList.remove("animate-update");
                            void el.offsetWidth; // trigger reflow
                            el.classList.add("animate-update");
                        }
                    }
                    prevValues.current[key] = newValue;
                });

                setResarm(newData);
            } catch (err) {
                console.error("Error fetching resarm:", err);
            }
        };

        fetchResArm();
        const poll = setInterval(fetchResArm, 5000);
        return () => clearInterval(poll);
    }, []);

    if (!resarm) return <MedievalSpinner />;

    return (
        <div className="res-container">
            <h2 className="res-header">军队与资源情况</h2>
            <div className="res-grid">
                {Object.entries(resarm).map(([key, value]) => (
                    <div className="res-card" key={key}>
                        {getIcon(key)}
                        <div className="res-label">{resourceLabels[key] || key}</div>
                        <div
                            id={`res-value-${key}`}
                            className="res-value"
                        >
                            {value}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default OGResArmInfo;
