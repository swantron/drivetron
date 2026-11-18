import type { Metadata } from "next";
import { Suspense } from "react";
import { CONTACT_EMAIL, socialMeta } from "@/lib/site";
import { LegalPage } from "@/components/public/LegalPage";
import { DeleteAccountPanel } from "@/components/DeleteAccountPanel";

const title = "Delete your account — Drivetron";
const description = "How to delete your Drivetron account and the data that goes with it.";

// Public on purpose: app stores require a web page for deletion requests, reachable without the app.
export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/delete-account" },
  ...socialMeta(title, description, "/delete-account"),
  robots: { index: true, follow: true },
};

const mail = <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>;

export default function DeleteAccountPage() {
  return (
    <LegalPage title="Delete your account">
      <p>
        You can delete your Drivetron account yourself, right here or from the Family tab in the app. It takes effect
        immediately.
      </p>
      <h2>What gets deleted</h2>
      <ul>
        <li>Your sign-in account and your place in your family&apos;s log: your name, initials, and role.</li>
        <li>What the app keeps on this device: its offline copy of the log and your settings.</li>
        <li>
          If you own the log and no other supervising adult is in it, the whole log: every drive, the learners, vehicles, and
          the invite code. If another supervising adult is in it, hand the log to them first (Family tab), and it stays
          with the family.
        </li>
      </ul>
      <h2>What stays</h2>
      <ul>
        <li>
          Drives you supervised stay in the family&apos;s log, under your name, because they&apos;re part of the teen&apos;s
          practice record. The log&apos;s owner can delete the log.
        </li>
        <li>Payment records, which tax and accounting rules require us to keep. Stripe keeps its own records of a payment.</li>
      </ul>
      <Suspense fallback={null}>
        <DeleteAccountPanel />
      </Suspense>
      <h2>Can&apos;t sign in?</h2>
      <p>
        Email {mail} from the address you sign in with and ask us to delete your account. We&apos;ll do it within 30 days
        and confirm by email.
      </p>
    </LegalPage>
  );
}
