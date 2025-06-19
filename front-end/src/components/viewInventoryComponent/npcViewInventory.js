import React, { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import { useOG } from "../ogSelectionComponent/ogContext.js";
import "./ogInventory.css";

const noTargetNameEffects = [
    "防御工事", "知己知彼", "天道酬勤", "天道酬勤+", "兵不厌诈", "兵不厌诈+", "抛砖引玉", "十面埋伏", "十面埋伏+"
];

const noTargetEffects = [
    "防御工事", "知己知彼", "天道酬勤", "天道酬勤+", "兵不厌诈", "兵不厌诈+", "抛砖引玉", "十面埋伏", "十面埋伏+", "梅林的魔法"
];

const noExpiryEffects = [
    "防御工事", "石中剑", "知己知彼", "兵不厌诈", "兵不厌诈+", "抛砖引玉", "十面埋伏", "十面埋伏+"
];

const NPCViewInventory = () => {
    const { selectedOG } = useOG();
    const [inventory, setInventory] = useState(null);

    useEffect(() => {
        if (!selectedOG) return;

        const fetchInventory = async () => {
            try {
                const res = await axiosInstance.get(`/npcpr/oginv/${selectedOG}`);
                setInventory(res.data.data);
            } catch (err) {
                console.error("Error fetching OG inventory:", err);
            }
        };

        fetchInventory();
        const poll = setInterval(fetchInventory, 5000);
        return () => clearInterval(poll);
    }, [selectedOG]);

    if (!inventory) return <div className="loading">Loading inventory...</div>;

    const formatEntry = (entry) => {
        const showTargetName = !noTargetNameEffects.includes(entry.effect);
        const showTargetResource = !noTargetEffects.includes(entry.effect);
        const showExpiry = !noExpiryEffects.includes(entry.effect);

        return (
            <tr key={`${entry.effect}-${entry.expiry}-${entry.resource}`}>
                <td>{entry.effect}</td>
                <td>{showTargetName ? entry.targetName || "-" : "-"}</td>
                <td>{showTargetResource ? entry.resource : "-"}</td>
                <td>{showExpiry ? entry.expiry : "-"}</td>
            </tr>
        );
    };

    const formatDebuff = (entry) => (
        <tr key={`${entry.effect}-${entry.expiry}-${entry.resource}`}>
            <td>{entry.effect}</td>
            <td>{entry.resource}</td>
            <td>{entry.expiry}</td>
        </tr>
    );

    return (
        <div className="inventory-container fancy-dashboard">
            <h2 className="inventory-header">Buffing Effects</h2>
            <div className="table-wrapper">
                <table className="inventory-table">
                    <thead>
                        <tr>
                            <th>Effect</th>
                            <th>Target OG</th>
                            <th>Resource</th>
                            <th>Expiry</th>
                        </tr>
                    </thead>
                    <tbody>
                        {inventory.buffs.length > 0 ? (
                            inventory.buffs.map(formatEntry)
                        ) : (
                            <tr><td colSpan="4">No active buffs.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            <h2 className="inventory-header">Nerfing Effects</h2>
            <div className="table-wrapper">
                <table className="inventory-table">
                    <thead>
                        <tr>
                            <th>Effect</th>
                            <th>Resource</th>
                            <th>Expiry</th>
                        </tr>
                    </thead>
                    <tbody>
                        {inventory.debuffs.length > 0 ? (
                            inventory.debuffs.map(formatDebuff)
                        ) : (
                            <tr><td colSpan="3">No active debuffs.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default NPCViewInventory;
