import React, { useEffect, useRef, useState } from "react";
import { useOG } from "../ogSelectionComponent/ogContext.js";
import axiosInstance from "../../api/axiosInstance.js";
import "./useEffect.css";

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
    setCurrentIndex((prev) => (prev - 1 + effects.length) % effects.length);
  };

  const handleScrollDown = () => {
    setCurrentIndex((prev) => (prev + 1) % effects.length);
  };

  const handleUseEffect = async () => {
    try {
      await axiosInstance.put("/npcpr/oguse-eff", {
        effect_id: effects[currentIndex].effect_id,
      });
      alert("Effect used successfully!");
      setShowConfirm(false);
    } catch (err) {
      console.error(err);
      alert("Failed to use effect: " + (err.response?.data?.message || err.message));
    }
  };

  const handleClear = () => {
    setCurrentIndex(0);
  };

  return (
    <div className="use-effect-container">
      <h2>Use OG Effect</h2>

      <div className="use-effect-scroll-controls">
        <button className="use-effect-scroll-arrow" onClick={handleScrollUp}>▲</button>
        <div className="use-effect-scroll-list" ref={scrollRef}>
          {effects.map((eff, idx) => (
            <div
              key={eff.effect_id}
              className={`use-effect-item ${idx === currentIndex ? "selected" : ""}`}
            >
              {eff.effect}
            </div>
          ))}
        </div>
        <button className="use-effect-scroll-arrow" onClick={handleScrollDown}>▼</button>
      </div>

      <div className="use-effect-button-row">
        <button
          className="use-effect-btn"
          onClick={() => setShowConfirm(true)}
          disabled={effects.length === 0 || !selectedOG}
        >
          Use Effect
        </button>
        <button className="use-effect-clear-btn" onClick={handleClear}>
          Clear
        </button>
      </div>

      {showConfirm && (
        <div className="use-effect-modal-overlay">
          <div className="use-effect-modal">
            <h3>Confirm Action</h3>
            <p>Are you sure you want to use this effect?</p>
            <div className="use-effect-modal-buttons">
              <button className="use-effect-confirm" onClick={handleUseEffect}>Confirm</button>
              <button className="use-effect-cancel" onClick={() => setShowConfirm(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UseEffect;
