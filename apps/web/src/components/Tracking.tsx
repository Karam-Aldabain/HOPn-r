"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import { fetchCms, normalizeSingle } from "@/lib/cms-client";

type TrackingSettings = {
  analyticsId?: string;
  enableCookies?: boolean;
};

const STORAGE_KEY = "hopn_cookie_consent";

export default function Tracking() {
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

  const consent = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
  const allowed = settings?.analyticsId && (!settings?.enableCookies || consent === "accepted");

  if (!allowed) return null;

  return (
    <>
      <script async src={`https://www.googletagmanager.com/gtag/js?id=${settings.analyticsId}`} />
      <Script id="ga4" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${settings.analyticsId}', { anonymize_ip: true });
        `}
      </Script>
    </>
  );
}
