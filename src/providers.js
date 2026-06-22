// Provider detection: map ipinfo's `org` string to a logo. Keyed on AS number
// (the stable part — "AS16509 Amazon.com, Inc.") with a name fallback, since the
// trailing org name varies across ipinfo responses.
export const PROVIDERS = [
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

export function getCloudProvider(org = "") {
  const asn = (org.match(/\bAS(\d+)\b/i) || [])[1];
  const byAsn = asn && PROVIDERS.find((p) => p.asns.includes(asn));
  if (byAsn) return byAsn.logo;
  const byName = PROVIDERS.find((p) => p.rx && p.rx.test(org));
  return byName ? byName.logo : "genericcloud.png";
}
