import { describe, it, expect } from "vitest";
import * as mod from "../../core/utils/languageColors"

const getLanguageColor: (lang?: string | null) => string =
(mod as any).getLanguageColor ??
(mod as any).default ??
(mod as any).languageColor ??
(mod as any).colorForLanguage;

describe("languageColors", () => {
    it("returns mapped color for exact-cased known languages (e.g., TypeScript)", () => {
        const ts = getLanguageColor("TypeScript");
        expect(ts).toBe("#3178c6");
    });

    it ("returns a deterministic hashed color for unknown or case-mismatched language", () => {
        const a = getLanguageColor("typescript");
        const b = getLanguageColor("typescript");
        expect(a).toBe(b);
        expect(b).toMatch(/^hsl\(/);
    });

    it("returns theme fallback for empty/undefined language", () => {
        const empty = getLanguageColor("");
        const undef = getLanguageColor(undefined);
        expect(empty).toBe(undef);
        expect(empty).toMatch(/^var\(--/);
    })
});