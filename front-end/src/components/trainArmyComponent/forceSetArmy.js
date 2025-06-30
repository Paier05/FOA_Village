import React, { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import { useOG } from "../ogSelectionComponent/ogContext.js";
import { GiShield } from "react-icons/gi";
import "../tradingComponent/ogTrading.css";
import { MdMilitaryTech } from "react-icons/md";
import { FaBroom, FaCheckCircle, FaEdit, FaTimesCircle } from "react-icons/fa";

const ForceSetArmy = () => {
  const { selectedOG } = useOG();
  const [armyAmount, setArmyAmount] = useState(0);
  const [showConfirm, setShowConfirm] = useState(false);
  const [ogOptions, setOgOptions] = useState([]);

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
    if (!selectedOG || armyAmount === 0) {
      alert("请选择一个 OG 以及军队的数量！");
      return;
    }

    try {
      await axiosInstance.put("/apr/forceset/ogarmy", {
        ogID: selectedOG,
        armyAmount
      });

      alert("军队训练成功！");
      setArmyAmount(0);
    } catch (err) {
      console.error(err);
      alert("军队训练失败: " + (err.response?.data?.message || err.message));
    } finally {
      setShowConfirm(false);
    }
  };

  return (
    <div className="og-trading-container train-army-container">
      <h2 className="og-trading-medieval-title">
        <GiShield className="medieval-icon" /> 修改军队数量
      </h2>

      {/* Army Amount Slider */}
      <div className="og-trading-slider-row army-amount-row">
        <label className="train-army-label">
          <span className="train-army-name">
            <MdMilitaryTech/> 军队数量: <span className="train-army-value">{armyAmount}</span>
          </span>
        </label>
        <input
          type="range"
          min="-20"
          max="20"
          value={armyAmount}
          onChange={(e) => setArmyAmount(parseInt(e.target.value, 10))}
          className="train-army-amount-slider"
          style={{
            background: `linear-gradient(
                to right,
                ${
                    armyAmount < 0
                    ? `#e8d8c3 0%, #e8d8c3 ${50 + (armyAmount / 20) * 50}%, rgb(167, 51, 51) ${50 + (armyAmount / 20) * 50}%,rgb(167, 51, 51) 50%, #e8d8c3 50%, #e8d8c3 100%`
                    : armyAmount > 0
                    ? `#e8d8c3 0%, #e8d8c3 50%, rgb(58, 131, 45) 50%,rgb(58, 131, 45) ${50 + (armyAmount / 20) * 50}%, #e8d8c3 ${50 + (armyAmount / 20) * 50}%, #e8d8c3 100%`
                    : `#e8d8c3 0%, #e8d8c3 100%`
                }
            )`
          }}
        />
      </div>
      <div style={{ marginBottom: "2.0rem" }} />
      <div className="og-trading-button-row">
        <button
          onClick={() => setShowConfirm(true)}
          className="og-trading-medieval-btn"
          disabled={
            armyAmount === 0 ||
            !selectedOG
          }
        >
          <FaEdit className="og-trading-medieval-btn-icon" /> 修改
        </button>
        <button
          onClick={() => {
            setArmyAmount(0);
          }}
          className="og-trading-medieval-btn cancel"
        >
          <FaBroom className="og-trading-medieval-btn-icon" /> 清除
        </button>
      </div>

      {/* === CONFIRM MODAL === */}
      {showConfirm && (
        <div className="use-effect-modal-overlay">
          <div className="use-effect-modal">
            <h3>确认操作</h3>
            <p>
              您确定要为 <strong>{ogOptions.find(og => og.id === selectedOG)?.name || `OG ${selectedOG}`}</strong>{" "}
              训练 <strong>{armyAmount}</strong>{" "} 支军队吗？
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

export default ForceSetArmy;
