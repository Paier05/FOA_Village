import React, { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import { useOG } from "../ogSelectionComponent/ogContext.js";
import "../tradingComponent/ogTrading.css";
import { MdCached } from "react-icons/md";
import { GiWoodPile, GiBrickWall, GiSheep, GiWheat, GiAnvil, GiSpinningWheel } from 'react-icons/gi';
import { FaBroom, FaCheckCircle, FaCoins, FaExchangeAlt, FaTimesCircle } from "react-icons/fa";

const resourceTypes = ["wood", "bricks", "livestock", "wheat", "ore", "textiles"];

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
  livestock: "牲畜"
};

const GoldExchange = () => {
  const { selectedOG } = useOG();
  const [goldChanges, setGoldChanges] = useState(0);
  const [resourcesChanges, setResourcesChanges] = useState(
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

  const handleResourceChange = (resource, value) => {
    setResourcesChanges((prev) => ({
      ...prev,
      [resource]: parseInt(value, 10),
    }));
  };

  const handleSubmit = async () => {
    if (!selectedOG || goldChanges === 0) {
      alert("请选择一个 OG 以及金币变化的数量！");
      return;
    }

    try {
      await axiosInstance.put("/npcpr/goldexchg", {
        ogID: selectedOG,
        resourcesChanges,
        goldChanges,
      });

      alert("成功兑换金币与资源！");
      setGoldChanges(0);
      setResourcesChanges(resourceTypes.reduce((acc, res) => ({ ...acc, [res]: 0 }), {}));
    } catch (err) {
      console.error(err);
      alert("金币与资源兑换失败: " + (err.response?.data?.message || err.message));
    } finally {
      setShowConfirm(false);
    }
  };

  return (
    <div className="og-trading-container train-army-container">
      <h2 className="og-trading-medieval-title">
        <FaExchangeAlt className="medieval-icon" /> 兑换金币与资源
      </h2>

      {/* Army Amount Slider */}
      <div className="og-trading-slider-row army-amount-row">
        <label className="train-army-label">
          <span className="train-army-name">
            <FaCoins/> 金币: <span className="train-army-value">{goldChanges}</span>
          </span>
        </label>
        <input
          type="range"
          min="-10"
          max="10"
          value={goldChanges}
          onChange={(e) => setGoldChanges(parseInt(e.target.value, 10))}
          className="train-army-amount-slider"
          style={{
            background: `linear-gradient(
                to right,
                ${
                    goldChanges < 0
                    ? `#e8d8c3 0%, #e8d8c3 ${50 + (goldChanges / 10) * 50}%, rgb(167, 51, 51) ${50 + (goldChanges / 10) * 50}%,rgb(167, 51, 51) 50%, #e8d8c3 50%, #e8d8c3 100%`
                    : goldChanges > 0
                    ? `#e8d8c3 0%, #e8d8c3 50%, rgb(58, 131, 45) 50%,rgb(58, 131, 45) ${50 + (goldChanges / 10) * 50}%, #e8d8c3 ${50 + (goldChanges / 10) * 50}%, #e8d8c3 100%`
                    : `#e8d8c3 0%, #e8d8c3 100%`
                }
            )`
          }}
        />
      </div>

      {/* Divider */}
      <div className="medieval-divider" />

      {/* Resource Sliders */}
      <div className="og-trading-sliders">
        {resourceTypes.map((resource) => {
          const value = resourcesChanges[resource];
          return (
            <div key={resource} className="og-trading-slider-row">
              <label className="og-trading-medieval-label">
                {resourceIcons[resource]} {resourceLabels[resource] || resource} : <span className="og-trading-resource-val">{value}</span>
              </label>
              <input
                type="range"
                min="-50"
                max="50"
                value={value}
                className="og-trading-medieval-slider"
                onChange={(e) => handleResourceChange(resource, e.target.value)}
                style={{
                    background: `linear-gradient(
                        to right,
                        ${
                            value < 0
                            ? `#e8d8c3 0%, #e8d8c3 ${50 + (value / 50) * 50}%, rgb(167, 51, 51) ${50 + (value / 50) * 50}%,rgb(167, 51, 51) 50%, #e8d8c3 50%, #e8d8c3 100%`
                            : value > 0
                            ? `#e8d8c3 0%, #e8d8c3 50%, rgb(58, 131, 45) 50%,rgb(58, 131, 45) ${50 + (value / 50) * 50}%, #e8d8c3 ${50 + (value / 50) * 50}%, #e8d8c3 100%`
                            : `#e8d8c3 0%, #e8d8c3 100%`
                        }
                    )`
                }}
              />
            </div>
          );
        })}
      </div>

      <div className="og-trading-button-row">
        <button
          onClick={() => setShowConfirm(true)}
          className="og-trading-medieval-btn"
          disabled={
            !selectedOG
          }
        >
          <MdCached className="og-trading-medieval-btn-icon" /> 兑换
        </button>
        <button
          onClick={() => {
            setGoldChanges(0);
            setResourcesChanges(resourceTypes.reduce((acc, res) => ({ ...acc, [res]: 0 }), {}));
          }}
          className="og-trading-medieval-btn cancel"
        >
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
              进行金币与资源的兑换吗？
            </p>
            <div className="use-effect-modal-buttons">
              <button className="og-trading-medieval-btn" onClick={handleSubmit}>
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

export default GoldExchange;
