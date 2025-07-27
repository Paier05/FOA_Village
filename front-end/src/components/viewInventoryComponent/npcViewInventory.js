import React, { useEffect, useState, useRef } from "react";
import { GiScrollQuill, GiSwordClash } from "react-icons/gi";
import axiosInstance from "../../api/axiosInstance.js";
import { useOG } from "../ogSelectionComponent/ogContext.js";
import MedievalSpinner from "../loadingComponent/spinner.js";
import "./ogInventory.css";

const noTargetNameEffects = [
    "防御工事", "知己知彼", "天道酬勤", "天道酬勤+", "兵不厌诈", "抛砖引玉", "十面埋伏"
];
const noTargetEffects = [
    "防御工事", "知己知彼", "天道酬勤", "天道酬勤+", "兵不厌诈", "抛砖引玉", "十面埋伏", "梅林的魔法"
];
const noExpiryEffects = [
    "防御工事", "石中剑", "知己知彼", "兵不厌诈", "抛砖引玉", "十面埋伏"
];

const resourceLabels = {
    wheat: "稻米",
    ore: "矿石",
    textiles: "纺织品",
    bricks: "砖块",
    wood: "木头",
    livestock: "牲畜",
    army: "军队",
    gold: "金币"
};

const NPCViewInventory = () => {
    const { selectedOG } = useOG();
    const [inventory, setInventory] = useState(null);
    const [previewEffect, setPreviewEffect] = useState(null);
    const prevInventory = useRef({ buffs: [], debuffs: [] });

    useEffect(() => {
        if (!selectedOG) return;

        const fetchInventory = async () => {
            try {
                const res = await axiosInstance.get(`/npcpr/oginv/${selectedOG}`);
                const newData = res.data.data;

                const applyAnimation = (type, index) => {
                    const el = document.getElementById(`${type}-row-${index}`);
                    if (el) {
                        el.classList.remove("animate-update");
                        void el.offsetWidth;
                        el.classList.add("animate-update");
                    }
                };

                newData.buffs.forEach((buff, i) => {
                    if (JSON.stringify(prevInventory.current.buffs[i]) !== JSON.stringify(buff)) {
                        applyAnimation("buff", i);
                    }
                });
                newData.debuffs.forEach((debuff, i) => {
                    if (JSON.stringify(prevInventory.current.debuffs[i]) !== JSON.stringify(debuff)) {
                        applyAnimation("debuff", i);
                    }
                });

                prevInventory.current = newData;
                setInventory(newData);
            } catch (err) {
                console.error("Error fetching OG inventory:", err);
            }
        };

        fetchInventory();
        const poll = setInterval(fetchInventory, 5000);
        return () => clearInterval(poll);
    }, [selectedOG]);

    const handleEffectClick = (effectName) => {
        setPreviewEffect(effectName);
    };

    const closePreview = () => {
        setPreviewEffect(null);
    };

    if (!inventory) return <MedievalSpinner />;

    return (
        <div className="inventory-container fancy-dashboard">
            <h2 className="inventory-header inventory-centered-header">
                <GiScrollQuill className="inventory-icon-header" /> 特殊技能（正）
            </h2>

            <div className="table-wrapper">
                <table className="inventory-table">
                    <thead>
                        <tr>
                            <th>技能名称</th>
                            <th>针对 OG</th>
                            <th>针对资源</th>
                            <th>截止时间</th>
                        </tr>
                    </thead>
                    <tbody>
                        {inventory.buffs.length > 0 ? (
                            inventory.buffs.map((entry, i) => {
                                const showTargetName = !noTargetNameEffects.includes(entry.effect);
                                const showTargetResource = !noTargetEffects.includes(entry.effect);
                                const showExpiry = !noExpiryEffects.includes(entry.effect);

                                return (
                                    <tr key={`buff-${i}`} id={`buff-row-${i}`}>
                                        <td
                                            className="clickable-effect"
                                            onClick={() => handleEffectClick(entry.effect)}
                                        >
                                            {entry.effect}
                                        </td>
                                        <td>{showTargetName ? entry.targetName || "-" : "-"}</td>
                                        <td>{showTargetResource ? resourceLabels[entry.resource] : "-"}</td>
                                        <td>{showExpiry ? entry.expiry : "-"}</td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr><td colSpan="4" className="empty-cell">暂无特殊技能（正）</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            <h2 className="inventory-header inventory-centered-header">
                <GiSwordClash className="inventory-icon-header" /> 特殊技能（负）
            </h2>

            <div className="table-wrapper">
                <table className="inventory-table">
                    <thead>
                        <tr>
                            <th>技能名称</th>
                            <th>针对资源</th>
                            <th>截止时间</th>
                        </tr>
                    </thead>
                    <tbody>
                        {inventory.debuffs.length > 0 ? (
                            inventory.debuffs.map((entry, i) => (
                                <tr key={`debuff-${i}`} id={`debuff-row-${i}`}>
                                    <td
                                        className="clickable-effect"
                                        onClick={() => handleEffectClick(entry.effect)}
                                    >
                                        {entry.effect}
                                    </td>
                                    <td>{resourceLabels[entry.resource]}</td>
                                    <td>{entry.expiry}</td>
                                </tr>
                            ))
                        ) : (
                            <tr><td colSpan="3" className="empty-cell">暂无特殊技能（负）</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            {previewEffect && (
                <div className="card-preview-overlay" onClick={closePreview}>
                    <div className="card-preview">
                        <img
                            src={`/cards/${previewEffect}.png`}
                            alt={previewEffect}
                            className="card-image"
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default NPCViewInventory;
