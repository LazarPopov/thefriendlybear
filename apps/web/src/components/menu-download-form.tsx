"use client";

import { useId, useState, type FormEvent } from "react";
import type { SiteLocale } from "@/lib/site";
import type { TouristMarketLocale } from "@/lib/tourist-market";

type MenuDownloadFormLocale = SiteLocale | TouristMarketLocale;

type MenuDownloadFormProps = {
  locale: MenuDownloadFormLocale;
  menuLocale?: SiteLocale;
  source?: string;
};

type SubmitState = "idle" | "submitting" | "success" | "error";

const copy = {
  bg: {
    eyebrow: "Редовно меню",
    title: "Изтеглете редовното меню",
    name: "Име",
    email: "Имейл",
    namePlaceholder: "Вашето име",
    emailPlaceholder: "you@example.com",
    menuOption: "Изпратете ми редовното меню и започнете свалянето.",
    extrasOption: "Искам да получавам и специални предложения и събития.",
    buttonIdle: "Изтеглете менюто",
    buttonLoading: "Подготвяме файла...",
    success: "Благодарим ви. Свалянето започва.",
    error: "Не успяхме да запазим заявката. Опитайте отново."
  },
  en: {
    eyebrow: "Regular menu",
    title: "Download the regular menu",
    name: "Name",
    email: "Email",
    namePlaceholder: "Your name",
    emailPlaceholder: "you@example.com",
    menuOption: "Send me the regular menu and start the download.",
    extrasOption: "I would also like special offers and events.",
    buttonIdle: "Download menu",
    buttonLoading: "Preparing file...",
    success: "Thank you. The download is starting.",
    error: "We could not save the request. Please try again."
  }
} as const;

function getCopy(locale: MenuDownloadFormLocale) {
  return locale === "bg" ? copy.bg : copy.en;
}

function getFormValue(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value : "";
}

function getCheckboxValue(value: FormDataEntryValue | null) {
  return value === "on";
}

export function MenuDownloadForm({
  locale,
  menuLocale = locale === "bg" ? "bg" : "en",
  source = "menu_download_form"
}: MenuDownloadFormProps) {
  const text = getCopy(locale);
  const nameId = useId();
  const emailId = useId();
  const menuOptionId = useId();
  const extrasOptionId = useId();
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    setSubmitState("submitting");
    setMessage("");

    try {
      const response = await fetch("/api/menu-download-leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: getFormValue(formData.get("name")),
          email: getFormValue(formData.get("email")),
          menuRequested: getCheckboxValue(formData.get("menuRequested")),
          extrasRequested: getCheckboxValue(formData.get("extrasRequested")),
          locale,
          menuLocale,
          source
        })
      });
      const payload = (await response.json().catch(() => null)) as { downloadUrl?: string; error?: string } | null;

      if (!response.ok) {
        throw new Error(payload?.error || text.error);
      }

      setSubmitState("success");
      setMessage(text.success);

      window.setTimeout(() => {
        window.location.href = payload?.downloadUrl || `/api/menu-download?locale=${menuLocale}`;
      }, 120);
    } catch (error) {
      setSubmitState("error");
      setMessage(error instanceof Error ? error.message : text.error);
    }
  }

  return (
    <section className="menu-download-card" data-track-section="menu_download_form">
      <div className="menu-download-copy">
        <p className="menu-download-eyebrow">{text.eyebrow}</p>
        <h2>{text.title}</h2>
      </div>

      <form className="menu-download-form" onSubmit={handleSubmit}>
        <label className="menu-download-field" htmlFor={nameId}>
          <span>{text.name}</span>
          <input
            id={nameId}
            name="name"
            type="text"
            autoComplete="name"
            placeholder={text.namePlaceholder}
            required
            minLength={2}
            maxLength={120}
          />
        </label>

        <label className="menu-download-field" htmlFor={emailId}>
          <span>{text.email}</span>
          <input
            id={emailId}
            name="email"
            type="email"
            autoComplete="email"
            placeholder={text.emailPlaceholder}
            required
            maxLength={254}
          />
        </label>

        <div className="menu-download-options">
          <label className="menu-download-check" htmlFor={menuOptionId}>
            <input id={menuOptionId} name="menuRequested" type="checkbox" defaultChecked required />
            <span>{text.menuOption}</span>
          </label>

          <label className="menu-download-check" htmlFor={extrasOptionId}>
            <input id={extrasOptionId} name="extrasRequested" type="checkbox" />
            <span>{text.extrasOption}</span>
          </label>
        </div>

        <button className="menu-download-submit" type="submit" disabled={submitState === "submitting"}>
          {submitState === "submitting" ? text.buttonLoading : text.buttonIdle}
        </button>
      </form>

      <p className={`menu-download-message menu-download-message-${submitState}`} aria-live="polite">
        {message}
      </p>
    </section>
  );
}
