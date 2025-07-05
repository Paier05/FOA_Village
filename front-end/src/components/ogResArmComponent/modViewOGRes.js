import React, { useEffect, useState, useRef } from "react";
import { useOG } from "../ogSelectionComponent/ogContext.js";
import axiosInstance from '../../api/axiosInstance.js';
import {
    GiWheat, GiAnvil, GiSheep, GiBrickWall, GiWoodPile, GiSpinningWheel
} from "react-icons/gi";
import { MdMilitaryTech } from "react-icons/md";
import "./ogResArmInfo.css";
import MedievalSpinner from "../loadingComponent/spinner.js";
import { FaCoins } from "react-icons/fa";

const getIcon = (type) => {
    const icons = {
        wheat: <GiWheat className="res-icon" />,
        ore: <GiAnvil className="res-icon" />,
        textiles: <GiSpinningWheel className="res-icon" />,
        bricks: <GiBrickWall className="res-icon" />,
        wood: <GiWoodPile className="res-icon" />,
        livestock: <GiSheep className="res-icon" />,
        army: <MdMilitaryTech className="res-icon military-icon" />,
        gold: <FaCoins className="res-icon military-icon" />
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
    army: "军队",
    gold: "金币"
};

const OGResInfo = () => {
    const { selectedOG } = useOG();
    const [resarm, setResarm] = useState(null);
    const valueRefs = useRef({});
    const prevValues = useRef({});

    useEffect(() => {
        if (!selectedOG) return;

        const fetchResArm = async () => {
            try {
                const res = await axiosInstance.get(`/mpr/ogresarm/${selectedOG}`);
                const newData = res.data.data;

                Object.entries(newData).forEach(([key, newValue]) => {
                    if (prevValues.current[key] !== undefined && prevValues.current[key] !== newValue) {
                        const el = valueRefs.current[key];
                        if (el) {
                            el.classList.remove("animate-update");
                            void el.offsetWidth;
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
    }, [selectedOG]);

    if (!resarm) return <MedievalSpinner />;

    return (
        <div className="res-container fancy-dashboard">
            <h2 className="res-header">军队与资源情况</h2>
            <div className="res-grid">
                {Object.entries(resarm).map(([key, value]) => (
                    <div className="res-card" key={key}>
                        {getIcon(key)}
                        <div className="res-label">{resourceLabels[key] || key}</div>
                        <div
                            className="res-value"
                            ref={el => (valueRefs.current[key] = el)}
                            id={`res-value-${key}`}
                        >
                            {value}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default OGResInfo;
