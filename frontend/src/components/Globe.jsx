import React, { useEffect, useRef } from "react";
import Globe from "react-globe.gl";

const GlobeComponent = ({ attacks }) => {
  const globeRef = useRef();

  useEffect(() => {
    globeRef.current.pointOfView({ lat: 20, lng: 0, altitude: 2 }, 0);
  }, []);

  return (
    <Globe
      ref={globeRef}
      globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
      backgroundColor="#0a0a0a"
      pointsData={attacks}
      pointLat={(d) => d.lat}
      pointLng={(d) => d.lon}
      pointColor={(d) =>
        d.level === "low" ? "lime" : d.level === "medium" ? "orange" : "red"
      }
      pointAltitude={(d) => 0.01 + d.score * 0.0005}
      pointRadius={0.2}
      pointsMerge={true}
      animateIn={true}
    />
  );
};

export default GlobeComponent;
