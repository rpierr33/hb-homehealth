"use client";

import Link from "next/link";
import { Phone, MessageSquare } from "lucide-react";
import { SITE } from "@/lib/site-config";

export function MobileCTABar() {
  return (
    <div data-mobile-cta-bar className="fixed bottom-0 left-0 right-0 z-40 border-t border-gray-200 bg-white p-3 md:hidden print:hidden">
      <div className="flex gap-2">
        <a
          href={`tel:${SITE.contact.phone.tel}`}
          className="flex flex-1 items-center justify-center gap-2 rounded-full bg-primary py-3 text-sm font-semibold text-white shadow-lg transition-all active:scale-95"
        >
          <Phone size={18} />
          Call Now
        </a>
        <Link
          href="/contact"
          className="flex flex-1 items-center justify-center gap-2 rounded-full border-2 border-primary py-3 text-sm font-semibold text-primary shadow-lg transition-all active:scale-95"
        >
          <MessageSquare size={18} />
          Contact Us
        </Link>
      </div>
    </div>
  );
}
