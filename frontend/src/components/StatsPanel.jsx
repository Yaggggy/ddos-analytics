import React from "react";

const StatsPanel = ({ stats }) => {
  return (
    <div style={{ color: "white", padding: "1rem" }}>
      <h2>Global DDoS Stats</h2>
      <p>Total Incidents: {stats?.total}</p>
      <h3>Top Countries</h3>
      <ul>
        {stats?.by_country?.map((c) => (
          <li key={c.country}>
            {c.country}: {c.count}
          </li>
        ))}
      </ul>
      <h3>Top IPs</h3>
      <ul>
        {stats?.top_ips?.map((ip) => (
          <li key={ip.ip}>
            {ip.ip}: {ip.max_score}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default StatsPanel;
