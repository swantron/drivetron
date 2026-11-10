import type { Family } from "@/types";
import { defaultVehicleId, driveLearnerId, learnersOf, PRIMARY_LEARNER, vehiclesOf } from "../learners";

const base: Family = {
  id: "f",
  ownerUid: "u",
  memberUids: ["u"],
  members: {},
  inviteCode: "ABCD2345",
  createdAt: 0,
};

describe("learnersOf", () => {
  it("reads a legacy single-learner family as the primary learner", () => {
    const f = { ...base, learnerName: "Ada Lovelace", learnerDob: "2011-01-01", permitDate: "2026-10-01" };
    expect(learnersOf(f)).toEqual([{ id: PRIMARY_LEARNER, name: "Ada Lovelace", dob: "2011-01-01", permitDate: "2026-10-01" }]);
  });

  it("prefers the learners map and puts the primary learner first", () => {
    const f = {
      ...base,
      learnerName: "Stale",
      learners: {
        x1: { name: "Aaron", dob: "2012-01-01", permitDate: "2027-06-01" },
        [PRIMARY_LEARNER]: { name: "Zoe", dob: "2011-01-01", permitDate: "2026-10-01" },
      },
    };
    expect(learnersOf(f).map((l) => l.name)).toEqual(["Zoe", "Aaron"]);
  });

  it("is empty for a family with no learner yet", () => {
    expect(learnersOf(base)).toEqual([]);
  });
});

describe("vehiclesOf", () => {
  it("sorts by name", () => {
    const f = { ...base, vehicles: { a: { name: "Tacoma" }, b: { name: "Outback" } } };
    expect(vehiclesOf(f).map((v) => v.id)).toEqual(["b", "a"]);
  });
});

it("treats drives without a learnerId as the primary learner's", () => {
  expect(driveLearnerId({})).toBe(PRIMARY_LEARNER);
  expect(driveLearnerId({ learnerId: "x1" })).toBe("x1");
});

describe("defaultVehicleId", () => {
  const vehicles = [{ id: "b", name: "Outback" }, { id: "a", name: "Tacoma" }];
  it("uses the most recent drive's vehicle", () => {
    expect(defaultVehicleId([{ vehicleId: "a" }, { vehicleId: "b" }] as never, vehicles)).toBe("a");
  });
  it("skips vehicles that were removed", () => {
    expect(defaultVehicleId([{ vehicleId: "gone" }, { vehicleId: "a" }] as never, vehicles)).toBe("a");
  });
  it("falls back to the first vehicle, or none", () => {
    expect(defaultVehicleId([], vehicles)).toBe("b");
    expect(defaultVehicleId([], [])).toBeNull();
  });
});
