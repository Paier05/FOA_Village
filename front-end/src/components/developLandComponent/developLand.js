import React, { useEffect, useRef, useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import { useOG } from "../ogSelectionComponent/ogContext.js";
import "../tradingComponent/ogTrading.css";
import { FaBroom, FaCheckCircle, FaHammer, FaTimesCircle } from "react-icons/fa";
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
  wood: "木头",
  bricks: "砖块",
  textiles: "纺织品",
  wheat: "稻米",
  ore: "矿石",
  livestock: "牲畜",
};

const resourceTypes = Object.keys(resourceIcons);
const landTypes = resourceTypes;

const DevelopLand = () => {
  const { selectedOG } = useOG();
  const [landType, setLandType] = useState("");
  const [resourcesChanges, setResourcesChanges] = useState(
    resourceTypes.reduce((acc, res) => ({ ...acc, [res]: 0 }), {})
  );
  const [showConfirm, setShowConfirm] = useState(false);
  const [ogOptions, setOgOptions] = useState([]);
  const landTypeItemRefs = useRef({});

  useEffect(() => {
    if (landType && landTypeItemRefs.current[landType]) {
      landTypeItemRefs.current[landType].scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [landType]);

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
      alert("请选择一个 OG 和产地种类！");
      return;
    }

    const hasCost = Object.values(resourcesChanges).some(v => v > 0);
    if (!hasCost) {
      alert("请选择支付的价格！");
      return;
    }

    try {
      await axiosInstance.put("/npcpr/ogdevland", {
        ogID: selectedOG,
        landType,
        resourcesChanges
      });
      alert("产地开发成功！");
      handleClear();
    } catch (err) {
      console.error(err);
      alert("产地开发失败: " + (err.response?.data?.message || err.message));
    } finally {
      setShowConfirm(false);
    }
  };

  const handleClear = () => {
    setLandType("");
    setResourcesChanges(resourceTypes.reduce((acc, res) => ({ ...acc, [res]: 0 }), {}));
  };

  return (
    <div className="og-trading-container medieval-bg">
      <h2 className="og-trading-medieval-title">
        <GiHillFort className="medieval-icon" /> 开发产地
      </h2>

      {/* Land Type Selector */}
      <div className="all-og-selector-container">
        <h3>请选择产地类型</h3>
        <div className="all-og-scroll-controls">
          <button className="all-scroll-arrow" onClick={handleLandTypeScrollUp}>▲</button>
          <div className="all-og-scroll-list">
            {landTypes.map(type => (
              <div
                key={type}
                ref={el => (landTypeItemRefs.current[type] = el)}
                className={`all-og-item ${landType === type ? "selected" : ""}`}
                onClick={() => setLandType(type)}
              >
                {resourceLabels[type]}
              </div>
            ))}
          </div>
          <button className="all-scroll-arrow" onClick={handleLandTypeScrollDown}>▼</button>
        </div>
      </div>

      {/* Resource Sliders */}
      <div className="og-trading-sliders">
        {resourceTypes.map(resource => {
          const value = resourcesChanges[resource];
          return (
            <div key={resource} className="og-trading-slider-row">
              <label className="og-trading-medieval-label">
                {resourceIcons[resource]} {resourceLabels[resource]} :{" "}
                <span className="og-trading-resource-val">{value}</span>
              </label>
              <input
                type="range"
                min="0"
                max="50"
                value={value}
                className="og-trading-medieval-slider"
                onChange={e => handleSliderChange(resource, e.target.value)}
                style={{ '--percent': `${(value / 50) * 100}%` }}
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
          disabled={!selectedOG || !landType || Object.values(resourcesChanges).every((v) => v === 0)}
        >
          <FaHammer className="og-trading-medieval-btn-icon" /> 开发
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
              确定要为 <strong>{ogOptions.find(og => og.id === selectedOG)?.name || `OG ${selectedOG}`}</strong>{" "}
              开发一个 <strong>{resourceLabels[landType]}</strong> 的产地吗？
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

export default DevelopLand;
