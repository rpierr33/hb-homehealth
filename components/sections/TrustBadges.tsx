import { ShieldCheck, Clock, Award, UserCheck, Heart } from "lucide-react";
import { SITE } from "@/lib/site-config";

const badges = [
  {
    icon: ShieldCheck,
    title: "Licensed & Insured",
    desc: `Florida AHCA License #${SITE.company.ahcaLicense}`,
  },
  {
    icon: UserCheck,
    title: "Background Checked",
    desc: "Every caregiver thoroughly vetted",
  },
  {
    icon: Clock,
    title: "Care Within 24–48 Hours",
    desc: "Fast placement when you need it most",
  },
  {
    icon: Award,
    title: "Certified Professionals",
    desc: "CNAs, HHAs, RNs, and LPNs on staff",
  },
  {
    icon: Heart,
    title: "Family-Owned Since 2021",
    desc: "Personal attention, not a corporate number",
  },
];

export function TrustBadges() {
  return (
    <section className="border-y border-gray-100 bg-white py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12">
          {badges.map((badge) => {
            const Icon = badge.icon;
            return (
              <div key={badge.title} className="flex items-center gap-3 text-center sm:text-left">
                <div className="shrink-0 rounded-lg bg-primary-light p-2">
                  <Icon size={20} className="text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-neutral-dark">{badge.title}</p>
                  <p className="text-xs text-neutral-mid">{badge.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
