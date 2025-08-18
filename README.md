# DDoS Analytics Platform


<img width="1919" height="870" alt="image" src="https://github.com/user-attachments/assets/99121254-d089-4610-9b48-0f216454ef3f" />



> **Note:** The backend is no longer deployed. This repository contains both the original backend code (for reference) and the currently deployed frontend. Only the frontend is live; backend APIs and live data are disabled.

---

## 🌐 Project Overview

DDoS Analytics is a full-stack platform for visualizing and analyzing global Distributed Denial of Service (DDoS) attacks in real time. The project originally featured a FastAPI backend for ingesting, scoring, and serving attack data, and a modern React + Three.js frontend for interactive visualization.

- **Frontend:** Interactive 3D globe, live feed, filters, and statistics (React + Vite + Three.js)
- **Backend:** FastAPI, SQLAlchemy, WebSockets, GeoIP, AbuseIPDB integration (now removed from deployment)

---

## 🚀 Features

- 3D globe visualization of DDoS attacks
- Live feed and statistics panels (UI only, no real data)
- Filtering by time window, severity, attack type, and country
- Modern, responsive design with dark/light mode

---

## 📦 Tech Stack

- **Frontend:** React, Vite, Three.js, three-globe
- **Backend:** FastAPI, SQLAlchemy, PostgreSQL, Redis, GeoIP2, AbuseIPDB, WebSockets

---

## 🖥️ Frontend Usage

1. **Install dependencies:**
   ```bash
   cd frontend
   npm install
   ```
2. **Run the development server:**
   ```bash
   npm run dev
   ```
3. **Build for production:**
   ```bash
   npm run build
   ```

> The frontend is fully functional for demo and design purposes, but all backend-dependent features are disabled.

---

## 🗄️ Backend (Reference Only)

The backend code is included for reference and learning. It is not deployed or maintained. Key components:

- **API:** FastAPI app with routers for ingesting events, querying latest attacks, and IP lookups
- **Database:** SQLAlchemy ORM models for incidents
- **GeoIP:** Integration with MaxMind GeoLite2 for IP geolocation
- **AbuseIPDB:** Checks source IPs for abuse confidence
- **Scoring:** Custom risk scoring for each incident
- **WebSockets:** (Was used for live event streaming)

### Example: Backend API Endpoints

- `POST /ingest` — Ingest a new DDoS incident (with risk scoring, geo lookup, and abuse check)
- `GET /events/latest` — Get the latest 50 incidents
- `GET /ips/{ip}` — Get all incidents for a given source IP

### Main Backend Dependencies

- fastapi
- uvicorn
- httpx
- pydantic
- SQLAlchemy
- psycopg2-binary
- geoip2
- redis
- orjson

---

## ⚠️ Backend Notice

- The backend is **not deployed** and all API endpoints are now placeholders.
- The UI is fully functional for demo and design purposes, but no real attack data is shown.

---

## 📁 Project Structure

```
.
├── backend/   # FastAPI backend (reference only)
├── frontend/  # React + Vite + Three.js frontend (deployed)
└── ...
```

---

## 🤝 Contributing

Feel free to fork and adapt the UI or backend for your own use!

---

**Original Author:** [Yaggggy](https://github.com/Yaggggy)
**License:** MIT
