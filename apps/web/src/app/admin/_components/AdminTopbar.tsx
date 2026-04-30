"use client";

import { useRouter } from "next/navigation";
import { adminLogout } from "@/lib/admin-api";

export default function AdminTopbar() {
  const router = useRouter();

  return (
    <div className="h-14 border-b border-white/10 bg-[#070b13] flex items-center justify-between px-6">
      <div className="text-sm text-white/60">Admin Panel</div>
      <button
        className="text-xs rounded-lg border border-white/10 px-3 py-1.5 text-white/80 hover:bg-white/5"
        onClick={async () => {
          await adminLogout();
          router.push("/admin/login");
        }}
      >
        Log out
      </button>
    </div>
  );
}
