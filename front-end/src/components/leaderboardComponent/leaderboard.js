import React, { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance.js";
import "./leaderboard.css";
import { FaMedal, FaCrown, FaTrophy, FaChevronRight, FaChevronLeft } from "react-icons/fa";

const medalIcons = [
    <FaCrown style={{ color: "#FFD700" }} />, // Gold crown
    <FaMedal style={{ color: "#C0C0C0" }} />, // Silver medal
    <FaMedal style={{ color: "#CD7F32" }} />, // Bronze medal
];

const Leaderboard = () => {
    const [leaderboard, setLeaderboard] = useState(null);
    const [isOpen, setIsOpen] = useState(window.innerWidth > 600);

    const fetchLeaderboard = async () => {
        try {
            const res = await axiosInstance.get("/allpr/leaderboard");
            setLeaderboard(res.data.data);
        } catch (err) {
            console.error("Error fetching leaderboard:", err);
        }
    };

    useEffect(() => {
        fetchLeaderboard();
        const poll = setInterval(fetchLeaderboard, 5000);
        return () => clearInterval(poll);
    }, []);

    useEffect(() => {
        const handleResize = () => {
            setIsOpen(window.innerWidth > 600);
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    if (!leaderboard) return <div>Loading leaderboard...</div>;

    return (
        <>
            <button
                className={`leaderboard-toggle-btn ${isOpen ? "open" : "closed"}`}
                onClick={() => setIsOpen(!isOpen)}
                aria-label={isOpen ? "Hide leaderboard" : "Show leaderboard"}
            >
                {isOpen ? <FaChevronRight /> : <FaChevronLeft />}
            </button>

            <div className={`leaderboard-container ${isOpen ? "open" : "closed"}`}>
                <h3 className="leaderboard-title">
                    <FaTrophy style={{ marginRight: "8px" }} />
                    Leaderboard
                </h3>
                <ul className="leaderboard-list">
                    {leaderboard.map((og, index) => (
                        <li key={index} className="leaderboard-item">
                            <div className="leaderboard-left">
                                <span className="leaderboard-rank">
                                    {index < 3 ? medalIcons[index] : index + 1}
                                </span>
                                <span className="leaderboard-name">{og.name}</span>
                            </div>
                            <span className="leaderboard-score">{og.score}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </>
    );
};

export default Leaderboard;
