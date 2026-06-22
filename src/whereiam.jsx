import { useState, useEffect } from "react";

// Match by AS number first (robust to ipinfo's varying org strings), then fall back to a
// name match. ipinfo's `org` looks like "AS16509 Amazon.com, Inc." — the ASN is the stable
// part; the trailing name varies, so exact-string equality on the whole thing is fragile.
const PROVIDERS = [
  { asns: ["16509", "14618", "7224", "8987"], rx: /\b(amazon|aws)\b/i, logo: "aws.png" },
  { asns: ["8075"], rx: /\b(microsoft|azure)\b/i, logo: "azure.png" },
  { asns: ["31898"], rx: /oracle/i, logo: "oracle_o_logo.png" }, // Oracle Cloud (OCI)
  { asns: ["1215"], rx: null, logo: "oracle_corp.png" }, //         Oracle corporate
  { asns: ["20940"], rx: /akamai/i, logo: "akamai.png" },
  { asns: ["13335"], rx: /cloudflare/i, logo: "cloudflare.png" },
  { asns: ["11427"], rx: /\b(charter|spectrum)\b/i, logo: "charter.png" },
  { asns: ["27496"], rx: /venetian/i, logo: "venetian.png" }, //   Oracle CloudWorld venue
  { asns: ["393780"], rx: null, logo: "ocw23.png" },
];

function getCloudProvider(org = "") {
  const asn = (org.match(/\bAS(\d+)\b/i) || [])[1];
  const byAsn = asn && PROVIDERS.find((p) => p.asns.includes(asn));
  if (byAsn) return byAsn.logo;
  const byName = PROVIDERS.find((p) => p.rx && p.rx.test(org));
  return byName ? byName.logo : "genericcloud.png";
}

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

  if (error) {
    return (
      <div className="card mb-4">
        <div className="info box pulse">
          <h3 className="card-title">Could not determine location</h3>
          <p>The IP lookup is unavailable right now.</p>
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
        <img src={getCloudProvider(ipInfo.org)} alt="Cloud provider logo" height="100" />
      </div>
    </div>
  );
}
