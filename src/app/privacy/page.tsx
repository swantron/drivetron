import type { Metadata } from "next";
import Link from "next/link";
import { CONTACT_EMAIL, OPERATOR, socialMeta } from "@/lib/site";
import { LegalPage } from "@/components/public/LegalPage";

const title = "Privacy policy — Drivetron";
const description = "What Drivetron stores about your family's driving log, who can see it, and how to delete it.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/privacy" },
  ...socialMeta(title, description, "/privacy"),
  robots: { index: true, follow: true },
};

const mail = <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>;

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy policy">
      <p>
        Drivetron is a supervised-driving log shared by a family: parents or other supervising adults, and the teen learning to
        drive. This page explains what it stores, why, who can see it, and how to get it deleted. The short version: it keeps
        what a driving log needs, shows it only to your family, and has no ads, analytics, or tracking.
      </p>
      <p>
        Drivetron is run by {OPERATOR}, a business based in Montana (&ldquo;we&rdquo; and &ldquo;us&rdquo; below), which is
        responsible for the data described here.
      </p>

      <h2>What we store</h2>
      <ul>
        <li>
          <strong>Your sign-in:</strong> your email address and an account id. With Google sign-in, also your name from
          Google; Drivetron never sees your Google password. With email sign-in there&apos;s no password at all: we email you
          a one-time link.
        </li>
        <li>
          <strong>The family log:</strong> each teen&apos;s name, date of birth, and permit date; the family&apos;s state;
          each member&apos;s display name, initials, and role; vehicle names; and invite codes.
        </li>
        <li>
          <strong>Drives:</strong> start and end times, day and night minutes, the supervising adult, the vehicle, condition
          and skill tags, notes, and whether a drive was timed, typed in, or edited.
        </li>
        <li>
          <strong>Location:</strong> when a drive starts, one location reading rounded to about 1 km, used only to work out
          sunset and sunrise for that drive. Drivetron doesn&apos;t track your route.
        </li>
        <li>
          <strong>Join requests:</strong> when someone asks to join a family log, their name and Google email are shown to the
          log&apos;s owner so the owner can tell who it is. The request is deleted once it&apos;s approved or declined.
        </li>
        <li>
          <strong>Payments:</strong> if you buy an unlock, a record of which teen&apos;s log it unlocked, the amount, and
          Stripe&apos;s reference for the payment. Your card and billing details go to Stripe, never to Drivetron.
        </li>
      </ul>

      <h2>Who can see it</h2>
      <p>
        Only the people in your family log. Someone with your invite code can ask to join, but sees nothing until the
        log&apos;s owner approves them. The owner can remove members and change the invite code at any time.
      </p>
      <p>
        We don&apos;t sell, rent, or share your data, and we don&apos;t use it for advertising. We look at stored data only
        when you ask for help, to fix a problem, to keep the service secure, or when the law requires it.
      </p>

      <h2>Services we use</h2>
      <ul>
        <li>
          <strong>Google Firebase</strong> (Google Cloud) stores the log, runs sign-in (including sending email sign-in
          links), hosts the site, and keeps standard server logs (such as IP addresses) for security and reliability. Data
          is stored in the United States.
        </li>
        <li>
          <strong>Google reCAPTCHA</strong> checks that requests come from the real app rather than a bot. Google&apos;s{" "}
          <a href="https://policies.google.com/privacy" target="_blank" rel="noreferrer">
            privacy policy
          </a>{" "}
          covers what it collects.
        </li>
        <li>
          <strong>Stripe</strong> processes unlock payments under its{" "}
          <a href="https://stripe.com/privacy" target="_blank" rel="noreferrer">
            privacy policy
          </a>
          .
        </li>
      </ul>

      <h2>On your phone</h2>
      <p>
        The app saves a copy of your log on your device so it works without signal, and remembers which teen you were
        viewing. Signing out or clearing the browser&apos;s site data removes it. There are no advertising or analytics
        cookies.
      </p>

      <h2>Teens</h2>
      <p>
        Drivetron is for families with a teen who is old enough to hold a learner&apos;s permit. It isn&apos;t meant for
        children under 13, and a teen&apos;s place in a family log is set up and controlled by a parent or guardian, who can
        remove them or delete the log.
      </p>

      <h2>Keeping and deleting data</h2>
      <p>
        Your log is kept until it&apos;s deleted. The family owner can delete the whole log from the Family tab, which erases
        its drives, members, and invite codes for everyone right away. Anyone can delete their own account, right away,
        at <Link href="/delete-account">drivetron.app/delete-account</Link> or from the Family tab; drives they supervised
        stay in the family&apos;s log as part of the teen&apos;s record. If you can&apos;t sign in, or want anything else
        deleted, email {mail} and we&apos;ll do it within 30 days. Payment records are kept as long as tax and accounting
        rules require, even after a log is deleted.
      </p>
      <p>
        You can see everything in your log in the app, and print it or save it as a PDF. For a copy of anything else we hold
        about you, or a correction, email {mail}.
      </p>

      <h2>Security</h2>
      <p>
        Data is encrypted in transit and at rest by Google. Access rules on the database let each person read and change only
        what their role in their own family allows. No system is perfectly secure; if something goes wrong that affects your
        data, we&apos;ll tell you.
      </p>

      <h2>Changes</h2>
      <p>
        If this policy changes, the date at the top changes too. For anything that matters, such as a new kind of data or a
        new service that receives it, we&apos;ll also say so in the app before it takes effect.
      </p>

      <h2>Contact</h2>
      <p>
        Questions or requests: {mail}. See also the <Link href="/terms">terms of use</Link>.
      </p>
    </LegalPage>
  );
}
