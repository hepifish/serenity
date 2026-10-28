"use client";

import { useState } from "react";
import { getDict } from "@/i18n";
import type { Locale } from "@/i18n/config";

export default function ContactForm({ lang }: { lang: Locale }) {
  const t = getDict(lang).contact;
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));
    setState("sending");
    const res = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...data, lang }) }).catch(() => null);
    setState(res?.ok ? "sent" : "error");
  }

  if (state === "sent") return <p className="notice" role="status">{t.sent}</p>;

  return (
    <form className="form" onSubmit={submit}>
      <div className="form-row">
        <div className="field">
          <label htmlFor="c-name">{t.name}</label>
          <input id="c-name" name="name" required minLength={2} maxLength={120} autoComplete="name" />
        </div>
        <div className="field">
          <label htmlFor="c-email">{t.email}</label>
          <input id="c-email" name="email" type="email" required maxLength={200} autoComplete="email" />
        </div>
      </div>
      <div className="field">
        <label htmlFor="c-msg">{t.message}</label>
        <textarea id="c-msg" name="message" required minLength={5} maxLength={3000} />
      </div>
      <input className="honeypot" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" />
      {state === "error" ? <p className="error-text" role="alert">{t.error}</p> : null}
      <div>
        <button className="btn" disabled={state === "sending"}>{state === "sending" ? t.sending : t.send}</button>
      </div>
    </form>
  );
}
