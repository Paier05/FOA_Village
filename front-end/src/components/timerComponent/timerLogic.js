import { useEffect, useState } from "react";
import axiosInstance from '../../api/axiosInstance.js';

const PHASE_DURATIONS = {
  "1st Development Phase": 45 * 60,
  "1st Og War": 5 * 60,
  "2nd Development Phase": 45 * 60,
  "2nd Og War": 5 * 60,
  "Final Development Phase": 45 * 60,
  "Final Og War": 5 * 60,
};

export const useGameTimer = () => {
    const [phase, setPhase] = useState(null);
    const [timeLeft, setTimeLeft] = useState(0);

    const fetchPhase = async () => {
        const res = await axiosInstance.get("/allpr/gamephase");
        const { phase, starttime } = res.data.data;
        const duration = PHASE_DURATIONS[phase];
        const today = new Date().toISOString().split('T')[0];
        const trimmedStarttime = starttime.split('.')[0];
        const utcDateString = `${today}T${trimmedStarttime}Z`; // 'Z' means UTC
        const start = new Date(utcDateString).getTime();
        const now = Date.now();
        const elapsed = Math.floor((now - start) / 1000);
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