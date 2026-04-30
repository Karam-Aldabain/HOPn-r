"use client";

import { useEffect, useMemo, useState } from "react";
import { adminFetch } from "@/lib/admin-api";

type Count = { label: string; value: number };
type Lead = {
  id: number;
  name: string;
  email: string;
  topic: string;
  message: string;
  createdAt: string;
  status: string;
};
type Project = { id: number; published?: boolean };

export default function AdminDashboard() {
  const [counts, setCounts] = useState<Count[]>([]);
  const [latestLeads, setLatestLeads] = useState<Lead[]>([]);

  useEffect(() => {
    let mounted = true;
    Promise.all([
      adminFetch<Project[]>("/admin/projects"),
      adminFetch<any[]>("/admin/partners"),
      adminFetch<any[]>("/admin/solutions"),
      adminFetch<any[]>("/admin/team"),
      adminFetch<Lead[]>("/admin/leads"),
    ])
      .then(([projects, partners, solutions, team, leads]) => {
        if (!mounted) return;
        const now = Date.now();
        const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;
        const newLeads = leads.filter((l) => now - new Date(l.createdAt).getTime() <= sevenDaysMs);
        const publishedProjects = projects.filter((p) => p.published).length;

        setCounts([
          { label: "New leads (7d)", value: newLeads.length },
          { label: "Total leads", value: leads.length },
          { label: "Published projects", value: publishedProjects },
          { label: "Partners", value: partners.length },
          { label: "Solutions", value: solutions.length },
          { label: "Team", value: team.length },
        ]);
        setLatestLeads(leads.slice(0, 10));
      })
      .catch(() => {
        if (!mounted) return;
        setCounts([]);
        setLatestLeads([]);
      });
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
        {counts.map((c) => (
          <div key={c.label} className="rounded-xl border border-white/10 bg-white/5 p-4">
            <div className="text-xs text-white/60">{c.label}</div>
            <div className="mt-2 text-2xl font-bold">{c.value}</div>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[2fr_1fr]">
        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <div className="text-sm font-semibold">Latest messages</div>
          <div className="mt-3 space-y-3">
            {latestLeads.map((l) => (
              <div key={l.id} className="rounded-lg border border-white/10 bg-white/5 p-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="text-sm font-semibold">{l.name}</div>
                  <div className="text-[11px] text-white/50">{new Date(l.createdAt).toLocaleString()}</div>
                </div>
                <div className="mt-1 text-[11px] text-white/60">
                  {l.email} - {l.topic} - {l.status}
                </div>
                <div className="mt-2 text-xs text-white/70 line-clamp-3">{l.message}</div>
              </div>
            ))}
            {!latestLeads.length ? (
              <div className="text-xs text-white/50">No leads yet.</div>
            ) : null}
          </div>
        </div>

        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <div className="text-sm font-semibold">Quick actions</div>
          <div className="mt-3 grid gap-2">
            <a className="rounded-lg border border-white/10 px-3 py-2 text-xs hover:bg-white/5" href="/admin/projects">
              Add project
            </a>
            <a className="rounded-lg border border-white/10 px-3 py-2 text-xs hover:bg-white/5" href="/admin/partners">
              Add partner
            </a>
            <a className="rounded-lg border border-white/10 px-3 py-2 text-xs hover:bg-white/5" href="/admin/pages">
              Edit homepage hero
            </a>
            <a className="rounded-lg border border-white/10 px-3 py-2 text-xs hover:bg-white/5" href="/admin/leads">
              View leads
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
