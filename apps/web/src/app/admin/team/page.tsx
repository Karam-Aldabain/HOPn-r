"use client";

import { useEffect, useMemo, useState } from "react";
import { adminFetch } from "@/lib/admin-api";

type TeamMember = {
  id: number;
  name: string;
  role: string;
  photo?: string | null;
  bio?: string | null;
  linkedinUrl?: string | null;
  visible: boolean;
  order: number;
};

type Draft = {
  name: string;
  role: string;
  photo: string;
  linkedinUrl: string;
  bio: string;
  visible: boolean;
  order: number;
};

function isLikelyImageUrl(s: string) {
  const v = (s || "").trim();
  return v.startsWith("http://") || v.startsWith("https://") || v.startsWith("/");
}

export default function AdminTeam() {
  const [items, setItems] = useState<TeamMember[]>([]);
  const [drafts, setDrafts] = useState<Record<number, Draft>>({});
  const [loading, setLoading] = useState(true);

  const [name, setName] = useState("");
  const [role, setRole] = useState("");

  const [busyId, setBusyId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const sorted = useMemo(
    () => items.slice().sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
    [items],
  );

  function initDraft(m: TeamMember): Draft {
    return {
      name: m.name || "",
      role: m.role || "",
      photo: m.photo || "",
      linkedinUrl: m.linkedinUrl || "",
      bio: m.bio || "",
      visible: !!m.visible,
      order: Number.isFinite(m.order) ? m.order : 0,
    };
  }

  function patchDraft(id: number, patch: Partial<Draft>) {
    setDrafts((prev) => ({ ...prev, [id]: { ...prev[id], ...patch } }));
  }

  async function load() {
    setError(null);
    setLoading(true);
    try {
      const data = await adminFetch<TeamMember[]>("/admin/team");
      setItems(data);
      setDrafts((prev) => {
        const next = { ...prev };
        for (const m of data) {
          if (!next[m.id]) next[m.id] = initDraft(m);
        }
        return next;
      });
    } catch (e: any) {
      setError(e?.message || "Failed to load team.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load().catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function add() {
    setError(null);
    const n = name.trim();
    const r = role.trim();
    if (!n) return setError("Name is required.");
    if (!r) return setError("Role is required.");

    try {
      await adminFetch("/admin/team", {
        method: "POST",
        body: JSON.stringify({ name: n, role: r }),
      });
      setName("");
      setRole("");
      await load();
    } catch (e: any) {
      setError(e?.message || "Failed to add team member.");
    }
  }

  async function save(id: number) {
    setError(null);
    const d = drafts[id];
    if (!d) return;

    setBusyId(id);
    try {
      await adminFetch(`/admin/team/${id}`, {
        method: "PATCH",
        body: JSON.stringify({
          name: d.name.trim(),
          role: d.role.trim(),
          photo: d.photo.trim() ? d.photo.trim() : null,
          linkedinUrl: d.linkedinUrl.trim() ? d.linkedinUrl.trim() : null,
          bio: d.bio.trim() ? d.bio.trim() : null,
          visible: !!d.visible,
          order: Number(d.order) || 0,
        }),
      });

      // update local list without reload (stable UI)
      setItems((prev) =>
        prev.map((m) =>
          m.id === id
            ? {
                ...m,
                name: d.name,
                role: d.role,
                photo: d.photo || null,
                linkedinUrl: d.linkedinUrl || null,
                bio: d.bio || null,
                visible: !!d.visible,
                order: Number(d.order) || 0,
              }
            : m,
        ),
      );
    } catch (e: any) {
      setError(e?.message || "Failed to save team member.");
    } finally {
      setBusyId(null);
    }
  }

  function reset(id: number) {
    const m = items.find((x) => x.id === id);
    if (!m) return;
    setDrafts((prev) => ({ ...prev, [id]: initDraft(m) }));
  }

  async function remove(id: number) {
    setError(null);
    setBusyId(id);

    // optimistic remove so layout never breaks
    const prevItems = items;
    setItems((prev) => prev.filter((x) => x.id !== id));
    setDrafts((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });

    try {
      await adminFetch(`/admin/team/${id}`, { method: "DELETE" });
    } catch (e: any) {
      setError(e?.message || "Failed to delete team member.");
      setItems(prevItems);
      await load();
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Team</h1>
      </div>

      {error ? (
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-xs text-red-200">
          {error}
        </div>
      ) : null}

      {/* ADD */}
      <div className="rounded-xl border border-white/10 bg-white/5 p-4">
        <div className="grid gap-3 sm:grid-cols-2">
          <input
            className="rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-xs"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            className="rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-xs"
            placeholder="Role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          />
        </div>
        <button className="mt-3 rounded-lg bg-[#C51F5D] px-3 py-1.5 text-xs" onClick={add}>
          Add
        </button>
      </div>

      {/* LIST */}
      {loading ? (
        <div className="text-sm text-white/60">Loading...</div>
      ) : (
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {sorted.map((m) => {
            const d = drafts[m.id];
            if (!d) return null;

            return (
              <div key={m.id} className="rounded-lg border border-white/10 bg-white/5 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="truncate text-sm font-semibold">{m.name}</div>
                    <div className="mt-1 text-[11px] text-white/50">
                      ID #{m.id} • order {m.order} • {m.visible ? "Visible" : "Hidden"}
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center gap-2">
                    <button
                      className="rounded-lg border border-white/10 px-2 py-1 text-[11px] hover:bg-white/5 disabled:opacity-60"
                      onClick={() => reset(m.id)}
                      disabled={busyId === m.id}
                      type="button"
                    >
                      Reset
                    </button>
                    <button
                      className="rounded-lg bg-[#C51F5D] px-2 py-1 text-[11px] font-semibold disabled:opacity-60"
                      onClick={() => save(m.id)}
                      disabled={busyId === m.id}
                      type="button"
                    >
                      {busyId === m.id ? "Saving..." : "Save"}
                    </button>
                    <button
                      className="text-xs text-red-400 disabled:opacity-60"
                      onClick={() => remove(m.id)}
                      disabled={busyId === m.id}
                      type="button"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                {/* PHOTO PREVIEW */}
                {d.photo && isLikelyImageUrl(d.photo) ? (
                  <div className="mt-3 overflow-hidden rounded-lg border border-white/10 bg-white/5">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={d.photo}
                      alt="photo"
                      className="h-40 w-full object-cover"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).style.display = "none";
                      }}
                    />
                  </div>
                ) : null}

                <div className="mt-4 grid gap-3">
                  <input
                    className="rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-xs"
                    value={d.name}
                    onChange={(e) => patchDraft(m.id, { name: e.target.value })}
                    placeholder="Name"
                  />
                  <input
                    className="rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-xs"
                    value={d.role}
                    onChange={(e) => patchDraft(m.id, { role: e.target.value })}
                    placeholder="Role"
                  />
                  <input
                    className="rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-xs"
                    value={d.photo}
                    onChange={(e) => patchDraft(m.id, { photo: e.target.value })}
                    placeholder="Photo URL"
                  />
                  <input
                    className="rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-xs"
                    value={d.linkedinUrl}
                    onChange={(e) => patchDraft(m.id, { linkedinUrl: e.target.value })}
                    placeholder="LinkedIn URL"
                  />
                  <textarea
                    className="rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-xs"
                    value={d.bio}
                    onChange={(e) => patchDraft(m.id, { bio: e.target.value })}
                    placeholder="Bio"
                    rows={3}
                  />

                  <div className="grid gap-3 sm:grid-cols-2">
                    <select
                      className="rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-xs"
                      value={d.visible ? "true" : "false"}
                      onChange={(e) => patchDraft(m.id, { visible: e.target.value === "true" })}
                    >
                      <option value="true">Visible</option>
                      <option value="false">Hidden</option>
                    </select>
                    <input
                      className="rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-xs"
                      type="number"
                      value={d.order}
                      onChange={(e) => patchDraft(m.id, { order: Number(e.target.value) || 0 })}
                      placeholder="Order"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
