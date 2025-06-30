import React, { useEffect, useRef, useState } from "react";
import { useOG } from "../ogSelectionComponent/ogContext.js";
import axiosInstance from "../../api/axiosInstance.js";
import { GiSparkles } from "react-icons/gi";
import { FaBroom, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import "../tradingComponent/ogTrading.css"; // Reuse this!

const UseEffect = () => {
  const { selectedOG } = useOG();
  const [effects, setEffects] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showConfirm, setShowConfirm] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    const fetchEffects = async () => {
      if (!selectedOG) return;
      try {
        const res = await axiosInstance.get(`/npcpr/oguseable-eff/${selectedOG}`);
        setEffects(res.data.data || []);
        setCurrentIndex(0);
      } catch (err) {
        console.error("Error fetching usable effects:", err);
      }
    };

    fetchEffects();
    const interval = setInterval(fetchEffects, 5000);
    return () => clearInterval(interval);
  }, [selectedOG]);

  const handleScrollUp = () => {
    if (effects.length > 0) {
      setCurrentIndex((prev) => (prev - 1 + effects.length) % effects.length);
    }
  };

  const handleScrollDown = () => {
    if (effects.length > 0) {
      setCurrentIndex((prev) => (prev + 1) % effects.length);
    }
  };

  const handleUseEffect = async () => {
    try {
      await axiosInstance.put("/npcpr/oguse-eff", {
        effect_id: effects[currentIndex].effect_id,
      });
      alert("特殊技能使用成功！");
      setShowConfirm(false);
    } catch (err) {
      console.error(err);
      alert("特殊技能使用失败: " + (err.response?.data?.message || err.message));
    }
  };

  const handleClear = () => {
    setCurrentIndex(0);
  };

  return (
    <div className="og-trading-container medieval-bg">
      <h2 className="og-trading-medieval-title">
        <GiSparkles className="medieval-icon" /> 使用特殊技能
      </h2>

      <div className="all-og-selector-container">
        <h3>持有特殊技能列表</h3>
        <div className="all-og-scroll-controls">
          <button className="all-scroll-arrow" onClick={handleScrollUp}>▲</button>
          <div className="all-og-scroll-list" ref={scrollRef}>
            {effects.length === 0 ? (
              <div className="all-og-item disabled">未持有特殊技能</div>
            ) : (
              effects.map((eff, idx) => (
                <div
                  key={eff.effect_id}
                  className={`all-og-item ${idx === currentIndex ? "selected" : ""}`}
                >
                  {eff.effect}
                </div>
              ))
            )}
          </div>
          <button className="all-scroll-arrow" onClick={handleScrollDown}>▼</button>
        </div>
      </div>

      <div className="og-trading-button-row">
        <button
          className="og-trading-medieval-btn"
          onClick={() => setShowConfirm(true)}
          disabled={effects.length === 0 || !selectedOG}
        >
          <FaCheckCircle className="og-trading-medieval-btn-icon" /> 使用
        </button>
        <button className="og-trading-medieval-btn cancel" onClick={handleClear}>
          <FaBroom className="og-trading-medieval-btn-icon" /> 清除
        </button>
      </div>

      {showConfirm && (
        <div className="use-effect-modal-overlay">
          <div className="use-effect-modal">
            <h3>确认使用</h3>
            <p>您确定要使用该特殊技能吗？</p>
            <div className="use-effect-modal-buttons">
              <button className="og-trading-medieval-btn" onClick={handleUseEffect}>
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

export default UseEffect;
