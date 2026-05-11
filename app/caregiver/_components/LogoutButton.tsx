"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    await fetch("/api/caregiver/auth/logout", { method: "POST" });
    router.push("/caregiver/login");
    router.refresh();
  };

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className="inline-flex items-center gap-2 rounded-full border border-gray-300 px-4 py-2 text-sm font-medium text-neutral-dark transition-all hover:border-[#E8476C] hover:text-[#E8476C] disabled:opacity-50"
    >
      <LogOut size={14} />
      {loading ? "Signing out..." : "Sign Out"}
    </button>
  );
}
