import React, { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import { useOG } from "../ogSelectionComponent/ogContext.js";
import { GiShield } from "react-icons/gi";
import "../tradingComponent/ogTrading.css";
import { MdMilitaryTech } from "react-icons/md";
import { GiWoodPile, GiBrickWall, GiSheep, GiWheat, GiAnvil, GiSpinningWheel } from 'react-icons/gi';
import { FaBroom, FaCheckCircle, FaPlusCircle, FaTimesCircle } from "react-icons/fa";

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

const TrainArmy = () => {
  const { selectedOG } = useOG();
  const [armyAmount, setArmyAmount] = useState(0);
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
    if (!selectedOG || armyAmount <= 0) {
      alert("请选择一个 OG 以及军队的数量！");
      return;
    }

    const hasCost = Object.values(resourcesChanges).some((v) => v > 0);
    if (!hasCost) {
      alert("支付的资源不可为零！");
      return;
    }

    try {
      await axiosInstance.put("/npcpr/ogtrain", {
        ogID: selectedOG,
        armyAmount,
        resourcesChanges,
      });

      alert("成功训练军队！");
      setArmyAmount(0);
      setResourcesChanges(resourceTypes.reduce((acc, res) => ({ ...acc, [res]: 0 }), {}));
    } catch (err) {
      console.error(err);
      alert("军队训练失败: " + (err.response?.data?.message || err.message));
    } finally {
      setShowConfirm(false);
    }
  };

  return (
    <div className="og-trading-container train-army-container">
      <h2 className="og-trading-medieval-title">
        <GiShield className="medieval-icon" /> 训练军队
      </h2>

      {/* Army Amount Slider */}
      <div className="og-trading-slider-row army-amount-row">
        <label className="train-army-label">
          <span className="train-army-name">
            <MdMilitaryTech/> 军队数量: <span className="train-army-value">{armyAmount}</span>
          </span>
        </label>
        <input
          type="range"
          min="0"
          max="10"
          value={armyAmount}
          onChange={(e) => setArmyAmount(parseInt(e.target.value, 10))}
          className="train-army-amount-slider"
          style={{ '--percent': `${armyAmount * 10}%` }}
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
                min="0"
                max="50"
                value={value}
                className="og-trading-medieval-slider"
                onChange={(e) => handleResourceChange(resource, e.target.value)}
                style={{ '--percent': `${(value / 50) * 100}%` }}
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
            armyAmount <= 0 ||
            !selectedOG ||
            Object.values(resourcesChanges).every((v) => v === 0)
          }
        >
          <FaPlusCircle className="og-trading-medieval-btn-icon" /> 训练
        </button>
        <button
          onClick={() => {
            setArmyAmount(0);
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
              训练 <strong>{armyAmount}</strong>{" "} 支军队吗？
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

export default TrainArmy;
