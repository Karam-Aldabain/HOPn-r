"use client";

import { useEffect, useMemo, useState } from "react";
import { adminFetch } from "@/lib/admin-api";

type NavItem = {
  id?: number;
  label: string;
  url: string;
  order?: number;
  visible?: boolean;
  isCta?: boolean;
  external?: boolean;
  location?: "HEADER" | "FOOTER";
};

type SimpleLink = {
  label: string;
  url: string;
  visible?: boolean;
  external?: boolean;
};

// Add stable client identity for React keys + edits (even before DB id exists)
type NavItemUI = NavItem & { clientId: string };
type SimpleLinkUI = SimpleLink & { clientId: string; order?: number };

const DEFAULT_HEADER_ITEMS: NavItem[] = [
  { label: "Home", url: "/", visible: true, isCta: false, external: false, location: "HEADER" },
  { label: "HOPn Labs", url: "/labs", visible: true, isCta: false, external: false, location: "HEADER" },
  { label: "Events", url: "/events", visible: true, isCta: false, external: false, location: "HEADER" },
  { label: "Insights", url: "/insights", visible: true, isCta: false, external: false, location: "HEADER" },
  { label: "Services", url: "/services", visible: true, isCta: false, external: false, location: "HEADER" },
  { label: "Company", url: "/company", visible: true, isCta: false, external: false, location: "HEADER" },
  { label: "Contact Us", url: "/contact", visible: true, isCta: true, external: false, location: "HEADER" },
];

const DEFAULT_FOOTER_ITEMS: NavItem[] = [
  { label: "Imprint", url: "/imprint", visible: true, external: false, location: "FOOTER" },
  { label: "Privacy", url: "/privacy", visible: true, external: false, location: "FOOTER" },
  { label: "Cookie Policy", url: "/cookies", visible: true, external: false, location: "FOOTER" },
];

const DEFAULT_FOOTER_QUICK: SimpleLink[] = [
  { label: "Home", url: "/", visible: true, external: false },
  { label: "About", url: "/about", visible: true, external: false },
  { label: "Solutions", url: "/solutions", visible: true, external: false },
  { label: "Projects", url: "/projects", visible: true, external: false },
];

const DEFAULT_FOOTER_RESOURCES: SimpleLink[] = [
  { label: "Insights/Blog", url: "/insights", visible: true, external: false },
  { label: "Events", url: "/events", visible: true, external: false },
  { label: "Careers", url: "/carres", visible: true, external: false },
];

function withClientId(items: NavItem[]): NavItemUI[] {
  return items
    .slice()
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    .map((x, i) => ({
      ...x,
      order: i,
      clientId: x.id ? `id:${x.id}` : `tmp:${crypto.randomUUID()}`,
    }));
}

function withClientIdSimple(items: SimpleLink[]): SimpleLinkUI[] {
  return items.map((x, i) => ({
    ...x,
    order: i,
    clientId: `tmp:${crypto.randomUUID()}`,
  }));
}

function normalizeOrder(items: NavItemUI[]) {
  return items.map((x, i) => ({ ...x, order: i }));
}

function normalizeSimple(items: SimpleLinkUI[]) {
  return items.map((x, i) => ({ ...x, order: i }));
}

function moveByClientId(items: NavItemUI[], clientId: string, dir: "up" | "down") {
  const idx = items.findIndex((x) => x.clientId === clientId);
  if (idx === -1) return items;
  const swap = dir === "up" ? idx - 1 : idx + 1;
  if (swap < 0 || swap >= items.length) return items;

  const next = items.slice();
  const tmp = next[idx];
  next[idx] = next[swap];
  next[swap] = tmp;
  return normalizeOrder(next);
}

function moveByClientIdSimple(items: SimpleLinkUI[], clientId: string, dir: "up" | "down") {
  const idx = items.findIndex((x) => x.clientId === clientId);
  if (idx === -1) return items;
  const swap = dir === "up" ? idx - 1 : idx + 1;
  if (swap < 0 || swap >= items.length) return items;

  const next = items.slice();
  const tmp = next[idx];
  next[idx] = next[swap];
  next[swap] = tmp;
  return normalizeSimple(next);
}

