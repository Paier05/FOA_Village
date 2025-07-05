import React, { useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import "../tradingComponent/ogTrading.css";
import { FaBroom, FaCheckCircle, FaEdit, FaTimesCircle, FaCoins, FaBalanceScale } from "react-icons/fa";
import {
  GiWoodPile, GiBrickWall, GiSheep, GiWheat, GiAnvil, GiSpinningWheel
} from "react-icons/gi";

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
  textiles: "纺织品",
  wheat: "稻米",
  ore: "矿石",
  livestock: "牲畜",
};

const resourceTypes = Object.keys(resourceIcons);

const SetMarket = () => {
    const [marketChanges, setMarketChanges] = useState(
        resourceTypes.reduce((acc, res) => ({ ...acc, [res]: 0 }), {})
    );
    const [showConfirm, setShowConfirm] = useState(false);

    const handleSliderChange = (res, value) => {
        setMarketChanges(prev => ({
            ...prev,
            [res]: parseInt(value, 10)
        }));
    };

    const handleSubmit = async () => {
        try {
            await axiosInstance.put("/npcpr/market", {
                marketChanges
            });
            alert("市场兑换率修改成功！");
            handleClear();
        } catch (err) {
            console.error(err);
            alert("市场兑换率修改失败: " + (err.response?.data?.message || err.message));
        } finally {
            setShowConfirm(false);
        }
    };

    const handleClear = () => {
        setMarketChanges(resourceTypes.reduce((acc, res) => ({ ...acc, [res]: 0 }), {}));
    };

    return (
        <div className="og-trading-container medieval-bg">
        <h2 className="og-trading-medieval-title">
            <FaBalanceScale className="medieval-icon" /> 市场兑换率调整
        </h2>

        {/* Sliders */}
        <div className="og-trading-sliders">
            {resourceTypes.map(resource => {
            const value = marketChanges[resource];
            return (
                <div key={resource} className="og-trading-slider-row">
                <label className="og-trading-medieval-label">
                    5 {resourceLabels[resource]} = <FaCoins /> ：
                    <span className="og-trading-resource-val">{value >= 0 ? `+${value}` : value}</span>
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
            disabled={Object.values(marketChanges).every(v => v === 0)}
            >
            <FaEdit className="og-trading-medieval-btn-icon" /> 修改
            </button>
            <button className="og-trading-medieval-btn cancel" onClick={handleClear}>
            <FaBroom className="og-trading-medieval-btn-icon" /> 清除
            </button>
        </div>

        {/* Confirm Modal */}
        {showConfirm && (
            <div className="use-effect-modal-overlay">
            <div className="use-effect-modal">
                <h3>确认操作</h3>
                <p>
                确定要调整市场兑换率吗？
                </p>
                <div className="use-effect-modal-buttons">
                <button className="og-trading-medieval-btn" onClick={handleSubmit}>
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

export default SetMarket;
