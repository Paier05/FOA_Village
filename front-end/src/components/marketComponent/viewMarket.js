import React, { useEffect, useState, useRef } from "react";
import axiosInstance from '../../api/axiosInstance.js';
import "../ogResArmComponent/ogResArmInfo.css";
import MedievalSpinner from "../loadingComponent/spinner.js";

import {
    GiWheat, GiAnvil, GiSheep, GiBrickWall, GiWoodPile, GiSpinningWheel
} from "react-icons/gi";
import { FaCoins } from "react-icons/fa";

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

const MarketRatesInfo = () => {
    const [marketRates, setMarketRates] = useState(null);
    const prevValues = useRef({});
    const valueRefs = useRef({});

    const fetchMarketRates = async () => {
        try {
            const res = await axiosInstance.get("/allpr/market");
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

            setMarketRates(newData);
        } catch (err) {
            console.error("无法读取市场兑换率：", err);
        }
    };

    useEffect(() => {
        fetchMarketRates();
        const poll = setInterval(fetchMarketRates, 5000);
        return () => clearInterval(poll);
    }, []);

    if (!marketRates) return <MedievalSpinner />;

    return (
        <div className="res-container fancy-dashboard">
            <h2 className="res-header">市场兑换率</h2>
            <div className="res-grid">
                {Object.entries(marketRates).map(([key, value]) => (
                    <div className="res-card" key={key}>
                        <div className="res-card-split">
                            <div className="res-side">
                                <div
                                    className="res-value"
                                    ref={el => (valueRefs.current[key] = el)}
                                >
                                    {value}
                                </div>
                                <FaCoins className="res-icon gold-icon" />
                            </div>
                            <div className="res-side">
                                <div className="res-value">5</div>
                                {getIcon(key)}
                            </div>
                            <div className="res-label">金币兑{resourceLabels[key]}</div>
                        </div>
                    </div>

                ))}
            </div>
        </div>
    );
};

export default MarketRatesInfo;
