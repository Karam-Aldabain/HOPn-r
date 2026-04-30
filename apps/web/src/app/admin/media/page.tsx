"use client";

import { useEffect, useMemo, useState } from "react";
import { ADMIN_API_BASE, getAdminToken, adminFetch } from "@/lib/admin-api";

type Media = {
  id: number;
  fileUrl: string;
  altText: string;
  tags: string[];
};

type Draft = {
  altText: string;
  tagsText: string; // comma separated
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

export default function AdminMedia() {
  const [items, setItems] = useState<Media[]>([]);
  const [drafts, setDrafts] = useState<Record<number, Draft>>({});
  const [loading, setLoading] = useState(true);

  const [file, setFile] = useState<File | null>(null);
  const [altText, setAltText] = useState("");
  const [tags, setTags] = useState("");

  const [uploading, setUploading] = useState(false);
  const [busyId, setBusyId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const filePreviewUrl = useMemo(() => {
    if (!file) return null;
    return URL.createObjectURL(file);
  }, [file]);

  useEffect(() => {
    return () => {
      if (filePreviewUrl) URL.revokeObjectURL(filePreviewUrl);
    };
  }, [filePreviewUrl]);

  function initDraft(m: Media): Draft {
    return { altText: m.altText || "", tagsText: toComma(m.tags) };
  }

  function patchDraft(id: number, patch: Partial<Draft>) {
    setDrafts((prev) => ({ ...prev, [id]: { ...prev[id], ...patch } }));
  }

  async function load() {
    setError(null);
    setLoading(true);
    try {
      const data = await adminFetch<Media[]>("/admin/media");
      setItems(data);
      setDrafts((prev) => {
        const next = { ...prev };
        for (const m of data) {
          if (!next[m.id]) next[m.id] = initDraft(m);
        }
        return next;
      });
    } catch (e: any) {
      setError(e?.message || "Failed to load media.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load().catch(() => {});
  }, []);

  async function upload() {
    setError(null);
    if (!file) return setError("Choose a file first.");
    if (!altText.trim()) return setError("Alt text is required.");

    setUploading(true);
    try {
      const token = getAdminToken();
      const form = new FormData();
      form.append("file", file);
      form.append("altText", altText.trim());
      form.append("tags", tags);

      const res = await fetch(`${ADMIN_API_BASE}/admin/media/upload`, {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        body: form,
      });

      if (!res.ok) {
        const msg = await res.text().catch(() => "");
        throw new Error(msg || "Upload failed");
      }

      setFile(null);
      setAltText("");
      setTags("");
      await load();
    } catch (e: any) {
      setError(e?.message || "Upload failed.");
    } finally {
      setUploading(false);
    }
  }

  async function save(id: number) {
    setError(null);
    const d = drafts[id];
    if (!d) return;

    setBusyId(id);
    try {
      await adminFetch(`/admin/media/${id}`, {
        method: "PATCH",
        body: JSON.stringify({
          altText: d.altText.trim(),
          tags: fromComma(d.tagsText),
        }),
      });

      // update local items without reload to avoid UI jump
      setItems((prev) =>
        prev.map((m) =>
          m.id === id
            ? { ...m, altText: d.altText, tags: fromComma(d.tagsText) }
            : m,
        ),
      );
    } catch (e: any) {
      setError(e?.message || "Failed to save media.");
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

    // optimistic remove so layout doesn't break
    const prevItems = items;
    setItems((prev) => prev.filter((x) => x.id !== id));
    setDrafts((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });

    try {
      await adminFetch(`/admin/media/${id}`, { method: "DELETE" });
    } catch (e: any) {
      setError(e?.message || "Failed to delete media.");
      setItems(prevItems);
      await load();
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Media Library</h1>
      </div>

      {error ? (
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-xs text-red-200">
          {error}
        </div>
      ) : null}

      {/* UPLOAD */}
      <div className="rounded-xl border border-white/10 bg-white/5 p-4">
        <div className="grid gap-3 sm:grid-cols-3 items-start">
          <div className="space-y-2">
            <input
              type="file"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
            {filePreviewUrl ? (
              <div className="overflow-hidden rounded-lg border border-white/10 bg-white/5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={filePreviewUrl}
                  alt="preview"
                  className="h-32 w-full object-cover"
                />
              </div>
            ) : null}
          </div>

          <input
            className="rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-xs"
            placeholder="Alt text"
            value={altText}
            onChange={(e) => setAltText(e.target.value)}
          />
          <input
            className="rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-xs"
            placeholder="Tags (comma)"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
          />
        </div>

        <button
          className="mt-3 rounded-lg bg-[#C51F5D] px-3 py-1.5 text-xs disabled:opacity-60"
          onClick={upload}
          disabled={uploading}
        >
          {uploading ? "Uploading..." : "Upload"}
        </button>
      </div>

      {/* LIST */}
      {loading ? (
        <div className="text-sm text-white/60">Loading...</div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((m) => {
            const d = drafts[m.id];
            if (!d) return null;

            return (
              <div key={m.id} className="rounded-xl border border-white/10 bg-white/5 p-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={m.fileUrl}
                  alt={m.altText}
                  className="h-36 w-full object-cover rounded-lg"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).style.display = "none";
                  }}
                />

                <div className="mt-2 flex items-center justify-between gap-2">
                  <div className="text-[11px] text-white/50 truncate">{m.fileUrl}</div>
                  <div className="flex gap-2">
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
                  </div>
                </div>

                <input
                  className="mt-2 w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-xs"
                  value={d.altText}
                  onChange={(e) => patchDraft(m.id, { altText: e.target.value })}
                  placeholder="Alt text"
                />

                <input
                  className="mt-2 w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-xs"
                  value={d.tagsText}
                  onChange={(e) => patchDraft(m.id, { tagsText: e.target.value })}
                  placeholder="Tags (comma)"
                />

                <button
                  className="mt-2 text-xs text-red-400 disabled:opacity-60"
                  onClick={() => remove(m.id)}
                  disabled={busyId === m.id}
                  type="button"
                >
                  Delete
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
