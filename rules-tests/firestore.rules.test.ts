import { readFileSync } from "node:fs";
import {
  assertFails,
  assertSucceeds,
  initializeTestEnvironment,
  type RulesTestEnvironment,
} from "@firebase/rules-unit-testing";
import { arrayUnion, doc, getDoc, getDocs, collection, setDoc, updateDoc, writeBatch, deleteDoc } from "firebase/firestore";

let env: RulesTestEnvironment;

const CODE = "ABCD2345";
const member = (name: string, role = "supervisor") => ({ name, initials: name.slice(0, 2).toUpperCase(), role });

const family = {
  learnerName: "Teen Driver",
  learnerDob: "2011-03-04",
  permitDate: "2026-11-01",
  ownerUid: "parent",
  memberUids: ["parent"],
  members: { parent: member("Parent") },
  inviteCode: CODE,
  createdAt: 1,
};

const drive = (by: string) => ({
  startedAt: 1_700_000_000_000,
  endedAt: 1_700_003_600_000,
  dayMinutes: 45,
  nightMinutes: 15,
  supervisorUid: "parent",
  supervisorName: "Parent",
  supervisorInitials: "PA",
  conditions: ["Snow"],
  skills: ["Merging"],
  notes: "",
  lat: 46.5,
  lng: -112,
  manual: false,
  createdBy: by,
  updatedAt: 1,
});

const db = (uid?: string) => (uid ? env.authenticatedContext(uid).firestore() : env.unauthenticatedContext().firestore());

beforeAll(async () => {
  env = await initializeTestEnvironment({
    projectId: "demo-drivetron",
    firestore: { rules: readFileSync("firestore.rules", "utf8"), host: "127.0.0.1", port: 8080 },
  });
});
afterAll(() => env.cleanup());

beforeEach(async () => {
  await env.clearFirestore();
  await env.withSecurityRulesDisabled(async (ctx) => {
    const fs = ctx.firestore();
    await setDoc(doc(fs, "families/f1"), family);
    await setDoc(doc(fs, "invites", CODE), { familyId: "f1" });
    await setDoc(doc(fs, "families/f1/drives/d1"), drive("parent"));
  });
});

describe("creating a family", () => {
  it("lets a user create a family with an invite in one batch", async () => {
    const fs = db("newparent");
    const b = writeBatch(fs);
    b.set(doc(fs, "families/f2"), { ...family, ownerUid: "newparent", memberUids: ["newparent"], members: { newparent: member("New") }, inviteCode: "ZZZZ2345" });
    b.set(doc(fs, "invites/ZZZZ2345"), { familyId: "f2" });
    await assertSucceeds(b.commit());
  });

  it("rejects adding other people at creation", async () => {
    await assertFails(setDoc(doc(db("x"), "families/f3"), { ...family, ownerUid: "x", memberUids: ["x", "victim"], members: { x: member("X") } }));
  });

  it("rejects an invite pointing at someone else's family", async () => {
    await assertFails(setDoc(doc(db("stranger"), "invites/QQQQ2345"), { familyId: "f1" }));
  });
});

describe("reading", () => {
  it("lets members read the family and drives", async () => {
    await assertSucceeds(getDoc(doc(db("parent"), "families/f1")));
    await assertSucceeds(getDocs(collection(db("parent"), "families/f1/drives")));
  });

  it("blocks strangers and signed-out users", async () => {
    await assertFails(getDoc(doc(db("stranger"), "families/f1")));
    await assertFails(getDocs(collection(db("stranger"), "families/f1/drives")));
    await assertFails(getDoc(doc(db(), "families/f1")));
  });

  it("allows looking up an invite by code but not listing them", async () => {
    await assertSucceeds(getDoc(doc(db("stranger"), "invites", CODE)));
    await assertFails(getDocs(collection(db("stranger"), "invites")));
  });
});

