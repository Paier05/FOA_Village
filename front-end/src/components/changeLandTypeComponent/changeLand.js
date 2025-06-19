import React, { useEffect, useState, useRef } from "react";
import axiosInstance from "../../api/axiosInstance.js";
import "../useEffectsComponent/useEffect.css"; // Reuse same neon-style CSS

const landTypes = ["wood", "bricks", "livestock", "wheat", "ore", "textiles"];

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
        setOgOptions(res.data.data);
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
      alert("Land property changed successfully!");
      handleClear();
    } catch (err) {
      console.error(err);
      alert("Failed to change land property: " + (err.response?.data?.message || err.message));
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
    <div className="use-effect-container">
      <h2>Change Land Property</h2>

      {/* === OG SCROLL SELECTOR === */}
      <h3 style={{ marginTop: "2rem" }}>Choose OG</h3>
      <div className="use-effect-scroll-controls">
        <div className="use-effect-scroll-list" ref={ogListRef}>
          {ogOptions.map((og) => (
            <div
              key={og.id}
              className={`use-effect-item ${selectedOG === og.id ? "selected" : ""}`}
              onClick={() => setSelectedOG(og.id)}
            >
              {og.name || `OG ${og.id}`}
            </div>
          ))}
        </div>
      </div>

      {/* === OLD TYPE SELECTOR === */}
      <h3 style={{ marginTop: "2rem" }}>Current Land Type</h3>
      <div className="use-effect-scroll-controls">
        <div className="use-effect-scroll-list" ref={oldTypeListRef}>
          {landTypes.map((type) => (
            <div
              key={type}
              className={`use-effect-item ${oldType === type ? "selected" : ""}`}
              onClick={() => setOldType(type)}
            >
              {type}
            </div>
          ))}
        </div>
      </div>

      {/* === NEW TYPE SELECTOR === */}
      <h3 style={{ marginTop: "2rem" }}>New Land Type</h3>
      <div className="use-effect-scroll-controls">
        <div className="use-effect-scroll-list" ref={newTypeListRef}>
          {landTypes.map((type) => (
            <div
              key={type}
              className={`use-effect-item ${newType === type ? "selected" : ""}`}
              onClick={() => setNewType(type)}
            >
              {type}
            </div>
          ))}
        </div>
      </div>

      <div className="use-effect-button-row" style={{ marginTop: "2rem" }}>
        <button className="use-effect-btn" onClick={() => setShowConfirm(true)} disabled={isDisabled}>
          Change Land Property
        </button>
        <button className="use-effect-clear-btn" onClick={handleClear}>
          Clear
        </button>
      </div>

      {/* === CONFIRMATION MODAL === */}
      {showConfirm && (
        <div className="use-effect-modal-overlay">
          <div className="use-effect-modal">
            <h3>Confirm Action</h3>
            <p>
              Are you sure you want to change land type from <strong>{oldType}</strong> to{" "}
              <strong>{newType}</strong> for <strong>{selectedOGName}</strong>?
            </p>
            <div className="use-effect-modal-buttons">
              <button className="use-effect-confirm" onClick={handleSubmit}>
                Confirm
              </button>
              <button className="use-effect-cancel" onClick={() => setShowConfirm(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChangeLand;
