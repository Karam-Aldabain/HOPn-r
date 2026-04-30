"use client";

import { useEffect, useState } from "react";
import { fetchCms, normalizeSingle } from "@/lib/cms-client";

type TrackingSettings = {
  analyticsId?: string;
  enableCookies?: boolean;
};

const STORAGE_KEY = "hopn_cookie_consent";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const [settings, setSettings] = useState<TrackingSettings | null>(null);

  useEffect(() => {
    let mounted = true;
    fetchCms<{ key: string; valueJson?: TrackingSettings }>("/settings/public?key=tracking")
      .then((res) => {
        const data = normalizeSingle<{ valueJson?: TrackingSettings }>(res as any);
        if (!mounted) return;
        setSettings(data?.valueJson || null);
      })
      .catch(() => {
        if (!mounted) return;
        setSettings(null);
      });
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!settings?.enableCookies) return;
    const existing = localStorage.getItem(STORAGE_KEY);
    if (!existing) setVisible(true);
  }, [settings]);

  if (!settings?.enableCookies || !visible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-[9999] mx-auto max-w-3xl rounded-2xl border border-white/10 bg-[#0b0f16]/95 p-4 text-sm text-white/85 backdrop-blur">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          We use cookies to improve performance and measure traffic. You can accept or decline.
        </div>
        <div className="flex items-center gap-2">
          <button
            className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white/80 hover:bg-white/10"
            onClick={() => {
              localStorage.setItem(STORAGE_KEY, "declined");
              setVisible(false);
            }}
          >
            Decline
          </button>
          <button
            className="rounded-lg bg-[#C51F5D] px-4 py-2 text-sm font-semibold text-white hover:brightness-110"
            onClick={() => {
              localStorage.setItem(STORAGE_KEY, "accepted");
              setVisible(false);
            }}
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
