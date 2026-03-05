import { useState, useEffect } from 'react';
import { initializeWebSocket, closeWebSocket } from '../websocket/socket';
import { fetchAnalytics, fetchViolations, fetchLiveDrivers } from '../services/api';

export const useLiveEvents = () => {
    const [analytics, setAnalytics] = useState({
        totalTrips: 0,
        activeDrivers: 0,
        violationCount: 0,
        riskScore: 0.0
    });

    const [events, setEvents] = useState([]);
    const [violations, setViolations] = useState([]);
    const [liveDrivers, setLiveDrivers] = useState([]);
    const [alertFlash, setAlertFlash] = useState(null); // Used to trigger red flash screen for severe events

    // Initial Load
    useEffect(() => {
        const loadInitialData = async () => {
            const initialAnalytics = await fetchAnalytics();
            if (initialAnalytics) setAnalytics(initialAnalytics);

            const initialViolations = await fetchViolations();
            if (initialViolations) setViolations(initialViolations);

            const drivers = await fetchLiveDrivers();
            if (drivers) setLiveDrivers(drivers);
        };

        loadInitialData();
    }, []);

    // WebSocket Integration
    useEffect(() => {
        initializeWebSocket((message) => {
            const { type, payload } = message;

            if (type === 'NEW_EVENT') {
                setEvents((prev) => [payload, ...prev].slice(0, 50)); // keep last 50 events locally

                // If it's severe, trigger a flash alert
                if (payload.severity === 'critical' || payload.severity === 'high') {
                    setAlertFlash(payload);
                    setTimeout(() => setAlertFlash(null), 3000);
                }
            } else if (type === 'NEW_VIOLATION') {
                setViolations((prev) => [payload, ...prev].slice(0, 50));
            } else if (type === 'ANALYTICS_UPDATE') {
                setAnalytics({
                    totalTrips: payload.total_trips,
                    activeDrivers: payload.active_drivers,
                    violationCount: payload.violation_count,
                    riskScore: payload.risk_score
                });
            }
        });

        return () => {
            // In a real app we might leave socket open, for dev we clean it up on unmount
            // closeWebSocket(); 
        };
    }, []);

    return { analytics, events, violations, liveDrivers, alertFlash };
};