function stripUi(items: NavItemUI[]): NavItem[] {
  // backend doesn’t need clientId
  return items.map(({ clientId, location, ...rest }) => rest as NavItem);
}

function stripSimple(items: SimpleLinkUI[]): SimpleLink[] {
  return items.map(({ clientId, order, ...rest }) => rest);
}

export default function AdminNav() {
  const [headerItems, setHeaderItems] = useState<NavItemUI[]>([]);
  const [footerItems, setFooterItems] = useState<NavItemUI[]>([]);
  const [quickItems, setQuickItems] = useState<SimpleLinkUI[]>([]);
  const [resourceItems, setResourceItems] = useState<SimpleLinkUI[]>([]);
  const [headerLabel, setHeaderLabel] = useState("");
  const [headerUrl, setHeaderUrl] = useState("");
  const [footerLabel, setFooterLabel] = useState("");
  const [footerUrl, setFooterUrl] = useState("");
  const [quickLabel, setQuickLabel] = useState("");
  const [quickUrl, setQuickUrl] = useState("");
  const [resourceLabel, setResourceLabel] = useState("");
  const [resourceUrl, setResourceUrl] = useState("");
  const [saving, setSaving] = useState<string | null>(null);

  async function load() {
    const [data, quickSetting, resourceSetting] = await Promise.all([
      adminFetch<NavItem[]>("/admin/navigation"),
      adminFetch<{ key: string; valueJson?: any }>("/admin/settings/footer_quick_links").catch(
        () => null
      ),
      adminFetch<{ key: string; valueJson?: any }>("/admin/settings/footer_resources").catch(
        () => null
      ),
    ]);
    const header = data.filter((i) => i.location === "HEADER");
    const footer = data.filter((i) => i.location === "FOOTER");
    setHeaderItems(withClientId(header.length ? header : DEFAULT_HEADER_ITEMS));
    setFooterItems(withClientId(footer.length ? footer : DEFAULT_FOOTER_ITEMS));

    const quickValue = Array.isArray(quickSetting?.valueJson)
      ? (quickSetting?.valueJson as SimpleLink[])
      : DEFAULT_FOOTER_QUICK;
    const resourceValue = Array.isArray(resourceSetting?.valueJson)
      ? (resourceSetting?.valueJson as SimpleLink[])
      : DEFAULT_FOOTER_RESOURCES;
    setQuickItems(withClientIdSimple(quickValue));
    setResourceItems(withClientIdSimple(resourceValue));
  }

  useEffect(() => {
    load().catch(() => {});
  }, []);

  function addHeader() {
    if (!headerLabel.trim() || !headerUrl.trim()) return;
    setHeaderItems((prev) =>
      normalizeOrder([
        ...prev,
        {
          clientId: `tmp:${crypto.randomUUID()}`,
          label: headerLabel.trim(),
          url: headerUrl.trim(),
          visible: true,
          isCta: false,
          external: false,
          location: "HEADER",
        },
      ]),
    );
    setHeaderLabel("");
    setHeaderUrl("");
  }

  function addFooter() {
    if (!footerLabel.trim() || !footerUrl.trim()) return;
    setFooterItems((prev) =>
      normalizeOrder([
        ...prev,
        {
          clientId: `tmp:${crypto.randomUUID()}`,
          label: footerLabel.trim(),
          url: footerUrl.trim(),
          visible: true,
          external: false,
          location: "FOOTER",
        },
      ]),
    );
    setFooterLabel("");
    setFooterUrl("");
  }

  function addQuick() {
    if (!quickLabel.trim() || !quickUrl.trim()) return;
    setQuickItems((prev) =>
      normalizeSimple([
        ...prev,
        {
          clientId: `tmp:${crypto.randomUUID()}`,
          label: quickLabel.trim(),
          url: quickUrl.trim(),
          visible: true,
          external: false,
        },
      ]),
    );
    setQuickLabel("");
    setQuickUrl("");
  }

  function addResource() {
    if (!resourceLabel.trim() || !resourceUrl.trim()) return;
    setResourceItems((prev) =>
      normalizeSimple([
        ...prev,
        {
          clientId: `tmp:${crypto.randomUUID()}`,
          label: resourceLabel.trim(),
          url: resourceUrl.trim(),
          visible: true,
          external: false,
        },
      ]),
    );
    setResourceLabel("");
    setResourceUrl("");
  }

  function patchHeader(clientId: string, patch: Partial<NavItemUI>) {
    setHeaderItems((prev) => prev.map((x) => (x.clientId === clientId ? { ...x, ...patch } : x)));
  }

  function patchFooter(clientId: string, patch: Partial<NavItemUI>) {
    setFooterItems((prev) => prev.map((x) => (x.clientId === clientId ? { ...x, ...patch } : x)));
  }

  function patchQuick(clientId: string, patch: Partial<SimpleLinkUI>) {
    setQuickItems((prev) => prev.map((x) => (x.clientId === clientId ? { ...x, ...patch } : x)));
  }

  function patchResource(clientId: string, patch: Partial<SimpleLinkUI>) {
    setResourceItems((prev) => prev.map((x) => (x.clientId === clientId ? { ...x, ...patch } : x)));
  }

  function removeHeader(clientId: string) {
    setHeaderItems((prev) => normalizeOrder(prev.filter((x) => x.clientId !== clientId)));
  }

  function removeFooter(clientId: string) {
    setFooterItems((prev) => normalizeOrder(prev.filter((x) => x.clientId !== clientId)));
  }

  function removeQuick(clientId: string) {
    setQuickItems((prev) => normalizeSimple(prev.filter((x) => x.clientId !== clientId)));
  }

  function removeResource(clientId: string) {
    setResourceItems((prev) => normalizeSimple(prev.filter((x) => x.clientId !== clientId)));
  }

  function resetHeader() {
    setHeaderItems(withClientId(DEFAULT_HEADER_ITEMS));
    setHeaderLabel("");
    setHeaderUrl("");
  }

  function resetFooter() {
    setFooterItems(withClientId(DEFAULT_FOOTER_ITEMS));
    setFooterLabel("");
    setFooterUrl("");
  }

  function resetQuick() {
    setQuickItems(withClientIdSimple(DEFAULT_FOOTER_QUICK));
    setQuickLabel("");
    setQuickUrl("");
  }

  function resetResources() {
    setResourceItems(withClientIdSimple(DEFAULT_FOOTER_RESOURCES));
    setResourceLabel("");
    setResourceUrl("");
  }

  async function saveHeader() {
    setSaving("header");
    await adminFetch("/admin/navigation/header", {
      method: "PUT",
      body: JSON.stringify({ items: stripUi(headerItems) }),
    });
    await load();
    setSaving(null);
  }

  async function saveFooter() {
    setSaving("footer");
    await adminFetch("/admin/navigation/footer", {
      method: "PUT",
      body: JSON.stringify({ items: stripUi(footerItems) }),
    });
    await load();
    setSaving(null);
  }

  async function saveQuick() {
    setSaving("quick");
    await adminFetch("/admin/settings", {
      method: "PUT",
      body: JSON.stringify({ key: "footer_quick_links", valueJson: stripSimple(quickItems) }),
    });
    await load();
    setSaving(null);
  }

  async function saveResources() {
    setSaving("resources");
    await adminFetch("/admin/settings", {
      method: "PUT",
      body: JSON.stringify({ key: "footer_resources", valueJson: stripSimple(resourceItems) }),
    });
    await load();
    setSaving(null);
  }

  const hasHeaderCta = useMemo(() => headerItems.some((x) => x.isCta), [headerItems]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Navigation</h1>
        <p className="text-xs text-white/50">
          Manage header and footer links. One header item can be highlighted as CTA.
        </p>
      </div>

      {/* HEADER */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Header Navigation</h2>
          <div className="flex items-center gap-2">
            <button
              className="rounded-lg border border-white/10 px-3 py-1.5 text-xs hover:bg-white/5"
              onClick={resetHeader}
              type="button"
            >
              Reset
            </button>
            <button
              className="rounded-lg bg-[#C51F5D] px-3 py-1.5 text-xs disabled:opacity-60"
              onClick={saveHeader}
              disabled={saving === "header"}
            >
              {saving === "header" ? "Saving..." : "Save Header"}
            </button>
          </div>
        </div>

        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <div className="grid gap-3 sm:grid-cols-3">
            <input
              className="rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-xs"
              placeholder="Label"
              value={headerLabel}
              onChange={(e) => setHeaderLabel(e.target.value)}
            />
            <input
              className="rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-xs"
              placeholder="URL"
              value={headerUrl}
              onChange={(e) => setHeaderUrl(e.target.value)}
            />
            <button
              className="rounded-lg border border-white/10 px-3 py-2 text-xs hover:bg-white/5"
              onClick={addHeader}
            >
              Add Header Link
            </button>
          </div>
        </div>

        <div className="space-y-2">
          {headerItems.map((item) => (
            <div key={item.clientId} className="rounded-lg border border-white/10 bg-white/5 p-3">
              <div className="grid gap-3 sm:grid-cols-6 items-center">
                <input
                  className="rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-xs"
                  value={item.label}
                  onChange={(e) => patchHeader(item.clientId, { label: e.target.value })}
                />
                <input
                  className="rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-xs"
                  value={item.url}
                  onChange={(e) => patchHeader(item.clientId, { url: e.target.value })}
                />
                <select
                  className="rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-xs"
                  value={item.visible === false ? "false" : "true"}
                  onChange={(e) => patchHeader(item.clientId, { visible: e.target.value === "true" })}
                >
                  <option value="true">Visible</option>
                  <option value="false">Hidden</option>
                </select>

                <select
                  className="rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-xs"
                  value={item.isCta ? "true" : "false"}
                  onChange={(e) => {
                    const v = e.target.value === "true";
                    // enforce single CTA
                    setHeaderItems((prev) =>
                      prev.map((x) =>
                        x.clientId === item.clientId ? { ...x, isCta: v } : { ...x, isCta: false },
                      ),
                    );
                  }}
                >
                  <option value="false">Regular</option>
                  <option value="true">CTA</option>
                </select>

                <select
                  className="rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-xs"
                  value={item.external ? "true" : "false"}
                  onChange={(e) => patchHeader(item.clientId, { external: e.target.value === "true" })}
                >
                  <option value="false">Internal</option>
                  <option value="true">External</option>
                </select>

                <div className="flex gap-2">
                  <button
                    className="text-xs hover:underline"
                    onClick={() => setHeaderItems((prev) => moveByClientId(prev, item.clientId, "up"))}
                  >
                    Up
                  </button>
                  <button
                    className="text-xs hover:underline"
                    onClick={() =>
                      setHeaderItems((prev) => moveByClientId(prev, item.clientId, "down"))
                    }
                  >
                    Down
                  </button>
                  <button
                    className="text-xs text-red-400 hover:underline"
                    onClick={() => removeHeader(item.clientId)}
                  >
                    Delete
                  </button>
                </div>
              </div>

              {!hasHeaderCta ? (
                <div className="mt-2 text-[11px] text-white/40">Tip: set one item as CTA.</div>
              ) : null}
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Footer Legal Links</h2>
          <div className="flex items-center gap-2">
            <button
              className="rounded-lg border border-white/10 px-3 py-1.5 text-xs hover:bg-white/5"
              onClick={resetFooter}
              type="button"
            >
              Reset
            </button>
            <button
              className="rounded-lg bg-[#C51F5D] px-3 py-1.5 text-xs disabled:opacity-60"
              onClick={saveFooter}
              disabled={saving === "footer"}
            >
              {saving === "footer" ? "Saving..." : "Save Footer"}
            </button>
          </div>
        </div>

        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <div className="grid gap-3 sm:grid-cols-3">
            <input
              className="rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-xs"
              placeholder="Label"
              value={footerLabel}
              onChange={(e) => setFooterLabel(e.target.value)}
            />
            <input
              className="rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-xs"
              placeholder="URL"
              value={footerUrl}
              onChange={(e) => setFooterUrl(e.target.value)}
            />
            <button
              className="rounded-lg border border-white/10 px-3 py-2 text-xs hover:bg-white/5"
              onClick={addFooter}
            >
              Add Footer Link
            </button>
          </div>
        </div>

        <div className="space-y-2">
          {footerItems.map((item) => (
            <div key={item.clientId} className="rounded-lg border border-white/10 bg-white/5 p-3">
              <div className="grid gap-3 sm:grid-cols-6 items-center">
                <input
                  className="rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-xs"
                  value={item.label}
                  onChange={(e) => patchFooter(item.clientId, { label: e.target.value })}
                />
                <input
                  className="rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-xs"
                  value={item.url}
                  onChange={(e) => patchFooter(item.clientId, { url: e.target.value })}
                />
                <select
                  className="rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-xs"
                  value={item.visible === false ? "false" : "true"}
                  onChange={(e) => patchFooter(item.clientId, { visible: e.target.value === "true" })}
                >
                  <option value="true">Visible</option>
                  <option value="false">Hidden</option>
                </select>

                <select
                  className="rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-xs"
                  value={item.external ? "true" : "false"}
                  onChange={(e) => patchFooter(item.clientId, { external: e.target.value === "true" })}
                >
                  <option value="false">Internal</option>
                  <option value="true">External</option>
                </select>

                <div className="flex gap-2 sm:col-span-2">
                  <button
                    className="text-xs hover:underline"
                    onClick={() => setFooterItems((prev) => moveByClientId(prev, item.clientId, "up"))}
                  >
                    Up
                  </button>
                  <button
                    className="text-xs hover:underline"
                    onClick={() =>
                      setFooterItems((prev) => moveByClientId(prev, item.clientId, "down"))
                    }
                  >
                    Down
                  </button>
                  <button
                    className="text-xs text-red-400 hover:underline"
                    onClick={() => removeFooter(item.clientId)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER QUICK LINKS */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Footer Quick Links</h2>
          <div className="flex items-center gap-2">
            <button
              className="rounded-lg border border-white/10 px-3 py-1.5 text-xs hover:bg-white/5"
              onClick={resetQuick}
              type="button"
            >
              Reset
            </button>
            <button
              className="rounded-lg bg-[#C51F5D] px-3 py-1.5 text-xs disabled:opacity-60"
              onClick={saveQuick}
              disabled={saving === "quick"}
            >
              {saving === "quick" ? "Saving..." : "Save Quick Links"}
            </button>
          </div>
        </div>

        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <div className="grid gap-3 sm:grid-cols-3">
            <input
              className="rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-xs"
              placeholder="Label"
              value={quickLabel}
              onChange={(e) => setQuickLabel(e.target.value)}
            />
            <input
              className="rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-xs"
              placeholder="URL"
              value={quickUrl}
              onChange={(e) => setQuickUrl(e.target.value)}
            />
            <button
              className="rounded-lg border border-white/10 px-3 py-2 text-xs hover:bg-white/5"
              onClick={addQuick}
            >
              Add Quick Link
            </button>
          </div>
        </div>

        <div className="space-y-2">
          {quickItems.map((item) => (
            <div key={item.clientId} className="rounded-lg border border-white/10 bg-white/5 p-3">
              <div className="grid gap-3 sm:grid-cols-5 items-center">
                <input
                  className="rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-xs"
                  value={item.label}
                  onChange={(e) => patchQuick(item.clientId, { label: e.target.value })}
                />
                <input
                  className="rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-xs"
                  value={item.url}
                  onChange={(e) => patchQuick(item.clientId, { url: e.target.value })}
                />
                <select
                  className="rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-xs"
                  value={item.visible === false ? "false" : "true"}
                  onChange={(e) => patchQuick(item.clientId, { visible: e.target.value === "true" })}
                >
                  <option value="true">Visible</option>
                  <option value="false">Hidden</option>
                </select>
                <select
                  className="rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-xs"
                  value={item.external ? "true" : "false"}
                  onChange={(e) => patchQuick(item.clientId, { external: e.target.value === "true" })}
                >
                  <option value="false">Internal</option>
                  <option value="true">External</option>
                </select>

                <div className="flex gap-2">
                  <button
                    className="text-xs hover:underline"
                    onClick={() => setQuickItems((prev) => moveByClientIdSimple(prev, item.clientId, "up"))}
                  >
                    Up
                  </button>
                  <button
                    className="text-xs hover:underline"
                    onClick={() => setQuickItems((prev) => moveByClientIdSimple(prev, item.clientId, "down"))}
                  >
                    Down
                  </button>
                  <button
                    className="text-xs text-red-400 hover:underline"
                    onClick={() => removeQuick(item.clientId)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER RESOURCES */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Footer Resources</h2>
          <div className="flex items-center gap-2">
            <button
              className="rounded-lg border border-white/10 px-3 py-1.5 text-xs hover:bg-white/5"
              onClick={resetResources}
              type="button"
            >
              Reset
            </button>
            <button
              className="rounded-lg bg-[#C51F5D] px-3 py-1.5 text-xs disabled:opacity-60"
              onClick={saveResources}
              disabled={saving === "resources"}
            >
              {saving === "resources" ? "Saving..." : "Save Resources"}
            </button>
          </div>
        </div>

        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <div className="grid gap-3 sm:grid-cols-3">
            <input
              className="rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-xs"
              placeholder="Label"
              value={resourceLabel}
              onChange={(e) => setResourceLabel(e.target.value)}
            />
            <input
              className="rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-xs"
              placeholder="URL"
              value={resourceUrl}
              onChange={(e) => setResourceUrl(e.target.value)}
            />
            <button
              className="rounded-lg border border-white/10 px-3 py-2 text-xs hover:bg-white/5"
              onClick={addResource}
            >
              Add Resource Link
            </button>
          </div>
        </div>

        <div className="space-y-2">
          {resourceItems.map((item) => (
            <div key={item.clientId} className="rounded-lg border border-white/10 bg-white/5 p-3">
              <div className="grid gap-3 sm:grid-cols-5 items-center">
                <input
                  className="rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-xs"
                  value={item.label}
                  onChange={(e) => patchResource(item.clientId, { label: e.target.value })}
                />
                <input
                  className="rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-xs"
                  value={item.url}
                  onChange={(e) => patchResource(item.clientId, { url: e.target.value })}
                />
                <select
                  className="rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-xs"
                  value={item.visible === false ? "false" : "true"}
                  onChange={(e) => patchResource(item.clientId, { visible: e.target.value === "true" })}
                >
                  <option value="true">Visible</option>
                  <option value="false">Hidden</option>
                </select>
                <select
                  className="rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-xs"
                  value={item.external ? "true" : "false"}
                  onChange={(e) => patchResource(item.clientId, { external: e.target.value === "true" })}
                >
                  <option value="false">Internal</option>
                  <option value="true">External</option>
                </select>

                <div className="flex gap-2">
                  <button
                    className="text-xs hover:underline"
                    onClick={() => setResourceItems((prev) => moveByClientIdSimple(prev, item.clientId, "up"))}
                  >
                    Up
                  </button>
                  <button
                    className="text-xs hover:underline"
                    onClick={() => setResourceItems((prev) => moveByClientIdSimple(prev, item.clientId, "down"))}
                  >
                    Down
                  </button>
                  <button
                    className="text-xs text-red-400 hover:underline"
                    onClick={() => removeResource(item.clientId)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
