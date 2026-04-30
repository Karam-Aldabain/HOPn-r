"use client";

import { useEffect, useMemo, useState } from "react";
import { ADMIN_API_BASE, adminFetch, getAdminToken } from "@/lib/admin-api";

type Lead = {
  id: number;
  name: string;
  email: string;
  company?: string;
  topic: string;
  message: string;
  status: string;
  createdAt: string;
  notes?: { id: number; body: string; createdAt: string }[];
  statusHistory?: { id: number; fromStatus?: string | null; toStatus: string; changedAt: string }[];
};

const statuses = ["NEW", "CONTACTED", "QUALIFIED", "WON", "LOST"] as const;

export default function AdminLeads() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [topicFilter, setTopicFilter] = useState("all");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [busyLeadId, setBusyLeadId] = useState<number | null>(null);

  // draft note text per lead
  const [noteDraft, setNoteDraft] = useState<Record<number, string>>({});

  const qs = useMemo(() => {
    const params = new URLSearchParams();
    if (statusFilter !== "all") params.set("status", statusFilter);
    if (topicFilter !== "all") params.set("topic", topicFilter);
    const str = params.toString();
    return str ? `?${str}` : "";
  }, [statusFilter, topicFilter]);

  async function load() {
    setError(null);
    setLoading(true);
    try {
      const data = await adminFetch<Lead[]>(`/admin/leads${qs}`);
      setLeads(data);
      // initialize note drafts for visible leads
      setNoteDraft((prev) => {
        const next = { ...prev };
        for (const l of data) if (next[l.id] === undefined) next[l.id] = "";
        return next;
      });
    } catch (e: any) {
      setError(e?.message || "Failed to load leads.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load().catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [qs]);

  async function updateStatus(id: number, status: string) {
    setError(null);
    setBusyLeadId(id);

    // optimistic update (no flicker)
    const prev = leads;
    setLeads((cur) => cur.map((l) => (l.id === id ? { ...l, status } : l)));

    try {
      await adminFetch(`/admin/leads/${id}/status`, {
        method: "PUT",
        body: JSON.stringify({ status }),
      });
      // optional: reload to refresh statusHistory (if backend returns updated history only on fetch)
      await load();
    } catch (e: any) {
      setError(e?.message || "Failed to update status.");
      setLeads(prev);
    } finally {
      setBusyLeadId(null);
    }
  }

  async function addNote(id: number) {
    setError(null);
    const body = (noteDraft[id] || "").trim();
    if (!body) return;

    setBusyLeadId(id);

    try {
      await adminFetch(`/admin/leads/${id}/notes`, {
        method: "POST",
        body: JSON.stringify({ body }),
      });

      // clear draft immediately
      setNoteDraft((prev) => ({ ...prev, [id]: "" }));

      // reload to show note + timestamp from server
      await load();
    } catch (e: any) {
      setError(e?.message || "Failed to add note.");
    } finally {
      setBusyLeadId(null);
    }
  }

  async function exportCsv() {
    setError(null);
    try {
      const token = getAdminToken();
      const params = new URLSearchParams();
      if (statusFilter !== "all") params.set("status", statusFilter);
      if (topicFilter !== "all") params.set("topic", topicFilter);

      const res = await fetch(
        `${ADMIN_API_BASE}/admin/leads/export.csv${params.toString() ? `?${params.toString()}` : ""}`,
        { headers: token ? { Authorization: `Bearer ${token}` } : undefined },
      );
      if (!res.ok) return;

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "leads.csv";
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (e: any) {
      setError(e?.message || "Export failed.");
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Leads</h1>
        <button
          className="rounded-lg border border-white/10 px-3 py-1.5 text-xs"
          onClick={exportCsv}
        >
          Export CSV
        </button>
      </div>

      {error ? (
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-xs text-red-200">
          {error}
        </div>
      ) : null}

      <div className="flex flex-wrap gap-3">
        <select
          className="rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-xs"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All statuses</option>
          {statuses.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>

        <select
          className="rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-xs"
          value={topicFilter}
          onChange={(e) => setTopicFilter(e.target.value)}
        >
          <option value="all">All topics</option>
          <option value="Solutions">Solutions</option>
          <option value="Partnership">Partnership</option>
          <option value="Project">Project</option>
          <option value="Careers">Careers</option>
          <option value="Other">Other</option>
        </select>

        <button
          className="rounded-lg border border-white/10 px-3 py-2 text-xs"
          onClick={load}
          disabled={loading}
        >
          {loading ? "Loading..." : "Refresh"}
        </button>
      </div>

      {loading ? (
        <div className="text-sm text-white/60">Loading...</div>
      ) : (
        <div className="space-y-3">
          {leads.map((l) => (
            <div key={l.id} className="rounded-xl border border-white/10 bg-white/5 p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-sm font-semibold">{l.name}</div>
                  <div className="text-xs text-white/60">
                    {l.email} - {l.company || "-"} - {l.topic}
                  </div>
                  <div className="mt-1 text-[11px] text-white/40">
                    {new Date(l.createdAt).toLocaleString()}
                  </div>
                </div>

                <select
                  className="rounded-lg bg-white/5 border border-white/10 px-2 py-1 text-xs disabled:opacity-60"
                  value={l.status}
                  onChange={(e) => updateStatus(l.id, e.target.value)}
                  disabled={busyLeadId === l.id}
                >
                  {statuses.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mt-3 text-sm text-white/70 whitespace-pre-wrap">{l.message}</div>

              {/* NOTES */}
              <div className="mt-4 rounded-lg border border-white/10 bg-white/5 p-3">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-semibold text-white/70">Notes</div>
                  <button
                    className="rounded-lg bg-[#C51F5D] px-3 py-1.5 text-xs disabled:opacity-60"
                    onClick={() => addNote(l.id)}
                    disabled={busyLeadId === l.id || !(noteDraft[l.id] || "").trim()}
                  >
                    {busyLeadId === l.id ? "Saving..." : "Add Note"}
                  </button>
                </div>

                <div className="mt-2 space-y-2">
                  {(l.notes || []).map((n) => (
                    <div key={n.id} className="rounded-lg border border-white/10 bg-white/5 p-2 text-xs">
                      <div className="text-white/60">{new Date(n.createdAt).toLocaleString()}</div>
                      <div className="mt-1 text-white/80 whitespace-pre-wrap">{n.body}</div>
                    </div>
                  ))}
                </div>

                <textarea
                  className="mt-3 w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-xs"
                  placeholder="Add a note"
                  value={noteDraft[l.id] ?? ""}
                  onChange={(e) => setNoteDraft((prev) => ({ ...prev, [l.id]: e.target.value }))}
                  rows={3}
                />
              </div>

              {/* STATUS HISTORY */}
              <div className="mt-3 rounded-lg border border-white/10 bg-white/5 p-3">
                <div className="text-xs font-semibold text-white/70">Status history</div>
                <div className="mt-2 space-y-2 text-xs text-white/70">
                  {(l.statusHistory || []).map((h) => (
                    <div key={h.id} className="rounded-lg border border-white/10 bg-white/5 p-2">
                      <div>{new Date(h.changedAt).toLocaleString()}</div>
                      <div>
                        {h.fromStatus ? `${h.fromStatus} → ` : ""}
                        {h.toStatus}
                      </div>
                    </div>
                  ))}
                  {!l.statusHistory?.length ? (
                    <div className="text-xs text-white/50">No history yet.</div>
                  ) : null}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
