import React, { useEffect, useRef, useState } from "react";
import { useOG } from "../ogSelectionComponent/ogContext.js";
import axiosInstance from "../../api/axiosInstance.js";
import "../tradingComponent/ogTrading.css";
import { GiSparkles } from "react-icons/gi";
import { FaBroom, FaCheckCircle, FaEdit, FaTimesCircle } from "react-icons/fa";

const constraintEffectOptions = [
    "釜底抽薪", "釜底抽薪+", "梅林的魔法", "十面埋伏",
    "十面埋伏+", "防御工事", "石中剑", "抛砖引玉"
];

const ForceSetEffectsConstraints = () => {
    const { selectedOG } = useOG();
    const [effect, setEffect] = useState("");
    const [changes, setChanges] = useState(0);
    const [ogOptions, setOgOptions] = useState([]);
    const [targetOG, setTargetOG] = useState("");
    const [showConfirm, setShowConfirm] = useState(false);

    const effectItemRefs = useRef({});

    useEffect(() => {
        axiosInstance.get("/mpr/all-ogs")
            .then(res => setOgOptions(res.data.data || []))
            .catch(err => console.error("Failed to load OGs:", err));
    }, []);

    useEffect(() => {
        if (effect && effectItemRefs.current[effect]) {
            effectItemRefs.current[effect].scrollIntoView({ behavior: "smooth", block: "center" });
        }
    }, [effect]);

    useEffect(() => {
        setTargetOG(selectedOG);
    }, [selectedOG]);

    const handleSubmit = async () => {
        if (!targetOG || !effect) return alert("请选择 OG 和 特殊技能");

        try {
            await axiosInstance.put("/apr/forceset/effcons", {
                ogID: targetOG,
                effect,
                changes: parseInt(changes, 10)
            });
            alert("特殊技能参数已成功设置！");
            handleClear();
        } catch (err) {
            alert("设置失败: " + (err.response?.data?.message || err.message));
        } finally {
            setShowConfirm(false);
        }
    };

    const handleClear = () => {
        setEffect("");
        setChanges(0);
    };

    const scrollEffectUp = () => {
        const i = constraintEffectOptions.findIndex(e => e === effect);
        setEffect(constraintEffectOptions[(i <= 0 ? constraintEffectOptions.length : i) - 1]);
    };

    const scrollEffectDown = () => {
        const i = constraintEffectOptions.findIndex(e => e === effect);
        setEffect(constraintEffectOptions[(i + 1) % constraintEffectOptions.length]);
    };

    const selectedOGName = ogOptions.find(og => og.id === selectedOG)?.name || `OG ${selectedOG}`;

    return (
        <div className="og-trading-container medieval-bg">
            <h2 className="og-trading-medieval-title">
                <GiSparkles className="medieval-icon" /> 设置特效限制
            </h2>

            {/* Effect Selector */}
            <div className="all-og-selector-container">
                <h3>选择特殊技能</h3>
                <div className="all-og-scroll-controls">
                    <button className="all-scroll-arrow" onClick={scrollEffectUp}>▲</button>
                    <div className="all-og-scroll-list">
                        {constraintEffectOptions.map(eff => (
                            <div
                                key={eff}
                                ref={el => (effectItemRefs.current[eff] = el)}
                                className={`all-og-item ${effect === eff ? "selected" : ""}`}
                                onClick={() => setEffect(eff)}
                            >
                                {eff}
                            </div>
                        ))}
                    </div>
                    <button className="all-scroll-arrow" onClick={scrollEffectDown}>▼</button>
                </div>
            </div>

            {/* Slider Input */}
            <div className="all-og-selector-container">
                <h3>
                    {
                        ["梅林的魔法", "十面埋伏", "十面埋伏+", "防御工事", "石中剑", "抛砖引玉"].includes(effect)
                            ? "新使用限制次数"
                            : ["釜底抽薪", "釜底抽薪+"].includes(effect)
                            ? "新被针对限制次数"
                            : "新限制"
                    }: {changes}
                </h3>
                <input
                    type="range"
                    min="-5"
                    max="5"
                    value={changes}
                    onChange={e => setChanges(e.target.value)}
                    className="og-trading-medieval-slider"
                    style={{
                        background: `linear-gradient(
                            to right,
                            ${
                                changes < 0
                                ? `#e8d8c3 0%, #e8d8c3 ${50 + (changes / 5) * 50}%, rgb(167, 51, 51) ${50 + (changes / 5) * 50}%,rgb(167, 51, 51) 50%, #e8d8c3 50%, #e8d8c3 100%`
                                : changes > 0
                                ? `#e8d8c3 0%, #e8d8c3 50%, rgb(58, 131, 45) 50%,rgb(58, 131, 45) ${50 + (changes / 5) * 50}%, #e8d8c3 ${50 + (changes / 5) * 50}%, #e8d8c3 100%`
                                : `#e8d8c3 0%, #e8d8c3 100%`
                            }
                        )`
                    }}
                />
            </div>

            {/* Buttons */}
            <div className="og-trading-button-row">
                <button
                    onClick={() => setShowConfirm(true)}
                    className="og-trading-medieval-btn"
                    disabled={!selectedOG || !effect || Number(changes) === 0 }
                >
                    <FaEdit className="og-trading-medieval-btn-icon" /> 设置
                </button>
                <button onClick={handleClear} className="og-trading-medieval-btn cancel">
                    <FaBroom className="og-trading-medieval-btn-icon" /> 清除
                </button>
            </div>

            {/* Confirm Modal */}
            {showConfirm && (
                <div className="use-effect-modal-overlay">
                    <div className="use-effect-modal">
                        <h3>确认操作</h3>
                        <p>
                            确定为 <strong>{selectedOGName}</strong> 设置特殊技能
                            <strong>{effect}</strong> 的新限制吗？
                        </p>
                        <div className="use-effect-modal-buttons">
                            <button className="og-trading-medieval-btn" onClick={handleSubmit}>
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

export default ForceSetEffectsConstraints;
