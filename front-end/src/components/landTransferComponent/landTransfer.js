import React, { useState, useRef, useEffect } from "react";
import { useOG } from "../ogSelectionComponent/ogContext.js";
import axiosInstance from "../../api/axiosInstance.js";
import "../tradingComponent/ogTrading.css";
import {
  GiCrossedSwords,
  GiWoodPile,
  GiBrickWall,
  GiSheep,
  GiWheat,
  GiAnvil,
  GiSpinningWheel,
} from "react-icons/gi";
import { FaBroom, FaCheckCircle, FaPlusCircle, FaTimesCircle } from "react-icons/fa";

const resourceIcons = {
  wood: <GiWoodPile />,
  bricks: <GiBrickWall />,
  livestock: <GiSheep />,
  wheat: <GiWheat />,
  ore: <GiAnvil />,
  textiles: <GiSpinningWheel />,
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

const LandTransfer = () => {
  const { ogOptions } = useOG();
  const [winnerID, setWinnerID] = useState("");
  const [loserID, setLoserID] = useState("");
  const [landChanges, setLandChanges] = useState(
    resourceTypes.reduce((acc, type) => ({ ...acc, [type]: 0 }), {})
  );
  const [showConfirm, setShowConfirm] = useState(false);

  const winnerRef = useRef(null);
  const loserRef = useRef(null);

  useEffect(() => {
    if (winnerID && winnerRef.current?.[winnerID]) {
      winnerRef.current[winnerID].scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [winnerID]);

  useEffect(() => {
    if (loserID && loserRef.current?.[loserID]) {
      loserRef.current[loserID].scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [loserID]);

  const handleSliderChange = (type, value) => {
    setLandChanges((prev) => ({
      ...prev,
      [type]: parseInt(value, 10),
    }));
  };

  const handleSubmit = async () => {
    if (!winnerID || !loserID) {
      alert("请为赢家与失败者分别选择 OG。");
      return;
    }

    if (winnerID === loserID) {
      alert("赢家与失败者不能是同一个 OG。");
      return;
    }

    try {
      await axiosInstance.put("/npcpr/oglndtrf", {
        winnerID,
        loserID,
        landChanges,
      });
      alert("产地资源转移成功！");
      handleClear();
    } catch (err) {
      console.error(err);
      alert("转移失败：" + (err.response?.data?.message || err.message));
    } finally {
      setShowConfirm(false);
    }
  };

  const handleClear = () => {
    setWinnerID("");
    setLoserID("");
    setLandChanges(resourceTypes.reduce((acc, type) => ({ ...acc, [type]: 0 }), {}));
  };

  return (
    <div className="og-trading-container medieval-bg">
      <h2 className="og-trading-medieval-title">
        <GiCrossedSwords className="medieval-icon" /> 战争结果 - 产地转移
      </h2>

      {/* Winner OG Selection */}
      <div className="all-og-selector-container">
        <h3>选择赢家 OG</h3>
        <div className="all-og-scroll-controls">
          <div className="all-og-scroll-list">
            {ogOptions.map((og) => (
              <div
                key={og.id}
                ref={(el) => {
                  if (!winnerRef.current) winnerRef.current = {};
                  winnerRef.current[og.id] = el;
                }}
                className={`all-og-item ${winnerID === og.id ? "selected" : ""}`}
                onClick={() => setWinnerID(og.id)}
              >
                {og.name || `OG ${og.id}`}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Battle Icon */}
      <div style={{ textAlign: "center", margin: "1rem 0" }}>
        <GiCrossedSwords size={48} color="#5e4228" />
      </div>

      {/* Loser OG Selection */}
      <div className="all-og-selector-container">
        <h3>选择败家 OG</h3>
        <div className="all-og-scroll-controls">
          <div className="all-og-scroll-list">
            {ogOptions.map((og) => (
              <div
                key={og.id}
                ref={(el) => {
                  if (!loserRef.current) loserRef.current = {};
                  loserRef.current[og.id] = el;
                }}
                className={`all-og-item ${loserID === og.id ? "selected" : ""}`}
                onClick={() => setLoserID(og.id)}
              >
                {og.name || `OG ${og.id}`}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Resource Transfer Sliders */}
      <div className="og-trading-sliders" style={{ marginTop: "2rem" }}>
        {resourceTypes.map((type) => {
          const value = landChanges[type];
          const percent = (value / 10) * 100;
          return (
            <div key={type} className="og-trading-slider-row">
              <label className="og-trading-medieval-label">
                {resourceIcons[type]} {resourceLabels[type]}:
                <span className="og-trading-resource-val"> {value}</span>
              </label>
              <input
                type="range"
                min="0"
                max="10"
                value={value}
                onChange={(e) => handleSliderChange(type, e.target.value)}
                className="og-trading-medieval-slider"
                style={{ "--percent": `${percent}%` }}
              />
            </div>
          );
        })}
      </div>

      {/* Buttons */}
      <div className="og-trading-button-row">
        <button
          onClick={() => setShowConfirm(true)}
          className="og-trading-medieval-btn"
          disabled={!winnerID || !loserID || Object.values(landChanges).every((v) => v === 0)}
        >
          <FaPlusCircle className="og-trading-medieval-btn-icon" /> 转移资源
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
              确定要将 <strong>{ogOptions.find(og => og.id === loserID)?.name || `OG ${loserID}`}</strong>{" "}
              的这些产地拥有权转交给 <strong>{ogOptions.find(og => og.id === loserID)?.name || `OG ${loserID}`}</strong>{" "}
              吗？
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

export default LandTransfer;
