import React, { useEffect, useMemo, useRef, useState } from "react";
import Globe from "three-globe";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import "./App.css"; // Assuming you have some basic styles
export default function DDOSThreatMap() {
  const [filters, setFilters] = useState({
    severity: ["Critical"],
    type: [
      "SYN_FLOOD",
      "UDP_AMPLIFICATION",
      "HTTP_FLOOD",
      "DNS_AMPLIFICATION",
      "NTP_AMPLIFICATION",
      "OTHER",
    ],
    country: "ALL",
    window: "24h",
    showPaths: true,
    showTargets: true,
    showSources: true,
  });
  // ...existing code...
  // Place the main render at the end of the function
  const mountRef = useRef(null);
  const rendererRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const controlsRef = useRef(null);
  const globeRef = useRef(null);
  const animationRef = useRef(null);
  const [connected, setConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState("");
  const [events, setEvents] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    last5m: 0,
    last1h: 0,
    byCountry: {},
    byType: {},
    bySeverity: {},
  });
  // Small helper to generate UUIDs in all browsers
  const uuid = () =>
    typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID()
      : "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
          const r = (Math.random() * 16) | 0;
          const v = c === "x" ? r : (r & 0x3) | 0x8;
          return v.toString(16);
        });
  const [theme, setTheme] = useState("dark");
  const [wsUrl, setWsUrl] = useState("wss://example.com/ws/events");
  const [apiUrl, setApiUrl] = useState("https://example.com/events/stats");
  // ...existing code...
  const countries = useMemo(
    () => [
      "ALL",
      "Afghanistan",
      "Albania",
      "Algeria",
      "Andorra",
      "Angola",
      "Antigua and Barbuda",
      "Argentina",
      "Armenia",
      "Australia",
      "Austria",
      "Azerbaijan",
      "Bahamas",
      "Bahrain",
      "Bangladesh",
      "Barbados",
      "Belarus",
      "Belgium",
      "Belize",
      "Benin",
      "Bhutan",
      "Bolivia",
      "Bosnia and Herzegovina",
      "Botswana",
      "Brazil",
      "Brunei",
      "Bulgaria",
      "Burkina Faso",
      "Burundi",
      "Cabo Verde",
      "Cambodia",
      "Cameroon",
      "Canada",
      "Central African Republic",
      "Chad",
      "Chile",
      "China",
      "Colombia",
      "Comoros",
      "Congo (Congo-Brazzaville)",
      "Costa Rica",
      "Côte d’Ivoire",
      "Croatia",
      "Cuba",
      "Cyprus",
      "Czechia",
      "Democratic Republic of the Congo",
      "Denmark",
      "Djibouti",
      "Dominica",
      "Dominican Republic",
      "Ecuador",
      "Egypt",
      "El Salvador",
      "Equatorial Guinea",
      "Eritrea",
      "Estonia",
      "Eswatini",
      "Ethiopia",
      "Fiji",
      "Finland",
      "France",
      "Gabon",
      "Gambia",
      "Georgia",
      "Germany",
      "Ghana",
      "Greece",
      "Grenada",
      "Guatemala",
      "Guinea",
      "Guinea-Bissau",
      "Guyana",
      "Haiti",
      "Honduras",
      "Hungary",
      "Iceland",
      "India",
      "Indonesia",
      "Iran",
      "Iraq",
      "Ireland",
      "Israel",
      "Italy",
      "Jamaica",
      "Japan",
      "Jordan",
      "Kazakhstan",
      "Kenya",
      "Kiribati",
      "Kuwait",
      "Kyrgyzstan",
      "Laos",
      "Latvia",
      "Lebanon",
      "Lesotho",
      "Liberia",
      "Libya",
      "Liechtenstein",
      "Lithuania",
      "Luxembourg",
      "Madagascar",
      "Malawi",
      "Malaysia",
      "Maldives",
      "Mali",
      "Malta",
      "Marshall Islands",
      "Mauritania",
      "Mauritius",
      "Mexico",
      "Micronesia",
      "Moldova",
      "Monaco",
      "Mongolia",
      "Montenegro",
      "Morocco",
      "Mozambique",
      "Myanmar (Burma)",
      "Namibia",
      "Nauru",
      "Nepal",
      "Netherlands",
      "New Zealand",
      "Nicaragua",
      "Niger",
      "Nigeria",
      "North Korea",
      "North Macedonia",
      "Norway",
      "Oman",
      "Pakistan",
      "Palau",
      "Palestine State",
      "Panama",
      "Papua New Guinea",
      "Paraguay",
      "Peru",
      "Philippines",
      "Poland",
      "Portugal",
      "Qatar",
      "Romania",
      "Russia",
      "Rwanda",
      "Saint Kitts and Nevis",
      "Saint Lucia",
      "Saint Vincent and the Grenadines",
      "Samoa",
      "San Marino",
      "Sao Tome and Principe",
      "Saudi Arabia",
      "Senegal",
      "Serbia",
      "Seychelles",
      "Sierra Leone",
      "Singapore",
      "Slovakia",
      "Slovenia",
      "Solomon Islands",
      "Somalia",
      "South Africa",
      "South Korea",
      "South Sudan",
      "Spain",
      "Sri Lanka",
      "Sudan",
      "Suriname",
      "Sweden",
      "Switzerland",
      "Syria",
      "Taiwan",
      "Tajikistan",
      "Tanzania",
      "Thailand",
      "Timor-Leste",
      "Togo",
      "Tonga",
      "Trinidad and Tobago",
      "Tunisia",
      "Turkey",
      "Turkmenistan",
      "Tuvalu",
      "Uganda",
      "Ukraine",
      "United Arab Emirates",
      "United Kingdom",
      "United States",
      "Uruguay",
      "Uzbekistan",
      "Vanuatu",
      "Vatican City",
      "Venezuela",
      "Vietnam",
      "Yemen",
      "Zambia",
      "Zimbabwe",
    ],
    []
  );

  const filteredEvents = useMemo(() => {
    const now = Date.now();
    const windowMs =
      filters.window === "5m"
        ? 5 * 60e3
        : filters.window === "1h"
        ? 60 * 60e3
        : 24 * 60 * 60e3;
    const end = now;
    const start = now - windowMs;
    return events.filter((e) => {
      if (!filters.severity.includes(e.severity)) return false;
      if (!filters.type.includes(e.type)) return false;
      if (
        filters.country !== "ALL" &&
        e.targetCountry !== filters.country &&
        e.sourceCountry !== filters.country
      )
        return false;
      return e.ts >= start && e.ts <= end;
    });
  }, [events, filters]);

  const numberFmt = (n) => {
    if (n >= 1e9) return (n / 1e9).toFixed(1) + "B";
    if (n >= 1e6) return (n / 1e6).toFixed(1) + "M";
    if (n >= 1e3) return (n / 1e3).toFixed(1) + "K";
    return String(n);
  };

  function upsertStats(data) {
    setStats({
      total: data.total || 0,
      last5m: data.last5m || 0,
      last1h: data.last1h || 0,
      byCountry: data.byCountry || {},
      byType: data.byType || {},
      bySeverity: data.bySeverity || {},
    });
  }

  const calcTop = (obj, limit = 10) =>
    Object.entries(obj)
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit);

  // ---- THREE + GLOBE SETUP ----
  function createGlobe() {
    const mount = mountRef.current;
    if (!mount) return;

    mount.innerHTML = "";

    const { width, height } = mount.getBoundingClientRect();
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
    const w = Math.max(1, Math.floor(width || window.innerWidth));
    const h = Math.max(1, Math.floor(height || window.innerHeight));
    renderer.setSize(w, h);
    // Make sure the canvas fills the mount element
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    renderer.domElement.style.display = "block";
    renderer.domElement.style.position = "absolute";
    renderer.domElement.style.top = "0";
    renderer.domElement.style.left = "0";

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(
      theme === "dark" ? "#0b0f17" : "#eef2ff"
    );

    const camera = new THREE.PerspectiveCamera(
      45,
      (width || window.innerWidth) / (height || window.innerHeight),
      0.1,
      3000
    );
    camera.position.z = 420;

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.minDistance = 140;
    controls.maxDistance = 800;

    // Lights
    scene.add(new THREE.AmbientLight(0xbbbbbb, 1.0));
    const dir = new THREE.DirectionalLight(0xffffff, 0.8);
    dir.position.set(-120, 80, 250);
    scene.add(dir);

    // Globe instance
    const globe = new Globe()
      .globeImageUrl(
        "//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
      )
      .bumpImageUrl("//unpkg.com/three-globe/example/img/earth-topology.png")
      .showAtmosphere(true)
      .atmosphereAltitude(0.25)
      .atmosphereColor("#88ccff");
    scene.add(globe);

    mount.appendChild(renderer.domElement);
    // ensure mount container has a position and min size
    try {
      mount.style.position = mount.style.position || "relative";
      mount.style.minHeight = mount.style.minHeight || "200px";
    } catch (_) {}

    rendererRef.current = renderer;
    sceneRef.current = scene;
    cameraRef.current = camera;
    controlsRef.current = controls;
    globeRef.current = globe;

    const animate = () => {
      animationRef.current = requestAnimationFrame(animate);
      if (globe) globe.rotation.y += 0.0009;
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    window.addEventListener("resize", handleResize);
  }

  function handleResize() {
    const mount = mountRef.current;
    const renderer = rendererRef.current;
    const camera = cameraRef.current;
    if (!mount || !renderer || !camera) return;
    const { width, height } = mount.getBoundingClientRect();
    const w = width || window.innerWidth;
    const h = height || window.innerHeight;
    renderer.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }

  function teardownGlobe() {
    cancelAnimationFrame(animationRef.current);
    window.removeEventListener("resize", handleResize);
    const controls = controlsRef.current;
    if (controls) controls.dispose();
    const renderer = rendererRef.current;
    if (renderer) {
      renderer.dispose();
      if (renderer.domElement && renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    }
    rendererRef.current = null;
    sceneRef.current = null;
    cameraRef.current = null;
    globeRef.current = null;
    controlsRef.current = null;
  }

  // ---- GLOBE LAYERS (ARCS/POINTS/LABELS) ----
  const severityToArcProps = (sev) => {
    if (sev === "Critical")
      return { color: "#ff5050", altitude: 0.35, stroke: 1.9, dash: 0.2 };
    if (sev === "High")
      return { color: "#ffa000", altitude: 0.3, stroke: 1.6, dash: 0.25 };
    if (sev === "Medium")
      return { color: "#ffdc00", altitude: 0.25, stroke: 1.3, dash: 0.3 };
    return { color: "#64c8ff", altitude: 0.2, stroke: 1.1, dash: 0.35 };
  };

  function refreshGlobeLayers() {
    const globe = globeRef.current;
    if (!globe) return;

    const arcs = filters.showPaths
      ? filteredEvents.map((ev) => {
          const p = severityToArcProps(ev.severity);
          return {
            startLat: ev.src.lat,
            startLng: ev.src.lng,
            endLat: ev.dst.lat,
            endLng: ev.dst.lng,
            color: p.color,
            altitude: p.altitude,
            stroke: p.stroke,
            dash: p.dash,
          };
        })
      : [];

    const points = [];
    if (filters.showSources) {
      filteredEvents.forEach((ev) => {
        points.push({
          lat: ev.src.lat,
          lng: ev.src.lng,
          size: 0.6,
          color: "#66d9ff",
          label: ev.sourceCountry,
        });
      });
    }
    if (filters.showTargets) {
      filteredEvents.forEach((ev) => {
        points.push({
          lat: ev.dst.lat,
          lng: ev.dst.lng,
          size: 0.9,
          color: "#ff6b6b",
          label: ev.targetCountry,
        });
      });
    }

    globe
      .arcsData(arcs)
      .arcColor("color")
      .arcAltitude("altitude")
      .arcStroke((d) => d.stroke)
      .arcDashLength(0.5)
      .arcDashGap((d) => d.dash)
      .arcDashAnimateTime(2200)
      .pointsData(points)
      .pointAltitude("size")
      .pointColor("color")
      .pointRadius(0.6)
      .labelsData(points)
      .labelText("label")
      .labelSize(1.6)
      .labelColor(() =>
        theme === "dark" ? "rgba(255,255,255,0.85)" : "rgba(30,30,30,0.85)"
      );
  }

  // ---- DATA PIPELINE ----
  function connectWS(url) {
    let ws;
    try {
      setConnecting(true);
      setError("");
      ws = new WebSocket(url);
      ws.onopen = () => {
        setConnected(true);
        setConnecting(false);
      };
      ws.onclose = () => {
        setConnected(false);
      };
      ws.onerror = () => {
        setError("WebSocket error");
      };
      ws.onmessage = (msg) => {
        try {
          const data = JSON.parse(msg.data);
          if (Array.isArray(data.events)) {
            setEvents((prev) => {
              const next = [...prev, ...normalizeEvents(data.events)];
              const sliced = next.slice(-5000);
              // schedule a refresh so the globe updates with new data
              try {
                setTimeout(() => {
                  try {
                    refreshGlobeLayers();
                  } catch (_) {}
                }, 50);
              } catch (_) {}
              return sliced;
            });
          }
          if (data.stats) upsertStats(data.stats);
        } catch (_) {}
      };
    } catch (e) {
      setError("Failed to connect");
    }
    return ws;
  }

  const normalizeEvents = (arr) =>
    arr.map((e) => ({
      id: e.id || uuid(),
      ts: typeof e.ts === "number" ? e.ts : Date.parse(e.ts || Date.now()),
      severity: ["Low", "Medium", "High", "Critical"].includes(e.severity)
        ? e.severity
        : "Low",
      type: e.type || "OTHER",
      sourceCountry: e.sourceCountry || "Unknown",
      targetCountry: e.targetCountry || "Unknown",
      src: { lat: +e.src?.lat || 0, lng: +e.src?.lng || 0 },
      dst: { lat: +e.dst?.lat || 0, lng: +e.dst?.lng || 0 },
      bps: +e.bps || 0,
      pps: +e.pps || 0,
    }));

  function seedDemoTraffic() {
    const cityPool = [
      { c: "United States", lat: 37.77, lng: -122.41 },
      { c: "India", lat: 28.61, lng: 77.2 },
      { c: "Singapore", lat: 1.29, lng: 103.85 },
      { c: "Netherlands", lat: 52.37, lng: 4.9 },
      { c: "Germany", lat: 52.52, lng: 13.4 },
      { c: "Brazil", lat: -23.55, lng: -46.63 },
      { c: "Japan", lat: 35.68, lng: 139.69 },
      { c: "United Kingdom", lat: 51.5, lng: -0.12 },
      { c: "Australia", lat: -33.87, lng: 151.21 },
      { c: "UAE", lat: 25.2, lng: 55.27 },
    ];
    const sevList = ["Low", "Medium", "High", "Critical"];
    const typList = filters.type;
    const now = Date.now();
    const batch = Array.from({ length: 70 }, () => {
      const a = cityPool[Math.floor(Math.random() * cityPool.length)];
      const b = cityPool[Math.floor(Math.random() * cityPool.length)];
      const sev = sevList[Math.floor(Math.random() * sevList.length)];
      const typ = typList[Math.floor(Math.random() * typList.length)];
      return {
        id: uuid(),
        ts: now - Math.floor(Math.random() * 60 * 60 * 1000),
        severity: sev,
        type: typ,
        sourceCountry: a.c,
        targetCountry: b.c,
        src: {
          lat: a.lat + (Math.random() - 0.5) * 2,
          lng: a.lng + (Math.random() - 0.5) * 2,
        },
        dst: {
          lat: b.lat + (Math.random() - 0.5) * 2,
          lng: b.lng + (Math.random() - 0.5) * 2,
        },
        bps: Math.floor(Math.random() * 1e9),
        pps: Math.floor(Math.random() * 1e6),
      };
    });
    setEvents((prev) => [...prev, ...batch].slice(-5000));
  }

  async function fetchStats() {
    try {
      const r = await fetch(apiUrl, {
        headers: { Accept: "application/json" },
      });
      if (!r.ok) throw new Error("Bad status");
      const data = await r.json();
      upsertStats(data);
    } catch (_) {}
  }

  // ---- EFFECTS ----
  useEffect(() => {
    createGlobe();
    return () => teardownGlobe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [theme]);

  useEffect(() => {
    refreshGlobeLayers();
  }, [filteredEvents, filters, theme]);

  useEffect(() => {
    const ws = connectWS(wsUrl);
    const demoTimer = setInterval(seedDemoTraffic, 4000);
    const statTimer = setInterval(fetchStats, 10000);
    // seed initial demo traffic immediately so UI shows data right away
    try {
      seedDemoTraffic();
    } catch (_) {}
    return () => {
      try {
        ws && ws.close();
      } catch (_) {}
      clearInterval(demoTimer);
      clearInterval(statTimer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wsUrl, apiUrl]);

  const topCountries = useMemo(() => calcTop(stats.byCountry, 8), [stats]);
  const topTypes = useMemo(() => calcTop(stats.byType, 5), [stats]);
  const topSev = useMemo(() => calcTop(stats.bySeverity, 4), [stats]);

  // ---- UI ----
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "320px 1fr 360px",
        gridTemplateRows: "auto 1fr",
        height: "100vh",
        background: theme === "dark" ? "#0b0f17" : "#f5f7fb",
        color: theme === "dark" ? "#e8eefc" : "#0f172a",
        fontFamily:
          "Inter, system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
        overflowY: "auto",
      }}
    >
      {/* Backend removal notice */}
      <div
        style={{
          gridColumn: "1 / span 3",
          background: "#fffae6",
          color: "#b45309",
          padding: "10px 0",
          textAlign: "center",
          fontWeight: 600,
          fontSize: 16,
          borderBottom: "1px solid #fbbf24",
          letterSpacing: 0.2,
          zIndex: 100,
        }}
      >
        Backend has been removed. Code available at{" "}
        <a
          href="https://github.com/Yaggggy/ddos-analytics"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "#b45309", textDecoration: "underline" }}
        >
          GitHub repo
        </a>
        .
      </div>
      <header
        style={{
          gridColumn: "1 / span 3",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "14px 16px",
          borderBottom:
            theme === "dark" ? "1px solid #1a2234" : "1px solid #dbe3f1",
          backdropFilter: "blur(6px)",
          position: "sticky",
          top: 0,
          zIndex: 10,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              width: 12,
              height: 12,
              borderRadius: 999,
              background: connected
                ? "#10b981"
                : connecting
                ? "#f59e0b"
                : "#ef4444",
              boxShadow: connected ? "0 0 12px rgba(16,185,129,0.6)" : "none",
            }}
          />
          <div style={{ fontWeight: 700, letterSpacing: 0.3 }}>
            Global DDoS Threat Map
          </div>
          <div style={{ opacity: 0.7, fontSize: 12 }}>
            {connected ? "live" : connecting ? "connecting" : "offline"}
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <input
            value={wsUrl}
            onChange={(e) => setWsUrl(e.target.value)}
            placeholder="wss://backend/ws/events"
            style={{
              width: 340,
              border: "1px solid #334155",
              borderRadius: 10,
              padding: "8px 10px",
              background: theme === "dark" ? "#0f1625" : "#fff",
              color: "inherit",
            }}
          />
          <input
            value={apiUrl}
            onChange={(e) => setApiUrl(e.target.value)}
            placeholder="https://backend/events/stats"
            style={{
              width: 260,
              border: "1px solid #334155",
              borderRadius: 10,
              padding: "8px 10px",
              background: theme === "dark" ? "#0f1625" : "#fff",
              color: "inherit",
            }}
          />
          <button
            onClick={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
            style={{
              border: "1px solid #334155",
              background: "transparent",
              color: "inherit",
              borderRadius: 12,
              padding: "8px 12px",
              cursor: "pointer",
            }}
          >
            {theme === "dark" ? "Light" : "Dark"}
          </button>
          <div style={{ fontSize: 12, opacity: 0.8, marginLeft: 8 }}>
            Events: {events.length} • Shown: {filteredEvents.length}
          </div>
        </div>
      </header>

      <aside
        style={{
          padding: 16,
          borderRight:
            theme === "dark" ? "1px solid #1a2234" : "1px solid #dbe3f1",
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}
      >
        <div style={{ fontWeight: 700, fontSize: 14 }}>Filters</div>
        <div style={{ display: "grid", gap: 10 }}>
          <div>
            <div style={{ fontSize: 12, opacity: 0.8, marginBottom: 6 }}>
              Time Window
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              {["5m", "1h", "24h"].map((w) => (
                <button
                  key={w}
                  onClick={() => setFilters((f) => ({ ...f, window: w }))}
                  style={{
                    padding: "6px 10px",
                    borderRadius: 10,
                    border:
                      filters.window === w
                        ? "1px solid #60a5fa"
                        : "1px solid #334155",
                    background:
                      filters.window === w ? "#1d4ed8" : "transparent",
                    color: filters.window === w ? "white" : "inherit",
                    cursor: "pointer",
                  }}
                >
                  {w}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div style={{ fontSize: 12, opacity: 0.8, marginBottom: 6 }}>
              Severity
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {["Low", "Medium", "High", "Critical"].map((s) => {
                const active = filters.severity.includes(s);
                return (
                  <button
                    key={s}
                    onClick={() =>
                      setFilters((f) => ({
                        ...f,
                        severity: active
                          ? f.severity.filter((x) => x !== s)
                          : [...f.severity, s],
                      }))
                    }
                    style={{
                      padding: "6px 10px",
                      borderRadius: 10,
                      border: active
                        ? "1px solid #60a5fa"
                        : "1px solid #334155",
                      background: active ? "#1d4ed8" : "transparent",
                      color: active ? "white" : "inherit",
                      cursor: "pointer",
                    }}
                  >
                    {s}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <div style={{ fontSize: 12, opacity: 0.8, marginBottom: 6 }}>
              Attack Type
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {filters.type.map((t) => (
                <span
                  key={t}
                  style={{
                    padding: "6px 10px",
                    borderRadius: 10,
                    border: "1px solid #334155",
                  }}
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

          <div>
            <div style={{ fontSize: 12, opacity: 0.8, marginBottom: 6 }}>
              Focus Country
            </div>
            <select
              value={filters.country}
              onChange={(e) =>
                setFilters((f) => ({ ...f, country: e.target.value }))
              }
              style={{
                width: "100%",
                padding: "8px 10px",
                borderRadius: 10,
                border: "1px solid #334155",
                background: theme === "dark" ? "#0f1625" : "#fff",
                color: "inherit",
              }}
            >
              {countries.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: "grid", gap: 6 }}>
            <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <input
                type="checkbox"
                checked={filters.showPaths}
                onChange={(e) =>
                  setFilters((f) => ({ ...f, showPaths: e.target.checked }))
                }
              />{" "}
              Paths
            </label>
            <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <input
                type="checkbox"
                checked={filters.showSources}
                onChange={(e) =>
                  setFilters((f) => ({ ...f, showSources: e.target.checked }))
                }
              />{" "}
              Sources
            </label>
            <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <input
                type="checkbox"
                checked={filters.showTargets}
                onChange={(e) =>
                  setFilters((f) => ({ ...f, showTargets: e.target.checked }))
                }
              />{" "}
              Targets
            </label>
          </div>

          <button
            onClick={() => {
              setEvents([]);
              seedDemoTraffic();
            }}
            style={{
              marginTop: 8,
              padding: "10px 12px",
              borderRadius: 12,
              border: "1px solid #334155",
              background: "transparent",
              color: "inherit",
              cursor: "pointer",
            }}
          >
            Seed Demo Traffic
          </button>
        </div>

        <div
          style={{
            marginTop: 18,
            fontSize: 12,
            opacity: 0.75,
            lineHeight: 1.4,
          }}
        >
          Data is anonymized and for visualization only. Not exhaustive of all
          attacks.
        </div>
      </aside>

      <main style={{ position: "relative" }}>
        <div ref={mountRef} style={{ width: "100%", height: "100%" }} />
        {error && (
          <div
            style={{
              position: "absolute",
              top: 16,
              left: "50%",
              transform: "translateX(-50%)",
              background: "rgba(220,38,38,0.9)",
              padding: "8px 12px",
              borderRadius: 10,
              fontSize: 12,
            }}
          >
            {error}
          </div>
        )}
        <div
          style={{
            position: "absolute",
            bottom: 16,
            left: 16,
            display: "flex",
            gap: 10,
          }}
        >
          <StatCard
            label="Total"
            value={numberFmt(stats.total)}
            theme={theme}
          />
          <StatCard
            label="Last 1h"
            value={numberFmt(stats.last1h)}
            theme={theme}
          />
          <StatCard
            label="Last 5m"
            value={numberFmt(stats.last5m)}
            theme={theme}
          />
        </div>
      </main>

      <aside
        style={{
          padding: 16,
          borderLeft:
            theme === "dark" ? "1px solid #1a2234" : "1px solid #dbe3f1",
          display: "flex",
          flexDirection: "column",
          gap: 14,
          overflow: "auto",
        }}
      >
        <div style={{ fontWeight: 700, fontSize: 14 }}>Live Feed</div>
        <div
          style={{ display: "grid", gap: 8, maxHeight: 220, overflow: "auto" }}
        >
          {filteredEvents
            .slice(-50)
            .reverse()
            .map((e) => (
              <div
                key={e.id}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr auto",
                  gap: 8,
                  padding: 10,
                  border: "1px solid #263247",
                  borderRadius: 12,
                  background: theme === "dark" ? "#0f1625" : "#fff",
                }}
              >
                <div style={{ display: "grid", gap: 2, fontSize: 12 }}>
                  <div style={{ fontWeight: 700 }}>
                    {e.sourceCountry} → {e.targetCountry}
                  </div>
                  <div style={{ opacity: 0.8 }}>
                    {e.type} • {e.severity}
                  </div>
                </div>
                <div
                  style={{ textAlign: "right", fontSize: 12, opacity: 0.85 }}
                >
                  {new Date(e.ts).toLocaleTimeString()}
                </div>
              </div>
            ))}
        </div>

        <div style={{ display: "grid", gap: 12 }}>
          <Section title="Top Target Countries">
            {topCountries.map(([k, v]) => (
              <BarRow
                key={k}
                label={k}
                value={v}
                max={topCountries[0]?.[1] || 1}
                theme={theme}
              />
            ))}
          </Section>
          <Section title="Attack Types">
            {topTypes.map(([k, v]) => (
              <BarRow
                key={k}
                label={k}
                value={v}
                max={topTypes[0]?.[1] || 1}
                theme={theme}
              />
            ))}
          </Section>
          <Section title="Severity Mix">
            {topSev.map(([k, v]) => (
              <BarRow
                key={k}
                label={k}
                value={v}
                max={topSev[0]?.[1] || 1}
                theme={theme}
              />
            ))}
          </Section>
        </div>
      </aside>
    </div>
  );
  // ...existing code...
  // Place the main render at the end of the function
}

function StatCard({ label, value, theme }) {
  return (
    <div
      style={{
        minWidth: 120,
        padding: "10px 12px",
        borderRadius: 12,
        border: theme === "dark" ? "1px solid #1a2234" : "1px solid #dbe3f1",
        background:
          theme === "dark" ? "rgba(17,24,39,0.7)" : "rgba(255,255,255,0.9)",
        backdropFilter: "blur(6px)",
      }}
    >
      <div style={{ fontSize: 11, opacity: 0.75 }}>{label}</div>
      <div style={{ fontSize: 22, fontWeight: 800 }}>{value}</div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div>
      <div style={{ fontWeight: 700, fontSize: 13, margin: "8px 0" }}>
        {title}
      </div>
      <div style={{ display: "grid", gap: 6 }}>{children}</div>
    </div>
  );
}

function BarRow({ label, value, max, theme }) {
  const pct = Math.max(3, Math.round((value / (max || 1)) * 100));
  return (
    <div style={{ display: "grid", gap: 6 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: 12,
        }}
      >
        <span>{label}</span>
        <span style={{ opacity: 0.8 }}>{value}</span>
      </div>
      <div
        style={{
          height: 8,
          borderRadius: 999,
          background: theme === "dark" ? "#0b1220" : "#edf2fb",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: pct + "%",
            height: "100%",
            background: theme === "dark" ? "#2563eb" : "#3b82f6",
          }}
        />
      </div>
    </div>
  );
}
