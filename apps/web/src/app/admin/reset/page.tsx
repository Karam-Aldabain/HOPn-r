"use client";

import { useState } from "react";
import { adminFetch } from "@/lib/admin-api";

export default function AdminResetPassword() {
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      await adminFetch("/auth/reset-password", {
        method: "POST",
        body: JSON.stringify({ token, newPassword: password }),
      });
      setDone(true);
    } catch (err: any) {
      setError(err?.message || "Reset failed");
    }
  }

  return (
    <div className="min-h-screen bg-[#0b0f16] text-white flex items-center justify-center">
      <form
        onSubmit={submit}
        className="w-full max-w-md rounded-2xl border border-white/10 bg-[#070b13] p-6"
      >
        <h1 className="text-2xl font-bold">Set New Password</h1>
        <input
          className="mt-4 w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          placeholder="Reset token"
        />
        <input
          className="mt-3 w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="New password"
          type="password"
        />
        {error ? <div className="mt-3 text-xs text-red-400">{error}</div> : null}
        {done ? <div className="mt-3 text-xs text-green-400">Password updated.</div> : null}
        <button className="mt-5 w-full rounded-lg bg-[#C51F5D] py-2 text-sm font-semibold">
          Reset Password
        </button>
        <div className="mt-3 text-xs text-white/50">
          Back to{" "}
          <a className="text-white underline" href="/admin/login">
            login
          </a>
        </div>
      </form>
    </div>
  );
}
