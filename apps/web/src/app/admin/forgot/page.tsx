"use client";

import { useState } from "react";
import { adminFetch } from "@/lib/admin-api";

export default function AdminForgotPassword() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      await adminFetch("/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify({ email }),
      });
      setSent(true);
    } catch (err: any) {
      setError(err?.message || "Request failed");
    }
  }

  return (
    <div className="min-h-screen bg-[#0b0f16] text-white flex items-center justify-center">
      <form
        onSubmit={submit}
        className="w-full max-w-md rounded-2xl border border-white/10 bg-[#070b13] p-6"
      >
        <h1 className="text-2xl font-bold">Reset Password</h1>
        <p className="mt-2 text-xs text-white/60">
          We will generate a reset token. Check the server console logs.
        </p>
        <input
          className="mt-4 w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
        />
        {error ? <div className="mt-3 text-xs text-red-400">{error}</div> : null}
        {sent ? (
          <div className="mt-3 text-xs text-green-400">Reset token created.</div>
        ) : null}
        <button className="mt-5 w-full rounded-lg bg-[#C51F5D] py-2 text-sm font-semibold">
          Send Reset
        </button>
        <div className="mt-3 text-xs text-white/50">
          Have a token?{" "}
          <a className="text-white underline" href="/admin/reset">
            Reset now
          </a>
        </div>
      </form>
    </div>
  );
}
