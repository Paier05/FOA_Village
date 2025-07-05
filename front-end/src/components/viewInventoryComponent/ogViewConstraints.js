import React, { useEffect, useState, useRef } from "react";
import axiosInstance from "../../api/axiosInstance.js";
import {
    GiCauldron,
    GiWizardStaff, 
    GiStoneWall,
    GiSwordInStone,
    GiThrowingBall,
    GiSpy,
} from "react-icons/gi";
import "../ogResArmComponent/ogResArmInfo.css";
import MedievalSpinner from "../loadingComponent/spinner.js";
import { FaPlusCircle } from "react-icons/fa";

const getConstraintsIcon = (type) => {
    const icons = {
        fdcx: <GiCauldron className="res-icon" />,
        fdcx_plus: (
            <span className="res-icon plus-icon-wrapper">
                <GiCauldron className="res-icon" />
                <FaPlusCircle className="plus-overlay" />
            </span>
        ),
        mlmf: <GiWizardStaff className="res-icon" />,
        smmf: <GiSpy className="res-icon" />,
        fygs: <GiStoneWall className="res-icon" />,
        szj: <GiSwordInStone className="res-icon" />,
        pzyy: <GiThrowingBall className="res-icon" />
    };

    return icons[type] || <span className="res-icon">📛</span>;
};

const constraintsLabels = {
    fdcx: "被釜底抽薪针对",
    fdcx_plus: "被釜底抽薪+针对",
    mlmf: "使用梅林的魔法",
    smmf: "使用十面埋伏",
    fygs: "使用防御工事",
    szj: "使用石中剑",
    pzyy: "使用抛砖引玉"
};

const OGConsInfo = () => {
    const [constraints, setConstraints] = useState(null);
    const prevValues = useRef({});

    useEffect(() => {
        const fetchConstraints = async () => {
            try {
                const res = await axiosInstance.get("/ogpr/ogallcons");
                const newData = res.data.data;

                // Detect value changes
                Object.entries(newData).forEach(([key, newValue]) => {
                    if (prevValues.current[key] !== undefined && prevValues.current[key] !== newValue) {
                        const el = document.getElementById(`res-value-${key}`);
                        if (el) {
                            el.classList.remove("animate-update");
                            void el.offsetWidth; // trigger reflow
                            el.classList.add("animate-update");
                        }
                    }
                    prevValues.current[key] = newValue;
                });

                setConstraints(newData);
            } catch (err) {
                console.error("无法读取OG 特效上限资料：", err);
            }
        };

        fetchConstraints();
        const poll = setInterval(fetchConstraints, 5000);
        return () => clearInterval(poll);
    }, []);

    if (!constraints) return <MedievalSpinner />;

    return (
        <div className="res-container">
            <h2 className="res-header">特殊技能上限</h2>
            <div className="res-grid">
                {Object.entries(constraints).map(([key, value]) => (
                    <div className="res-card" key={key}>
                        {getConstraintsIcon(key)}
                        <div className="res-label">{constraintsLabels[key] || key}</div>
                        <div
                            id={`res-value-${key}`}
                            className="res-value"
                        >
                            {value}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default OGConsInfo;
