"use client";

import { useEffect, useMemo, useState } from "react";
import { adminFetch } from "@/lib/admin-api";

type Project = {
  id: number;
  title: string;
  shortDesc: string;
  longDesc?: string | null;
  industry: string;
  techTags?: string[];
  highlights?: string[];
  coverImage?: string | null;
  gallery?: string[];
  externalUrl?: string | null;
  featured: boolean;
  published: boolean;
  order: number;
};

type Draft = {
  title: string;
  industry: string;
  shortDesc: string;
  longDesc: string;
  techTagsText: string; // comma separated
  highlightsText: string; // comma separated
  coverImage: string;
  galleryText: string; // comma separated
  externalUrl: string;
  featured: boolean;
  published: boolean;
  order: number;
};

function toComma(arr?: string[]) {
  return (arr || []).filter(Boolean).join(", ");
}
function fromComma(text: string) {
  return (text || "")
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
}
function isLikelyImageUrl(s: string) {
  const v = (s || "").trim();
  return v.startsWith("http://") || v.startsWith("https://") || v.startsWith("/");
}

export default function AdminProjects() {
  const [items, setItems] = useState<Project[]>([]);
  const [drafts, setDrafts] = useState<Record<number, Draft>>({});
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [industry, setIndustry] = useState("");

  const sorted = useMemo(
    () => items.slice().sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
    [items],
  );

  function initDraft(p: Project): Draft {
    return {
      title: p.title || "",
      industry: p.industry || "",
      shortDesc: p.shortDesc || "",
      longDesc: p.longDesc || "",
      techTagsText: toComma(p.techTags),
      highlightsText: toComma(p.highlights),
      coverImage: p.coverImage || "",
      galleryText: toComma(p.gallery),
      externalUrl: p.externalUrl || "",
      featured: !!p.featured,
      published: !!p.published,
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
      const data = await adminFetch<Project[]>("/admin/projects");
      setItems(data);
      setDrafts((prev) => {
        const next = { ...prev };
        for (const p of data) {
          if (!next[p.id]) next[p.id] = initDraft(p);
        }
        return next;
      });
    } catch (e: any) {
      setError(e?.message || "Failed to load projects.");
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
    const t = title.trim();
    const ind = industry.trim();
    if (!t) return setError("Title is required.");
    if (!ind) return setError("Industry is required.");

    try {
      await adminFetch("/admin/projects", {
        method: "POST",
        body: JSON.stringify({
          title: t,
          shortDesc: "Short description",
          industry: ind,
          techTags: [],
          published: false,
        }),
      });
      setTitle("");
      setIndustry("");
      await load();
    } catch (e: any) {
      setError(e?.message || "Failed to add project.");
    }
  }

  async function save(id: number) {
    setError(null);
    const d = drafts[id];
    if (!d) return;

    setBusyId(id);
    try {
      await adminFetch(`/admin/projects/${id}`, {
        method: "PATCH",
        body: JSON.stringify({
          title: d.title.trim(),
          industry: d.industry.trim(),
          shortDesc: d.shortDesc.trim(),
          longDesc: d.longDesc.trim() ? d.longDesc.trim() : null,
          techTags: fromComma(d.techTagsText),
          highlights: fromComma(d.highlightsText),
          coverImage: d.coverImage.trim() ? d.coverImage.trim() : null,
          gallery: fromComma(d.galleryText),
          externalUrl: d.externalUrl.trim() ? d.externalUrl.trim() : null,
          featured: !!d.featured,
          published: !!d.published,
          order: Number(d.order) || 0,
        }),
      });

      // update local list (no reload -> no “jumping”)
      setItems((prev) =>
        prev.map((p) =>
          p.id === id
            ? {
                ...p,
                title: d.title,
                industry: d.industry,
                shortDesc: d.shortDesc,
                longDesc: d.longDesc || null,
                techTags: fromComma(d.techTagsText),
                highlights: fromComma(d.highlightsText),
                coverImage: d.coverImage || null,
                gallery: fromComma(d.galleryText),
                externalUrl: d.externalUrl || null,
                featured: !!d.featured,
                published: !!d.published,
                order: Number(d.order) || 0,
              }
            : p,
        ),
      );
    } catch (e: any) {
      setError(e?.message || "Failed to save project.");
    } finally {
      setBusyId(null);
    }
  }

  async function remove(id: number) {
    setError(null);
    setBusyId(id);

    // optimistic remove so UI doesn't break
    const prevItems = items;
    setItems((p) => p.filter((x) => x.id !== id));
    setDrafts((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });

    try {
      await adminFetch(`/admin/projects/${id}`, { method: "DELETE" });
    } catch (e: any) {
      setError(e?.message || "Failed to delete project.");
      // restore on failure
      setItems(prevItems);
      await load();
    } finally {
      setBusyId(null);
    }
  }

  function reset(id: number) {
    const p = items.find((x) => x.id === id);
    if (!p) return;
    setDrafts((prev) => ({ ...prev, [id]: initDraft(p) }));
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Projects</h1>
        <p className="text-xs text-white/50">Stable editing + image previews (same colors).</p>
      </div>

      {error ? (
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-xs text-red-200">
          {error}
        </div>
      ) : null}

      <div className="rounded-xl border border-white/10 bg-white/5 p-4">
        <div className="grid gap-3 sm:grid-cols-2">
          <input
            className="rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-xs"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <input
            className="rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-xs"
            placeholder="Industry"
            value={industry}
            onChange={(e) => setIndustry(e.target.value)}
          />
        </div>
        <button className="mt-3 rounded-lg bg-[#C51F5D] px-3 py-1.5 text-xs" onClick={add}>
          Add
        </button>
      </div>

      {loading ? (
        <div className="text-sm text-white/60">Loading...</div>
      ) : (
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {sorted.map((p) => {
            const d = drafts[p.id];
            if (!d) return null;

            const galleryArr = fromComma(d.galleryText);

            return (
              <div key={p.id} className="rounded-lg border border-white/10 bg-white/5 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="truncate text-sm font-semibold">{p.title}</div>
                    <div className="mt-1 text-[11px] text-white/50">
                      ID #{p.id} • order {p.order} • {p.published ? "Published" : "Unpublished"} •{" "}
                      {p.featured ? "Featured" : "Not featured"}
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center gap-2">
                    <button
                      className="rounded-lg border border-white/10 px-2 py-1 text-[11px] hover:bg-white/5 disabled:opacity-60"
                      onClick={() => reset(p.id)}
                      type="button"
                      disabled={busyId === p.id}
                    >
                      Reset
                    </button>
                    <button
                      className="rounded-lg bg-[#C51F5D] px-2 py-1 text-[11px] font-semibold disabled:opacity-60"
                      onClick={() => save(p.id)}
                      type="button"
                      disabled={busyId === p.id}
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

                {/* Cover preview */}
                {d.coverImage && isLikelyImageUrl(d.coverImage) ? (
                  <div className="mt-3 overflow-hidden rounded-lg border border-white/10 bg-white/5">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={d.coverImage}
                      alt="cover"
                      className="h-36 w-full object-cover"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).style.display = "none";
                      }}
                    />
                  </div>
                ) : null}

                <div className="mt-4 grid gap-3">
                  <input
                    className="rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-xs"
                    value={d.title}
                    onChange={(e) => patchDraft(p.id, { title: e.target.value })}
                    placeholder="Title"
                  />
                  <input
                    className="rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-xs"
                    value={d.industry}
                    onChange={(e) => patchDraft(p.id, { industry: e.target.value })}
                    placeholder="Industry"
                  />

                  <textarea
                    className="rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-xs"
                    value={d.shortDesc}
                    onChange={(e) => patchDraft(p.id, { shortDesc: e.target.value })}
                    placeholder="Short description"
                    rows={2}
                  />
                  <textarea
                    className="rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-xs"
                    value={d.longDesc}
                    onChange={(e) => patchDraft(p.id, { longDesc: e.target.value })}
                    placeholder="Long description"
                    rows={3}
                  />

                  <input
                    className="rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-xs"
                    value={d.techTagsText}
                    onChange={(e) => patchDraft(p.id, { techTagsText: e.target.value })}
                    placeholder="Tech tags (comma)"
                  />
                  <input
                    className="rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-xs"
                    value={d.highlightsText}
                    onChange={(e) => patchDraft(p.id, { highlightsText: e.target.value })}
                    placeholder="Highlights (comma)"
                  />

                  <input
                    className="rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-xs"
                    value={d.coverImage}
                    onChange={(e) => patchDraft(p.id, { coverImage: e.target.value })}
                    placeholder="Cover image URL"
                  />

                  <input
                    className="rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-xs"
                    value={d.galleryText}
                    onChange={(e) => patchDraft(p.id, { galleryText: e.target.value })}
                    placeholder="Gallery URLs (comma)"
                  />

                  <input
                    className="rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-xs"
                    value={d.externalUrl}
                    onChange={(e) => patchDraft(p.id, { externalUrl: e.target.value })}
                    placeholder="External link (optional)"
                  />

                  {/* Gallery preview */}
                  {galleryArr.length ? (
                    <div className="grid grid-cols-3 gap-2">
                      {galleryArr.slice(0, 6).map((url, idx) => (
                        <div
                          key={`${p.id}-g-${idx}`}
                          className="overflow-hidden rounded-lg border border-white/10 bg-white/5"
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={url}
                            alt="gallery"
                            className="h-20 w-full object-cover"
                            onError={(e) => {
                              (e.currentTarget as HTMLImageElement).style.display = "none";
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  ) : null}

                  <div className="grid gap-3 sm:grid-cols-2">
                    <select
                      className="rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-xs"
                      value={d.featured ? "true" : "false"}
                      onChange={(e) => patchDraft(p.id, { featured: e.target.value === "true" })}
                    >
                      <option value="false">Not featured</option>
                      <option value="true">Featured</option>
                    </select>

                    <select
                      className="rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-xs"
                      value={d.published ? "true" : "false"}
                      onChange={(e) => patchDraft(p.id, { published: e.target.value === "true" })}
                    >
                      <option value="false">Unpublished</option>
                      <option value="true">Published</option>
                    </select>
                  </div>

                  <input
                    className="rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-xs"
                    type="number"
                    value={d.order}
                    onChange={(e) => patchDraft(p.id, { order: Number(e.target.value) || 0 })}
                    placeholder="Order"
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
