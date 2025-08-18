import { expect } from "vitest";
import { normalizeUrl } from "../../core/utils/url";

describe("normalizeUrl", () => {
  it("returns null for empty/whitespace/undefined/null", () => {
    expect(normalizeUrl("")).toBeNull();
    expect(normalizeUrl("  ")).toBeNull();
    expect(normalizeUrl(undefined)).toBeNull();
    expect(normalizeUrl(null)).toBeNull();
  });

  it("adds https:// when missing", () => {
    expect(normalizeUrl("github.com/rosa-haro")).toBe(
      "https://github.com/rosa-haro"
    );
    expect(normalizeUrl("example.org")).toBe("https://example.org");
  });

  it("preserves existing http/https (case-insensitive)", () => {
    expect(normalizeUrl("https://github.com")).toBe("https://github.com");
    expect(normalizeUrl("http://example.org")).toBe("http://example.org");
    expect(normalizeUrl("HTTP://EXAMPLE.example")).toBe(
      "HTTP://EXAMPLE.example"
    );
  });

  it("trims surrounding whitespace before processing", () => {
    expect(normalizeUrl("  example.com  ")).toBe("https://example.com");
    expect(normalizeUrl("  https://demo.com  ")).toBe("https://demo.com");
  });
});
