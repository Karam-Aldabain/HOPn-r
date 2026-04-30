"use client";

import { useEffect, useMemo, useState } from "react";
import { adminFetch } from "@/lib/admin-api";

type Partner = {
  id: number;
  name: string;
  logo?: string | null;
  url?: string | null;
  description?: string | null;
  partnershipType?: string | null;
  visible: boolean;
  order: number;
};

type Settings = {
  displayMode?: "carousel" | "grid";
  carouselSpeed?: number;
};

type Draft = {
  name: string;
  partnershipType: string;
  url: string;
  logo: string;
  description: string;
  visible: boolean;
  order: number;
};

function isLikelyImageUrl(s: string) {
  const v = (s || "").trim();
  return v.startsWith("http://") || v.startsWith("https://") || v.startsWith("/");
}

export default function AdminPartners() {
  const [items, setItems] = useState<Partner[]>([]);
  const [drafts, setDrafts] = useState<Record<number, Draft>>({});
  const [loading, setLoading] = useState(true);

  const [name, setName] = useState("");

  const [displayMode, setDisplayMode] = useState<"carousel" | "grid">("carousel");
  const [carouselSpeed, setCarouselSpeed] = useState(30);
  const [savingSettings, setSavingSettings] = useState(false);

  const [busyId, setBusyId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const sorted = useMemo(
    () => items.slice().sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
    [items],
  );

  function initDraft(p: Partner): Draft {
    return {
      name: p.name || "",
      partnershipType: p.partnershipType || "",
      url: p.url || "",
      logo: p.logo || "",
      description: p.description || "",
      visible: !!p.visible,
      order: Number.isFinite(p.order) ? p.order : 0,
    };
  }

  function patchDraft(id: number, patch: Partial<Draft>) {
    setDrafts((prev) => ({ ...prev, [id]: { ...prev[id], ...patch } }));
  }

  async function load() {
    setError(null);
    setLoading(true);
    try {
      const [data, settings] = await Promise.all([
        adminFetch<Partner[]>("/admin/partners"),
        adminFetch<Settings>("/admin/partners/settings").catch(() => ({} as Settings)),
      ]);

      setItems(data);

      if (settings?.displayMode) setDisplayMode(settings.displayMode);
      if (typeof settings?.carouselSpeed === "number") setCarouselSpeed(settings.carouselSpeed);

      setDrafts((prev) => {
        const next = { ...prev };
        for (const p of data) {
          if (!next[p.id]) next[p.id] = initDraft(p);
        }
        return next;
      });
    } catch (e: any) {
      setError(e?.message || "Failed to load partners.");
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
    if (!n) return setError("Name is required.");

    try {
      await adminFetch("/admin/partners", {
        method: "POST",
        body: JSON.stringify({ name: n }),
      });
      setName("");
      await load();
    } catch (e: any) {
      setError(e?.message || "Failed to add partner.");
    }
  }

  async function save(id: number) {
    setError(null);
    const d = drafts[id];
    if (!d) return;

    setBusyId(id);
    try {
      await adminFetch(`/admin/partners/${id}`, {
        method: "PATCH",
        body: JSON.stringify({
          name: d.name.trim(),
          partnershipType: d.partnershipType.trim() ? d.partnershipType.trim() : null,
          url: d.url.trim() ? d.url.trim() : null,
          logo: d.logo.trim() ? d.logo.trim() : null,
          description: d.description.trim() ? d.description.trim() : null,
          visible: !!d.visible,
          order: Number(d.order) || 0,
        }),
      });

      // update local list without reload (prevents UI jumping)
      setItems((prev) =>
        prev.map((p) =>
          p.id === id
            ? {
                ...p,
                name: d.name,
                partnershipType: d.partnershipType || null,
                url: d.url || null,
                logo: d.logo || null,
                description: d.description || null,
                visible: !!d.visible,
                order: Number(d.order) || 0,
              }
            : p,
        ),
      );
    } catch (e: any) {
      setError(e?.message || "Failed to save partner.");
    } finally {
      setBusyId(null);
    }
  }

  function reset(id: number) {
    const p = items.find((x) => x.id === id);
    if (!p) return;
    setDrafts((prev) => ({ ...prev, [id]: initDraft(p) }));
  }

  async function remove(id: number) {
    setError(null);
    setBusyId(id);

    // optimistic remove so layout doesn't “break”
    const prevItems = items;
    setItems((prev) => prev.filter((x) => x.id !== id));
    setDrafts((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });

    try {
      await adminFetch(`/admin/partners/${id}`, { method: "DELETE" });
    } catch (e: any) {
      setError(e?.message || "Failed to delete partner.");
      setItems(prevItems);
      await load();
    } finally {
      setBusyId(null);
    }
  }

  async function saveSettings() {
    setError(null);
    setSavingSettings(true);
    try {
      await adminFetch("/admin/partners/settings", {
        method: "PUT",
        body: JSON.stringify({ displayMode, carouselSpeed }),
      });
    } catch (e: any) {
      setError(e?.message || "Failed to save settings.");
    } finally {
      setSavingSettings(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Partners</h1>
      </div>

      {error ? (
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-xs text-red-200">
          {error}
        </div>
      ) : null}

      {/* SETTINGS */}
      <div className="rounded-xl border border-white/10 bg-white/5 p-4">
        <div className="text-sm font-semibold">Display Settings</div>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          <select
            className="rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-xs"
            value={displayMode}
            onChange={(e) => setDisplayMode(e.target.value as "carousel" | "grid")}
          >
            <option value="carousel">Carousel</option>
            <option value="grid">Grid</option>
          </select>
          <input
            className="rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-xs"
            type="number"
            value={carouselSpeed}
            onChange={(e) => setCarouselSpeed(Number(e.target.value) || 0)}
            placeholder="Carousel speed"
          />
          <button
            className="rounded-lg bg-[#C51F5D] px-3 py-2 text-xs disabled:opacity-60"
            onClick={saveSettings}
            disabled={savingSettings}
          >
            {savingSettings ? "Saving..." : "Save Settings"}
          </button>
        </div>
      </div>

      {/* ADD */}
      <div className="rounded-xl border border-white/10 bg-white/5 p-4">
        <div className="grid gap-3 sm:grid-cols-2">
          <input
            className="rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-xs"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button className="rounded-lg bg-[#C51F5D] px-3 py-2 text-xs" onClick={add}>
            Add
          </button>
        </div>
      </div>

      {/* LIST */}
      {loading ? (
        <div className="text-sm text-white/60">Loading...</div>
      ) : (
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {sorted.map((p) => {
            const d = drafts[p.id];
            if (!d) return null;

            return (
              <div key={p.id} className="rounded-lg border border-white/10 bg-white/5 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="truncate text-sm font-semibold">{p.name}</div>
                    <div className="mt-1 text-[11px] text-white/50">
                      ID #{p.id} • order {p.order} • {p.visible ? "Visible" : "Hidden"}
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center gap-2">
                    <button
                      className="rounded-lg border border-white/10 px-2 py-1 text-[11px] hover:bg-white/5 disabled:opacity-60"
                      onClick={() => reset(p.id)}
                      disabled={busyId === p.id}
                      type="button"
                    >
                      Reset
                    </button>
                    <button
                      className="rounded-lg bg-[#C51F5D] px-2 py-1 text-[11px] font-semibold disabled:opacity-60"
                      onClick={() => save(p.id)}
                      disabled={busyId === p.id}
                      type="button"
                    >
                      {busyId === p.id ? "Saving..." : "Save"}
                    </button>
                    <button
                      className="text-xs text-red-400 disabled:opacity-60"
                      onClick={() => remove(p.id)}
                      disabled={busyId === p.id}
                      type="button"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                {/* LOGO PREVIEW */}
                {d.logo && isLikelyImageUrl(d.logo) ? (
                  <div className="mt-3 flex items-center justify-center rounded-lg border border-white/10 bg-white/5 p-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={d.logo}
                      alt="logo"
                      className="h-12 w-full object-contain"
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
                    onChange={(e) => patchDraft(p.id, { name: e.target.value })}
                    placeholder="Name"
                  />
                  <input
                    className="rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-xs"
                    value={d.partnershipType}
                    onChange={(e) => patchDraft(p.id, { partnershipType: e.target.value })}
                    placeholder="Type"
                  />
                  <input
                    className="rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-xs"
                    value={d.url}
                    onChange={(e) => patchDraft(p.id, { url: e.target.value })}
                    placeholder="Website URL"
                  />
                  <input
                    className="rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-xs"
                    value={d.logo}
                    onChange={(e) => patchDraft(p.id, { logo: e.target.value })}
                    placeholder="Logo URL"
                  />
                  <textarea
                    className="rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-xs"
                    value={d.description}
                    onChange={(e) => patchDraft(p.id, { description: e.target.value })}
                    placeholder="Description"
                    rows={3}
                  />
                  <div className="grid gap-3 sm:grid-cols-2">
                    <select
                      className="rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-xs"
                      value={d.visible ? "true" : "false"}
                      onChange={(e) => patchDraft(p.id, { visible: e.target.value === "true" })}
                    >
                      <option value="true">Visible</option>
                      <option value="false">Hidden</option>
                    </select>
                    <input
                      className="rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-xs"
                      type="number"
                      value={d.order}
                      onChange={(e) => patchDraft(p.id, { order: Number(e.target.value) || 0 })}
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
