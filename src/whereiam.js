import React, { useState, useEffect } from "react";

export default function WhereIAm() {
  const [ipInfo, setIpInfo] = useState({});

  useEffect(() => {
    const fetchIpInfo = async () => {
      try {
        const response = await fetch("ipinfo.json");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        setIpInfo(result);
      } catch (err) {
        console.error("Fetch Error:", err);
      }
    };
    fetchIpInfo();
  }, []);

  const getCloudProvider = (org) => {
    const providers = {
      "AS31898 Oracle Corporation": "oracle_o_logo.png",
      "AS8075 Microsoft Corporation": "azure.png",
      "ASXX aws": "aws.png",
      "AS20940 Akamai International B.V.": "akamai.png",
      "AS27496 VENETIAN CASINO RESORT, LLC": "venetian.png",
      "AS13335 Cloudflare, Inc.": "cloudflare.png",
      "AS11427 Charter Communications Inc": "charter.png",
      "AS393780 Hyper Networks LLC": "ocw23.png",
      "AS1215 Oracle Corporation": "oracle_corp.png",
    };
    return providers[org] || "genericcloud.png";
  };

  return (
    <div className="card mb-4">
      <div className="info box pulse">
        <h3 className="card-title text-info">Provider: {ipInfo.org}</h3>
        <p>City: {ipInfo.city} / Region: {ipInfo.region}</p>
        <p className="card-text">Service IP: {ipInfo.ip}</p>
        <p className="card-text">Service Host: {ipInfo.hostname}</p>
      </div>
      <div className="cloudlogo">
        <img src={getCloudProvider(ipInfo.org)} alt="Cloud Provider Logo" height="100" />
      </div>
    </div>
  );
}
