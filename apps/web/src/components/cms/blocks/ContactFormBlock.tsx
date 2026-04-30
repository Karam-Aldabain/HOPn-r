"use client";

import { useEffect, useState } from "react";
import { buildCmsUrl } from "@/lib/cms-client";

type Props = {
  title?: string;
  subtitle?: string;
  info?: {
    location?: string;
    email?: string;
    phone?: string;
    mapEmbedUrl?: string;
    showMap?: boolean;
  };
};

const topics = ["Solutions", "Partnership", "Project", "Careers", "Other"] as const;

type CaptchaConfig = {
  enabled?: boolean;
  provider?: "recaptcha";
  siteKey?: string;
};

export default function ContactFormBlock({ title, subtitle, info }: Props) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const [captcha, setCaptcha] = useState<CaptchaConfig | null>(null);
  const [captchaToken, setCaptchaToken] = useState<string>("");
  const [widgetId, setWidgetId] = useState<number | null>(null);

  useEffect(() => {
    let mounted = true;
    fetch(buildCmsUrl("/settings/public?key=captcha_public"))
      .then((res) => res.json())
      .then((data) => {
        const cfg = data?.valueJson || data?.data?.valueJson || data || {};
        if (!mounted) return;
        setCaptcha(cfg);
      })
      .catch(() => {});
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!captcha?.enabled || captcha?.provider !== "recaptcha" || !captcha?.siteKey) return;
    if (typeof window === "undefined") return;

    if (!document.getElementById("recaptcha-script")) {
      const s = document.createElement("script");
      s.id = "recaptcha-script";
      s.src = "https://www.google.com/recaptcha/api.js?render=explicit";
      s.async = true;
      s.defer = true;
      document.body.appendChild(s);
      s.onload = () => {
        if ((window as any).grecaptcha && widgetId === null) {
          const id = (window as any).grecaptcha.render("recaptcha-container", {
            sitekey: captcha.siteKey,
            callback: (token: string) => setCaptchaToken(token),
            "expired-callback": () => setCaptchaToken(""),
          });
          setWidgetId(id);
        }
      };
    } else if ((window as any).grecaptcha && widgetId === null) {
      const id = (window as any).grecaptcha.render("recaptcha-container", {
        sitekey: captcha.siteKey,
        callback: (token: string) => setCaptchaToken(token),
        "expired-callback": () => setCaptchaToken(""),
      });
      setWidgetId(id);
    }
  }, [captcha, widgetId]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setError(null);

    const form = e.currentTarget;
    const formData = new FormData(form);
    const payload = {
      name: String(formData.get("name") || ""),
      email: String(formData.get("email") || ""),
      company: String(formData.get("company") || ""),
      topic: String(formData.get("topic") || "Other"),
      message: String(formData.get("message") || ""),
      consent: formData.get("consent") === "on",
      captchaToken: captchaToken || undefined,
    };

    // Honeypot (anti-spam)
    const trap = String(formData.get("website") || "");
    if (trap.trim()) {
      setStatus("success");
      form.reset();
      return;
    }

    if (captcha?.enabled && captcha?.provider === "recaptcha" && captcha?.siteKey && !captchaToken) {
      setStatus("error");
      setError("Please complete the captcha.");
      return;
    }

    try {
      const res = await fetch(buildCmsUrl("/leads"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(await res.text());
      setStatus("success");
      form.reset();
    } catch (err: any) {
      setStatus("error");
      setError("Something went wrong. Please try again.");
    }
  }

  return (
    <section className="relative z-10 py-12">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-3xl border border-[hsl(var(--border))] bg-[hsl(var(--card))]/85 p-6 sm:p-8">
          <h2 className="text-2xl sm:text-3xl font-black text-[hsl(var(--fg))]">
            {title || "Contact Us"}
          </h2>
          {subtitle ? (
            <p className="mt-3 text-[hsl(var(--muted))]">{subtitle}</p>
          ) : null}

          <form onSubmit={onSubmit} className="mt-6 grid gap-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <input
                name="name"
                required
                placeholder="Full name"
                className="w-full rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-4 py-3 text-sm text-[hsl(var(--fg))]"
              />
              <input
                name="email"
                type="email"
                required
                placeholder="Email address"
                className="w-full rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-4 py-3 text-sm text-[hsl(var(--fg))]"
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <input
                name="company"
                placeholder="Company"
                className="w-full rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-4 py-3 text-sm text-[hsl(var(--fg))]"
              />
              {/* Honeypot: hidden field for bots */}
              <input
                name="website"
                tabIndex={-1}
                autoComplete="off"
                className="hidden"
                aria-hidden="true"
              />
              <select
                name="topic"
                className="w-full rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-4 py-3 text-sm text-[hsl(var(--fg))]"
                defaultValue="Solutions"
              >
                {topics.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
            <textarea
              name="message"
              required
              rows={5}
              placeholder="Tell us about your project"
              className="w-full rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-4 py-3 text-sm text-[hsl(var(--fg))]"
            />
            <label className="flex items-start gap-2 text-xs text-[hsl(var(--muted))]">
              <input type="checkbox" name="consent" required className="mt-0.5" />
              I agree to the processing of my data in accordance with the Privacy Policy.
            </label>

            {captcha?.enabled && captcha?.provider === "recaptcha" && captcha?.siteKey ? (
              <div className="mt-2">
                <div id="recaptcha-container" />
              </div>
            ) : null}

            <button
              type="submit"
              disabled={status === "loading"}
              className="inline-flex items-center justify-center rounded-xl px-6 py-3 text-sm font-semibold text-white"
              style={{
                background: "hsl(var(--accent))",
                opacity: status === "loading" ? 0.8 : 1,
              }}
            >
              {status === "loading" ? "Submitting..." : "Submit"}
            </button>

            {status === "success" ? (
              <div className="text-sm text-[hsl(var(--accent))]">
                Thanks! We’ll get back to you shortly.
              </div>
            ) : null}
            {status === "error" ? (
              <div className="text-sm text-red-500">{error}</div>
            ) : null}
          </form>
        </div>
          <div className="rounded-3xl border border-[hsl(var(--border))] bg-[hsl(var(--card))]/85 p-6 sm:p-8">
            <div className="text-sm font-semibold text-[hsl(var(--fg))]">Contact Info</div>
            <div className="mt-4 space-y-3 text-sm text-[hsl(var(--muted))]">
              <div>
                <div className="text-xs text-[hsl(var(--fg))]/70">Location</div>
                <div>{info?.location || "Germany"}</div>
              </div>
              {info?.email ? (
                <div>
                  <div className="text-xs text-[hsl(var(--fg))]/70">Email</div>
                  <div>{info.email}</div>
                </div>
              ) : null}
              {info?.phone ? (
                <div>
                  <div className="text-xs text-[hsl(var(--fg))]/70">Phone</div>
                  <div>{info.phone}</div>
                </div>
              ) : null}
            </div>

            {info?.showMap && info?.mapEmbedUrl ? (
              <div className="mt-5 overflow-hidden rounded-2xl border border-[hsl(var(--border))]">
                <iframe
                  src={info.mapEmbedUrl}
                  title="Map"
                  className="h-56 w-full"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
