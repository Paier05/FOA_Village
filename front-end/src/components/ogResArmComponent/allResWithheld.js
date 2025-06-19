import React, { useEffect, useState } from "react";
import axiosInstance from '../../api/axiosInstance.js';
import "./ogResArmInfo.css";

import {
    GiWheat, GiStoneBlock, GiSheep, GiBrickWall, GiWoodPile, GiCow
} from "react-icons/gi";

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

const AllResSumInfo = () => {
    const [resSum, setResSum] = useState(null);

    const fetchResSum = async () => {
        try {
            const res = await axiosInstance.get("/allpr/allreswithheld");
            setResSum(res.data.data);
        } catch (err) {
            console.error("Error fetching total resources withheld info:", err);
        }
    };

    useEffect(() => {
        fetchResSum();
        const poll = setInterval(fetchResSum, 5000);
        return () => clearInterval(poll);
    }, []);

    if (!resSum) return <div className="loading">Loading total resources withheld...</div>;

    return (
        <div className="res-container fancy-dashboard">
            <h2 className="res-header">Total Resources Withheld</h2>
            <div className="res-grid">
                {Object.entries(resSum).map(([key, value]) => (
                    <div className="res-card" key={key}>
                        {getIcon(key)}
                        <div className="res-label">{capitalize(key)}</div>
                        <div className="res-value">{value}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AllResSumInfo;