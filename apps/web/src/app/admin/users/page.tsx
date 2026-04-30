"use client";

import { useEffect, useMemo, useState } from "react";
import { adminFetch } from "@/lib/admin-api";

type User = {
  id: number;
  name: string;
  email: string;
  role: string;
  status?: string;
  lastLoginAt?: string | null;
};

const roles = [
  "SUPER_ADMIN",
  "CONTENT_MANAGER",
  "MARKETING_CRM_MANAGER",
  "EDITOR",
  "TECHNICAL_ADMIN",
] as const;

type Role = (typeof roles)[number];

type Draft = {
  name: string;
  email: string;
  role: Role;
  newPassword: string; // local only
};

export default function AdminUsers() {
  const [items, setItems] = useState<User[]>([]);
  const [drafts, setDrafts] = useState<Record<number, Draft>>({});
  const [loading, setLoading] = useState(true);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<Role>(roles[1]);
  const [password, setPassword] = useState("");

  const [busyId, setBusyId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const sorted = useMemo(() => items.slice().sort((a, b) => a.id - b.id), [items]);

  function initDraft(u: User): Draft {
    return {
      name: u.name || "",
      email: u.email || "",
      role: (u.role as Role) || roles[1],
      newPassword: "",
    };
  }

  function patchDraft(id: number, patch: Partial<Draft>) {
    setDrafts((prev) => ({ ...prev, [id]: { ...prev[id], ...patch } }));
  }

  async function load() {
    setError(null);
    setLoading(true);
    try {
      const data = await adminFetch<User[]>("/admin/users");
      setItems(data);
      setDrafts((prev) => {
        const next = { ...prev };
        for (const u of data) {
          if (!next[u.id]) next[u.id] = initDraft(u);
        }
        return next;
      });
    } catch (e: any) {
      setError(e?.message || "Failed to load users.");
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
    const em = email.trim();
    const pw = password;

    if (!n) return setError("Name is required.");
    if (!em) return setError("Email is required.");
    if (!pw) return setError("Password is required.");

    try {
      await adminFetch("/admin/users", {
        method: "POST",
        body: JSON.stringify({ name: n, email: em, role, password: pw }),
      });
      setName("");
      setEmail("");
      setPassword("");
      await load();
    } catch (e: any) {
      setError(e?.message || "Failed to add user.");
    }
  }

  async function save(id: number) {
    setError(null);
    const d = drafts[id];
    if (!d) return;

    setBusyId(id);
    try {
      await adminFetch(`/admin/users/${id}`, {
        method: "PATCH",
        body: JSON.stringify({
          name: d.name.trim(),
          email: d.email.trim(),
          role: d.role,
        }),
      });

      // update local list without reload (stable UI)
      setItems((prev) =>
        prev.map((u) =>
          u.id === id ? { ...u, name: d.name, email: d.email, role: d.role } : u,
        ),
      );
    } catch (e: any) {
      setError(e?.message || "Failed to save user.");
    } finally {
      setBusyId(null);
    }
  }

  async function setUserPassword(id: number) {
    setError(null);
    const d = drafts[id];
    if (!d) return;

    const pw = d.newPassword;
    if (!pw) return;

    setBusyId(id);
    try {
      await adminFetch(`/admin/users/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ password: pw }),
      });

      // clear password field locally
      patchDraft(id, { newPassword: "" });
    } catch (e: any) {
      setError(e?.message || "Failed to update password.");
    } finally {
      setBusyId(null);
    }
  }

  function reset(id: number) {
    const u = items.find((x) => x.id === id);
    if (!u) return;
    setDrafts((prev) => ({ ...prev, [id]: initDraft(u) }));
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
      await adminFetch(`/admin/users/${id}`, { method: "DELETE" });
    } catch (e: any) {
      setError(e?.message || "Failed to delete user.");
      setItems(prevItems);
      await load();
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Users</h1>
      </div>

      {error ? (
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-xs text-red-200">
          {error}
        </div>
      ) : null}

      {/* ADD USER */}
      <div className="rounded-xl border border-white/10 bg-white/5 p-4">
        <div className="grid gap-3 sm:grid-cols-4">
          <input
            className="rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-xs"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            className="rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-xs"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <select
            className="rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-xs"
            value={role}
            onChange={(e) => setRole(e.target.value as Role)}
          >
            {roles.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
          <input
            className="rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-xs"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
          />
        </div>
        <button className="mt-3 rounded-lg bg-[#C51F5D] px-3 py-1.5 text-xs" onClick={add}>
          Add User
        </button>
      </div>

      {/* LIST */}
      {loading ? (
        <div className="text-sm text-white/60">Loading...</div>
      ) : (
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {sorted.map((u) => {
            const d = drafts[u.id];
            if (!d) return null;

            return (
              <div key={u.id} className="rounded-lg border border-white/10 bg-white/5 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-sm font-semibold truncate">
                      {u.name} <span className="text-white/50">{u.email}</span>
                    </div>
                    <div className="mt-1 text-[11px] text-white/50">
                      ID #{u.id} • {u.role}
                      {u.lastLoginAt ? ` • last login ${new Date(u.lastLoginAt).toLocaleString()}` : ""}
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center gap-2">
                    <button
                      className="rounded-lg border border-white/10 px-2 py-1 text-[11px] hover:bg-white/5 disabled:opacity-60"
                      onClick={() => reset(u.id)}
                      disabled={busyId === u.id}
                      type="button"
                    >
                      Reset
                    </button>
                    <button
                      className="rounded-lg bg-[#C51F5D] px-2 py-1 text-[11px] font-semibold disabled:opacity-60"
                      onClick={() => save(u.id)}
                      disabled={busyId === u.id}
                      type="button"
                    >
                      {busyId === u.id ? "Saving..." : "Save"}
                    </button>
                    <button
                      className="text-xs text-red-400 disabled:opacity-60"
                      onClick={() => remove(u.id)}
                      disabled={busyId === u.id}
                      type="button"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                <div className="mt-4 grid gap-3">
                  <input
                    className="rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-xs"
                    value={d.name}
                    onChange={(e) => patchDraft(u.id, { name: e.target.value })}
                    placeholder="Name"
                  />
                  <input
                    className="rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-xs"
                    value={d.email}
                    onChange={(e) => patchDraft(u.id, { email: e.target.value })}
                    placeholder="Email"
                  />
                  <select
                    className="rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-xs"
                    value={d.role}
                    onChange={(e) => patchDraft(u.id, { role: e.target.value as Role })}
                  >
                    {roles.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>

                  {/* Password change: explicit */}
                  <div className="grid gap-2 sm:grid-cols-2">
                    <input
                      className="rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-xs"
                      placeholder="New password"
                      type="password"
                      value={d.newPassword}
                      onChange={(e) => patchDraft(u.id, { newPassword: e.target.value })}
                    />
                    <button
                      className="rounded-lg border border-white/10 px-3 py-2 text-xs hover:bg-white/5 disabled:opacity-60"
                      onClick={() => setUserPassword(u.id)}
                      disabled={busyId === u.id || !d.newPassword}
                      type="button"
                    >
                      {busyId === u.id ? "Saving..." : "Set Password"}
                    </button>
                  </div>

                  {u.status ? (
                    <div className="text-[11px] text-white/50">Status: {u.status}</div>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
