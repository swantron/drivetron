# Drivetron

Supervised driving log for Montana learner drivers, served at **drive.mt.services**.

Montana's GDL learner stage requires holding the learner license for 6 months and logging
50 supervised hours, 10 of them at night (MCA 61-5-132). The parent certifies this on MVD form
21-1600, and the examiner may ask to see the log. The state points families at two separate
apps (one for iOS, one for Android); this is one log the whole family shares from any phone.

Not affiliated with the State of Montana, MVD, or OPI.

## What it does

- **One-tap drive timer.** Stored as a start timestamp in Firestore, so it survives a locked phone
  and shows on every family member's device.
- **Automatic day/night split.** Sunset to sunrise at the drive's location, computed on-device with
  `suncalc` from one coarse GPS fix (rounded to ~1 km).
- **Progress toward Montana's numbers.** Total and night hours, days left on the 6-month hold, pace,
  and a projected test-ready date, with a warning if that's after the learner license expires.
- **Conditions and skills tags,** with a "not practiced yet" list.
- **Past drives** can be entered by hand and any drive edited (including a forgotten timer).
- **Printable log** laid out like the OPI practice driving log (Date / Conditions & Skills / Time /
  Initials, total, signature lines), plus a night column and the 21-1600 details.
- **Family sharing** via invite code: parents, other authorized adults, and the learners.
- **Multiple learners** (siblings) in one family log, each with their own permit date, progress, timer,
  and printable log. Each device remembers which learner it's showing.
- **Vehicles**: a family garage. Each drive records the car, defaulting to the one that learner used last.
- **Offline.** An installable PWA with Firestore's persistent cache.

## Stack

Next.js 15 static export, Tailwind 4, Firebase Auth (Google) and Firestore, Serwist PWA.
Hosted as a second Firebase Hosting site in the `mt-services-swantron` project. The mt.services
landing page is untouched.

## Commands

- `npm run dev`: dev server
- `npm run build`: static export to `out/`
- `npm test`: unit tests (night split, progress math)
- `npm run test:rules`: Firestore rules tests against the emulator (needs Java)
- `npm run lint`

Local end-to-end against emulators:

```sh
firebase emulators:start --only auth,firestore --project demo-drivetron
NEXT_PUBLIC_FIREBASE_EMULATORS=1 NEXT_PUBLIC_FIREBASE_PROJECT_ID=demo-drivetron \
  NEXT_PUBLIC_FIREBASE_API_KEY=fake NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=localhost npm run dev
# In the browser console: await __devSignIn("parent@test.dev", "Pat Parent")
```

## Data

```
families/{familyId}            learners{id: name/dob/permitDate}, vehicles{id: name}, memberUids,
                               members{uid: name/initials/role}, inviteCode
families/{familyId}/drives/{id} learnerId, vehicleId/vehicleName, startedAt, endedAt (null = timer running),
                               dayMinutes, nightMinutes, supervisor, tags, notes
invites/{code}                 { familyId }  (get-only lookup for joining)
```

All access control is in `firestore.rules`, with emulator tests in `rules-tests/`. The trust model:

- **Joining is approved.** An invite code only lets someone file a request (`families/{id}/joinRequests/{uid}`).
  The owner approves it and sets the role. An owner can only add an account that has a pending
  request, so nobody can push a family onto a stranger's account.
- **Roles are owner-controlled.** Members edit their own name and initials but not their role.
- **Learners can't pad hours.** They can time drives live and tag them, but can't enter past drives,
  change a finished drive's times, edit or delete drives a parent logged, or change license dates.
- **Edits are visible.** Changing a finished drive's times sets a permanent `timesEdited` flag, and
  the printed log marks those drives (*) along with hand-entered ones (†).

Families created before multi-learner support stored one learner in top-level `learnerName` /
`learnerDob` / `permitDate`. On load these are copied into `learners.primary`, and the old fields
are kept so copies still running the old version keep working. Drives without a `learnerId` belong
to `primary`.

## One-time setup (mt-services-swantron project)

1. Firestore: create the database (Native mode).
2. Authentication: enable the Google provider, and add `drive.mt.services` to authorized domains.
3. Register a web app, and put its config in the repo's Actions **variables** (`NEXT_PUBLIC_FIREBASE_*`).
4. Hosting: `firebase hosting:sites:create drive-mt-services`, then add the custom domain
   `drive.mt.services` (DNS records at the registrar).
5. Workload identity: allow this repo in the `github-oidc` provider's attribute condition, and give
   `github-action-deploy@` the Firebase Rules Admin role so it can deploy `firestore.rules`.