describe("joining (request + owner approval)", () => {
  const req = (role = "learner", code = CODE) => ({ name: "Teen", initials: "TE", role, code, createdAt: 1 });
  const reqPath = "families/f1/joinRequests/teen";

  it("no longer lets anyone add themselves directly", async () => {
    await assertFails(
      updateDoc(doc(db("teen"), "families/f1"), { memberUids: arrayUnion("teen"), "members.teen": member("Teen", "learner"), joinCode: CODE })
    );
  });

  it("lets someone with the code file a request and read only their own", async () => {
    await assertSucceeds(setDoc(doc(db("teen"), reqPath), req()));
    await assertSucceeds(getDoc(doc(db("teen"), reqPath)));
    await assertFails(getDoc(doc(db("teen"), "families/f1")));
    await assertFails(getDocs(collection(db("teen"), "families/f1/joinRequests")));
  });

  it("rejects a request with the wrong code or for someone else", async () => {
    await assertFails(setDoc(doc(db("teen"), reqPath), req("learner", "WRONG234")));
    await assertFails(setDoc(doc(db("mallory"), reqPath), req()));
  });

  it("lets the owner see requests and approve one, choosing the role", async () => {
    await setDoc(doc(db("teen"), reqPath), req("supervisor"));
    await assertSucceeds(getDocs(collection(db("parent"), "families/f1/joinRequests")));
    const fs = db("parent");
    const b = writeBatch(fs);
    b.update(doc(fs, "families/f1"), {
      memberUids: arrayUnion("teen"),
      "members.teen": member("Teen", "learner"),
      approvedUid: "teen",
    });
    b.delete(doc(fs, reqPath));
    await assertSucceeds(b.commit());
    await assertSucceeds(getDoc(doc(db("teen"), "families/f1")));
  });

  it("stops the owner adding an account that never asked to join", async () => {
    await assertFails(
      updateDoc(doc(db("parent"), "families/f1"), { memberUids: arrayUnion("victim"), "members.victim": member("V"), approvedUid: "victim" })
    );
  });

  it("stops the owner adding two people under one request", async () => {
    await setDoc(doc(db("teen"), reqPath), req());
    await assertFails(
      updateDoc(doc(db("parent"), "families/f1"), { memberUids: arrayUnion("teen", "victim"), approvedUid: "teen" })
    );
  });

  it("lets the requester withdraw and the owner decline", async () => {
    await setDoc(doc(db("teen"), reqPath), req());
    await assertSucceeds(deleteDoc(doc(db("teen"), reqPath)));
    await setDoc(doc(db("teen"), reqPath), req());
    await assertSucceeds(deleteDoc(doc(db("parent"), reqPath)));
  });
});

describe("member edits", () => {
  beforeEach(async () => {
    await env.withSecurityRulesDisabled((ctx) =>
      updateDoc(doc(ctx.firestore(), "families/f1"), { memberUids: ["parent", "teen"], "members.teen": member("Teen", "learner") })
    );
  });

  it("lets a learner edit their own entry and vehicles, but not learner details", async () => {
    await assertSucceeds(updateDoc(doc(db("teen"), "families/f1"), { "members.teen.name": "Teenie", "vehicles.v9": { name: "Civic" } }));
    await assertFails(updateDoc(doc(db("teen"), "families/f1"), { permitDate: "2026-01-01" }));
    await assertFails(updateDoc(doc(db("teen"), "families/f1"), { "learners.primary": { name: "T", dob: "2011-03-04", permitDate: "2026-01-01" } }));
  });

  it("lets a supervisor who isn't the owner edit learner details", async () => {
    await env.withSecurityRulesDisabled((ctx) =>
      updateDoc(doc(ctx.firestore(), "families/f1"), { memberUids: ["parent", "teen", "mom"], "members.mom": member("Mom") })
    );
    await assertSucceeds(updateDoc(doc(db("mom"), "families/f1"), { learnerName: "Teen D." }));
  });

  it("stops a non-owner from removing people or changing the code", async () => {
    await assertFails(updateDoc(doc(db("teen"), "families/f1"), { memberUids: ["teen"] }));
    await assertFails(updateDoc(doc(db("teen"), "families/f1"), { inviteCode: "MINE2345" }));
    await assertFails(updateDoc(doc(db("teen"), "families/f1"), { "members.parent.name": "Someone" }));
  });

  it("stops a member changing their own role", async () => {
    await assertFails(updateDoc(doc(db("teen"), "families/f1"), { "members.teen.role": "supervisor" }));
  });

  it("lets a non-owner leave, and only remove themselves", async () => {
    await assertFails(updateDoc(doc(db("teen"), "families/f1"), { memberUids: [], members: {} }));
    await assertSucceeds(updateDoc(doc(db("teen"), "families/f1"), { memberUids: ["parent"], members: { parent: member("Parent") } }));
  });

  it("lets the owner remove a member", async () => {
    await assertSucceeds(updateDoc(doc(db("parent"), "families/f1"), { memberUids: ["parent"], members: { parent: member("Parent") } }));
  });

  it("only lets the owner delete the family", async () => {
    await assertFails(deleteDoc(doc(db("teen"), "families/f1")));
    await assertSucceeds(deleteDoc(doc(db("parent"), "families/f1")));
  });
});

