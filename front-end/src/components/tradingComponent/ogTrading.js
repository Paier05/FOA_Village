import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance.js';
import { GiTrade, GiWoodPile, GiBrickWall, GiSheep, GiWheat, GiAnvil, GiSpinningWheel } from 'react-icons/gi';
import "./ogTrading.css";
import { FaBroom, FaCheckCircle, FaTimesCircle } from "react-icons/fa";

const resourceIcons = {
  wood: <GiWoodPile />, bricks: <GiBrickWall />, livestock: <GiSheep />, wheat: <GiWheat />, ore: <GiAnvil />, textiles: <GiSpinningWheel />
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

const OGTrade = () => {
  const navigate = useNavigate();
  const [ogOptions, setOgOptions] = useState([]);
  const [selectedOG, setSelectedOG] = useState("");
  const [resources, setResources] = useState(
    resourceTypes.reduce((acc, res) => ({ ...acc, [res]: 0 }), {})
  );
  const [showConfirm, setShowConfirm] = useState(false);

  const itemRefs = useRef({});

  useEffect(() => {
    axiosInstance.get("/ogpr/available-ogs")
      .then((res) => setOgOptions(res.data.data))
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

  const handleSliderChange = (resource, value) => {
    setResources(prev => ({ ...prev, [resource]: parseInt(value, 10) }));
  };

  const handleTrade = async () => {
    if (!selectedOG) return alert("请选择一个交易对象！");
    try {
      await axiosInstance.post("/ogpr/trade", { toOg: selectedOG, resources });
      alert("交易成功!");
      handleClear();
    } catch (err) {
      alert("交易失败: " + (err.response?.data?.message || err.message));
    } finally {
      setShowConfirm(false);
    }
  };

  const handleClear = () => {
    setSelectedOG("");
    setResources(resourceTypes.reduce((acc, res) => ({ ...acc, [res]: 0 }), {}));
  };

  return (
    <div className="og-trading-container medieval-bg">
      <h2 className="og-trading-medieval-title"><GiTrade className="medieval-icon" /> 交易</h2>

      <div className="all-og-selector-container">
        <h3>交易对象</h3>
        <div className="all-og-scroll-controls">
          <button className="all-scroll-arrow" onClick={() => {
            if (ogOptions.length === 0) return;
            const currentIndex = ogOptions.findIndex(og => og.id === selectedOG);
            if (currentIndex === -1) return;
            const prevIndex = currentIndex <= 0 ? ogOptions.length - 1 : currentIndex - 1;
            setSelectedOG(ogOptions[prevIndex].id);
          }}>
            ▲
          </button>

          <div className="all-og-scroll-list">
            {ogOptions.map((og) => (
              <div
                key={og.id}
                ref={el => itemRefs.current[og.id] = el}
                className={`all-og-item ${selectedOG === og.id ? "selected" : ""}`}
                onClick={() => setSelectedOG(og.id)}
              >
                {og.name}
              </div>
            ))}
          </div>

          <button className="all-scroll-arrow" onClick={() => {
            if (ogOptions.length === 0) return;
            const currentIndex = ogOptions.findIndex(og => og.id === selectedOG);
            if (currentIndex === -1) return;
            const nextIndex = (currentIndex + 1) % ogOptions.length;
            setSelectedOG(ogOptions[nextIndex].id);
          }}>
            ▼
          </button>
        </div>
      </div>

      <div className="og-trading-sliders">
        {resourceTypes.map((res) => (
          <div key={res} className="og-trading-slider-row">
            <label className="og-trading-medieval-label">
              {resourceIcons[res]} {resourceLabels[res]} : <span className="og-trading-resource-val">{resources[res]}</span>
            </label>
            <input
              type="range"
              min="0"
              max="50"
              value={resources[res]}
              className="og-trading-medieval-slider"
              onChange={(e) => handleSliderChange(res, e.target.value)}
              style={{
                '--percent': `${(resources[res] / 50) * 100}%`
              }}
            />
          </div>
        ))}
      </div>

      <div className="og-trading-button-row">
        <button 
          className="og-trading-medieval-btn" 
          onClick={() => setShowConfirm(true)}
          disabled={!selectedOG || Object.values(resources).every((v) => v === 0)}
        >
          <GiTrade className="og-trading-medieval-btn-icon" />成交
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
              确定要与 <strong>{ogOptions.find(og => og.id === selectedOG)?.name || `OG ${selectedOG}`}</strong>{" "}
              进行交易吗？
            </p>
            <div className="use-effect-modal-buttons">
              <button className="og-trading-medieval-btn" onClick={() => { handleTrade(); setShowConfirm(false); }}>
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

export default OGTrade;
