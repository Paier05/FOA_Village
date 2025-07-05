import { useEffect, useState } from "react";
import axiosInstance from '../../api/axiosInstance.js';

export const useGameTimer = () => {
    const [phase, setPhase] = useState(null);
    const [timeLeft, setTimeLeft] = useState(0);

    const fetchPhase = async () => {
        const res = await axiosInstance.get("/allpr/gamephase");
        const { phase, endtime } = res.data.data;
        const [h, m, s] = endtime.split(":").map((x) => parseInt(x));
        const now = new Date();
        const endUTC = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), h, m, s);
        const remaining = Math.max(0, Math.floor((endUTC - Date.now()) / 1000));
        setPhase(phase);
        setTimeLeft(remaining);
    };

    useEffect(() => {
        fetchPhase();

        // To set the timer to update every second
        const interval = setInterval(() => {
            setTimeLeft((prev) => Math.max(0, prev - 1));
        }, 1000);

        // Check timer with database every 5000 milliseconds
        const pollInterval = setInterval(fetchPhase, 5000);

        return () => {
            clearInterval(interval);
            clearInterval(pollInterval);
        };
    }, []);

    return { phase, timeLeft };
};