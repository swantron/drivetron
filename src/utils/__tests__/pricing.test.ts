import { FREE_FOREVER_BEFORE, FREE_MINUTES, needsUnlock } from "@/lib/pricing";

describe("needsUnlock", () => {
  const newFamily = { createdAt: FREE_FOREVER_BEFORE + 1 };
  const none = new Set<string>();

  it("is free up to the free hours, then asks for the unlock", () => {
    expect(needsUnlock(newFamily, "a", FREE_MINUTES - 1, none, true)).toBe(false);
    expect(needsUnlock(newFamily, "a", FREE_MINUTES, none, true)).toBe(true);
  });

  it("counts per learner: one paid learner doesn't unlock a sibling", () => {
    const paid = new Set(["a"]);
    expect(needsUnlock(newFamily, "a", 3000, paid, true)).toBe(false);
    expect(needsUnlock(newFamily, "b", 3000, paid, true)).toBe(true);
  });

  it("never charges logs from before launch, or while payments are off", () => {
    expect(needsUnlock({ createdAt: FREE_FOREVER_BEFORE - 1 }, "a", 3000, none, true)).toBe(false);
    expect(needsUnlock(newFamily, "a", 3000, none, false)).toBe(false);
  });
});
