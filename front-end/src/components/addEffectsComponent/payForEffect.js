import React, { useEffect, useRef, useState } from "react";
import { useOG } from "../ogSelectionComponent/ogContext.js";
import axiosInstance from "../../api/axiosInstance.js";
import "../tradingComponent/ogTrading.css";

const resourceTypes = ["wood", "bricks", "livestock", "wheat", "ore", "textiles"];
const effectOptions = [
  "釜底抽薪", "釜底抽薪+", "天道酬勤", "天道酬勤+",
  "梅林的魔法", "防御工事", "石中剑", "知己知彼",
  "兵不厌诈", "兵不厌诈+", "抛砖引玉", "十面埋伏", "十面埋伏+"
];

const PayForEffect = () => {
  const { selectedOG } = useOG();
  const [effect, setEffect] = useState("");
  const [resourcesChanges, setResourcesChanges] = useState(
    resourceTypes.reduce((acc, res) => ({ ...acc, [res]: 0 }), {})
  );
  const [targetOG, setTargetOG] = useState("");
  const [type, setType] = useState("");
  const [ogOptions, setOgOptions] = useState([]);

  const effectItemRefs = useRef({});
  const effectListRef = useRef(null);

  useEffect(() => {
    const fetchOGs = async () => {
      try {
        const res = await axiosInstance.get("/mpr/all-ogs");
        setOgOptions(res.data.data || []);
      } catch (err) {
        console.error("Failed to load OGs:", err);
      }
    };
    fetchOGs();
  }, []);

  useEffect(() => {
    if (["釜底抽薪", "釜底抽薪+"].includes(effect)) {
      setTargetOG("");
      setType("");
    } else if (effect === "梅林的魔法") {
      setTargetOG(selectedOG);
      setType("");
    } else if (effect) {
      setTargetOG(selectedOG);
      setType("others");
    } else {
      setTargetOG("");
      setType("");
    }
  }, [effect, selectedOG]);

  useEffect(() => {
    if (effect && effectItemRefs.current[effect]) {
      effectItemRefs.current[effect].scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [effect]);

  const handleSliderChange = (resource, value) => {
    setResourcesChanges(prev => ({
      ...prev,
      [resource]: parseInt(value, 10)
    }));
  };

  const handleSubmit = async () => {
    if (!selectedOG || !effect) {
      alert("Please select an OG and an effect.");
      return;
    }
    const hasCost = Object.values(resourcesChanges).some(v => v > 0);
    if (!hasCost) {
      alert("Please assign at least one resource as cost.");
      return;
    }
    try {
      await axiosInstance.post("/npcpr/ogeffadd", {
        ogID: selectedOG,
        effect,
        targetID: targetOG,
        type,
        resourcesChanges
      });
      alert("Effect added and paid for successfully!");
      handleClear();
    } catch (err) {
      console.error(err);
      alert("Failed to process: " + (err.response?.data?.message || err.message));
    }
  };

  const handleClear = () => {
    setEffect("");
    setTargetOG("");
    setType("");
    setResourcesChanges(resourceTypes.reduce((acc, res) => ({ ...acc, [res]: 0 }), {}));
  };

  const getSliderBackground = (percent) => {
    return percent === 0 ? "#444" : `linear-gradient(to right, violet 0%, violet ${percent}%, #444 ${percent}%, #444 100%)`;
  };

  const scrollEffectUp = () => {
    const currentIndex = effectOptions.findIndex(e => e === effect);
    const prevIndex = currentIndex === 0 ? effectOptions.length - 1 : currentIndex - 1;
    setEffect(effectOptions[prevIndex]);
  };

  const scrollEffectDown = () => {
    const currentIndex = effectOptions.findIndex(e => e === effect);
    const nextIndex = (currentIndex + 1) % effectOptions.length;
    setEffect(effectOptions[nextIndex]);
  };

  const scrollTargetOGUp = () => {
    const currentIndex = ogOptions.findIndex(og => og.id === targetOG);
    const prevIndex = currentIndex === 0 ? ogOptions.length - 1 : currentIndex - 1;
    setTargetOG(ogOptions[prevIndex]?.id);
  };

  const scrollTargetOGDown = () => {
    const currentIndex = ogOptions.findIndex(og => og.id === targetOG);
    const nextIndex = (currentIndex + 1) % ogOptions.length;
    setTargetOG(ogOptions[nextIndex]?.id);
  };

  const scrollTypeUp = () => {
    const currentIndex = resourceTypes.findIndex(r => r === type);
    const prevIndex = currentIndex === 0 ? resourceTypes.length - 1 : currentIndex - 1;
    setType(resourceTypes[prevIndex]);
  };

  const scrollTypeDown = () => {
    const currentIndex = resourceTypes.findIndex(r => r === type);
    const nextIndex = (currentIndex + 1) % resourceTypes.length;
    setType(resourceTypes[nextIndex]);
  };

  return (
    <div className="og-trading-container">
      <h2>Pay For Effect</h2>

      <div className="og-trading-scroll-controls">
        <button className="og-trading-scroll-arrow" onClick={scrollEffectUp}>▲</button>
        <div className="og-trading-scroll-list" ref={effectListRef}>
          {effectOptions.map(eff => (
            <div
              key={eff}
              ref={el => (effectItemRefs.current[eff] = el)}
              className={`og-trading-item ${effect === eff ? "selected" : ""}`}
              onClick={() => setEffect(eff)}
            >
              {eff}
            </div>
          ))}
        </div>
        <button className="og-trading-scroll-arrow" onClick={scrollEffectDown}>▼</button>
      </div>

      {[
        "釜底抽薪",
        "釜底抽薪+"
      ].includes(effect) && (
        <div className="og-trading-scroll-controls">
          <h3 style={{ color: "red" }}>Target OG</h3>
          <button className="og-trading-scroll-arrow" onClick={scrollTargetOGUp}>▲</button>
          <div className="og-trading-scroll-list">
            {ogOptions.map((og) => (
              <div
                key={og.id}
                className={`og-trading-item ${targetOG === og.id ? "selected" : ""}`}
                onClick={() => setTargetOG(og.id)}
              >
                {og.name}
              </div>
            ))}
          </div>
          <button className="og-trading-scroll-arrow" onClick={scrollTargetOGDown}>▼</button>
        </div>
      )}

      {["釜底抽薪", "釜底抽薪+", "梅林的魔法"].includes(effect) && (
        <div className="og-trading-scroll-controls">
          <h3 style={{ color: "red" }}>Target Resource</h3>
          <button className="og-trading-scroll-arrow" onClick={scrollTypeUp}>▲</button>
          <div className="og-trading-scroll-list">
            {resourceTypes.map(res => (
              <div
                key={res}
                className={`og-trading-item ${type === res ? "selected" : ""}`}
                onClick={() => setType(res)}
              >
                {res}
              </div>
            ))}
          </div>
          <button className="og-trading-scroll-arrow" onClick={scrollTypeDown}>▼</button>
        </div>
      )}

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

      <div className="og-trading-button-row">
        <button
          onClick={handleSubmit}
          className="og-trading-btn"
          disabled={!selectedOG || !effect}
        >
          Pay
        </button>
        <button onClick={handleClear} className="og-trading-clear-btn">Clear</button>
      </div>
    </div>
  );
};

export default PayForEffect;
