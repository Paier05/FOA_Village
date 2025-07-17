import React, { useEffect, useRef, useState } from "react";
import { useOG } from "../ogSelectionComponent/ogContext.js";
import axiosInstance from "../../api/axiosInstance.js";
import "../tradingComponent/ogTrading.css";
import { GiSparkles } from "react-icons/gi";
import { FaBroom, FaCheckCircle, FaPlusCircle, FaTimesCircle } from "react-icons/fa";

const resourceTypes = ["wood", "bricks", "livestock", "wheat", "ore", "textiles"];

const resourceLabels = {
    wood: "木头",
    bricks: "砖块",
    textiles: "纺织品",
    wheat: "稻米",
    ore: "矿石",
    livestock: "牲畜"
};

const effectOptions = [
    "釜底抽薪", "釜底抽薪+", "天道酬勤",
    "梅林的魔法", "防御工事", "石中剑", "知己知彼",
    "兵不厌诈", "抛砖引玉", "十面埋伏"
];

const ForceAddEffect = () => {
    const { selectedOG } = useOG();
    const [effect, setEffect] = useState("");
    const [targetOG, setTargetOG] = useState("");
    const [type, setType] = useState("");
    const [ogOptions, setOgOptions] = useState([]);
    const [showConfirm, setShowConfirm] = useState(false);

    const effectItemRefs = useRef({});

    useEffect(() => {
        axiosInstance.get("/mpr/all-ogs")
            .then(res => setOgOptions(res.data.data || []))
            .catch(err => console.error("Failed to load OGs:", err));
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

    const handleSubmit = async () => {
        if (!selectedOG || !effect) return alert("请选择一个OG和特殊技能");

        try {
            await axiosInstance.post("/apr/forceset/addeffs", {
                ogID: selectedOG,
                effect,
                targetID: targetOG,
                type
            });
            alert("所持有特殊技能已成功修改！");
            handleClear();
        } catch (err) {
            alert("所持有特殊技能修改失败: " + (err.response?.data?.message || err.message));
        } finally {
            setShowConfirm(false);
        }
    };

    const handleClear = () => {
        setEffect("");
        setTargetOG("");
        setType("");
    };

    const scrollEffectUp = () => {
        const i = effectOptions.findIndex(e => e === effect);
        setEffect(effectOptions[(i <= 0 ? effectOptions.length : i) - 1]);
    };

    const scrollEffectDown = () => {
        const i = effectOptions.findIndex(e => e === effect);
        setEffect(effectOptions[(i + 1) % effectOptions.length]);
    };

    const scrollTargetOGUp = () => {
        const i = ogOptions.findIndex(og => og.id === targetOG);
        setTargetOG(ogOptions[(i <= 0 ? ogOptions.length : i) - 1]?.id);
    };

    const scrollTargetOGDown = () => {
        const i = ogOptions.findIndex(og => og.id === targetOG);
        setTargetOG(ogOptions[(i + 1) % ogOptions.length]?.id);
    };

    const scrollTypeUp = () => {
        const i = resourceTypes.findIndex(r => r === type);
        setType(resourceTypes[(i <= 0 ? resourceTypes.length : i) - 1]);
    };

    const scrollTypeDown = () => {
        const i = resourceTypes.findIndex(r => r === type);
        setType(resourceTypes[(i + 1) % resourceTypes.length]);
    };

    const selectedOGName = ogOptions.find(og => og.id === selectedOG)?.name || `OG ${selectedOG}`;

    return (
        <div className="og-trading-container medieval-bg">
        <h2 className="og-trading-medieval-title">
            <GiSparkles className="medieval-icon" /> 给予特殊技能
        </h2>

        {/* Effect Selector */}
        <div className="all-og-selector-container">
            <h3>选择特殊技能</h3>
            <div className="all-og-scroll-controls">
            <button className="all-scroll-arrow" onClick={scrollEffectUp}>▲</button>
            <div className="all-og-scroll-list">
                {effectOptions.map(eff => (
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

        {/* Conditional OG target selector */}
        {["釜底抽薪", "釜底抽薪+"].includes(effect) && (
            <div className="all-og-selector-container">
            <h3>指定 OG</h3>
            <div className="all-og-scroll-controls">
                <button className="all-scroll-arrow" onClick={scrollTargetOGUp}>▲</button>
                <div className="all-og-scroll-list">
                {ogOptions.map(og => (
                    <div
                    key={og.id}
                    className={`all-og-item ${targetOG === og.id ? "selected" : ""}`}
                    onClick={() => setTargetOG(og.id)}
                    >
                    {og.name}
                    </div>
                ))}
                </div>
                <button className="all-scroll-arrow" onClick={scrollTargetOGDown}>▼</button>
            </div>
            </div>
        )}

        {/* Conditional target resource selector */}
        {["釜底抽薪", "釜底抽薪+", "梅林的魔法"].includes(effect) && (
            <div className="all-og-selector-container">
            <h3>指定资源</h3>
            <div className="all-og-scroll-controls">
                <button className="all-scroll-arrow" onClick={scrollTypeUp}>▲</button>
                <div className="all-og-scroll-list">
                {resourceTypes.map(res => (
                    <div
                    key={res}
                    className={`all-og-item ${type === res ? "selected" : ""}`}
                    onClick={() => setType(res)}
                    >
                    {resourceLabels[res] || res}
                    </div>
                ))}
                </div>
                <button className="all-scroll-arrow" onClick={scrollTypeDown}>▼</button>
            </div>
            </div>
        )}

        {/* Buttons */}
        <div className="og-trading-button-row">
            <button
            onClick={() => setShowConfirm(true)}
            className="og-trading-medieval-btn"
            disabled={
                !selectedOG || !effect ||
                (
                    (["釜底抽薪", "釜底抽薪+"].includes(effect) && (!targetOG || !type)) ||
                    (effect === "梅林的魔法" && !type)
                )
            }
            >
            <FaPlusCircle className="og-trading-medieval-btn-icon" /> 添加
            </button>
            <button onClick={handleClear} className="og-trading-medieval-btn cancel">
            <FaBroom className="og-trading-medieval-btn-icon" /> 清除
            </button>
        </div>

        {/* === CONFIRM MODAL === */}
        {showConfirm && (
        <div className="use-effect-modal-overlay">
            <div className="use-effect-modal">
            <h3>确认操作</h3>
            <p>
                确定为 <strong>{selectedOGName}</strong> {" "}添加
                <strong>{effect}</strong> 的特殊技能吗？切记这 <strong>不会</strong> 对该技能的限制（使用次数/被针对次数）进行改变哦！
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

export default ForceAddEffect;
