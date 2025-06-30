import React, { useEffect, useState, useRef } from "react";
import axiosInstance from '../../api/axiosInstance.js';
import {
    GiWheat, GiSheep, GiBrickWall, GiWoodPile, GiAnvil, GiSpinningWheel
} from "react-icons/gi";
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
    };
    return icons[type] || <span className="res-icon">📦</span>;
};

const landLabels = {
    wheat: "稻米",
    ore: "矿石",
    textiles: "纺织品",
    bricks: "砖块",
    wood: "木头",
    livestock: "牲畜"
};

const OGLandOwned = () => {
    const [lands, setLands] = useState(null);
    const prevValues = useRef({});

    useEffect(() => {
        const fetchLands = async () => {
            try {
                const res = await axiosInstance.get("/ogpr/oglands");
                const newData = res.data.data;

                Object.entries(newData).forEach(([key, newValue]) => {
                    if (prevValues.current[key] !== undefined && prevValues.current[key] !== newValue) {
                        const el = document.getElementById(`land-value-${key}`);
                        if (el) {
                            el.classList.remove("animate-update");
                            void el.offsetWidth; // force reflow
                            el.classList.add("animate-update");
                        }
                    }
                    prevValues.current[key] = newValue;
                });

                setLands(newData);
            } catch (err) {
                console.error("Error fetching lands owned:", err);
            }
        };

        fetchLands();
        const poll = setInterval(fetchLands, 5000);
        return () => clearInterval(poll);
    }, []);


    if (!lands) return <MedievalSpinner />;

    return (
        <div className="res-container fancy-dashboard">
            <h2 className="res-header">已开发的产地</h2>
            <div className="res-grid">
                {Object.entries(lands).map(([key, value]) => (
                    <div className="res-card" key={key}>
                        {getIcon(key)}
                        <div className="res-label">{landLabels[key] || key}</div>
                        <div className="res-value">{value}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default OGLandOwned;