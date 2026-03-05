// Singleton WebSocket connection

let socket = null;

export const initializeWebSocket = (onMessageCallback) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
        return socket;
    }

    const wsUrl = 'ws://localhost:5000';
    socket = new WebSocket(wsUrl);

    socket.onopen = () => {
        console.log("WebSocket Connection Established");
    };

    socket.onmessage = (event) => {
        try {
            const data = JSON.parse(event.data);
            onMessageCallback(data);
        } catch (error) {
            console.error("Error parsing WebSocket message", error);
        }
    };

    socket.onclose = () => {
        console.warn("WebSocket Connection Closed. Attempting to reconnect in 3s...");
        setTimeout(() => initializeWebSocket(onMessageCallback), 3000);
    };

    socket.onerror = (error) => {
        console.error("WebSocket Error:", error);
        socket.close();
    };

    return socket;
};

export const closeWebSocket = () => {
    if (socket) {
        socket.close();
        socket = null;
    }
};
