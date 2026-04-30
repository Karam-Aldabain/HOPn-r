"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { adminFetch } from "@/lib/admin-api";

type Page = {
  id: number;
  title: string;
  slug: string;
  status?: string;
  seoTitle?: string;
  seoDescription?: string;
  ogImage?: string;
  sections?: Section[];
};

type Section = {
  id: number;
  type: string;
  contentJson?: any;
  visible?: boolean;
  order?: number;
};

type CommonBlock = {
  title?: string;
  text?: string;
  ctaLabel?: string;
  ctaUrl?: string;
  mediaUrl?: string;
  mediaAlt?: string;
};

type ContactInfo = {
  location?: string;
  email?: string;
  phone?: string;
  mapEmbedUrl?: string;
  showMap?: boolean;
};

type HomeLayoutSection = {
  key: "hero" | "highlights" | "services" | "partners" | "principles" | "cta";
  visible?: boolean;
  order?: number;
};

const BLOCK_TYPES = [
  "HomePage",
  "ProjectsPage",
  "LabsPage",
  "HeroBlock",
  "RichTextBlock",
  "CTA",
  "FeaturesBlock",
  "ProjectsGrid",
  "PartnersGrid",
  "TeamBlock",
  "ContactBlock",
];

function sortSections(sections: Section[]) {
  return (sections || []).slice().sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}

function asCommon(contentJson: any): CommonBlock {
  const c = contentJson || {};
  return {
    title: c.title ?? "",
    text: c.text ?? "",
    ctaLabel: c.ctaLabel ?? c.cta?.label ?? "",
    ctaUrl: c.ctaUrl ?? c.cta?.url ?? "",
    mediaUrl: c.mediaUrl ?? c.media?.url ?? "",
    mediaAlt: c.mediaAlt ?? c.media?.alt ?? "",
  };
}

function writeCommon(contentJson: any, patch: Partial<CommonBlock>) {
  const next = { ...(contentJson || {}) };

  if (patch.title !== undefined) next.title = patch.title;
  if (patch.text !== undefined) next.text = patch.text;

  if (patch.ctaLabel !== undefined) next.ctaLabel = patch.ctaLabel;
  if (patch.ctaUrl !== undefined) next.ctaUrl = patch.ctaUrl;

  if (patch.mediaUrl !== undefined) next.mediaUrl = patch.mediaUrl;
  if (patch.mediaAlt !== undefined) next.mediaAlt = patch.mediaAlt;

  // Keep backward compatibility if you previously stored nested objects
  // (optional: remove if you want strict new format)
  if (next.ctaLabel || next.ctaUrl) next.cta = { label: next.ctaLabel, url: next.ctaUrl };
  if (next.mediaUrl || next.mediaAlt) next.media = { url: next.mediaUrl, alt: next.mediaAlt };

  return next;
}

function getContactInfo(contentJson: any): ContactInfo {
  const c = contentJson || {};
  return {
    location: c.contactInfo?.location ?? "",
    email: c.contactInfo?.email ?? "",
    phone: c.contactInfo?.phone ?? "",
    mapEmbedUrl: c.contactInfo?.mapEmbedUrl ?? "",
    showMap: !!c.contactInfo?.showMap,
  };
}

function writeContactInfo(contentJson: any, patch: Partial<ContactInfo>) {
  const next = { ...(contentJson || {}) };
  const current = getContactInfo(next);
  const merged = { ...current, ...patch };
  next.contactInfo = {
    location: merged.location || "",
    email: merged.email || "",
    phone: merged.phone || "",
    mapEmbedUrl: merged.mapEmbedUrl || "",
    showMap: !!merged.showMap,
  };
  return next;
}

function getHomeLayout(contentJson: any): HomeLayoutSection[] {
  const raw = contentJson?.layout?.sections;
  if (Array.isArray(raw)) return raw;
  return [
    { key: "hero", order: 0, visible: true },
    { key: "highlights", order: 1, visible: true },
    { key: "services", order: 2, visible: true },
    { key: "partners", order: 3, visible: true },
    { key: "principles", order: 4, visible: true },
    { key: "cta", order: 5, visible: true },
  ];
}

function writeHomeLayout(contentJson: any, nextSections: HomeLayoutSection[]) {
  const next = { ...(contentJson || {}) };
  next.layout = { ...(next.layout || {}), sections: nextSections };
  return next;
}

