// Single source of truth for company-level contact info. Edit here, do not duplicate elsewhere.

export const SITE = {
  company: {
    name: "Humanity & Blessings Home Health",
    nameShort: "Humanity & Blessings",
    url: "https://humanityandblessings.com",
    domain: "humanityandblessings.com",
    ahcaLicense: "30212381",
  },
  contact: {
    phone: {
      display: "954-637-1334",      // for human-readable copy
      tel: "9546371334",             // digits only, for tel: hrefs
      e164: "+1-954-637-1334",       // for schema.org / structured data
    },
    fax: {
      display: "1-844-905-0544",
      tel: "18449050544",
      e164: "+1-844-905-0544",
    },
    email: "admin@humanityandblessings.com",
    emailFromHeader: "Humanity & Blessings Home Health <admin@humanityandblessings.com>",
  },
  address: {
    street: "2121 W Oakland Park BLVD, Suite 9",
    city: "Oakland Park",
    state: "FL",
    zip: "33311",
    country: "US",
    fullLine: "2121 W Oakland Park BLVD, Suite 9, Oakland Park, FL 33311",
    mapsQuery: "2121+W+Oakland+Park+BLVD,+Suite+9,+Oakland+Park,+FL+33311",
  },
} as const;
