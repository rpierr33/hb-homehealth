"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Mail, Heart } from "lucide-react";

export default function CaregiverLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/caregiver/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const body = await res.json().catch(() => ({}));

    if (!res.ok) {
      setError(body.error || "Invalid email or password");
      setLoading(false);
      return;
    }

    if (body.caregiver?.passwordResetRequired) {
      router.push("/caregiver/change-password");
    } else {
      router.push("/caregiver");
    }
    router.refresh();
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#E8476C] to-[#FF6B8A] text-white">
            <Heart size={28} fill="white" />
          </div>
          <h1 className="mt-4 font-display text-2xl font-bold text-neutral-dark">
            Caregiver Sign In
          </h1>
          <p className="mt-1 text-sm text-neutral-mid">
            Humanity &amp; Blessings Home Health
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm"
        >
          <div className="space-y-4">
            <div>
              <label
                className="block text-sm font-medium text-neutral-dark"
                htmlFor="email"
              >
                Email
              </label>
              <div className="relative mt-1">
                <Mail
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-mid"
                />
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  inputMode="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-4 text-sm focus:border-[#E8476C] focus:ring-1 focus:ring-[#E8476C]"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label
                className="block text-sm font-medium text-neutral-dark"
                htmlFor="password"
              >
                Password
              </label>
              <div className="relative mt-1">
                <Lock
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-mid"
                />
                <input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-4 text-sm focus:border-[#E8476C] focus:ring-1 focus:ring-[#E8476C]"
                  placeholder="Enter password"
                />
              </div>
            </div>
          </div>

          {error && (
            <p className="mt-4 text-sm text-red-500" role="alert">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-6 w-full rounded-full bg-[#E8476C] py-3 font-semibold text-white transition-all hover:bg-[#c73a5a] disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>

          <p className="mt-4 text-center text-xs text-neutral-mid">
            Don&apos;t have an account? Contact your administrator.
          </p>
        </form>
      </div>
    </div>
  );
}
