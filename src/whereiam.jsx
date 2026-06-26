import { useState, useEffect } from "react";
import { getCloudProvider } from "./providers";

export default function WhereIAm() {
  const [ipInfo, setIpInfo] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch("ipinfo.json")
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(setIpInfo)
      .catch((err) => {
        console.error("Fetch Error:", err);
        setError(true);
      });
  }, []);

  const failure = error || (ipInfo && ipInfo.error);
  if (failure) {
    const detail =
      (ipInfo && ipInfo.error) || "The IP lookup is unavailable right now.";
    return (
      <div className="card mb-4">
        <div className="info box pulse">
          <h3 className="card-title">Could not determine location</h3>
          <p>{detail}</p>
        </div>
      </div>
    );
  }

  if (!ipInfo) {
    return (
      <div className="card mb-4">
        <div className="info box pulse">
          <h3 className="card-title">Detecting…</h3>
        </div>
      </div>
    );
  }

  return (
    <div className="card mb-4">
      <div className="info box pulse">
        <h3 className="card-title text-info">Provider: {ipInfo.org}</h3>
        <p>
          City: {ipInfo.city} / Region: {ipInfo.region}
        </p>
        <p className="card-text">Service IP: {ipInfo.ip}</p>
        <p className="card-text">Service Host: {ipInfo.hostname}</p>
      </div>
      <div className="cloudlogo">
        <img src={getCloudProvider(ipInfo.org)} alt="Cloud provider logo" />
      </div>
    </div>
  );
}
