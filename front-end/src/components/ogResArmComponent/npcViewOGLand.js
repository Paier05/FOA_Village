import React, { useEffect, useState } from "react";
import axiosInstance from '../../api/axiosInstance.js';
import "./ogResArmInfo.css";
import { useOG } from "../ogSelectionComponent/ogContext.js";
import {
    GiWheat, GiStoneBlock, GiSheep, GiBrickWall, GiWoodPile, GiCow
} from "react-icons/gi";
import { MdMap } from "react-icons/md";

const getIcon = (type) => {
    const icons = {
        wheat: <GiWheat className="res-icon" />,
        ore: <GiStoneBlock className="res-icon" />,
        textiles: <GiSheep className="res-icon" />,
        bricks: <GiBrickWall className="res-icon" />,
        wood: <GiWoodPile className="res-icon" />,
        livestock: <GiCow className="res-icon" />
    };
    return icons[type] || <span className="res-icon">📦</span>;
};

const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);

const ViewOGLand = () => {
    const { selectedOG } = useOG();
    const [lands, setLands] = useState(null);

    useEffect(() => {
        if (!selectedOG) return;

        const fetchLands = async () => {
            try {
                const res = await axiosInstance.get(`/npcpr/oglands/${selectedOG}`);
                setLands(res.data.data);
            } catch (err) {
                console.error("Error fetching lands owned:", err);
            }
        };

        fetchLands();
        const poll = setInterval(fetchLands, 5000);
        return () => clearInterval(poll);
    }, [selectedOG]);

    if (!lands) return <div className="loading">Loading developed lands...</div>;

    const totalLands = Object.values(lands).reduce((sum, val) => sum + val, 0);

    return (
        <>
            <div className="res-container fancy-dashboard">
                <h2 className="res-header">Lands Developed</h2>
                <div className="res-grid">
                    {Object.entries(lands).map(([key, value]) => (
                        <div className="res-card" key={key}>
                            {getIcon(key)}
                            <div className="res-label">{capitalize(key)}</div>
                            <div className="res-value">{value}</div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="res-container fancy-dashboard">
                <h2 className="res-header">Total Lands Owned</h2>
                <div className="res-grid">
                    <div className="res-card">
                        <MdMap className="res-icon" />
                        <div className="res-label">Total</div>
                        <div className="res-value">{totalLands}</div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ViewOGLand;
