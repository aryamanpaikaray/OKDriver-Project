-- Phase 4 — Database Design

CREATE DATABASE IF NOT EXISTS fleet_monitoring;
USE fleet_monitoring;

CREATE TABLE IF NOT EXISTS drivers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    vehicle_number VARCHAR(50) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS trips (
    id INT AUTO_INCREMENT PRIMARY KEY,
    driver_id INT NOT NULL,
    start_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    end_time TIMESTAMP NULL,
    status ENUM('active', 'completed') DEFAULT 'active',
    FOREIGN KEY (driver_id) REFERENCES drivers(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS events (
    id INT AUTO_INCREMENT PRIMARY KEY,
    driver_id INT NOT NULL,
    trip_id INT NOT NULL,
    event_type VARCHAR(100) NOT NULL,
    speed DECIMAL(5,2) NOT NULL,
    location VARCHAR(255),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (driver_id) REFERENCES drivers(id) ON DELETE CASCADE,
    FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS violations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    event_id INT NOT NULL,
    type VARCHAR(100) NOT NULL,
    severity ENUM('low', 'medium', 'high', 'critical') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS analytics_summary (
    id INT AUTO_INCREMENT PRIMARY KEY,
    total_trips INT DEFAULT 0,
    active_drivers INT DEFAULT 0,
    violation_count INT DEFAULT 0,
    risk_score DECIMAL(5,2) DEFAULT 0.00,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Basic Indexes for performance
CREATE INDEX idx_events_timestamp ON events(timestamp);
CREATE INDEX idx_violations_severity ON violations(severity);
CREATE INDEX idx_trips_status ON trips(status);

-- Insert dummy initial state
INSERT INTO analytics_summary (total_trips, active_drivers, violation_count, risk_score) VALUES (0, 0, 0, 0.0);

INSERT INTO drivers (name, vehicle_number) VALUES
('John Doe', 'TRK-101'),
('Jane Smith', 'TRK-102'),
('Alan Turing', 'TRK-103');

INSERT INTO trips (driver_id, status) VALUES
(1, 'active'),
(2, 'active'),
(3, 'active');
