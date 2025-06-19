import React, { useState, useRef } from "react";
import { useOG } from "../ogSelectionComponent/ogContext.js";
import { GiCrossedSwords } from "react-icons/gi";
import axiosInstance from "../../api/axiosInstance.js";
import "../tradingComponent/ogTrading.css";

const landTypes = ["wood", "bricks", "livestock", "wheat", "ore", "textiles"];

const LandTransfer = () => {
  const { ogOptions } = useOG();
  const [winnerID, setWinnerID] = useState("");
  const [loserID, setLoserID] = useState("");
  const [landChanges, setLandChanges] = useState(
    landTypes.reduce((acc, type) => ({ ...acc, [type]: 0 }), {})
  );

  const winnerListRef = useRef(null);
  const loserListRef = useRef(null);

  const handleSliderChange = (type, value) => {
    setLandChanges((prev) => ({
      ...prev,
      [type]: parseInt(value, 10),
    }));
  };

  const handleSubmit = async () => {
    if (!winnerID || !loserID) {
      alert("Please select both a winner and a loser OG.");
      return;
    }

    if (winnerID === loserID) {
      alert("Winner and loser cannot be the same OG.");
      return;
    }

    const isEmpty = Object.values(landChanges).every((v) => v === 0);
    if (isEmpty) {
      alert("Please transfer at least one land.");
      return;
    }

    try {
      await axiosInstance.put("/npcpr/oglndtrf", {
        winnerID,
        loserID,
        landChanges,
      });
      alert("Land transfer successful!");
      handleClear();
    } catch (err) {
      console.error(err);
      alert(
        "Failed to transfer land: " +
          (err.response?.data?.message || err.message)
      );
    }
  };

  const handleClear = () => {
    setWinnerID("");
    setLoserID("");
    setLandChanges(landTypes.reduce((acc, type) => ({ ...acc, [type]: 0 }), {}));
  };

  const getSliderBackground = (percent) => {
    if (percent === 0) return "#444";
    return `linear-gradient(to right, violet 0%, violet ${percent}%, #444 ${percent}%, #444 100%)`;
  };

  return (
    <div className="og-trading-container">
      <h2>Land Transfer (Battle Outcome)</h2>

      <h3 style={{ color: "#b19cd9", marginBottom: "1rem" }}>Select Winner & Loser OG</h3>

        <div className="og-battle-scroll-row">
        {/* Winner OG List */}
        <div className="og-trading-scroll-controls">
            <div className="og-trading-scroll-list" ref={winnerListRef}>
            {ogOptions.map((og) => (
                <div
                key={og.id}
                className={`og-trading-item ${winnerID === og.id ? "selected" : ""}`}
                onClick={() => setWinnerID(og.id)}
                >
                {og.name || `OG ${og.id}`}
                </div>
            ))}
            </div>
            <div style={{ marginTop: "0.5rem", color: "#ffdf00", fontWeight: "bold" }}>WINNER</div>
        </div>

        {/* Battle Icon */}
        <div className="og-battle-icon">
            <GiCrossedSwords size={48} color="#b19cd9" />
        </div>

        {/* Loser OG List */}
        <div className="og-trading-scroll-controls">
            <div className="og-trading-scroll-list" ref={loserListRef}>
            {ogOptions.map((og) => (
                <div
                key={og.id}
                className={`og-trading-item ${loserID === og.id ? "selected" : ""}`}
                onClick={() => setLoserID(og.id)}
                >
                {og.name || `OG ${og.id}`}
                </div>
            ))}
            </div>
            <div style={{ marginTop: "0.5rem", color: "#ff4444", fontWeight: "bold" }}>LOSER</div>
        </div>
        </div>

      {/* === Sliders === */}
      <div className="og-trading-sliders" style={{ marginTop: "2rem" }}>
        {landTypes.map((type) => {
          const value = landChanges[type];
          const percent = (value / 10) * 100;
          return (
            <div key={type} className="og-trading-slider-row">
              <label>
                <span className="og-trading-resource-name">{type.toUpperCase()}:</span>
                <span className="og-trading-resource-value"> {value}</span>
              </label>
              <input
                type="range"
                min="0"
                max="10"
                value={value}
                onChange={(e) => handleSliderChange(type, e.target.value)}
                style={{ background: getSliderBackground(percent) }}
              />
            </div>
          );
        })}
      </div>

      {/* === Buttons === */}
      <div className="og-trading-button-row">
        <button
          onClick={handleSubmit}
          className="og-trading-btn"
          disabled={!winnerID || !loserID || Object.values(landChanges).every((v) => v === 0)}
        >
          Transfer Land
        </button>
        <button onClick={handleClear} className="og-trading-clear-btn">
          Clear
        </button>
      </div>
    </div>
  );
};

export default LandTransfer;
