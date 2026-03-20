import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <div className="mb-8 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-[#E8476C] to-[#FF6B8A] text-white text-4xl font-bold opacity-50">
        H
      </div>
      <h1 className="font-display text-6xl font-bold text-[#E8476C]">404</h1>
      <h2 className="mt-4 font-display text-2xl font-bold text-neutral-dark">
        Page Not Found
      </h2>
      <p className="mt-2 max-w-md text-neutral-mid">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <div className="mt-8 flex gap-4">
        <Link
          href="/"
          className="rounded-full bg-[#E8476C] px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-[#c73a5a]"
        >
          Go Home
        </Link>
        <Link
          href="/contact"
          className="rounded-full border-2 border-[#E8476C] px-6 py-3 text-sm font-semibold text-[#E8476C] transition-all hover:bg-[#E8476C] hover:text-white"
        >
          Contact Us
        </Link>
      </div>
    </div>
  );
}
