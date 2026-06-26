import { describe, it, expect } from "vitest";
import { getCloudProvider } from "./providers";

describe("getCloudProvider", () => {
  it("matches AWS by AS number", () => {
    expect(getCloudProvider("AS16509 Amazon.com, Inc.")).toBe("aws.png");
    expect(getCloudProvider("AS14618 Amazon.com, Inc.")).toBe("aws.png");
  });

  it("distinguishes Oracle Cloud from Oracle corporate by ASN", () => {
    expect(getCloudProvider("AS31898 Oracle Corporation")).toBe("oracle_o_logo.png");
    expect(getCloudProvider("AS1215 Oracle Corporation")).toBe("oracle_corp.png");
  });

  it("matches the other hyperscalers by ASN", () => {
    expect(getCloudProvider("AS8075 Microsoft Corporation")).toBe("azure.png");
    expect(getCloudProvider("AS396982 Google LLC")).toBe("gcp.svg");
    expect(getCloudProvider("AS15169 Google LLC")).toBe("gcp.svg");
    expect(getCloudProvider("AS45102 Alibaba (US) Technology Co., Ltd.")).toBe("alibaba.svg");
    expect(getCloudProvider("AS36351 IBM Cloud")).toBe("ibm.svg");
    expect(getCloudProvider("AS132203 Tencent")).toBe("tencent.svg");
    expect(getCloudProvider("AS136907 HUAWEI CLOUDS")).toBe("huawei.svg");
  });

  it("matches compute, hosting, and edge providers", () => {
    expect(getCloudProvider("AS14061 DigitalOcean, LLC")).toBe("digitalocean.svg");
    expect(getCloudProvider("AS63949 Akamai Connected Cloud")).toBe("linode.svg");
    expect(getCloudProvider("AS24940 Hetzner Online GmbH")).toBe("hetzner.svg");
    expect(getCloudProvider("AS16276 OVH SAS")).toBe("ovh.svg");
    expect(getCloudProvider("AS20473 The Constant Company, LLC")).toBe("vultr.svg");
    expect(getCloudProvider("AS54113 Fastly, Inc.")).toBe("fastly.svg");
    expect(getCloudProvider("AS16625 Akamai Technologies, Inc.")).toBe("akamai.png");
    expect(getCloudProvider("AS209242 Cloudflare London, LLC")).toBe("cloudflare.png");
  });

  it("matches home / consumer ISPs by ASN", () => {
    expect(getCloudProvider("AS7922 Comcast Cable Communications, LLC")).toBe("xfinity.svg");
    expect(getCloudProvider("AS7018 AT&T Enterprises, LLC")).toBe("att.svg");
    expect(getCloudProvider("AS701 Verizon Business")).toBe("verizon.svg");
    expect(getCloudProvider("AS21928 T-Mobile USA, Inc.")).toBe("tmobile.svg");
    expect(getCloudProvider("AS22773 Cox Communications Inc.")).toBe("cox.svg");
    expect(getCloudProvider("AS16591 Google Fiber Inc.")).toBe("googlefiber.svg");
  });

  it("matches every Charter/Spectrum range, including the primary AS20115", () => {
    for (const a of ["20115", "11427", "7843", "10796", "11426", "20001"]) {
      expect(getCloudProvider(`AS${a} Charter Communications`)).toBe("charter.png");
    }
  });

  it("matches Dell corporate networks by ASN and name", () => {
    expect(getCloudProvider("AS3614 Dell, Inc.")).toBe("dell.svg");
    expect(getCloudProvider("AS30614 Dell, Inc.")).toBe("dell.svg");
    expect(getCloudProvider("AS99999 Dell Technologies")).toBe("dell.svg");
  });

  it("falls back to a name match when the ASN is unknown", () => {
    expect(getCloudProvider("AS99999 Amazon data services")).toBe("aws.png");
    expect(getCloudProvider("AS99999 Google Fiber Inc.")).toBe("googlefiber.svg");
    expect(getCloudProvider("AS99999 Vercel Inc.")).toBe("vercel.svg");
  });

  it("returns the generic logo for unknown or empty input", () => {
    expect(getCloudProvider("AS64500 Some Random ISP")).toBe("genericcloud.png");
    expect(getCloudProvider("")).toBe("genericcloud.png");
    expect(getCloudProvider()).toBe("genericcloud.png");
  });
});
