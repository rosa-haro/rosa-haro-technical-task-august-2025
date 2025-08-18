import { timeAgo } from "../../core/utils/time";

const isoMsAgo = (ms: number) => new Date(Date.now() - ms).toISOString();

describe("timeAgo", () => {
  it("returns 'just now' for < 60 seconds", () => {
    const iso = isoMsAgo(10_000);
    expect(timeAgo(iso)).toBe("just now");
  });

  it("formats minutes correctly", () => {
    expect(timeAgo(isoMsAgo(60_000))).toBe("1 minute ago");
    expect(timeAgo(isoMsAgo(5 * 60_000))).toBe("5 minutes ago");
  });

  it("formats hours correctly", () => {
    expect(timeAgo(isoMsAgo(24 * 60 * 60_000))).toBe("1 day ago");
    expect(timeAgo(isoMsAgo(3 * 24 * 60 * 60_000))).toBe("3 days ago");
  }),
    it("returns 'just now' for future dates", () => {
      const futureIso = new Date(Date.now() + 5 * 60_000).toISOString();
      expect(timeAgo(futureIso)).toBe("just now");
    });
});
