import type { Metadata } from "next";
import Link from "next/link";
import { CONTACT_EMAIL, OPERATOR, socialMeta } from "@/lib/site";
import { FREE_HOURS_TEXT, PRICE_LABEL } from "@/lib/pricing";
import { LegalPage } from "@/components/public/LegalPage";

const title = "Terms of use — Drivetron";
const description = "The terms for using Drivetron, the shared supervised-driving log, including pricing and refunds.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/terms" },
  ...socialMeta(title, description, "/terms"),
  robots: { index: true, follow: true },
};

const mail = <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>;

export default function TermsPage() {
  return (
    <LegalPage title="Terms of use">
      <p>
        Drivetron is run by {OPERATOR}, a business based in Montana (&ldquo;we&rdquo; and &ldquo;us&rdquo; below). These
        terms apply when you use Drivetron at drivetron.app or as an installed app. By signing in you agree to them and
        to the <Link href="/privacy">privacy policy</Link>. If you&apos;re under 18, a parent or guardian needs to agree to them
        for you, and to set up or approve your place in a family log.
      </p>

      <h2>What Drivetron is</h2>
      <p>
        A tool for a family to keep a practice-driving log: timing drives, splitting day and night minutes, tracking progress
        toward the state&apos;s requirements, and printing the log. It is <strong>not affiliated with, endorsed by, or approved
        by</strong> any state government or motor vehicle agency.
      </p>
      <p>
        The state&apos;s requirements shown in the app come from the official sources listed on each state&apos;s page, but
        rules change and the app can be wrong. Confirm the current rules with your state. Night minutes are calculated from
        sunset and sunrise at an approximate location, so check drives close to dusk or dawn.
      </p>

      <h2>Your responsibilities</h2>
      <ul>
        <li>
          The parent or guardian who certifies hours to the state is responsible for their accuracy. Review the log before you
          sign anything.
        </li>
        <li>Enter true information. Don&apos;t use Drivetron to record drives that didn&apos;t happen.</li>
        <li>Never use the app while driving. The teen driving shouldn&apos;t touch the phone; start and stop drives while parked.</li>
        <li>Keep your Google account or email account secure, and share your family&apos;s invite code only with people you mean to let in.</li>
        <li>Don&apos;t try to get into other families&apos; logs, overload the service, or get around its limits.</li>
      </ul>

      <h2>Pricing and refunds</h2>
      <p>
        Each teen&apos;s first {FREE_HOURS_TEXT} of logged driving are free. After that, a one-time payment of {PRICE_LABEL}{" "}
        per teen unlocks the rest of that teen&apos;s log for everyone in the family. It isn&apos;t a subscription and
        doesn&apos;t renew. Logs started before paid unlocks launched stay free.
      </p>
      <p>
        Payments are processed by Stripe, which may act as the seller of record and collect any sales tax; its terms also
        apply to the payment. If you&apos;re not happy, email {mail} within 30 days of paying for a full refund. Your logged
        drives always stay viewable and printable, paid or not.
      </p>

      <h2>Your data</h2>
      <p>
        Your log belongs to your family. You let us store and process it only to run Drivetron for you, as described in the{" "}
        <Link href="/privacy">privacy policy</Link>. The family owner can delete the log at any time.
      </p>

      <h2>Changes and availability</h2>
      <p>
        We may change or improve Drivetron, and update these terms; the date at the top shows the latest version, and
        we&apos;ll give notice in the app before a change that matters takes effect. We aim to keep it running but can&apos;t
        promise it will always be available. Because a log you need for a license appointment matters, print or save a PDF of
        it before the appointment. If we ever shut Drivetron down, we&apos;ll give at least 60 days&apos; notice so you can save
        your log, and refund unlocks bought in the 12 months before.
      </p>
      <p>
        We may suspend an account that misuses the service or breaks these terms. You can stop using Drivetron at any time.
      </p>

      <h2>No warranty</h2>
      <p>
        Drivetron is provided &ldquo;as is&rdquo;, without warranties of any kind, including that it is accurate, meets your
        state&apos;s requirements, or is free of errors. To the extent the law allows, we aren&apos;t liable for indirect or
        consequential losses, such as a delayed license test, and our total liability to you is limited to what you paid for
        Drivetron in the 12 months before the claim. Some places don&apos;t allow these limits, so they may not all apply to
        you.
      </p>

      <h2>Law</h2>
      <p>These terms are governed by the laws of the State of Montana, USA.</p>

      <h2>Contact</h2>
      <p>
        {OPERATOR}, Bozeman, Montana. Questions about these terms: {mail}.
      </p>
    </LegalPage>
  );
}
