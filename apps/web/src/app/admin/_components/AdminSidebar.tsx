"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/pages", label: "Pages" },
  { href: "/admin/nav", label: "Navigation" },
  { href: "/admin/solutions", label: "Solutions" },
  { href: "/admin/projects", label: "Projects" },
  { href: "/admin/partners", label: "Partners" },
  { href: "/admin/team", label: "Team" },
  { href: "/admin/leads", label: "Leads" },
  { href: "/admin/media", label: "Media" },
  { href: "/admin/settings", label: "Settings" },
  { href: "/admin/users", label: "Users" },
  { href: "/admin/audit", label: "Audit Logs" },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  return (
    <aside className="w-64 border-r border-white/10 bg-[#070b13] min-h-screen sticky top-0">
      <div className="px-5 py-5 text-lg font-bold">HOPn Admin</div>
      <nav className="px-3 pb-6 space-y-1">
        {items.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`block rounded-lg px-3 py-2 text-sm ${
                active ? "bg-white/10 text-white" : "text-white/70 hover:bg-white/5"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
