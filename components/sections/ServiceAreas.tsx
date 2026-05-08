import { MapPin } from "lucide-react";

const serviceAreas = [
  "Parkland",
  "Coral Springs",
  "Miramar",
  "Weston",
  "Lauderdale-By-The-Sea",
  "Hollywood Beach",
  "Oakland Park",
  "Fort Lauderdale",
];

// Doubled for seamless loop
const scrollItems = [...serviceAreas, ...serviceAreas];

export function ServiceAreas() {
  return (
    <section className="border-y border-gray-100 bg-neutral-light py-8 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center gap-2 mb-6">
          <MapPin size={20} className="text-primary" />
          <p className="text-sm font-semibold text-neutral-dark">
            Areas We Serve
          </p>
        </div>
      </div>

      {/* Marquee container with edge fades */}
      <div className="relative">
        {/* Left fade */}
        <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-24 bg-gradient-to-r from-neutral-light to-transparent" />
        {/* Right fade */}
        <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-24 bg-gradient-to-l from-neutral-light to-transparent" />

        <div className="overflow-hidden">
          <div className="flex w-max gap-5 animate-marquee hover:[animation-play-state:paused]">
            {scrollItems.map((name, i) => (
              <span
                key={`${name}-${i}`}
                className="inline-flex shrink-0 items-center gap-2 rounded-full border border-primary/10 bg-white px-5 py-2.5 text-sm font-medium text-neutral-dark shadow-sm transition-all duration-200 hover:border-primary/30 hover:shadow-md"
              >
                <span className="flex h-2 w-2 rounded-full bg-gradient-to-br from-primary to-accent" />
                {name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
