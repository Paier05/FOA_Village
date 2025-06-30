import { useEffect, useState } from "react";
import axiosInstance from '../../api/axiosInstance.js';

const PHASE_DURATIONS = {
  "1st 发展期": 45 * 60,
  "1st 战争期": 5 * 60,
  "2nd 发展期": 45 * 60,
  "2nd 战争期": 5 * 60,
  "3rd 发展期": 45 * 60,
  "3rd 战争期": 5 * 60,
};

export const useGameTimer = () => {
    const [phase, setPhase] = useState(null);
    const [timeLeft, setTimeLeft] = useState(0);

    const fetchPhase = async () => {
        const res = await axiosInstance.get("/allpr/gamephase");
        const { phase, starttime } = res.data.data;
        const duration = PHASE_DURATIONS[phase];
        const [h, m, s] = starttime.split(":").map((x) => parseInt(x));
        const now = new Date();
        const startUTC = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), h, m, s);
        const elapsed = Math.floor((Date.now() - startUTC) / 1000);
        const remaining = Math.max(0, duration - elapsed);
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