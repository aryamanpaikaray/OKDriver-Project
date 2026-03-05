import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

/**
 * Fetch Analytics Summary
 */
export const fetchAnalytics = async () => {
    try {
        const response = await axios.get(`${API_URL}/analytics`);
        return response.data.data;
    } catch (error) {
        console.error("Error fetching analytics:", error);
        return null;
    }
};

/**
 * Fetch Recent Violations
 */
export const fetchViolations = async () => {
    try {
        const response = await axios.get(`${API_URL}/violations`);
        return response.data.data;
    } catch (error) {
        console.error("Error fetching violations:", error);
        return [];
    }
};

/**
 * Fetch Live Drivers
 */
export const fetchLiveDrivers = async () => {
    try {
        const response = await axios.get(`${API_URL}/drivers/live`);
        return response.data.data;
    } catch (error) {
        console.error("Error fetching live drivers:", error);
        return [];
    }
};
