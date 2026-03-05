# Phase 10 — API Documentation

## 1. Event Ingestion
**Endpoint:** `/api/events`
**Method:** `POST`

**Purpose:** Ingest driver behavior events broadcasted by the client background worker.

**Request Example:**
```json
{
  "driver_id": 1,
  "trip_id": 101,
  "event_type": "speeding",
  "speed": 85,
  "location": "34.0522,-118.2437",
  "timestamp": "2024-05-12T10:20:30Z"
}
```

**Response Example:**
```json
{
  "success": true,
  "message": "Event logged successfully",
  "data": {
    "id": 1024,
    "violationTriggered": true
  }
}
```

---

## 2. Get Analytics Summary
**Endpoint:** `/api/analytics`
**Method:** `GET`

**Purpose:** Retrieves aggregated metrics regarding total trips, internal system drivers online, overall violation count, and average system risk score.

**Response Example:**
```json
{
  "success": true,
  "data": {
    "totalTrips": 45,
    "activeDrivers": 12,
    "violationCount": 8,
    "riskScore": 65
  }
}
```

---

## 3. Get Live Drivers
**Endpoint:** `/api/drivers/live`
**Method:** `GET`

**Purpose:** Yields an array of all drivers currently marked as active on an ongoing trip.

**Response Example:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Alex Mercer",
      "vehicle_number": "TRK-092",
      "status": "active",
      "current_trip_id": 101
    }
  ]
}
```

---

## 4. Get Violations
**Endpoint:** `/api/violations`
**Method:** `GET`

**Purpose:** Yields recent violations across the fleet.

**Response Example:**
```json
{
  "success": true,
  "data": [
    {
      "id": 4,
      "event_id": 1024,
      "type": "speeding",
      "severity": "high",
      "driver_name": "Alex Mercer",
      "speed": 85,
      "timestamp": "2024-05-12T10:20:30Z"
    }
  ]
}
```
