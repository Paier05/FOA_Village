import React, { useState } from "react";
import { useOG } from "../ogSelectionComponent/ogContext.js";
import axiosInstance from "../../api/axiosInstance.js";
import { FaPlusCircle, FaBroom } from "react-icons/fa";
import "./addOGRes.css";

const resourceTypes = ["wood", "bricks", "livestock", "wheat", "ore", "textiles"];

const OGResourceAddition = () => {
    const { selectedOG } = useOG();
    const [resourcesChanges, setResourcesChanges] = useState(
        resourceTypes.reduce((acc, res) => ({
            ...acc,
            [res]: { value: 0, percent: 0 }
        }), {})
    );

    const handleSliderChange = (resource, value) => {
        const intValue = parseInt(value, 10);
        const percent = (intValue / 50) * 100;
        setResourcesChanges((prev) => ({
            ...prev,
            [resource]: { value: intValue, percent }
        }));
    };

    const handleClear = () => {
        setResourcesChanges(
            resourceTypes.reduce((acc, res) => ({
                ...acc,
                [res]: { value: 0, percent: 0 }
            }), {})
        );
    };

    const handleAddResources = async () => {
        if (!selectedOG) {
            alert("Please select an OG.");
            return;
        }

        try {
            // Extract plain object
            const plainChanges = Object.fromEntries(
                Object.entries(resourcesChanges).map(([key, obj]) => [key, obj.value])
            );

            await axiosInstance.put("/mpr/ogresadd", {
                ogID: selectedOG,
                resourcesChanges: plainChanges
            });
            alert("Resources added successfully!");
            handleClear();
        } catch (err) {
            console.error(err);
            alert("Failed to add resources: " + (err.response?.data?.message || err.message));
        }
    };

    const getSliderBackground = (percent) => {
        if (percent === 0) return "#444";

        return `linear-gradient(to right,
            violet 0%,
            violet ${percent}%,
            #444 ${percent}%,
            #444 100%)`;
    };

    return (
        <div className="add-og-res-container">
            <h2>Add Resources to OG</h2>

            <div className="add-og-res-sliders">
                {resourceTypes.map((resource) => (
                    <div key={resource} className="add-og-res-slider-row">
                        <label>
                            <span className="add-og-res-resource-name">{resource.toUpperCase()}:</span>
                            <span className="add-og-res-resource-value"> {resourcesChanges[resource].value}</span>
                        </label>
                        <input
                            type="range"
                            min="0"
                            max="50"
                            value={resourcesChanges[resource].value}
                            onChange={(e) => handleSliderChange(resource, e.target.value)}
                            style={{
                                background: getSliderBackground(resourcesChanges[resource].percent)
                            }}
                        />
                    </div>
                ))}
            </div>

            <div className="add-og-res-button-row">
                <button onClick={handleAddResources} className="add-og-res-btn">
                    <FaPlusCircle /> Add
                </button>
                <button onClick={handleClear} className="add-og-res-clear-btn">
                    <FaBroom /> Clear
                </button>
            </div>
        </div>
    );
};

export default OGResourceAddition;
