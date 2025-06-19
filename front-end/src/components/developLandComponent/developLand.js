import React, { useEffect, useRef, useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import { useOG } from "../ogSelectionComponent/ogContext.js";
import "../tradingComponent/ogTrading.css";

const resourceTypes = ["wood", "bricks", "livestock", "wheat", "ore", "textiles"];
const landTypes = ["wood", "bricks", "livestock", "wheat", "ore", "textiles"];

const DevelopLand = () => {
  const { selectedOG } = useOG();
  const [landType, setLandType] = useState("");
  const [resourcesChanges, setResourcesChanges] = useState(
    resourceTypes.reduce((acc, res) => ({ ...acc, [res]: 0 }), {})
  );

  const landTypeItemRefs = useRef({});
  const landTypeListRef = useRef(null);

  // Scroll selected land type into view on change
  useEffect(() => {
    if (landType && landTypeItemRefs.current[landType]) {
      landTypeItemRefs.current[landType].scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [landType]);

  const handleLandTypeScrollUp = () => {
    const currentIndex = landTypes.findIndex(type => type === landType);
    const prevIndex = currentIndex === 0 ? landTypes.length - 1 : currentIndex - 1;
    setLandType(landTypes[prevIndex]);
  };

  const handleLandTypeScrollDown = () => {
    const currentIndex = landTypes.findIndex(type => type === landType);
    const nextIndex = (currentIndex + 1) % landTypes.length;
    setLandType(landTypes[nextIndex]);
  };

  const handleSliderChange = (resource, value) => {
    setResourcesChanges(prev => ({
      ...prev,
      [resource]: parseInt(value, 10)
    }));
  };

  const handleSubmit = async () => {
    if (!selectedOG || !landType) {
      alert("Please select an OG and land type.");
      return;
    }

    const hasCost = Object.values(resourcesChanges).some(v => v > 0);
    if (!hasCost) {
      alert("Please assign at least one resource as cost.");
      return;
    }

    try {
      await axiosInstance.put("/npcpr/ogdevland", {
        ogID: selectedOG,
        landType,
        resourcesChanges
      });
      alert("Land development successful!");
      handleClear();
    } catch (err) {
      console.error(err);
      alert("Failed to develop land: " + (err.response?.data?.message || err.message));
    }
  };

  const handleClear = () => {
    setLandType("");
    setResourcesChanges(resourceTypes.reduce((acc, res) => ({ ...acc, [res]: 0 }), {}));
  };

  const getSliderBackground = (percent) => {
    return percent === 0
      ? "#444"
      : `linear-gradient(to right, violet 0%, violet ${percent}%, #444 ${percent}%, #444 100%)`;
  };

  return (
    <div className="og-trading-container">
      <h2>Develop Land</h2>

      {/* Land Type Scroll Selector */}
      <div className="og-trading-scroll-controls">
        <button className="og-trading-scroll-arrow" onClick={handleLandTypeScrollUp}>▲</button>
        <div className="og-trading-scroll-list" ref={landTypeListRef}>
          {landTypes.map(type => (
            <div
              key={type}
              ref={el => (landTypeItemRefs.current[type] = el)}
              className={`og-trading-item ${landType === type ? "selected" : ""}`}
              onClick={() => setLandType(type)}
            >
              {type}
            </div>
          ))}
        </div>
        <button className="og-trading-scroll-arrow" onClick={handleLandTypeScrollDown}>▼</button>
      </div>

      {/* Resource Sliders */}
      <div className="og-trading-sliders">
        {resourceTypes.map(resource => {
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
                onChange={e => handleSliderChange(resource, e.target.value)}
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
          disabled={!selectedOG || !landType}
        >
          Develop Land
        </button>
        <button onClick={handleClear} className="og-trading-clear-btn">
          Clear
        </button>
      </div>
    </div>
  );
};

export default DevelopLand;
