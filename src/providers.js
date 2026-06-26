// Provider detection: map ipinfo's `org` string to a logo. Keyed on AS number
// (the stable part — "AS16509 Amazon.com, Inc.") with a name-regex fallback, since
// the trailing org name varies across ipinfo responses. ASNs verified via RIPEstat.
//
// Note: serverless/edge PaaS (Vercel, Netlify) run on AWS, so ipinfo reports
// "Amazon" and they resolve to the AWS logo — they can't be told apart by ASN.
// iCloud Private Relay egresses via Akamai/Cloudflare/Fastly, so it shows those.
export const PROVIDERS = [
  // ---- hyperscalers ----
  { asns: ["16509", "14618", "7224", "8987"], rx: /\b(amazon|aws)\b/i, logo: "aws.png" },
  { asns: ["8075", "8068", "8069", "12076"], rx: /\b(microsoft|azure)\b/i, logo: "azure.png" },
  { asns: ["396982", "15169"], rx: /google cloud/i, logo: "gcp.svg" }, //          Google Cloud
  { asns: ["31898"], rx: /oracle/i, logo: "oracle_o_logo.png" }, //                 Oracle Cloud (OCI)
  { asns: ["45102", "37963"], rx: /alibaba/i, logo: "alibaba.svg" },
  { asns: ["36351"], rx: /\b(ibm|softlayer)\b/i, logo: "ibm.svg" },
  { asns: ["132203", "45090"], rx: /tencent/i, logo: "tencent.svg" },
  { asns: ["55990", "136907"], rx: /huawei/i, logo: "huawei.svg" },

  // ---- compute / hosting / edge ----
  { asns: ["14061"], rx: /digitalocean/i, logo: "digitalocean.svg" },
  { asns: ["63949"], rx: /linode|akamai connected cloud/i, logo: "linode.svg" },
  { asns: ["24940"], rx: /hetzner/i, logo: "hetzner.svg" },
  { asns: ["16276"], rx: /\bovh\b/i, logo: "ovh.svg" },
  { asns: ["20473"], rx: /vultr|constant company/i, logo: "vultr.svg" },
  { asns: ["54113"], rx: /fastly/i, logo: "fastly.svg" },
  { asns: ["20940", "16625", "32787"], rx: /akamai/i, logo: "akamai.png" },
  { asns: ["13335", "209242"], rx: /cloudflare/i, logo: "cloudflare.png" },
  { asns: [], rx: /vercel/i, logo: "vercel.svg" }, //                              usually masked by AWS ASN

  // ---- home / consumer ISPs ----
  { asns: ["7922"], rx: /comcast|xfinity/i, logo: "xfinity.svg" },
  { asns: ["7018", "7132"], rx: /at&t/i, logo: "att.svg" },
  { asns: ["701", "702", "6167", "22394"], rx: /verizon/i, logo: "verizon.svg" },
  { asns: ["21928"], rx: /t-?mobile/i, logo: "tmobile.svg" },
  { asns: ["20115", "11427", "7843", "10796", "11426", "20001"], rx: /charter|spectrum|time warner/i, logo: "charter.png" },
  { asns: ["22773"], rx: /\bcox\b/i, logo: "cox.svg" },
  { asns: ["209", "3356"], rx: /centurylink|lumen|level ?3|qwest/i, logo: "centurylink.svg" },
  { asns: ["16591"], rx: /google fiber/i, logo: "googlefiber.svg" },

  // ---- enterprise / corporate ----
  { asns: ["3614", "3612", "3613", "3615", "30614", "38057", "46507", "59915", "132711"], rx: /\bdell/i, logo: "dell.svg" },

  // ---- personal easter-eggs (Oracle CloudWorld) ----
  { asns: ["1215"], rx: null, logo: "oracle_corp.png" }, //   Oracle corporate
  { asns: ["27496"], rx: /venetian/i, logo: "venetian.png" }, // CloudWorld venue
  { asns: ["393780"], rx: null, logo: "ocw23.png" },
];

export function getCloudProvider(org = "") {
  const asn = (org.match(/\bAS(\d+)\b/i) || [])[1];
  const byAsn = asn && PROVIDERS.find((p) => p.asns.includes(asn));
  if (byAsn) return byAsn.logo;
  const byName = PROVIDERS.find((p) => p.rx && p.rx.test(org));
  return byName ? byName.logo : "genericcloud.png";
}
