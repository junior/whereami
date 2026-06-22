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

  it("matches Azure, Cloudflare, and Akamai", () => {
    expect(getCloudProvider("AS8075 Microsoft Corporation")).toBe("azure.png");
    expect(getCloudProvider("AS13335 Cloudflare, Inc.")).toBe("cloudflare.png");
    expect(getCloudProvider("AS20940 Akamai International B.V.")).toBe("akamai.png");
  });

  it("falls back to a name match when the ASN is unknown", () => {
    expect(getCloudProvider("AS99999 Amazon data services")).toBe("aws.png");
  });

  it("returns the generic logo for unknown or empty input", () => {
    expect(getCloudProvider("AS16591 Google Fiber Inc.")).toBe("genericcloud.png");
    expect(getCloudProvider("")).toBe("genericcloud.png");
    expect(getCloudProvider()).toBe("genericcloud.png");
  });
});
