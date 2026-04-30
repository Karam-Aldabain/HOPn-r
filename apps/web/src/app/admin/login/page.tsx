"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { adminFetch, setAdminRefreshToken, setAdminToken } from "@/lib/admin-api";

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@hopn.com");
  const [password, setPassword] = useState("ChangeMe123!");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      const res = await adminFetch<{ accessToken: string; refreshToken?: string }>("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      setAdminToken(res.accessToken);
      if (res.refreshToken) setAdminRefreshToken(res.refreshToken);
      router.push("/admin");
    } catch (err: any) {
      setError(err?.message || "Login failed");
    }
  }

  return (
    <div className="min-h-screen bg-[#0b0f16] text-white flex items-center justify-center">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-md rounded-2xl border border-white/10 bg-[#070b13] p-6"
      >
        <h1 className="text-2xl font-bold">Admin Login</h1>
        <div className="mt-4 space-y-3">
          <input
            className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
          />
          <input
            className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          />
        </div>
        {error ? <div className="mt-3 text-xs text-red-400">{error}</div> : null}
        <div className="mt-3 text-xs text-white/50">
          Forgot password?{" "}
          <a className="text-white underline" href="/admin/forgot">
            Reset
          </a>
        </div>
        <button className="mt-5 w-full rounded-lg bg-[#C51F5D] py-2 text-sm font-semibold">
          Sign in
        </button>
      </form>
    </div>
  );
}