describe("learners and vehicles", () => {
  it("lets a member migrate to the learners map and add a sibling and a car", async () => {
    await assertSucceeds(
      updateDoc(doc(db("parent"), "families/f1"), {
        learners: {
          primary: { name: "Teen Driver", dob: "2011-03-04", permitDate: "2026-11-01" },
          kid2: { name: "Younger Sib", dob: "2013-05-06", permitDate: "2028-05-06" },
        },
        "vehicles.v1": { name: "Outback" },
      })
    );
  });

  it("accepts a new family that only has the learners map", async () => {
    const fs = db("p2");
    const { learnerName: _n, learnerDob: _d, permitDate: _p, ...rest } = family;
    void _n; void _d; void _p;
    const b = writeBatch(fs);
    b.set(doc(fs, "families/f9"), {
      ...rest,
      ownerUid: "p2",
      memberUids: ["p2"],
      members: { p2: member("P2") },
      inviteCode: "NEWW2345",
      learners: { primary: { name: "Kid", dob: "2011-01-01", permitDate: "2026-11-01" } },
    });
    b.set(doc(fs, "invites/NEWW2345"), { familyId: "f9" });
    await assertSucceeds(b.commit());
  });

  it("rejects a bad legacy date and an oversized garage", async () => {
    await assertFails(updateDoc(doc(db("parent"), "families/f1"), { permitDate: "soon" }));
    const many = Object.fromEntries(Array.from({ length: 21 }, (_, i) => [`v${i}`, { name: `Car ${i}` }]));
    await assertFails(updateDoc(doc(db("parent"), "families/f1"), { vehicles: many }));
  });

  it("accepts drives with a learner and vehicle, and legacy drives without", async () => {
    const fs = db("parent");
    await assertSucceeds(setDoc(doc(fs, "families/f1/drives/n1"), { ...drive("parent"), learnerId: "kid2", vehicleId: "v1", vehicleName: "Outback" }));
    await assertSucceeds(setDoc(doc(fs, "families/f1/drives/n2"), { ...drive("parent"), vehicleId: null, vehicleName: null }));
    await assertFails(setDoc(doc(fs, "families/f1/drives/n3"), { ...drive("parent"), learnerId: 7 }));
  });
});

describe("drives: learner restrictions", () => {
  beforeEach(async () => {
    await env.withSecurityRulesDisabled(async (ctx) => {
      const fs = ctx.firestore();
      await updateDoc(doc(fs, "families/f1"), { memberUids: ["parent", "teen"], "members.teen": member("Teen", "learner") });
      await setDoc(doc(fs, "families/f1/drives/teenLive"), { ...drive("teen"), endedAt: null, dayMinutes: 0, nightMinutes: 0 });
      await setDoc(doc(fs, "families/f1/drives/teenDone"), drive("teen"));
    });
  });
  const fsT = () => db("teen");

  it("lets a learner start a live timer but not type in a past drive", async () => {
    await assertSucceeds(setDoc(doc(fsT(), "families/f1/drives/n1"), { ...drive("teen"), endedAt: null, dayMinutes: 0, nightMinutes: 0 }));
    await assertFails(setDoc(doc(fsT(), "families/f1/drives/n2"), { ...drive("teen"), manual: true }));
    await assertFails(setDoc(doc(fsT(), "families/f1/drives/n3"), drive("teen")));
  });

  it("lets a learner stop and tag their own drive", async () => {
    await assertSucceeds(updateDoc(doc(fsT(), "families/f1/drives/teenLive"), { endedAt: 1_700_003_600_000, dayMinutes: 45, nightMinutes: 15, updatedAt: 2 }));
    await assertSucceeds(updateDoc(doc(fsT(), "families/f1/drives/teenDone"), { notes: "merged onto I-90", skills: ["Merging"], updatedAt: 2 }));
  });

  it("stops a learner changing a finished drive's times, even flagged", async () => {
    await assertFails(updateDoc(doc(fsT(), "families/f1/drives/teenDone"), { endedAt: 1_700_009_000_000, dayMinutes: 120, updatedAt: 2 }));
    await assertFails(updateDoc(doc(fsT(), "families/f1/drives/teenDone"), { endedAt: 1_700_009_000_000, dayMinutes: 120, timesEdited: true, updatedAt: 2 }));
  });

  it("stops a learner editing or deleting a parent's drive", async () => {
    await assertFails(updateDoc(doc(fsT(), "families/f1/drives/d1"), { notes: "x", updatedAt: 2 }));
    await assertFails(deleteDoc(doc(fsT(), "families/f1/drives/d1")));
    await assertFails(deleteDoc(doc(fsT(), "families/f1/drives/teenDone")));
  });

  it("lets a learner stop a timer a parent started, but not discard it", async () => {
    await env.withSecurityRulesDisabled((ctx) =>
      setDoc(doc(ctx.firestore(), "families/f1/drives/parentLive"), { ...drive("parent"), endedAt: null, dayMinutes: 0, nightMinutes: 0 })
    );
    await assertFails(deleteDoc(doc(fsT(), "families/f1/drives/parentLive")));
    await assertSucceeds(updateDoc(doc(fsT(), "families/f1/drives/parentLive"), { endedAt: 1_700_003_600_000, dayMinutes: 60, nightMinutes: 0, updatedAt: 2 }));
  });

  it("lets a learner discard their own running timer", async () => {
    await assertSucceeds(deleteDoc(doc(fsT(), "families/f1/drives/teenLive")));
  });

  it("rejects more minutes than the drive lasted", async () => {
    await assertFails(updateDoc(doc(fsT(), "families/f1/drives/teenLive"), { endedAt: 1_700_003_600_000, dayMinutes: 300, nightMinutes: 0, updatedAt: 2 }));
  });
});

