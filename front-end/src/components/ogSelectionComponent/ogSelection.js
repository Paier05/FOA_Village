import React, { useRef, useEffect } from "react";
import { useOG } from "./ogContext";
import "./ogSelection.css";

const OGSelector = () => {
    const { selectedOG, setSelectedOG, ogOptions } = useOG();
    const itemRefs = useRef({}); // store refs for each item
    const listRef = useRef(null); // scrollable list

    // Scroll to selected item
    useEffect(() => {
        if (selectedOG && itemRefs.current[selectedOG]) {
            itemRefs.current[selectedOG].scrollIntoView({
                behavior: "smooth",
                block: "center"
            });
        }
    }, [selectedOG]);

    const handleScrollUp = () => {
        if (ogOptions.length === 0) return; // no options yet
        const currentIndex = ogOptions.findIndex((og) => og.id === selectedOG);
        if (currentIndex === -1) return; // selectedOG not found yet

        const prevIndex = currentIndex <= 0 ? ogOptions.length - 1 : currentIndex - 1;
        setSelectedOG(ogOptions[prevIndex].id);
    };

    const handleScrollDown = () => {
        if (ogOptions.length === 0) return;
        const currentIndex = ogOptions.findIndex((og) => og.id === selectedOG);
        if (currentIndex === -1) return;

        const nextIndex = (currentIndex + 1) % ogOptions.length;
        setSelectedOG(ogOptions[nextIndex].id);
    };

    return (
        <div className="all-og-selector-container">
            <h3>选择 OG</h3>
            <div className="all-og-scroll-controls">
                <button className="all-scroll-arrow" onClick={handleScrollUp}>▲</button>
                <div className="all-og-scroll-list" ref={listRef}>
                    {ogOptions.map((og) => (
                        <div
                            key={og.id}
                            ref={(el) => (itemRefs.current[og.id] = el)}
                            className={`all-og-item ${selectedOG === og.id ? "selected" : ""}`}
                            onClick={() => setSelectedOG(og.id)}
                        >
                            {og.name}
                        </div>
                    ))}
                </div>
                <button className="all-scroll-arrow" onClick={handleScrollDown}>▼</button>
            </div>
        </div>
    );
};

export default OGSelector;