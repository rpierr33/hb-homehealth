import type { Metadata } from "next";
import Link from "next/link";
import { SITE } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Privacy Policy & HIPAA Notice",
  description: `Privacy policy and HIPAA notice for ${SITE.company.name}. Learn how we protect your personal and health information. AHCA License #${SITE.company.ahcaLicense}.`,
};

export default function PrivacyPage() {
  return (
    <>
      <section className="bg-gradient-to-b from-primary-light to-white py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-display text-4xl font-bold text-neutral-dark sm:text-5xl">
            Privacy Policy &amp; HIPAA Notice
          </h1>
          <p className="mt-4 text-neutral-mid">
            Florida AHCA License #{SITE.company.ahcaLicense} &middot; Last updated: March 2026
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 prose prose-neutral">

          <h2 className="font-display text-2xl font-bold text-neutral-dark mt-12 mb-4">
            Notice of Privacy Practices (HIPAA)
          </h2>
          <p className="text-neutral-mid leading-relaxed mb-4">
            This notice describes how medical information about you may be used and disclosed
            and how you can get access to this information. Please review it carefully.
          </p>
          <p className="text-neutral-mid leading-relaxed mb-4">
            Humanity &amp; Blessings Home Health (AHCA License #{SITE.company.ahcaLicense}) is required by law to maintain
            the privacy of your protected health information (PHI), provide you with notice of our
            legal duties and privacy practices, and notify you following a breach of unsecured PHI.
          </p>

          <h3 className="font-display text-xl font-bold text-neutral-dark mt-10 mb-3">
            How We May Use and Disclose Your Health Information
          </h3>
          <p className="text-neutral-mid leading-relaxed mb-3">
            We may use and disclose your PHI for the following purposes:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-neutral-mid mb-6">
            <li><strong>Treatment:</strong> We may use your PHI to provide, coordinate, or manage your health care and related services, including consultations between health care providers regarding your care and referrals for care from one provider to another.</li>
            <li><strong>Payment:</strong> We may use and disclose your PHI to bill and collect payment for the services we provide, including communications with your insurance company or other payer.</li>
            <li><strong>Health Care Operations:</strong> We may use and disclose your PHI for our own operations, such as quality assessment, employee review, training, licensing, and accreditation activities.</li>
            <li><strong>As Required by Law:</strong> We will disclose your PHI when required to do so by federal, state, or local law.</li>
            <li><strong>Public Health Activities:</strong> We may disclose your PHI to public health authorities for purposes such as preventing or controlling disease, injury, or disability.</li>
            <li><strong>Health Oversight:</strong> We may disclose your PHI to a health oversight agency for activities authorized by law, such as audits, investigations, and licensure.</li>
          </ul>

          <h3 className="font-display text-xl font-bold text-neutral-dark mt-10 mb-3">
            Your Rights Regarding Your Health Information
          </h3>
          <ul className="list-disc pl-6 space-y-2 text-neutral-mid mb-6">
            <li><strong>Right to Access:</strong> You have the right to inspect and obtain a copy of your PHI maintained by us.</li>
            <li><strong>Right to Amend:</strong> You have the right to request that we amend your PHI if you believe it is incorrect or incomplete.</li>
            <li><strong>Right to an Accounting of Disclosures:</strong> You have the right to request a list of certain disclosures we have made of your PHI.</li>
            <li><strong>Right to Request Restrictions:</strong> You have the right to request that we restrict certain uses and disclosures of your PHI.</li>
            <li><strong>Right to Request Confidential Communications:</strong> You have the right to request that we communicate with you in a certain way or at a certain location.</li>
            <li><strong>Right to a Paper Copy:</strong> You have the right to obtain a paper copy of this notice upon request.</li>
          </ul>

          <h3 className="font-display text-xl font-bold text-neutral-dark mt-10 mb-3">
            Filing a Complaint
          </h3>
          <p className="text-neutral-mid leading-relaxed mb-6">
            If you believe your privacy rights have been violated, you may file a complaint with us
            or with the Secretary of the U.S. Department of Health and Human Services. You will not
            be penalized for filing a complaint. To file a complaint with us, contact our Privacy
            Officer at <a href={`mailto:${SITE.contact.email}`} className="text-primary hover:text-primary-dark">{SITE.contact.email}</a> or
            call <a href={`tel:${SITE.contact.phone.tel}`} className="text-primary hover:text-primary-dark">{SITE.contact.phone.display}</a>.
          </p>

          <hr className="border-gray-200 my-10" />

          <h2 className="font-display text-2xl font-bold text-neutral-dark mt-12 mb-4">
            Website Privacy Policy
          </h2>

          <h3 className="font-display text-xl font-bold text-neutral-dark mt-10 mb-3">
            Information We Collect
          </h3>
          <p className="text-neutral-mid leading-relaxed mb-3">
            When you use our website, we may collect the following types of information:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-neutral-mid mb-6">
            <li><strong>Information you provide:</strong> Name, email, phone number, and other details you submit through our contact, referral, or job application forms.</li>
            <li><strong>Automatically collected information:</strong> IP address, browser type, device information, pages visited, and time spent on our site through cookies and analytics tools.</li>
          </ul>

          <h3 className="font-display text-xl font-bold text-neutral-dark mt-10 mb-3">
            How We Use Your Information
          </h3>
          <ul className="list-disc pl-6 space-y-2 text-neutral-mid mb-6">
            <li>To respond to your inquiries and provide requested services</li>
            <li>To process referrals and job applications</li>
            <li>To send confirmation and follow-up communications</li>
            <li>To improve our website and services</li>
            <li>To comply with legal obligations</li>
          </ul>

          <h3 className="font-display text-xl font-bold text-neutral-dark mt-10 mb-3">
            Information Security
          </h3>
          <p className="text-neutral-mid leading-relaxed mb-6">
            We implement appropriate technical and organizational security measures to protect your
            personal information against unauthorized access, alteration, disclosure, or destruction.
            All data transmissions are encrypted using SSL/TLS technology. Form submissions are stored
            in a secure, encrypted database with access restricted to authorized personnel only.
          </p>

          <h3 className="font-display text-xl font-bold text-neutral-dark mt-10 mb-3">
            Third-Party Services
          </h3>
          <p className="text-neutral-mid leading-relaxed mb-6">
            We may use third-party services such as analytics providers and email delivery services
            to operate our website. These providers may collect and process data on our behalf in
            accordance with their own privacy policies. We do not sell your personal information to
            third parties.
          </p>

          <h3 className="font-display text-xl font-bold text-neutral-dark mt-10 mb-3">
            Contact Us
          </h3>
          <p className="text-neutral-mid leading-relaxed mb-4">
            If you have questions about this privacy policy or our privacy practices, please contact us:
          </p>
          <div className="rounded-xl bg-neutral-light p-6 text-neutral-mid text-sm mb-6">
            <p className="font-semibold text-neutral-dark">{SITE.company.name}</p>
            <p>{SITE.address.fullLine}</p>
            <p>Phone: <a href={`tel:${SITE.contact.phone.tel}`} className="text-primary">{SITE.contact.phone.display}</a></p>
            <p>Fax: {SITE.contact.fax.display}</p>
            <p>Email: <a href={`mailto:${SITE.contact.email}`} className="text-primary">{SITE.contact.email}</a></p>
            <p className="mt-2">Florida AHCA License #{SITE.company.ahcaLicense}</p>
          </div>
        </div>
      </section>
    </>
  );
}
