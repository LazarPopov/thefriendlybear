"use client";

import { useState, useTransition } from "react";
import { subscribeToNewsletter } from "@/lib/newsletter-actions";

type NewsletterFormProps = {
  locale: string;
  source?: string;
};

const translations: Record<string, any> = {
  bg: {
    title: "Вземете специална оферта",
    description: "Запишете се за нашия бюлетин и получете комплимент за вашето посещение в часове извън пика.",
    emailLabel: "Имейл адрес",
    emailPlaceholder: "your@email.com",
    consentLabel: "Съгласен съм да получавам маркетингови съобщения от The Friendly Bear.",
    submitLabel: "Записване",
    loadingLabel: "Обработка...",
    successMessage: "Благодарим ви! Проверете имейла си за потвърждение.",
    errorMessage: "Възникна грешка. Моля, опитайте отново.",
  },
  en: {
    title: "Get a special offer",
    description: "Join our newsletter and receive a welcome compliment for your off-peak visit.",
    emailLabel: "Email address",
    emailPlaceholder: "your@email.com",
    consentLabel: "I agree to receive marketing communications from The Friendly Bear.",
    submitLabel: "Subscribe",
    loadingLabel: "Processing...",
    successMessage: "Thank you! Please check your email for confirmation.",
    errorMessage: "An error occurred. Please try again.",
  }
};

export function NewsletterForm({ locale, source = "reservations_page" }: NewsletterFormProps) {
  const t = translations[locale] || translations.en;
  const [isPending, startTransition] = useTransition();
  const [state, setState] = useState<{ success?: boolean; error?: string } | null>(null);

  async function handleSubmit(formData: FormData) {
    setState(null);
    startTransition(async () => {
      const result = await subscribeToNewsletter(formData);
      if (result.success) {
        setState({ success: true });
      } else {
        setState({ error: result.error || t.errorMessage });
      }
    });
  }

  if (state?.success) {
    return (
      <div className="page-card newsletter-success">
        <h3>{t.successMessage}</h3>
      </div>
    );
  }

  return (
    <article className="page-card newsletter-card">
      <p className="page-card-label">{t.title}</p>
      <h2>{t.title}</h2>
      <p>{t.description}</p>
      
      <form action={handleSubmit} className="newsletter-form">
        <input type="hidden" name="locale" value={locale} />
        <input type="hidden" name="source" value={source} />
        
        <div className="form-group">
          <label htmlFor="email">{t.emailLabel}</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder={t.emailPlaceholder}
            required
            disabled={isPending}
            className="form-input"
          />
        </div>

        <div className="form-group checkbox-group">
          <input
            type="checkbox"
            id="marketingConsent"
            name="marketingConsent"
            required
            disabled={isPending}
          />
          <label htmlFor="marketingConsent">{t.consentLabel}</label>
        </div>

        {state?.error && <p className="form-error">{state.error}</p>}

        <button type="submit" disabled={isPending} className="action-link">
          {isPending ? t.loadingLabel : t.submitLabel}
        </button>
      </form>

      <style jsx>{`
        .newsletter-form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          margin-top: 1rem;
        }
        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .checkbox-group {
          flex-direction: row;
          align-items: flex-start;
          gap: 0.75rem;
        }
        .checkbox-group input {
          margin-top: 0.25rem;
        }
        .form-input {
          padding: 0.75rem;
          border: 1px solid var(--border-color, #ccc);
          border-radius: 4px;
          background: var(--card-bg, #fff);
        }
        .form-error {
          color: #d32f2f;
          font-size: 0.875rem;
        }
        .newsletter-success {
          text-align: center;
          padding: 2rem;
          background: #e8f5e9;
          border: 1px solid #c8e6c9;
        }
      `}</style>
    </article>
  );
}
