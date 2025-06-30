import React, { createContext, useContext, useState, useEffect } from "react";
import axiosInstance from "../../api/axiosInstance";

const OGContext = createContext();

export const OGProvider = ({ children }) => {
    const [selectedOG, setSelectedOG] = useState("");
    const [ogOptions, setOgOptions] = useState([]);

    useEffect(() => {
        axiosInstance.get("/mpr/all-ogs")
        .then(res => {
            setOgOptions(res.data.data);
            if (res.data.data.length > 0) {
                setSelectedOG(res.data.data[0].id);
            }
        })
        .catch(err => console.error("Failed to fetch OGs:", err));
    }, []);

    return (
        <OGContext.Provider value={{ selectedOG, setSelectedOG, ogOptions }}>
            {children}
        </OGContext.Provider>
    );
};

export const useOG = () => useContext(OGContext);