import { useEffect, useRef, useState } from "react";
import Globe from "react-globe.gl";
import axios from "axios";

export default function App() {
  const globeEl = useRef();
  const [attacks, setAttacks] = useState([]);

  // Poll backend every 3 seconds
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("http://127.0.0.1:8000/events/latest");
        setAttacks(res.data);
      } catch (err) {
        console.error("Error fetching attacks:", err);
      }
    };

    fetchData(); // initial fetch
    const interval = setInterval(fetchData, 3000); // repeat every 3s
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ width: "100vw", height: "100vh", backgroundColor: "#111" }}>
      <Globe
        ref={globeEl}
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-dark.jpg"
        backgroundColor="black"
        pointsData={attacks}
        pointLat={(d) => d.lat}
        pointLng={(d) => d.lon}
        pointColor={() => "red"}
        pointAltitude={(d) => Math.min(0.02 + d.requests * 0.0001, 0.1)}
        pointRadius={0.4}
      />
    </div>
  );
}
