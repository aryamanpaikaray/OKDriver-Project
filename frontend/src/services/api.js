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

/**
 * Fetch All Drivers List
 */
export const fetchAllDrivers = async () => {
    try {
        const response = await axios.get(`${API_URL}/drivers_list`);
        return response.data.data;
    } catch (error) {
        console.error("Error fetching all drivers:", error);
        return [];
    }
};

/**
 * Create a new Driver
 */
export const createDriver = async (name, vehicleNumber) => {
    try {
        const response = await axios.post(`${API_URL}/drivers_list`, {
            name,
            vehicle_number: vehicleNumber
        });
        return response.data;
    } catch (error) {
        const msg = error.response?.data?.message || 'Failed to create driver';
        throw new Error(msg);
    }
};

/**
 * Fetch Single Driver Profile & History
 */
export const fetchDriverDetails = async (driverId) => {
    try {
        const response = await axios.get(`${API_URL}/drivers_list/${driverId}`);
        return response.data.data;
    } catch (error) {
        console.error("Error fetching driver details:", error);
        return null;
    }
};
