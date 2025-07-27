import React, { useEffect, useState, useCallback } from "react";
import { Wheel } from "react-custom-roulette";
import axiosInstance from "../../api/axiosInstance.js";
import { useOG } from "../ogSelectionComponent/ogContext.js";
import "./wheel.css";
import MedievalSpinner from "../loadingComponent/spinner.js";

const resourceLabels = {
  wheat: "稻米",
  ore: "矿石",
  textiles: "纺织品",
  bricks: "砖块",
  wood: "木头",
  livestock: "牲畜",
  blank: "空白",
};

const OGSpinWheel = () => {
  const { selectedOG } = useOG();
  const [data, setData] = useState([]);
  const [mustSpin, setMustSpin] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [popupText, setPopupText] = useState("");

  const fetchWheel = useCallback(async () => {
    if (!selectedOG) return;
    try {
      const res = await axiosInstance.get(`/mpr/wheelslots/${selectedOG}`);
      const wheelData = res.data.data;
      const rouletteData = wheelData.map((item) => {
        const key = item.trim().toLowerCase();
        return {
          option: key === "blank" ? "" : resourceLabels[key] || item,
          value: key,
        };
      });
      setData(rouletteData);
    } catch (err) {
      console.error("Failed to fetch wheel data", err);
    }
  }, [selectedOG]);

  useEffect(() => {
    fetchWheel();
  }, [fetchWheel]);

  const handleSpinClick = async () => {
    if (data.length === 0) return;

    try {
      const res = await axiosInstance.post("/mpr/wheelspin", {
        wheel: data.map((d) => d.value),
      });
      const result = res.data.data;

      const prizeIndex = data.findIndex((d) => d.value === result);
      setPrizeNumber(prizeIndex);
      setMustSpin(true);
    } catch (err) {
      console.error("Spin failed", err);
    }
  };

  const handleSpinComplete = () => {
    setMustSpin(false);
    if (prizeNumber !== null) {
      const key = data[prizeNumber].value;
      if (key === "blank") {
        setPopupText("很抱歉，没有奖励，下次再接再厉！");
      } else {
        setPopupText(`恭喜！您获得了：${resourceLabels[key]}`);
      }
      setShowPopup(true);
    }
  };

  if (data.length === 0) return <MedievalSpinner />;

  return (
    <div className="wheel-container">
      <h2 className="wheel-header">OG 轮盘</h2>
      <Wheel
        mustStartSpinning={mustSpin}
        spinDuration={2500}
        prizeNumber={prizeNumber}
        data={data}
        backgroundColors={["#fdf8e4", "#e9d6b0"]}
        textColors={["#5b3b1c"]}
        onStopSpinning={handleSpinComplete}
        outerBorderColor="#a17c50"
        outerBorderWidth={6}
        innerBorderColor="#e5d1a8"
        innerBorderWidth={2}
        radiusLineColor="#a17c50"
        radiusLineWidth={2}
        fontSize={16}
      />
      <div className="wheel-button-row">
        <button
          className="wheel-spin-button"
          onClick={handleSpinClick}
          disabled={mustSpin || showPopup}
        >
          旋转
        </button>

        <button
          className="wheel-spin-button"
          onClick={fetchWheel}
          disabled={mustSpin}
        >
          更新
        </button>
      </div>

      {showPopup && (
        <div className="use-effect-modal-overlay">
          <div className="use-effect-modal">
            <h3>旋转结果</h3>
            <p>{popupText}</p>
            <div className="use-effect-modal-buttons">
              <button
                className="og-trading-medieval-btn"
                onClick={() => setShowPopup(false)}
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OGSpinWheel;
