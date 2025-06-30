import React, { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import { useOG } from "../ogSelectionComponent/ogContext.js";
import "../tradingComponent/ogTrading.css";
import { FaBroom, FaCheckCircle, FaEdit, FaTimesCircle } from "react-icons/fa";
import { GiHillFort, GiWoodPile, GiBrickWall, GiSheep, GiWheat, GiAnvil, GiSpinningWheel } from "react-icons/gi";

const resourceIcons = {
    wood: <GiWoodPile />,
    bricks: <GiBrickWall />,
    livestock: <GiSheep />,
    wheat: <GiWheat />,
    ore: <GiAnvil />,
    textiles: <GiSpinningWheel />
};

const resourceLabels = {
    wood: "木头产地",
    bricks: "砖块产地",
    textiles: "纺织品产地",
    wheat: "稻米产地",
    ore: "矿石产地",
    livestock: "牲畜产地",
};

const resourceTypes = Object.keys(resourceIcons);

const ForceSetLand = () => {
    const { selectedOG } = useOG();
    const [landChanges, setLandChanges] = useState(
        resourceTypes.reduce((acc, res) => ({ ...acc, [res]: 0 }), {})
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


    const handleSliderChange = (land, value) => {
        setLandChanges(prev => ({
            ...prev,
            [land]: parseInt(value, 10)
        }));
    };

    const handleSubmit = async () => {
        if (!selectedOG) {
            alert("请选择一个 OG！");
            return;
        }

        const hasChanges = Object.values(landChanges).some(v => v === 0);
        if (!hasChanges) {
            alert("请选择产地改变的数量！");
            return;
        }

        try {
            await axiosInstance.put("/apr/forceset/ogland", {
                ogID: selectedOG,
                landChanges
            });
            alert("已开发的产地数量修改成功！");
            handleClear();
        } catch (err) {
            console.error(err);
            alert("已开发的产地数量修改失败: " + (err.response?.data?.message || err.message));
        } finally {
            setShowConfirm(false);
        }
    };

    const handleClear = () => {
        setLandChanges(resourceTypes.reduce((acc, res) => ({ ...acc, [res]: 0 }), {}));
    };

    return (
        <div className="og-trading-container medieval-bg">
        <h2 className="og-trading-medieval-title">
            <GiHillFort className="medieval-icon" /> 已开发产地数修改
        </h2>

        {/* Resource Sliders */}
        <div className="og-trading-sliders">
            {resourceTypes.map(resource => {
            const value = landChanges[resource];
            return (
                <div key={resource} className="og-trading-slider-row">
                <label className="og-trading-medieval-label">
                    {resourceIcons[resource]} {resourceLabels[resource]} :{" "}
                    <span className="og-trading-resource-val">{value}</span>
                </label>
                <input
                    type="range"
                    min="-5"
                    max="5"
                    value={value}
                    className="og-trading-medieval-slider"
                    onChange={e => handleSliderChange(resource, e.target.value)}
                    style={{
                        background: `linear-gradient(
                            to right,
                            ${
                                value < 0
                                ? `#e8d8c3 0%, #e8d8c3 ${50 + (value / 5) * 50}%, rgb(167, 51, 51) ${50 + (value / 5) * 50}%,rgb(167, 51, 51) 50%, #e8d8c3 50%, #e8d8c3 100%`
                                : value > 0
                                ? `#e8d8c3 0%, #e8d8c3 50%, rgb(58, 131, 45) 50%,rgb(58, 131, 45) ${50 + (value / 5) * 50}%, #e8d8c3 ${50 + (value / 5) * 50}%, #e8d8c3 100%`
                                : `#e8d8c3 0%, #e8d8c3 100%`
                            }
                        )`
                    }}
                />
                </div>
            );
            })}
        </div>

        {/* Buttons */}
        <div className="og-trading-button-row">
            <button
            className="og-trading-medieval-btn"
            onClick={() => setShowConfirm(true)}
            disabled={!selectedOG || Object.values(landChanges).every((v) => v === 0)}
            >
            <FaEdit className="og-trading-medieval-btn-icon" /> 修改
            </button>
            <button className="og-trading-medieval-btn cancel" onClick={handleClear}>
            <FaBroom className="og-trading-medieval-btn-icon" /> 清除
            </button>
        </div>

        {showConfirm && (
            <div className="use-effect-modal-overlay">
            <div className="use-effect-modal">
                <h3>确认操作</h3>
                <p>
                确定要修改 <strong>{ogOptions.find(og => og.id === selectedOG)?.name || `OG ${selectedOG}`}</strong>{" "}
                的已开发产地数量吗？这不会影响未开发的产地数量哦！
                </p>
                <div className="use-effect-modal-buttons">
                <button className="og-trading-medieval-btn" onClick={() => { handleSubmit(); setShowConfirm(false); }}>
                    <FaCheckCircle className="og-trading-medieval-btn-icon" /> 确认
                </button>
                <button className="og-trading-medieval-btn cancel" onClick={() => setShowConfirm(false)}>
                    <FaTimesCircle className="og-trading-medieval-btn-icon" /> 取消
                </button>
                </div>
            </div>
            </div>
        )}

        </div>
    );
};

export default ForceSetLand;
