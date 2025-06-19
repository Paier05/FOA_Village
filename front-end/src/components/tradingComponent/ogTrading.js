// OGTrade.js - upgraded with neon OG selector + slider UI matching addOGRes
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance.js';
import "./ogTrading.css";

const resourceTypes = ["wood", "bricks", "livestock", "wheat", "ore", "textiles"];

const OGTrade = () => {
  const navigate = useNavigate();
  const [ogOptions, setOgOptions] = useState([]);
  const [selectedOG, setSelectedOG] = useState("");
  const [resources, setResources] = useState(
    resourceTypes.reduce((acc, res) => ({ ...acc, [res]: 0 }), {})
  );

  const itemRefs = useRef({});
  const listRef = useRef(null);

  useEffect(() => {
    axiosInstance.get("/ogpr/available-ogs")
      .then((res) => setOgOptions(res.data))
      .catch((err) => {
        console.error("Error fetching OGs:", err);
        if (err.response && (err.response.status === 401 || err.response.status === 403)) {
          navigate('/login');
        }
      });
  }, [navigate]);

  useEffect(() => {
    if (selectedOG && itemRefs.current[selectedOG]) {
      itemRefs.current[selectedOG].scrollIntoView({
        behavior: "smooth",
        block: "center"
      });
    }
  }, [selectedOG]);

  const handleScrollUp = () => {
    if (!ogOptions.length) return;
    const idx = ogOptions.findIndex((og) => og.id === selectedOG);
    const prev = idx <= 0 ? ogOptions.length - 1 : idx - 1;
    setSelectedOG(ogOptions[prev].id);
  };

  const handleScrollDown = () => {
    if (!ogOptions.length) return;
    const idx = ogOptions.findIndex((og) => og.id === selectedOG);
    const next = (idx + 1) % ogOptions.length;
    setSelectedOG(ogOptions[next].id);
  };

  const handleSliderChange = (resource, value) => {
    setResources(prev => ({ ...prev, [resource]: parseInt(value, 10) }));
  };

  const handleTrade = async () => {
    if (!selectedOG) return alert("Please select an OG to trade with.");
    try {
      await axiosInstance.post("/ogpr/trade", { toOg: selectedOG, resources });
      alert("Trade successful!");
      handleClear();
    } catch (err) {
      alert("Trade failed: " + (err.response?.data?.message || err.message));
    }
  };

  const handleClear = () => {
    setSelectedOG("");
    setResources(resourceTypes.reduce((acc, res) => ({ ...acc, [res]: 0 }), {}));
  };

  const getSliderBackground = (percent) => {
    if (percent === 0) return "#444";
    return `linear-gradient(to right, violet 0%, violet ${percent}%, #444 ${percent}%, #444 100%)`;
  };

  return (
    <div className="og-trading-container">
      <h2>Trade With OG</h2>

      <div className="og-trading-sliders">
        <div className="og-trading-scroll-controls">
          <button className="og-trading-scroll-arrow" onClick={handleScrollUp}>▲</button>
          <div className="og-trading-scroll-list" ref={listRef}>
            {ogOptions.map((og) => (
              <div
                key={og.id}
                ref={el => itemRefs.current[og.id] = el}
                className={`og-trading-item ${selectedOG === og.id ? "selected" : ""}`}
                onClick={() => setSelectedOG(og.id)}
              >
                {og.name}
              </div>
            ))}
          </div>
          <button className="og-trading-scroll-arrow" onClick={handleScrollDown}>▼</button>
        </div>

        {resourceTypes.map((resource) => {
          const value = resources[resource];
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
                onChange={(e) => handleSliderChange(resource, e.target.value)}
                style={{ background: getSliderBackground(percent) }}
              />
            </div>
          );
        })}
      </div>

      <div className="og-trading-button-row">
        <button onClick={handleTrade} className="og-trading-btn">Trade</button>
        <button onClick={handleClear} className="og-trading-clear-btn">Clear</button>
      </div>
    </div>
  );
};

export default OGTrade;