export default function AdminPages() {
  const [pages, setPages] = useState<Page[]>([]);
  const [saving, setSaving] = useState<number | null>(null);

  const [newSectionType, setNewSectionType] = useState<Record<number, string>>({});
  const [showAdvancedJson, setShowAdvancedJson] = useState<Record<number, boolean>>({}); // keyed by section id
  const dragIdRef = useRef<number | null>(null);

  async function load() {
    const data = await adminFetch<Page[]>("/admin/pages");
    setPages(data);
  }

  useEffect(() => {
    load().catch(() => {});
  }, []);

  async function updateSeo(page: Page) {
    setSaving(page.id);
    await adminFetch(`/admin/pages/${page.id}/seo`, {
      method: "PATCH",
      body: JSON.stringify({
        seoTitle: page.seoTitle,
        seoDescription: page.seoDescription,
        ogImage: page.ogImage,
      }),
    });
    setSaving(null);
  }

  async function togglePublish(page: Page) {
    setSaving(page.id);
    if (page.status === "PUBLISHED") {
      await adminFetch(`/admin/pages/${page.id}/unpublish`, { method: "POST" });
    } else {
      await adminFetch(`/admin/pages/${page.id}/publish`, { method: "POST" });
    }
    await load();
    setSaving(null);
  }

  async function addSection(page: Page) {
    const type = (newSectionType[page.id] || "RichTextBlock").trim();
    const defaultContent = writeCommon({}, { title: "", text: "", ctaLabel: "", ctaUrl: "", mediaUrl: "", mediaAlt: "" });

    await adminFetch(`/admin/pages/${page.id}/sections`, {
      method: "POST",
      body: JSON.stringify({
        type,
        contentJson: defaultContent,
        visible: true,
        order: (page.sections?.length || 0),
      }),
    });

    setNewSectionType((prev) => ({ ...prev, [page.id]: "" }));
    await load();
  }

  async function updateSection(sectionId: number, data: Partial<Section>) {
    await adminFetch(`/admin/sections/${sectionId}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
    await load();
  }

  async function deleteSection(sectionId: number) {
    await adminFetch(`/admin/sections/${sectionId}`, { method: "DELETE" });
    await load();
  }

  async function reorderSections(page: Page, next: Section[]) {
    await adminFetch(`/admin/pages/${page.id}/sections-order`, {
      method: "PUT",
      body: JSON.stringify({ sectionIds: next.map((s) => s.id) }),
    });
    // optimistic: update locally without waiting for reload
    setPages((prev) =>
      prev.map((p) => (p.id === page.id ? { ...p, sections: next.map((s, i) => ({ ...s, order: i })) } : p))
    );
    // then refresh from server to keep canonical
    await load();
  }

  function updatePageField(pageId: number, patch: Partial<Page>) {
    setPages((prev) => prev.map((p) => (p.id === pageId ? { ...p, ...patch } : p)));
  }

  function updateSectionLocal(pageId: number, sectionId: number, patch: Partial<Section>) {
    setPages((prev) =>
      prev.map((p) => {
        if (p.id !== pageId) return p;
        const sections = (p.sections || []).map((s) => (s.id === sectionId ? { ...s, ...patch } : s));
        return { ...p, sections };
      })
    );
  }

  const inputClass =
    "rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-xs w-full";
  const btnClass =
    "rounded-lg border border-white/10 px-3 py-2 text-xs hover:bg-white/5 transition";

  return (
    <div>
      <h1 className="text-2xl font-bold">Pages</h1>

      <div className="mt-4 space-y-4">
        {pages.map((p) => {
          const ordered = sortSections(p.sections || []);
          return (
            <div key={p.id} className="rounded-xl border border-white/10 bg-white/5 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-semibold">{p.title}</div>
                  <div className="text-xs text-white/60">/{p.slug}</div>
                </div>
                <button
                  className={btnClass}
                  onClick={() => togglePublish(p)}
                  disabled={saving === p.id}
                >
                  {p.status === "PUBLISHED" ? "Unpublish" : "Publish"}
                </button>
              </div>

              {/* SEO */}
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                <input
                  className={inputClass}
                  placeholder="SEO title"
                  value={p.seoTitle || ""}
                  onChange={(e) => updatePageField(p.id, { seoTitle: e.target.value })}
                />
                <input
                  className={inputClass}
                  placeholder="SEO description"
                  value={p.seoDescription || ""}
                  onChange={(e) => updatePageField(p.id, { seoDescription: e.target.value })}
                />
                <input
                  className={inputClass}
                  placeholder="OG image URL"
                  value={p.ogImage || ""}
                  onChange={(e) => updatePageField(p.id, { ogImage: e.target.value })}
                />
              </div>

              <div className="mt-3">
                <button
                  className="rounded-lg bg-[#C51F5D] px-3 py-1.5 text-xs"
                  onClick={() => updateSeo(p)}
                  disabled={saving === p.id}
                >
                  {saving === p.id ? "Saving..." : "Save SEO"}
                </button>
              </div>

              {/* Sections */}
              <div className="mt-6 border-t border-white/10 pt-4">
                <div className="text-sm font-semibold">Sections</div>

                {/* Add section */}
                <div className="mt-3 grid gap-3 sm:grid-cols-3">
                  <select
                    className={inputClass}
                    value={newSectionType[p.id] || "RichTextBlock"}
                    onChange={(e) => setNewSectionType((prev) => ({ ...prev, [p.id]: e.target.value }))}
                  >
                    {BLOCK_TYPES.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>

                  <div className="text-xs text-white/60 flex items-center">
                    Adds a new block with editable fields (no JSON required).
                  </div>

                  <button className={btnClass} onClick={() => addSection(p)}>
                    Add Section
                  </button>
                </div>

                {/* Editor list */}
                <div className="mt-4 space-y-3">
                  {ordered.map((s, idx) => {
                    const common = asCommon(s.contentJson);
                    const advancedOpen = !!showAdvancedJson[s.id];
                    const isContact = s.type === "ContactFormBlock" || s.type === "Contact";
                    const isHome = s.type === "HomePage" || s.type === "HomePageBlock" || s.type === "HomePageSection";
                    const contactInfo = isContact ? getContactInfo(s.contentJson) : null;
                    const layoutSections = isHome ? getHomeLayout(s.contentJson) : [];

                    return (
                      <div
                        key={s.id}
                        className="rounded-lg border border-white/10 bg-white/5 p-3"
                        draggable
                        onDragStart={() => {
                          dragIdRef.current = s.id;
                        }}
                        onDragOver={(e) => {
                          e.preventDefault();
                        }}
                        onDrop={() => {
                          const dragId = dragIdRef.current;
                          if (!dragId || dragId === s.id) return;

                          const list = ordered.slice();
                          const from = list.findIndex((x) => x.id === dragId);
                          const to = list.findIndex((x) => x.id === s.id);
                          if (from < 0 || to < 0) return;

                          const next = list.slice();
                          const [moved] = next.splice(from, 1);
                          next.splice(to, 0, moved);

                          reorderSections(p, next).catch(() => {});
                          dragIdRef.current = null;
                        }}
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <div
                              className="text-xs text-white/60 cursor-grab select-none"
                              title="Drag to reorder"
                            >
                              ⠿
                            </div>
                            <div className="text-xs text-white/60">#{s.id}</div>
                            <div className="text-sm font-semibold">{s.type}</div>
                          </div>

                          <div className="flex items-center gap-2">
                            <select
                              className={inputClass}
                              style={{ width: 110 }}
                              value={s.visible === false ? "false" : "true"}
                              onChange={(e) =>
                                updateSection(s.id, { visible: e.target.value === "true" }).catch(() => {})
                              }
                            >
                              <option value="true">Visible</option>
                              <option value="false">Hidden</option>
                            </select>

                            <button
                              className={btnClass}
                              onClick={() => setShowAdvancedJson((prev) => ({ ...prev, [s.id]: !prev[s.id] }))}
                            >
                              {advancedOpen ? "Hide JSON" : "Advanced JSON"}
                            </button>

                            <button
                              className="text-xs text-red-400 hover:text-red-300 transition"
                              onClick={() => deleteSection(s.id)}
                            >
                              Delete
                            </button>
                          </div>
                        </div>

                        {/* Main editor + preview */}
                        <div className="mt-3 grid gap-3 lg:grid-cols-[1.2fr_0.8fr]">
                          {/* Block form */}
                          <div className="rounded-lg border border-white/10 bg-black/10 p-3">
                            <div className="grid gap-3 sm:grid-cols-2">
                              <input
                                className={inputClass}
                                placeholder="Title"
                                value={common.title || ""}
                                onChange={(e) =>
                                  updateSectionLocal(p.id, s.id, {
                                    contentJson: writeCommon(s.contentJson, { title: e.target.value }),
                                  })
                                }
                              />
                              <input
                                className={inputClass}
                                placeholder="CTA label"
                                value={common.ctaLabel || ""}
                                onChange={(e) =>
                                  updateSectionLocal(p.id, s.id, {
                                    contentJson: writeCommon(s.contentJson, { ctaLabel: e.target.value }),
                                  })
                                }
                              />
                            </div>

                            <div className="mt-3 grid gap-3 sm:grid-cols-2">
                              <input
                                className={inputClass}
                                placeholder="CTA URL"
                                value={common.ctaUrl || ""}
                                onChange={(e) =>
                                  updateSectionLocal(p.id, s.id, {
                                    contentJson: writeCommon(s.contentJson, { ctaUrl: e.target.value }),
                                  })
                                }
                              />
                              <input
                                className={inputClass}
                                placeholder="Media URL"
                                value={common.mediaUrl || ""}
                                onChange={(e) =>
                                  updateSectionLocal(p.id, s.id, {
                                    contentJson: writeCommon(s.contentJson, { mediaUrl: e.target.value }),
                                  })
                                }
                              />
                            </div>

                            <div className="mt-3">
                              <input
                                className={inputClass}
                                placeholder="Media alt text (required if media is set)"
                                value={common.mediaAlt || ""}
                                onChange={(e) =>
                                  updateSectionLocal(p.id, s.id, {
                                    contentJson: writeCommon(s.contentJson, { mediaAlt: e.target.value }),
                                  })
                                }
                              />
                              {common.mediaUrl && !common.mediaAlt ? (
                                <div className="mt-1 text-[11px] text-yellow-300/90">
                                  Alt text is required when media is used.
                                </div>
                              ) : null}
                            </div>

                            <div className="mt-3">
                              <textarea
                                className={inputClass}
                                placeholder="Text"
                                value={common.text || ""}
                                onChange={(e) =>
                                  updateSectionLocal(p.id, s.id, {
                                    contentJson: writeCommon(s.contentJson, { text: e.target.value }),
                                  })
                                }
                                rows={5}
                              />
                            </div>

                            {isContact ? (
                              <div className="mt-4 rounded-lg border border-white/10 bg-white/5 p-3">
                                <div className="text-xs font-semibold mb-2">Contact Info Panel</div>
                                <div className="grid gap-3 sm:grid-cols-2">
                                  <input
                                    className={inputClass}
                                    placeholder="Location"
                                    value={contactInfo?.location || ""}
                                    onChange={(e) =>
                                      updateSectionLocal(p.id, s.id, {
                                        contentJson: writeContactInfo(s.contentJson, { location: e.target.value }),
                                      })
                                    }
                                  />
                                  <input
                                    className={inputClass}
                                    placeholder="Email"
                                    value={contactInfo?.email || ""}
                                    onChange={(e) =>
                                      updateSectionLocal(p.id, s.id, {
                                        contentJson: writeContactInfo(s.contentJson, { email: e.target.value }),
                                      })
                                    }
                                  />
                                </div>
                                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                                  <input
                                    className={inputClass}
                                    placeholder="Phone"
                                    value={contactInfo?.phone || ""}
                                    onChange={(e) =>
                                      updateSectionLocal(p.id, s.id, {
                                        contentJson: writeContactInfo(s.contentJson, { phone: e.target.value }),
                                      })
                                    }
                                  />
                                  <input
                                    className={inputClass}
                                    placeholder="Map embed URL"
                                    value={contactInfo?.mapEmbedUrl || ""}
                                    onChange={(e) =>
                                      updateSectionLocal(p.id, s.id, {
                                        contentJson: writeContactInfo(s.contentJson, { mapEmbedUrl: e.target.value }),
                                      })
                                    }
                                  />
                                </div>
                                <div className="mt-3">
                                  <select
                                    className={inputClass}
                                    value={contactInfo?.showMap ? "true" : "false"}
                                    onChange={(e) =>
                                      updateSectionLocal(p.id, s.id, {
                                        contentJson: writeContactInfo(s.contentJson, {
                                          showMap: e.target.value === "true",
                                        }),
                                      })
                                    }
                                  >
                                    <option value="true">Show map</option>
                                    <option value="false">Hide map</option>
                                  </select>
                                </div>
                              </div>
                            ) : null}

                            {isHome ? (
                              <div className="mt-4 rounded-lg border border-white/10 bg-white/5 p-3">
                                <div className="text-xs font-semibold mb-2">Home Layout</div>
                                <div className="grid gap-2">
                                  {layoutSections.map((sec, i) => (
                                    <div key={sec.key} className="grid gap-2 sm:grid-cols-[1fr_100px_120px]">
                                      <div className="text-xs text-white/70 flex items-center">{sec.key}</div>
                                      <input
                                        className={inputClass}
                                        type="number"
                                        value={sec.order ?? i}
                                        onChange={(e) => {
                                          const next = layoutSections.map((s2) =>
                                            s2.key === sec.key
                                              ? { ...s2, order: Number(e.target.value) || 0 }
                                              : s2
                                          );
                                          updateSectionLocal(p.id, s.id, { contentJson: writeHomeLayout(s.contentJson, next) });
                                        }}
                                        placeholder="Order"
                                      />
                                      <select
                                        className={inputClass}
                                        value={sec.visible === false ? "false" : "true"}
                                        onChange={(e) => {
                                          const next = layoutSections.map((s2) =>
                                            s2.key === sec.key ? { ...s2, visible: e.target.value === "true" } : s2
                                          );
                                          updateSectionLocal(p.id, s.id, { contentJson: writeHomeLayout(s.contentJson, next) });
                                        }}
                                      >
                                        <option value="true">Visible</option>
                                        <option value="false">Hidden</option>
                                      </select>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ) : null}

                            <div className="mt-3 flex items-center justify-between">
                              <div className="text-[11px] text-white/50">
                                Tip: drag the block (⠿) to reorder.
                              </div>
                              <button
                                className="rounded-lg bg-[#C51F5D] px-3 py-2 text-xs"
                                onClick={() => {
                                  const latest = pages
                                    .find((pg) => pg.id === p.id)
                                    ?.sections?.find((sec) => sec.id === s.id);

                                  updateSection(s.id, {
                                    type: latest?.type ?? s.type,
                                    contentJson: latest?.contentJson ?? s.contentJson,
                                  }).catch(() => {});
                                }}
                              >
                                Save Block
                              </button>
                            </div>

                            {/* Advanced JSON (optional) */}
                            {advancedOpen ? (
                              <div className="mt-3">
                                <div className="text-xs text-white/60 mb-2">Advanced JSON</div>
                                <textarea
                                  className={inputClass}
                                  defaultValue={JSON.stringify(s.contentJson || {}, null, 2)}
                                  rows={8}
                                  onBlur={(e) => {
                                    try {
                                      const parsed = JSON.parse(e.target.value || "{}");
                                      updateSection(s.id, { contentJson: parsed }).catch(() => {});
                                    } catch {
                                      // ignore invalid JSON
                                    }
                                  }}
                                />
                              </div>
                            ) : null}
                          </div>

                          {/* Preview */}
                          <div className="rounded-lg border border-white/10 bg-black/10 p-3">
                            <div className="text-xs text-white/60 mb-2">Preview</div>
                            <div className="rounded-lg border border-white/10 bg-white/5 p-3">
                              {common.title ? (
                                <div className="text-sm font-semibold">{common.title}</div>
                              ) : (
                                <div className="text-sm text-white/40">No title</div>
                              )}

                              {common.text ? (
                                <div className="mt-2 text-xs text-white/70 whitespace-pre-wrap">
                                  {common.text.length > 240 ? common.text.slice(0, 240) + "…" : common.text}
                                </div>
                              ) : null}

                              {common.mediaUrl ? (
                                <div className="mt-3 text-xs text-white/70">
                                  Media: <span className="text-white/90">{common.mediaUrl}</span>
                                </div>
                              ) : null}

                              {common.ctaLabel && common.ctaUrl ? (
                                <div className="mt-3 inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-xs">
                                  {common.ctaLabel} → {common.ctaUrl}
                                </div>
                              ) : null}
                            </div>

                            <div className="mt-2 text-[11px] text-white/50">
                              This preview is generic; your public renderer can style each block type differently.
                            </div>
                          </div>
                        </div>

                        <div className="mt-2 text-[11px] text-white/40">
                          Order: {idx} (server uses sectionIds order)
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
