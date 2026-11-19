# Drivetron for Android (Google Play)

A Trusted Web Activity: a thin Android wrapper that opens https://drivetron.app full screen in
Chrome. All the app's code is the website; this project only holds the wrapper. Package
`app.drivetron`, launch URL `/home?source=play`. Generated with Bubblewrap (`@bubblewrap/core`
1.24.1) from `twa-manifest.json`; regenerate with Bubblewrap rather than editing the Gradle files
by hand, except `targetSdkVersion`, which Play requires to be 36 for new apps (the template said 35).

## How the Play app differs from the website

Google Play's payments policy doesn't let the app sell the $9.99 unlock through Stripe, or point
people to buy it elsewhere. So inside the Play app (detected in `src/lib/platform.ts`) the price,
the "Unlock" checkout and the About page's pricing section are hidden; a learner past the free hours
sees that unlocking "isn't available in the Android app". A parent can still unlock from the website
or an iPhone, and the unlock applies on every phone, including this app.

## Before the first release (in order)

1. **D-U-N-S number** for swantron (free, from Dun & Bradstreet; Play Console links to the request
   form). Organization accounts skip the 12-tester closed test that new personal accounts need.
2. **Play Console organization account** ($25, identity and business verification).
3. **Account deletion** (done): in the app via Family tab → "Delete my account", and on the web at
   https://drivetron.app/delete-account, which is the URL for Play Console's "Delete account URL" field.
4. **Upload key.** Run it yourself so the passwords never leave your machine, and save the keystore
   and both passwords in your password manager. Losing it means asking Google to reset the upload key.
   ```sh
   cd android
   keytool -genkeypair -v -keystore drivetron-upload.keystore -alias upload \
     -keyalg RSA -keysize 2048 -validity 10000 -dname "CN=swantron, L=Bozeman, ST=Montana, C=US"
   keytool -list -v -keystore drivetron-upload.keystore -alias upload   # note the SHA-256 fingerprint
   ```
5. **Build tooling**: JDK 17 and the Android SDK (`npx @bubblewrap/cli doctor` offers to install
   both; the SDK asks you to accept Google's license).
6. **Build the bundle**: `npx @bubblewrap/cli build` in this folder → `app-release-bundle.aab`.
7. **Create the app** in Play Console, turn on Play App Signing, upload the bundle to the internal
   testing track.
8. **Digital Asset Links**: copy the *app signing key* SHA-256 from Play Console → Test and release →
   App integrity, plus the upload key's, into `public/.well-known/assetlinks.json` (below), push, and
   check https://drivetron.app/.well-known/assetlinks.json. Without it the app shows a browser address
   bar. Hosting serves `.well-known/` (firebase.json no longer ignores dot-folders).
   ```json
   [{
     "relation": ["delegate_permission/common.handle_all_urls"],
     "target": {
       "namespace": "android_app",
       "package_name": "app.drivetron",
       "sha256_cert_fingerprints": ["<play app signing SHA-256>", "<upload key SHA-256>"]
     }
   }]
   ```
9. **Store listing, Data safety and content rating** (drafts below), then promote to production.

Version bumps: raise `appVersionCode` (and `appVersionName`) in `twa-manifest.json`, then
`npx @bubblewrap/cli update` and `build`. Most changes need no new Android release at all: the app is
the website, so a web deploy updates it.

## Store listing (draft)

- **App name:** Drivetron: Teen Driving Log
- **Short description (80):** Shared supervised driving log for teen drivers. Day and night hours, every phone.
- **Category:** Education (alternative: Auto & Vehicles). **Contact:** support@drivetron.app.
  **Privacy policy:** https://drivetron.app/privacy
- **Full description:**

  > Drivetron is the supervised driving log the whole family shares. Parents and your teen each use
  > their own phone, iPhone or Android, and see the same log.
  >
  > • One tap to start and stop a drive. The timer keeps running if the phone locks, and shows on
  > every family phone.
  > • Night hours counted for you, from sunset and sunrise where you drove, using your state's
  > definition of night.
  > • Progress toward your state's hours and permit hold, with a projected test-ready date.
  > • Teens can time their own drives but can't type in past ones or stretch the times, and anything
  > edited afterward is marked, so the hours are ones a parent can sign for.
  > • Drives your teen times on their own phone wait for your OK, and the log shows which you confirmed.
  > • Download the whole log as a spreadsheet any time.
  > • A printable log with totals and signature lines.
  > • Works offline and syncs when you're back in coverage.
  >
  > Built around the rules in Montana, California, Ohio, Texas, Pennsylvania, Florida, Georgia, North Carolina, Illinois, New York, Michigan and Virginia, with more states coming. Your first hours of
  > logging are free for each teen.
  >
  > Drivetron is not affiliated with any state government or motor vehicle agency. Confirm current
  > requirements with your state.

- **Graphics** (in `store-assets/`): icon 512×512 (`store_icon.png`), feature graphic 1024×500
  (`feature-graphic.png`), and six 1080×1920 phone screenshots (`phone-*.png`) taken on the emulator
  build from a made-up demo family (the Riveras), never a real one. Retake them when the UI changes.

## Data safety (draft answers, from the privacy policy)

- **Collected:** name, email address, user IDs (account); approximate location (one reading per drive,
  rounded to about 1 km, for sunset times); other user-generated content (drives, notes, learner
  details including date of birth). All for app functionality and account management.
- **Shared with third parties:** no. **Encrypted in transit:** yes. **Deletion:** users can request
  deletion in the app or at https://drivetron.app/delete-account; the family owner can delete the whole log in the app.
- **No ads**, no analytics SDKs, no purchases inside the Android app.

## Content rating and audience

Target audience 13 and up (teens with learner permits, and their parents); not designed for children
under 13, so Google Play's Families policy doesn't apply. No user-to-user public content: a family log
is private to its members.
