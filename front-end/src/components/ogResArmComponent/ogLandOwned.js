import React, { useEffect, useState } from "react";
import axiosInstance from '../../api/axiosInstance.js';
import {
    GiWheat, GiStoneBlock, GiSheep, GiBrickWall, GiWoodPile, GiCow
} from "react-icons/gi";
import "./ogResArmInfo.css";

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

const formatLabel = (s) => s.charAt(0).toUpperCase() + s.slice(1);

const OGLandOwned = () => {
    const [lands, setLands] = useState(null);

    useEffect(() => {
        const fetchLands = async () => {
            try 
            {              
                const res = await axiosInstance.get("/ogpr/oglands");
                setLands(res.data.data);
            } catch (err) 
            {
                console.error("Error fetching lands owned:", err);
            }
        };
        fetchLands();
        const poll = setInterval(fetchLands, 5000);
        return () => clearInterval(poll);
    }, []);

    if (!lands) return <div className="loading">Loading lands...</div>;

    return (
        <div className="res-container fancy-dashboard">
            <h2 className="res-header">Lands Developed</h2>
            <div className="res-grid">
                {Object.entries(lands).map(([key, value]) => (
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

export default OGLandOwned;