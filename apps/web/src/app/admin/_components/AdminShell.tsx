"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import AdminSidebar from "./AdminSidebar";
import AdminTopbar from "./AdminTopbar";
import { getAdminToken } from "@/lib/admin-api";

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const token = getAdminToken();
    const publicPaths = ["/admin/login", "/admin/forgot", "/admin/reset"];
    const isPublic = publicPaths.some((p) => pathname.startsWith(p));
    if (!token && !isPublic) {
      router.push("/admin/login");
      return;
    }
    setReady(true);
  }, [pathname, router]);

  if (!ready && !pathname.includes("/admin/login") && !pathname.includes("/admin/forgot") && !pathname.includes("/admin/reset")) {
    return null;
  }

  return (
    <div className="admin-ui min-h-screen bg-[#0b0f16] text-white">
      <div className="flex">
        <AdminSidebar />
        <div className="flex-1 min-h-screen">
          <AdminTopbar />
          <main className="px-6 py-6">{children}</main>
        </div>
      </div>
    </div>
  );
}
