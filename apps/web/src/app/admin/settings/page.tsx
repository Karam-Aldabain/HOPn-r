"use client";

import { useEffect, useState } from "react";
import { adminFetch } from "@/lib/admin-api";
import {
  DEFAULT_HOME_CONTENT,
  DEFAULT_CONSULTING_CONTENT,
  DEFAULT_DIGITAL_TWINS_CONTENT,
  DEFAULT_FINTECH_INNOVATIONS_CONTENT,
  DEFAULT_EDUCATION_EVENTS_CONTENT,
  DEFAULT_CONTACT_CONTENT,
  DEFAULT_CARRES_CONTENT,
  DEFAULT_PARTNERS_CONTENT,
  DEFAULT_INSIGHTS_CONTENT,
  DEFAULT_LABS_CONTENT,
  DEFAULT_EVENTS_CONTENT,
  DEFAULT_AI_SOLUTIONS_CONTENT,
  DEFAULT_SOLUTIONS_PAGE_CONTENT,
} from "@/lib/page-defaults";

type Setting = { key: string; valueJson: any };
type AdminPage = {
  id: number;
  title?: string;
  slug?: string;
  seoTitle?: string;
  seoDescription?: string;
  ogImage?: string;
  sections?: Array<{
    id?: number;
    type: string;
    contentJson?: any;
    content_json?: any;
    visible?: boolean;
    order?: number;
  }>;
};

const keys = [
  "branding",
  "theme",
  "integrations",
  "captcha_public",
  "legal_imprint",
  "legal_privacy",
  "legal_cookies",
  "seo_defaults",
  "security",
  "backups",
  "tracking",
  // per-page content settings
  "page_home",
  "page_about",
  "page_solutions",
  "page_projects",
  "page_partnerships",
  "page_partners",
  "page_team",
  "page_insights",
  "page_labs",
  "page_events",
  "page_services",
  "page_consulting",
  "page_digital-twins",
  "page_fintech-innovations",
  "page_education-events",
  "page_ai_solutions",
  "page_contact",
  "page_carres",
  "page_vision_mission",
] as const;

type SaveState = "idle" | "saving" | "saved" | "error";

