"use client";

import { useEffect, useMemo, useState } from "react";
import { adminFetch } from "@/lib/admin-api";

type Audit = {
  id: number;
  entityType: string;
  entityId: string;
  action: string;
  changedBy?: number | null;
  timestamp: string;
  diffJson?: any;
};

function safeString(v: any) {
  if (v === null || v === undefined) return "";
  return String(v);
}

export default function AdminAuditLogs() {
  const [items, setItems] = useState<Audit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [q, setQ] = useState("");
  const [actionFilter, setActionFilter] = useState("all");
  const [entityFilter, setEntityFilter] = useState("all");

  const [open, setOpen] = useState<Record<number, boolean>>({});

  async function load() {
    setError(null);
    setLoading(true);
    try {
      const data = await adminFetch<Audit[]>("/admin/audit");
      setItems(data);
    } catch (e: any) {
      setError(e?.message || "Failed to load audit logs.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load().catch(() => {});
  }, []);

  const actions = useMemo(() => {
    const s = new Set<string>();
    items.forEach((x) => x.action && s.add(x.action));
    return Array.from(s).sort();
  }, [items]);

  const entityTypes = useMemo(() => {
    const s = new Set<string>();
    items.forEach((x) => x.entityType && s.add(x.entityType));
    return Array.from(s).sort();
  }, [items]);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();

    return items
      .slice()
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .filter((a) => {
        if (actionFilter !== "all" && a.action !== actionFilter) return false;
        if (entityFilter !== "all" && a.entityType !== entityFilter) return false;

        if (!query) return true;

        const hay = [
          a.entityType,
          a.entityId,
          a.action,
          a.changedBy ? `user ${a.changedBy}` : "",
          JSON.stringify(a.diffJson ?? {}),
        ]
          .join(" ")
          .toLowerCase();

        return hay.includes(query);
      });
  }, [items, q, actionFilter, entityFilter]);

  function toggle(id: number) {
    setOpen((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Audit Logs</h1>
        <button
          className="rounded-lg border border-white/10 px-3 py-1.5 text-xs disabled:opacity-60"
          onClick={load}
          disabled={loading}
        >
          {loading ? "Loading..." : "Refresh"}
        </button>
      </div>

      {error ? (
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-xs text-red-200">
          {error}
        </div>
      ) : null}

      <div className="flex flex-wrap gap-3">
        <input
          className="rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-xs w-full sm:w-64"
          placeholder="Search (entity, action, user, JSON...)"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />

        <select
          className="rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-xs"
          value={entityFilter}
          onChange={(e) => setEntityFilter(e.target.value)}
        >
          <option value="all">All entity types</option>
          {entityTypes.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>

        <select
          className="rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-xs"
          value={actionFilter}
          onChange={(e) => setActionFilter(e.target.value)}
        >
          <option value="all">All actions</option>
          {actions.map((a) => (
            <option key={a} value={a}>
              {a}
            </option>
          ))}
        </select>

        <div className="text-xs text-white/50 self-center">
          Showing {filtered.length} / {items.length}
        </div>
      </div>

      {loading ? (
        <div className="text-sm text-white/60">Loading...</div>
      ) : (
        <div className="space-y-2">
          {filtered.map((a) => {
            const isOpen = !!open[a.id];
            const hasDiff = a.diffJson !== null && a.diffJson !== undefined;

            return (
              <div key={a.id} className="rounded-xl border border-white/10 bg-white/5 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-sm font-semibold truncate">
                      {a.entityType} <span className="text-white/50">#{safeString(a.entityId)}</span>
                    </div>
                    <div className="mt-1 text-xs text-white/70">
                      {a.action}
                      {a.changedBy ? ` • user ${a.changedBy}` : ""}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-xs text-white/50">{new Date(a.timestamp).toLocaleString()}</div>
                    {hasDiff ? (
                      <button
                        className="mt-2 rounded-lg border border-white/10 px-2 py-1 text-[11px] hover:bg-white/5"
                        onClick={() => toggle(a.id)}
                        type="button"
                      >
                        {isOpen ? "Hide diff" : "Show diff"}
                      </button>
                    ) : null}
                  </div>
                </div>

                {hasDiff && isOpen ? (
                  <pre className="mt-3 rounded-lg border border-white/10 bg-white/5 p-3 text-xs text-white/60 whitespace-pre-wrap overflow-auto">
                    {JSON.stringify(a.diffJson, null, 2)}
                  </pre>
                ) : null}
              </div>
            );
          })}

          {!filtered.length ? (
            <div className="text-sm text-white/60">No audit logs match your filters.</div>
          ) : null}
        </div>
      )}
    </div>
  );
}