describe("drives: edit audit", () => {
  it("requires the edited flag when a supervisor changes a finished drive's times", async () => {
    const fs = db("parent");
    await assertFails(updateDoc(doc(fs, "families/f1/drives/d1"), { endedAt: 1_700_007_200_000, dayMinutes: 105, updatedAt: 2 }));
    await assertSucceeds(updateDoc(doc(fs, "families/f1/drives/d1"), { endedAt: 1_700_007_200_000, dayMinutes: 105, timesEdited: true, updatedAt: 2 }));
  });

  it("never lets the flag be cleared", async () => {
    const fs = db("parent");
    await updateDoc(doc(fs, "families/f1/drives/d1"), { endedAt: 1_700_007_200_000, dayMinutes: 105, timesEdited: true, updatedAt: 2 });
    await assertFails(updateDoc(doc(fs, "families/f1/drives/d1"), { timesEdited: false, updatedAt: 3 }));
  });

  it("doesn't flag tag or note edits", async () => {
    await assertSucceeds(updateDoc(doc(db("parent"), "families/f1/drives/d1"), { notes: "rain", updatedAt: 2 }));
  });
});

describe("drives", () => {
  it("lets a member log, edit and delete drives", async () => {
    await assertSucceeds(setDoc(doc(db("parent"), "families/f1/drives/d2"), drive("parent")));
    await assertSucceeds(updateDoc(doc(db("parent"), "families/f1/drives/d1"), { notes: "Icy on Main St", updatedAt: 2 }));
    await assertSucceeds(deleteDoc(doc(db("parent"), "families/f1/drives/d1")));
  });

  it("accepts an in-progress drive", async () => {
    await assertSucceeds(setDoc(doc(db("parent"), "families/f1/drives/live"), { ...drive("parent"), endedAt: null, dayMinutes: 0, nightMinutes: 0 }));
  });

  it("blocks strangers", async () => {
    await assertFails(setDoc(doc(db("stranger"), "families/f1/drives/d2"), drive("stranger")));
    await assertFails(deleteDoc(doc(db("stranger"), "families/f1/drives/d1")));
  });

  it("rejects malformed drives", async () => {
    const fs = db("parent");
    await assertFails(setDoc(doc(fs, "families/f1/drives/a"), { ...drive("parent"), endedAt: 1 }));
    await assertFails(setDoc(doc(fs, "families/f1/drives/b"), { ...drive("parent"), dayMinutes: 2000 }));
    await assertFails(setDoc(doc(fs, "families/f1/drives/c"), { ...drive("parent"), extra: true }));
    await assertFails(setDoc(doc(fs, "families/f1/drives/e"), drive("someoneelse")));
  });
});
