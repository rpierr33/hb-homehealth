import type { Metadata } from "next";
import { ReferralsContent } from "./ReferralsContent";

export const metadata: Metadata = {
  title: "Referrals",
  description: "Refer a patient to Humanity & Blessings Home Health. Submit a referral for home health care services including CNA, HHA, RN, LPN, and companion care in Broward County, FL.",
};

export default function ReferralsPage() {
  return <ReferralsContent />;
}
