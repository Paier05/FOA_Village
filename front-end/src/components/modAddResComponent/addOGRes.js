import React, { useEffect, useState } from "react";
import { useOG } from "../ogSelectionComponent/ogContext.js";
import axiosInstance from "../../api/axiosInstance.js";
import { FaPlusCircle, FaBroom, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import "../tradingComponent/ogTrading.css"
import { GiWoodPile, GiBrickWall, GiSheep, GiWheat, GiAnvil, GiSpinningWheel, GiStoneCrafting } from 'react-icons/gi';

const resourceIcons = {
    wood: <GiWoodPile />,
    bricks: <GiBrickWall />,
    livestock: <GiSheep />,
    wheat: <GiWheat />,
    ore: <GiAnvil />,
    textiles: <GiSpinningWheel />
};

const resourceLabels = {
    wood: "木头",
    bricks: "砖块",
    livestock: "牲畜",
    wheat: "稻米",
    ore: "矿石",
    textiles: "纺织品"
};

const resourceTypes = ["wood", "bricks", "livestock", "wheat", "ore", "textiles"];

const OGResourceAddition = () => {
    const { selectedOG } = useOG();
    const [resourcesChanges, setResourcesChanges] = useState(
        resourceTypes.reduce((acc, res) => ({
            ...acc,
            [res]: 0
        }), {})
    );
    const [showConfirm, setShowConfirm] = useState(false);
    const [ogOptions, setOgOptions] = useState([]);

    useEffect(() => {
        const fetchOGs = async () => {
            try {
                const res = await axiosInstance.get("/mpr/all-ogs");
                setOgOptions(res.data.data || []);
            } catch (err) {
                console.error("Failed to fetch OGs:", err);
            }
        };
        fetchOGs();
    }, []);


    const handleSliderChange = (resource, value) => {
        setResourcesChanges((prev) => ({
            ...prev,
            [resource]: parseInt(value, 10)
        }));
    };

    const handleClear = () => {
        setResourcesChanges(
            resourceTypes.reduce((acc, res) => ({
                ...acc,
                [res]: 0
            }), {})
        );
    };

    const handleAddResources = async () => {
        if (!selectedOG) {
            alert("请先选择一个 OG。");
            return;
        }

        try {
            await axiosInstance.put("/mpr/ogresadd", {
                ogID: selectedOG,
                resourcesChanges
            });
            alert("成功添加资源！");
            handleClear();
        } catch (err) {
            console.error(err);
            alert("添加失败：" + (err.response?.data?.message || err.message));
        } finally {
            setShowConfirm(false);
        }
    };

    return (
        <div className="og-trading-container">
            <h2 className="og-trading-medieval-title">
                <GiStoneCrafting className="medieval-icon" /> 添加资源
            </h2>

            <div className="og-trading-sliders">
                {resourceTypes.map((resource) => (
                    <div key={resource} className="og-trading-slider-row">
                        <label className="og-trading-medieval-label">
                            {resourceIcons[resource]} {resourceLabels[resource]}：<span className="og-trading-resource-val">{resourcesChanges[resource]}</span>
                        </label>
                        <input
                            type="range"
                            min="0"
                            max="50"
                            value={resourcesChanges[resource]}
                            onChange={(e) => handleSliderChange(resource, e.target.value)}
                            className="og-trading-medieval-slider"
                            style={{ '--percent': `${(resourcesChanges[resource] / 50) * 100}%` }}
                        />
                    </div>
                ))}
            </div>

            <div className="og-trading-button-row">
                <button 
                    onClick={() => setShowConfirm(true)} 
                    className="og-trading-medieval-btn"
                    disabled={!selectedOG || Object.values(resourcesChanges).every((v) => v === 0)}
                >
                    <FaPlusCircle className="og-trading-medieval-btn-icon" /> 添加
                </button>
                <button onClick={handleClear} className="og-trading-medieval-btn cancel">
                    <FaBroom className="og-trading-medieval-btn-icon" /> 清除
                </button>
            </div>

            {/* === CONFIRM MODAL === */}
            {showConfirm && (
            <div className="use-effect-modal-overlay">
                <div className="use-effect-modal">
                <h3>确认操作</h3>
                <p>
                    您确定要为 <strong>{ogOptions.find(og => og.id === selectedOG)?.name || `OG ${selectedOG}`}</strong>{" "}
                    添加这些资源奖励吗？
                </p>
                <div className="use-effect-modal-buttons">
                    <button className="og-trading-medieval-btn" onClick={handleAddResources}>
                    <FaCheckCircle className="og-trading-medieval-btn-icon" /> 确认
                    </button>
                    <button
                    className="og-trading-medieval-btn cancel"
                    onClick={() => setShowConfirm(false)}
                    >
                    <FaTimesCircle className="og-trading-medieval-btn-icon" /> 取消
                    </button>
                </div>
                </div>
            </div>
            )}
        </div>
    );
};

export default OGResourceAddition;
