import React, { useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import { useOG } from "../ogSelectionComponent/ogContext.js";
import "../tradingComponent/ogTrading.css";

const resourceTypes = ["wood", "bricks", "livestock", "wheat", "ore", "textiles"];

const TrainArmy = () => {
  const { selectedOG } = useOG();
  const [armyAmount, setArmyAmount] = useState(0);
  const [resourcesChanges, setResourcesChanges] = useState(
    resourceTypes.reduce((acc, res) => ({ ...acc, [res]: 0 }), {})
  );

  const handleResourceChange = (resource, value) => {
    setResourcesChanges((prev) => ({
      ...prev,
      [resource]: parseInt(value, 10),
    }));
  };

  const handleSubmit = async () => {
    if (!selectedOG || armyAmount <= 0) {
      alert("Please select an OG and train at least one army unit.");
      return;
    }

    const hasCost = Object.values(resourcesChanges).some((v) => v > 0);
    if (!hasCost) {
      alert("Please assign at least one resource as cost.");
      return;
    }

    try {
      await axiosInstance.put("/npcpr/ogtrain", {
        ogID: selectedOG,
        armyAmount,
        resourcesChanges,
      });

      alert("Army trained successfully!");
      setArmyAmount(0);
      setResourcesChanges(resourceTypes.reduce((acc, res) => ({ ...acc, [res]: 0 }), {}));
    } catch (err) {
      console.error(err);
      alert("Failed to train army: " + (err.response?.data?.message || err.message));
    }
  };

  const getSliderBackground = (percent) => {
    return percent === 0
      ? "#444"
      : `linear-gradient(to right, violet 0%, violet ${percent}%, #444 ${percent}%, #444 100%)`;
  };

  // Calculate army slider percent for styling (max 10)
  const armyPercent = (armyAmount / 10) * 100;

  return (
    <div className="og-trading-container train-army-container">
      <h2>Train Army</h2>

      {/* Army Amount Slider (highlighted) */}
      <div className="og-trading-slider-row army-amount-row">
        <label className="army-label">
            <span className="army-name">Army Units to Train:</span>
            <span className="army-value">{armyAmount}</span>
        </label>
        <input
          type="range"
          min="0"
          max="10"
          value={armyAmount}
          onChange={(e) => setArmyAmount(parseInt(e.target.value, 10))}
          className="army-amount-slider"
          style={{ background: getSliderBackground(armyPercent) }}
        />
      </div>

      {/* Spacer */}
      <div style={{ marginBottom: "12px", borderTop: "1px solid #ccc", paddingTop: "12px" }} />

      {/* Resource Sliders */}
      <div className="og-trading-sliders">
        {resourceTypes.map((resource) => {
          const value = resourcesChanges[resource];
          const percent = (value / 50) * 100;
          return (
            <div key={resource} className="og-trading-slider-row">
              <label>
                <span className="og-trading-resource-name">{resource.toUpperCase()}:</span>
                <span className="og-trading-resource-value"> {value}</span>
              </label>
              <input
                type="range"
                min="0"
                max="50"
                value={value}
                onChange={(e) => handleResourceChange(resource, e.target.value)}
                style={{ background: getSliderBackground(percent) }}
              />
            </div>
          );
        })}
      </div>

      {/* Buttons */}
      <div className="og-trading-button-row">
        <button
          onClick={handleSubmit}
          className="og-trading-btn"
          disabled={
            armyAmount <= 0 ||
            !selectedOG ||
            Object.values(resourcesChanges).every((v) => v === 0)
          }
        >
            Train Army
        </button>
        <button
            onClick={() => {
            setArmyAmount(0);
            setResourcesChanges(resourceTypes.reduce((acc, res) => ({ ...acc, [res]: 0 }), {}));
            }}
            className="og-trading-clear-btn"
        >
            Clear
        </button>
      </div>
    </div>
  );
};

export default TrainArmy;
