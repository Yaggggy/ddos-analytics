import React, { useEffect, useState } from "react";
import GlobeComponent from "./components/Globe";
import StatsPanel from "./components/StatsPanel";
import { getStats } from "./api";

function App() {
  const [attacks, setAttacks] = useState([]);
  const [stats, setStats] = useState({});

  useEffect(() => {
    const ws = new WebSocket("ws://127.0.0.1:8000/ws");

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setAttacks((prev) => [...prev, data].slice(-100));
    };

    ws.onopen = () => console.log("WebSocket connected");
    ws.onclose = () => console.log("WebSocket disconnected");

    return () => ws.close();
  }, []);

  useEffect(() => {
    getStats().then((res) => setStats(res));
  }, []);

  return (
    <div
      style={{ display: "flex", height: "100vh", backgroundColor: "#0a0a0a" }}
    >
      <div style={{ flex: 1 }}>
        <GlobeComponent attacks={attacks} />
      </div>
      <div
        style={{ width: "300px", backgroundColor: "#111", overflowY: "auto" }}
      >
        <StatsPanel stats={stats} />
      </div>
    </div>
  );
}

export default App;
