"use client";

import { useEffect, useMemo, useState } from "react";
import { adminFetch } from "@/lib/admin-api";

type Solution = {
  id: number;
  title: string;
  description: string;
  caseSnippet?: string | null;
  bulletsProblems?: string[];
  bulletsDeliverables?: string[];
  icon?: string | null;
  ctaLabel?: string | null;
  ctaUrl?: string | null;
  visible: boolean;
  order: number;
};

type Draft = {
  title: string;
  description: string;
  caseSnippet: string;
  icon: string;
  bulletsProblemsText: string; // one-per-line
  bulletsDeliverablesText: string; // one-per-line
  ctaLabel: string;
  ctaUrl: string;
  visible: boolean;
  order: number;
};

function toLines(arr?: string[]) {
  return (arr || []).filter(Boolean).join("\n");
}
function fromLines(text: string) {
  return (text || "")
    .split("\n")
    .map((t) => t.trim())
    .filter(Boolean);
}
function isLikelyImageUrl(s: string) {
  const v = (s || "").trim();
  return v.startsWith("http://") || v.startsWith("https://") || v.startsWith("/");
}

export default function AdminSolutions() {
  const [items, setItems] = useState<Solution[]>([]);
  const [drafts, setDrafts] = useState<Record<number, Draft>>({});
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<number | null>(null);
  const [busyMoveId, setBusyMoveId] = useState<number | null>(null);
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");

  const defaultSolutions = useMemo(
    () => [
      {
        title: "AI and Automation",
        description: "AI-powered solutions to automate processes and enhance decision-making.",
        bulletsProblems: ["Manual processes", "Slow decision cycles", "Operational inefficiencies"],
        bulletsDeliverables: ["Automation workflows", "AI models and integrations", "Monitoring & governance"],
        ctaLabel: "Explore AI Solutions",
        ctaUrl: "/ai-solutions",
      },
      {
        title: "Custom Software Development",
        description: "Scalable web and mobile applications tailored to business needs.",
        bulletsProblems: ["Legacy systems", "Feature gaps", "Performance bottlenecks"],
        bulletsDeliverables: ["Web & mobile apps", "APIs & integrations", "Quality assurance"],
        ctaLabel: "Discuss a Project",
        ctaUrl: "/contact",
      },
      {
        title: "Digital Transformation",
        description: "Modernizing systems, workflows, and digital experiences.",
        bulletsProblems: ["Fragmented tooling", "Slow delivery", "Poor customer experience"],
        bulletsDeliverables: ["Modern platforms", "Process redesign", "Change enablement"],
        ctaLabel: "Plan Transformation",
        ctaUrl: "/contact",
      },
      {
        title: "IT and Technology Consulting",
        description: "Strategic guidance for architecture, tools, and execution.",
        bulletsProblems: ["Unclear roadmap", "Tool sprawl", "Risky architecture decisions"],
        bulletsDeliverables: ["Architecture reviews", "Roadmaps & planning", "Delivery oversight"],
        ctaLabel: "Get Expert Advice",
        ctaUrl: "/consulting",
      },
      {
        title: "Data and Cloud Solutions",
        description: "Secure and scalable cloud infrastructure and analytics.",
        bulletsProblems: ["Data silos", "Scalability limits", "Security concerns"],
        bulletsDeliverables: ["Cloud migration", "Data pipelines", "Analytics platforms"],
        ctaLabel: "Explore Data & Cloud",
        ctaUrl: "/services",
      },
      {
        title: "Innovation and Startup Support",
        description: "Support for ideation, MVP delivery, fundraising readiness, and product strategy.",
        bulletsProblems: ["Unvalidated ideas", "Slow MVP cycles", "Go-to-market uncertainty"],
        bulletsDeliverables: ["MVP delivery", "Product strategy", "Pitch readiness"],
        ctaLabel: "Start a Conversation",
        ctaUrl: "/contact",
      },
    ],
    [],
  );

  async function seedDefaults() {
    for (let i = 0; i < defaultSolutions.length; i += 1) {
      const s = defaultSolutions[i];
      await adminFetch("/admin/solutions", {
        method: "POST",
        body: JSON.stringify({
          title: s.title,
          description: s.description,
          bulletsProblems: s.bulletsProblems,
          bulletsDeliverables: s.bulletsDeliverables,
          ctaLabel: s.ctaLabel,
          ctaUrl: s.ctaUrl,
          visible: true,
          order: i,
        }),
      });
    }
  }

  async function load() {
    setError(null);
    setLoading(true);
    try {
      const data = await adminFetch<Solution[]>("/admin/solutions");
      if (!data.length) {
        await seedDefaults();
        const seeded = await adminFetch<Solution[]>("/admin/solutions");
        setItems(seeded);
      } else {
        setItems(data);
      }

      // initialize drafts from server data (only for ids not present yet)
      setDrafts((prev) => {
        const next = { ...prev };
        for (const s of data) {
          if (!next[s.id]) {
            next[s.id] = {
              title: s.title || "",
              description: s.description || "",
              caseSnippet: s.caseSnippet || "",
              icon: s.icon || "",
              bulletsProblemsText: toLines(s.bulletsProblems),
              bulletsDeliverablesText: toLines(s.bulletsDeliverables),
              ctaLabel: s.ctaLabel || "",
              ctaUrl: s.ctaUrl || "",
              visible: !!s.visible,
              order: Number.isFinite(s.order) ? s.order : 0,
            };
          }
        }
        return next;
      });
    } catch (e: any) {
      setError(e?.message || "Failed to load solutions.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sorted = useMemo(() => {
    return items.slice().sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  }, [items]);

  function patchDraft(id: number, patch: Partial<Draft>) {
    setDrafts((prev) => ({ ...prev, [id]: { ...prev[id], ...patch } }));
  }

  function resetDraftFromItem(s: Solution) {
    setDrafts((prev) => ({
      ...prev,
      [s.id]: {
        title: s.title || "",
        description: s.description || "",
        caseSnippet: s.caseSnippet || "",
        icon: s.icon || "",
        bulletsProblemsText: toLines(s.bulletsProblems),
        bulletsDeliverablesText: toLines(s.bulletsDeliverables),
        ctaLabel: s.ctaLabel || "",
        ctaUrl: s.ctaUrl || "",
        visible: !!s.visible,
        order: Number.isFinite(s.order) ? s.order : 0,
      },
    }));
  }

  async function add() {
    setError(null);
    const title = newTitle.trim();
    const description = newDescription.trim();
    if (!title) {
      setError("Title is required.");
      return;
    }
    setAdding(true);
    try {
      await adminFetch("/admin/solutions", {
        method: "POST",
        body: JSON.stringify({ title, description }),
      });
      setNewTitle("");
      setNewDescription("");
      await load();
    } catch (e: any) {
      setError(e?.message || "Failed to add solution.");
    } finally {
      setAdding(false);
    }
  }

  async function save(id: number) {
    setError(null);
    const d = drafts[id];
    if (!d) return;

    setBusyId(id);
    try {
      await adminFetch(`/admin/solutions/${id}`, {
        method: "PATCH",
        body: JSON.stringify({
          title: d.title.trim(),
          description: d.description.trim(),
          caseSnippet: d.caseSnippet.trim() ? d.caseSnippet.trim() : null,
          icon: d.icon.trim() ? d.icon.trim() : null,
          bulletsProblems: fromLines(d.bulletsProblemsText),
          bulletsDeliverables: fromLines(d.bulletsDeliverablesText),
          ctaLabel: d.ctaLabel.trim() ? d.ctaLabel.trim() : null,
          ctaUrl: d.ctaUrl.trim() ? d.ctaUrl.trim() : null,
          visible: !!d.visible,
          order: Number(d.order) || 0,
        }),
      });

      // Update local items without a full reload (fast + stable)
      setItems((prev) =>
        prev.map((x) =>
          x.id === id
            ? {
                ...x,
                title: d.title,
                description: d.description,
                caseSnippet: d.caseSnippet || null,
                icon: d.icon || null,
                bulletsProblems: fromLines(d.bulletsProblemsText),
                bulletsDeliverables: fromLines(d.bulletsDeliverablesText),
                ctaLabel: d.ctaLabel || null,
                ctaUrl: d.ctaUrl || null,
                visible: !!d.visible,
                order: Number(d.order) || 0,
              }
            : x,
        ),
      );
    } catch (e: any) {
      setError(e?.message || "Failed to save changes.");
    } finally {
      setBusyId(null);
    }
  }

  async function remove(id: number) {
    setError(null);
    setBusyId(id);
    try {
      await adminFetch(`/admin/solutions/${id}`, { method: "DELETE" });

      // optimistic remove so UI never “breaks”
      setItems((prev) => prev.filter((x) => x.id !== id));
      setDrafts((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
    } catch (e: any) {
      setError(e?.message || "Failed to delete solution.");
    } finally {
      setBusyId(null);
    }
  }

  async function move(id: number, dir: "up" | "down") {
    const list = sorted;
    const idx = list.findIndex((x) => x.id === id);
    const swapIdx = dir === "up" ? idx - 1 : idx + 1;
    if (idx < 0 || swapIdx < 0 || swapIdx >= list.length) return;

    const a = list[idx];
    const b = list[swapIdx];

    setBusyMoveId(id);
    setError(null);

    // swap orders locally
    setItems((prev) =>
      prev.map((x) =>
        x.id === a.id ? { ...x, order: b.order } : x.id === b.id ? { ...x, order: a.order } : x,
      ),
    );

    // keep drafts in sync too
    patchDraft(a.id, { order: b.order });
    patchDraft(b.id, { order: a.order });

    try {
      await Promise.all([
        adminFetch(`/admin/solutions/${a.id}`, {
          method: "PATCH",
          body: JSON.stringify({ order: b.order }),
        }),
        adminFetch(`/admin/solutions/${b.id}`, {
          method: "PATCH",
          body: JSON.stringify({ order: a.order }),
        }),
      ]);
    } catch (e: any) {
      setError(e?.message || "Failed to reorder.");
      // recover from server
      await load();
    } finally {
      setBusyMoveId(null);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Solutions</h1>
        <p className="text-xs text-white/50">
          Add, edit, reorder, and toggle visibility. Use one item per line for bullets.
        </p>
      </div>

      {error ? (
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-xs text-red-200">
          {error}
        </div>
      ) : null}

      {/* ADD */}
      <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
        <div className="grid gap-3 lg:grid-cols-3">
          <input
            className="rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm"
            placeholder="Title"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
          />
          <textarea
            className="rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm lg:col-span-2"
            placeholder="Description"
            rows={2}
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
          />
        </div>
        <div className="mt-3 flex items-center gap-3">
          <button
            className="rounded-lg bg-[#C51F5D] px-4 py-2 text-sm font-semibold disabled:opacity-60"
            onClick={add}
            disabled={adding}
          >
            {adding ? "Adding..." : "Add Solution"}
          </button>
          <div className="text-xs text-white/40">
            Tip: keep bullets one-per-line (easier than comma-separated).
          </div>
        </div>
      </div>

      {/* LIST */}
      {loading ? (
        <div className="text-sm text-white/60">Loading...</div>
      ) : (
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {sorted.map((s) => {
            const d = drafts[s.id];
            if (!d) return null;

            return (
              <div key={s.id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="truncate text-sm font-semibold">{s.title}</div>
                    <div className="mt-1 text-[11px] text-white/50">
                      ID #{s.id} • order {s.order} • {s.visible ? "Visible" : "Hidden"}
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center gap-2">
                    <button
                      className="rounded-lg border border-white/10 px-2 py-1 text-[11px] hover:bg-white/5 disabled:opacity-60"
                      onClick={() => move(s.id, "up")}
                      disabled={busyMoveId === s.id}
                      title="Move up"
                    >
                      Up
                    </button>
                    <button
                      className="rounded-lg border border-white/10 px-2 py-1 text-[11px] hover:bg-white/5 disabled:opacity-60"
                      onClick={() => move(s.id, "down")}
                      disabled={busyMoveId === s.id}
                      title="Move down"
                    >
                      Down
                    </button>
                    <button
                      className="rounded-lg border border-white/10 px-2 py-1 text-[11px] hover:bg-white/5 disabled:opacity-60"
                      onClick={() => save(s.id)}
                      disabled={busyId === s.id}
                    >
                      {busyId === s.id ? "Saving..." : "Save"}
                    </button>
                    <button
                      className="rounded-lg border border-red-500/30 bg-red-500/10 px-2 py-1 text-[11px] text-red-200 hover:bg-red-500/20 disabled:opacity-60"
                      onClick={() => remove(s.id)}
                      disabled={busyId === s.id}
                    >
                      Delete
                    </button>
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  <div className="grid gap-3">
                    <label className="text-[11px] text-white/50">Title</label>
                    <input
                      className="rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm"
                      value={d.title}
                      onChange={(e) => patchDraft(s.id, { title: e.target.value })}
                    />
                  </div>

                  <div className="grid gap-3">
                    <label className="text-[11px] text-white/50">Description</label>
                    <textarea
                      className="rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm"
                      rows={3}
                      value={d.description}
                      onChange={(e) => patchDraft(s.id, { description: e.target.value })}
                    />
                  </div>

                  <div className="grid gap-3">
                    <label className="text-[11px] text-white/50">Mini case snippet (optional)</label>
                    <textarea
                      className="rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm"
                      rows={2}
                      value={d.caseSnippet}
                      onChange={(e) => patchDraft(s.id, { caseSnippet: e.target.value })}
                    />
                  </div>

                  <div className="grid gap-3">
                    <div className="flex items-center justify-between">
                      <label className="text-[11px] text-white/50">Icon (URL or name)</label>
                      {d.icon && isLikelyImageUrl(d.icon) ? (
                        <div className="h-8 w-8 overflow-hidden rounded-lg border border-white/10 bg-white/5">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={d.icon}
                            alt="icon"
                            className="h-full w-full object-contain"
                            onError={(e) => {
                              (e.currentTarget as HTMLImageElement).style.display = "none";
                            }}
                          />
                        </div>
                      ) : null}
                    </div>
                    <input
                      className="rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm"
                      value={d.icon}
                      onChange={(e) => patchDraft(s.id, { icon: e.target.value })}
                      placeholder="https://.../icon.png"
                    />
                  </div>

                  <div className="grid gap-3">
                    <label className="text-[11px] text-white/50">Problems (one per line)</label>
                    <textarea
                      className="rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm"
                      rows={3}
                      value={d.bulletsProblemsText}
                      onChange={(e) => patchDraft(s.id, { bulletsProblemsText: e.target.value })}
                    />
                  </div>

                  <div className="grid gap-3">
                    <label className="text-[11px] text-white/50">Deliverables (one per line)</label>
                    <textarea
                      className="rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm"
                      rows={3}
                      value={d.bulletsDeliverablesText}
                      onChange={(e) => patchDraft(s.id, { bulletsDeliverablesText: e.target.value })}
                    />
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="grid gap-2">
                      <label className="text-[11px] text-white/50">CTA label</label>
                      <input
                        className="rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm"
                        value={d.ctaLabel}
                        onChange={(e) => patchDraft(s.id, { ctaLabel: e.target.value })}
                      />
                    </div>
                    <div className="grid gap-2">
                      <label className="text-[11px] text-white/50">CTA url</label>
                      <input
                        className="rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm"
                        value={d.ctaUrl}
                        onChange={(e) => patchDraft(s.id, { ctaUrl: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="grid gap-2">
                      <label className="text-[11px] text-white/50">Visibility</label>
                      <select
                        className="rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm"
                        value={d.visible ? "true" : "false"}
                        onChange={(e) => patchDraft(s.id, { visible: e.target.value === "true" })}
                      >
                        <option value="true">Visible</option>
                        <option value="false">Hidden</option>
                      </select>
                    </div>
                    <div className="grid gap-2">
                      <label className="text-[11px] text-white/50">Order</label>
                      <input
                        className="rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm"
                        type="number"
                        value={d.order}
                        onChange={(e) => patchDraft(s.id, { order: Number(e.target.value) || 0 })}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <button
                      className="text-xs text-white/60 hover:text-white"
                      onClick={() => resetDraftFromItem(s)}
                      type="button"
                    >
                      Reset changes
                    </button>
                    <button
                      className="rounded-lg bg-[#C51F5D] px-4 py-2 text-sm font-semibold disabled:opacity-60"
                      onClick={() => save(s.id)}
                      disabled={busyId === s.id}
                    >
                      {busyId === s.id ? "Saving..." : "Save"}
                    </button>
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
