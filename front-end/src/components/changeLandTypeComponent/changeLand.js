import React, { useEffect, useState, useRef } from "react";
import axiosInstance from "../../api/axiosInstance.js";
import "../tradingComponent/ogTrading.css";
import { FaBroom, FaCheckCircle, FaTimesCircle, FaExchangeAlt } from "react-icons/fa";

const landTypes = ["wood", "bricks", "livestock", "wheat", "ore", "textiles"];
const landTypeLabels = {
  wood: "木头",
  bricks: "砖块",
  livestock: "牲畜",
  wheat: "稻米",
  ore: "矿石",
  textiles: "纺织品"
};

const ChangeLand = () => {
  const [ogOptions, setOgOptions] = useState([]);
  const [selectedOG, setSelectedOG] = useState("");
  const [oldType, setOldType] = useState("");
  const [newType, setNewType] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);

  const ogListRef = useRef(null);
  const oldTypeListRef = useRef(null);
  const newTypeListRef = useRef(null);

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

  const handleSubmit = async () => {
    try {
      await axiosInstance.put("/npcpr/ogchglnd", {
        ogID: selectedOG,
        oldType,
        newType
      });
      alert("产地属性更换成功！");
      handleClear();
    } catch (err) {
      console.error(err);
      alert("产地更换失败: " + (err.response?.data?.message || err.message));
    } finally {
      setShowConfirm(false);
    }
  };

  const handleClear = () => {
    setSelectedOG("");
    setOldType("");
    setNewType("");
  };

  const isDisabled = !selectedOG || !oldType || !newType || oldType === newType;
  const selectedOGName = ogOptions.find(og => og.id === selectedOG)?.name || `OG ${selectedOG}`;

  return (
    <div className="og-trading-container medieval-bg">
      <h2 className="og-trading-medieval-title">
        <FaExchangeAlt className="medieval-icon" /> 更换产地属性
      </h2>

      {/* === OG SCROLL SELECTOR === */}
      <div className="all-og-selector-container">
        <h3>选择 OG</h3>
        <div className="all-og-scroll-controls">
          <div className="all-og-scroll-list" ref={ogListRef}>
            {ogOptions.map((og) => (
              <div
                key={og.id}
                className={`all-og-item ${selectedOG === og.id ? "selected" : ""}`}
                onClick={() => setSelectedOG(og.id)}
              >
                {og.name || `OG ${og.id}`}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* === OLD LAND TYPE SELECTOR === */}
      <div className="all-og-selector-container">
        <h3>当前产地类型</h3>
        <div className="all-og-scroll-controls">
          <div className="all-og-scroll-list" ref={oldTypeListRef}>
            {landTypes.map((type) => (
              <div
                key={type}
                className={`all-og-item ${oldType === type ? "selected" : ""}`}
                onClick={() => setOldType(type)}
              >
                {landTypeLabels[type]}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* === NEW LAND TYPE SELECTOR === */}
      <div className="all-og-selector-container">
        <h3>新的产地类型</h3>
        <div className="all-og-scroll-controls">
          <div className="all-og-scroll-list" ref={newTypeListRef}>
            {landTypes.map((type) => (
              <div
                key={type}
                className={`all-og-item ${newType === type ? "selected" : ""}`}
                onClick={() => setNewType(type)}
              >
                {landTypeLabels[type]}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* === BUTTONS === */}
      <div className="og-trading-button-row" style={{ marginTop: "2rem" }}>
        <button
          className="og-trading-medieval-btn"
          onClick={() => setShowConfirm(true)}
          disabled={isDisabled}
        >
          <FaExchangeAlt className="og-trading-medieval-btn-icon" /> 更换
        </button>
        <button className="og-trading-medieval-btn cancel" onClick={handleClear}>
          <FaBroom className="og-trading-medieval-btn-icon" /> 清除
        </button>
      </div>

      {/* === CONFIRM MODAL === */}
      {showConfirm && (
        <div className="use-effect-modal-overlay">
          <div className="use-effect-modal">
            <h3>确认操作</h3>
            <p>
              确定将 <strong>{selectedOGName}</strong> 的产地从{" "}
              <strong>{landTypeLabels[oldType]}</strong> 更换为{" "}
              <strong>{landTypeLabels[newType]}</strong> 吗？
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

export default ChangeLand;
