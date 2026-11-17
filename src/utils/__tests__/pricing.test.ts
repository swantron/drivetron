import { FREE_FOREVER_BEFORE, FREE_MINUTES, freeMinutesLeft, needsUnlock } from "@/lib/pricing";

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

describe("freeMinutesLeft", () => {
  const newFamily = { createdAt: FREE_FOREVER_BEFORE + 1 };
  const none = new Set<string>();

  it("counts down to zero and stays there", () => {
    expect(freeMinutesLeft(newFamily, "a", 0, none, true)).toBe(FREE_MINUTES);
    expect(freeMinutesLeft(newFamily, "a", FREE_MINUTES - 90, none, true)).toBe(90);
    expect(freeMinutesLeft(newFamily, "a", FREE_MINUTES + 30, none, true)).toBe(0);
  });

  it("is null when the paywall doesn't apply to this learner", () => {
    expect(freeMinutesLeft(newFamily, "a", 0, new Set(["a"]), true)).toBeNull();
    expect(freeMinutesLeft({ createdAt: FREE_FOREVER_BEFORE - 1 }, "a", 0, none, true)).toBeNull();
    expect(freeMinutesLeft(newFamily, "a", 0, none, false)).toBeNull();
  });
});
