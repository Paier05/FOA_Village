import React, { useEffect, useState } from "react";
import { useOG } from "../ogSelectionComponent/ogContext.js";
import axiosInstance from '../../api/axiosInstance.js';
import {
    GiWheat, GiStoneBlock, GiSheep, GiBrickWall, GiWoodPile, GiCow
} from "react-icons/gi";
import { MdMilitaryTech } from "react-icons/md";
import "./ogResArmInfo.css";

const getIcon = (type) => {
    const icons = {
        wheat: <GiWheat className="res-icon" />,
        ore: <GiStoneBlock className="res-icon" />,
        textiles: <GiSheep className="res-icon" />,
        bricks: <GiBrickWall className="res-icon" />,
        wood: <GiWoodPile className="res-icon" />,
        livestock: <GiCow className="res-icon" />,
        army: <MdMilitaryTech className="res-icon" />
    };
    return icons[type] || <span className="res-icon">📦</span>;
};

const formatLabel = (s) => s.charAt(0).toUpperCase() + s.slice(1);

const OGResInfo = () => {
    const { selectedOG } = useOG();
    const [resarm, setResarm] = useState(null);

    useEffect(() => {
        if (!selectedOG) return;
        const fetchResArm = async () => {
            try {
                const res = await axiosInstance.get(`/mpr/ogresarm/${selectedOG}`);
                setResarm(res.data.data);
            } catch (err) {
                console.error("Error fetching resarm:", err);
            }
        };

        fetchResArm();
        const poll = setInterval(fetchResArm, 5000);
        return () => clearInterval(poll);
    }, [selectedOG]);

    if (!resarm) return <div className="loading">Loading resources...</div>;

    return (
        <div className="res-container fancy-dashboard">
            <h2 className="res-header">Army & Resources Owned</h2>
            <div className="res-grid">
                {Object.entries(resarm).map(([key, value]) => (
                    <div className="res-card" key={key}>
                        {getIcon(key)}
                        <div className="res-label">{formatLabel(key)}</div>
                        <div className="res-value">{value}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default OGResInfo;