export default function AdminSettings() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [parseErrors, setParseErrors] = useState<Record<string, string | null>>({});
  const [saveState, setSaveState] = useState<Record<string, SaveState>>({});
  const [saveMsg, setSaveMsg] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [globalError, setGlobalError] = useState<string | null>(null);

  async function load() {
    setGlobalError(null);
    setLoading(true);
    try {
      const [data, pages] = await Promise.all([
        adminFetch<Setting[]>("/admin/settings"),
        adminFetch<AdminPage[]>("/admin/pages").catch(() => []),
      ]);
      const map: Record<string, string> = {};
      data.forEach((s) => {
        map[s.key] = JSON.stringify(s.valueJson ?? {}, null, 2);
      });

      const pageBySlug = new Map<string, AdminPage>();
      pages.forEach((p) => {
        if (p.slug) pageBySlug.set(p.slug, p);
      });

      // ensure all keys exist in UI (and prefill page_* from CMS if empty)
      keys.forEach((k) => {
        if (map[k] === undefined) map[k] = JSON.stringify({}, null, 2);

        if (k.startsWith("page_")) {
          const slug = k.replace(/^page_/, "");
          const current = map[k]?.trim();
          const isEmpty = !current || current === "{}";
          const page = pageBySlug.get(slug);
          if (slug === "home") {
            let parsed: any = null;
            try {
              parsed = JSON.parse(current || "{}");
            } catch {
              parsed = null;
            }
            const looksLikeCms = parsed && Array.isArray(parsed.sections);
            if (isEmpty || looksLikeCms) {
              map[k] = JSON.stringify(DEFAULT_HOME_CONTENT, null, 2);
            }
          } else if (isEmpty && slug === "consulting") {
            map[k] = JSON.stringify(DEFAULT_CONSULTING_CONTENT, null, 2);
          } else if (isEmpty && slug === "digital-twins") {
            map[k] = JSON.stringify(DEFAULT_DIGITAL_TWINS_CONTENT, null, 2);
          } else if (isEmpty && slug === "fintech-innovations") {
            map[k] = JSON.stringify(DEFAULT_FINTECH_INNOVATIONS_CONTENT, null, 2);
          } else if (isEmpty && slug === "education-events") {
            map[k] = JSON.stringify(DEFAULT_EDUCATION_EVENTS_CONTENT, null, 2);
          } else if (isEmpty && slug === "contact") {
            map[k] = JSON.stringify(DEFAULT_CONTACT_CONTENT, null, 2);
          } else if (isEmpty && slug === "carres") {
            map[k] = JSON.stringify(DEFAULT_CARRES_CONTENT, null, 2);
          } else if (isEmpty && slug === "partners") {
            map[k] = JSON.stringify(DEFAULT_PARTNERS_CONTENT, null, 2);
          } else if (isEmpty && slug === "partnerships") {
            map[k] = JSON.stringify(DEFAULT_PARTNERS_CONTENT, null, 2);
          } else if (isEmpty && slug === "insights") {
            map[k] = JSON.stringify(DEFAULT_INSIGHTS_CONTENT, null, 2);
          } else if (isEmpty && slug === "labs") {
            map[k] = JSON.stringify(DEFAULT_LABS_CONTENT, null, 2);
          } else if (isEmpty && slug === "events") {
            map[k] = JSON.stringify(DEFAULT_EVENTS_CONTENT, null, 2);
          } else if (isEmpty && slug === "ai_solutions") {
            map[k] = JSON.stringify(DEFAULT_AI_SOLUTIONS_CONTENT, null, 2);
          } else if (isEmpty && slug === "solutions") {
            map[k] = JSON.stringify(DEFAULT_SOLUTIONS_PAGE_CONTENT, null, 2);
          } else if (isEmpty && page) {
            const sections = (page.sections || []).map((s) => ({
              id: s.id,
              type: s.type,
              visible: s.visible ?? true,
              order: s.order ?? 0,
              contentJson: s.contentJson ?? s.content_json ?? {},
            }));
            map[k] = JSON.stringify(
              {
                title: page.title ?? "",
                slug: page.slug ?? slug,
                seoTitle: page.seoTitle ?? "",
                seoDescription: page.seoDescription ?? "",
                ogImage: page.ogImage ?? "",
                sections,
              },
              null,
              2
            );
          }
        }
      });

      setSettings(map);
      setParseErrors({});
      setSaveState({});
      setSaveMsg({});
    } catch (e: any) {
      setGlobalError(e?.message || "Failed to load settings.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load().catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function validate(key: string, raw: string): any | null {
    try {
      const parsed = JSON.parse(raw || "{}");
      setParseErrors((prev) => ({ ...prev, [key]: null }));
      return parsed;
    } catch (e: any) {
      setParseErrors((prev) => ({ ...prev, [key]: "Invalid JSON" }));
      return null;
    }
  }

  function onChange(key: string, value: string) {
    setSettings((prev) => ({ ...prev, [key]: value }));
    // live-validate lightly
    validate(key, value);
    // reset saved status when edited
    setSaveState((prev) => ({ ...prev, [key]: "idle" }));
    setSaveMsg((prev) => ({ ...prev, [key]: "" }));
  }

  function formatJson(key: string) {
    const raw = settings[key] || "{}";
    const parsed = validate(key, raw);
    if (parsed === null) return;
    setSettings((prev) => ({ ...prev, [key]: JSON.stringify(parsed, null, 2) }));
  }

  async function save(key: string) {
    const raw = settings[key] || "{}";
    const valueJson = validate(key, raw);
    if (valueJson === null) {
      setSaveState((prev) => ({ ...prev, [key]: "error" }));
      setSaveMsg((prev) => ({ ...prev, [key]: "Fix JSON before saving." }));
      return;
    }

    setSaveState((prev) => ({ ...prev, [key]: "saving" }));
    setSaveMsg((prev) => ({ ...prev, [key]: "" }));

    try {
      await adminFetch(`/admin/settings`, {
        method: "PUT",
        body: JSON.stringify({ key, valueJson }),
      });

      setSaveState((prev) => ({ ...prev, [key]: "saved" }));
      setSaveMsg((prev) => ({ ...prev, [key]: "Saved." }));
    } catch (e: any) {
      setSaveState((prev) => ({ ...prev, [key]: "error" }));
      setSaveMsg((prev) => ({ ...prev, [key]: e?.message || "Save failed." }));
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Settings</h1>
        <button
          className="rounded-lg border border-white/10 px-3 py-1.5 text-xs disabled:opacity-60"
          onClick={load}
          disabled={loading}
        >
          {loading ? "Loading..." : "Reload"}
        </button>
      </div>

      {globalError ? (
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-xs text-red-200">
          {globalError}
        </div>
      ) : null}

      <div className="space-y-6">
        {keys.map((key) => {
          const err = parseErrors[key] || null;
          const state = saveState[key] || "idle";
          const msg = saveMsg[key] || "";

          const canSave = !err && state !== "saving";

          return (
            <div key={key} className="rounded-xl border border-white/10 bg-white/5 p-4">
              <div className="flex items-center justify-between gap-3">
                <div className="text-sm font-semibold">{key}</div>

                <div className="flex items-center gap-2">
                  {state === "saved" ? (
                    <div className="text-[11px] text-green-300">Saved</div>
                  ) : state === "error" ? (
                    <div className="text-[11px] text-red-300">Error</div>
                  ) : null}

                  <button
                    className="rounded-lg border border-white/10 px-3 py-1.5 text-xs hover:bg-white/5 disabled:opacity-60"
                    onClick={() => formatJson(key)}
                    disabled={state === "saving"}
                    type="button"
                  >
                    Format JSON
                  </button>

                  <button
                    className="rounded-lg bg-[#C51F5D] px-3 py-1.5 text-xs disabled:opacity-60"
                    onClick={() => save(key)}
                    disabled={!canSave}
                    type="button"
                  >
                    {state === "saving" ? "Saving..." : "Save"}
                  </button>
                </div>
              </div>

              {err ? (
                <div className="mt-2 text-xs text-red-300">{err}</div>
              ) : null}

              {msg ? (
                <div className={`mt-2 text-xs ${state === "error" ? "text-red-300" : "text-white/50"}`}>
                  {msg}
                </div>
              ) : null}

              <textarea
                className="mt-3 w-full min-h-[160px] rounded-lg bg-white/5 border border-white/10 p-3 text-xs font-mono"
                value={settings[key] || ""}
                onChange={(e) => onChange(key, e.target.value)}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
