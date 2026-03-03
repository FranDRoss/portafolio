// src/pages/Contact/ContactPage.tsx
import * as React from "react";
import styles from "./contact.module.css";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import emailjs from "@emailjs/browser";
import { useTranslation, Trans } from "react-i18next";
import ReCAPTCHA from "react-google-recaptcha";

const createContactSchema = (t: any) => z.object({
  name: z.string().min(2, t("contact.form.name.error")).max(80, t("contact.form.name.error")),
  email: z.string().email(t("contact.form.email.error")),
  company: z.string().max(120, "Too long").optional().or(z.literal("")),
  subject: z.string().min(3, t("contact.form.subject.error")).max(120, t("contact.form.subject.error")),
  message: z.string().min(20, t("contact.form.message.error")).max(3000, t("contact.form.message.error")),
  editorialInterest: z.boolean().refine((v) => v === true, {
    message: t("contact.form.editorialInterest.error"),
  }),

  // Honeypot anti-spam (debe quedar vacío)
  website: z.string().max(0, "Spam detected").optional().or(z.literal("")),
});

type ContactFormValues = z.infer<ReturnType<typeof createContactSchema>>;

/**
 * EmailJS setup:
 * - Crea un Service, Template y Public Key en EmailJS.
 * - Define estas variables en .env (Vite):
 *   VITE_EMAILJS_SERVICE_ID=...
 *   VITE_EMAILJS_TEMPLATE_ID=...
 *   VITE_EMAILJS_PUBLIC_KEY=...
 *
 * En tu template de EmailJS usa variables:
 * - from_name, reply_to, company, subject, message
 */
const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID as string | undefined;
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID as string | undefined;
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY as string | undefined;
const RECAPTCHA_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY as string | undefined;

function canSendEmail(): boolean {
  return Boolean(SERVICE_ID && TEMPLATE_ID && PUBLIC_KEY);
}

export default function ContactPage() {
  const [captchaToken, setCaptchaToken] = React.useState<string | null>(null);
  const recaptchaRef = React.useRef<ReCAPTCHA>(null);
  const formRef = React.useRef<HTMLFormElement>(null);
  const [status, setStatus] = React.useState<
    | { state: "idle" }
    | { state: "sending" }
    | { state: "success" }
    | { state: "error"; message: string }
  >({ state: "idle" });

  const { t } = useTranslation();

  const schema = React.useMemo(() => createContactSchema(t), [t]);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm<ContactFormValues>({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      company: "",
      subject: "",
      message: "",
      editorialInterest: false,
      website: "",
    },
  });

  const onSubmit = async () => {
    setStatus({ state: "sending" });

    // Si no está configurado EmailJS, fallamos de forma explícita y controlada
    if (!canSendEmail()) {
      setStatus({
        state: "error",
        message: t("contact.status.notConfigured"),
      });
      return;
    }

    try {
      if (!formRef.current) return;

      await emailjs.sendForm(
        SERVICE_ID!,
        TEMPLATE_ID!,
        formRef.current,
        { publicKey: PUBLIC_KEY! }
      );

      setStatus({ state: "success" });
      reset();
      if (recaptchaRef.current) recaptchaRef.current.reset();
      setCaptchaToken(null);
    } catch (e: any) {
      setStatus({
        state: "error",
        message: e?.text || e?.message || t("status.error"),
      });
    }
  };

  return (
    <section className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>{t("contact.title")}</h1>
        <p className={styles.subtitle}>
          <Trans i18nKey="contact.subtitle" t={t}>
            <strong />
          </Trans>
        </p>
        <p className={styles.altContact}>
          {t("contact.altContact.text")}{" "}
          <a
            href="https://www.instagram.com/daniel.horia.art/"
            target="_blank"
            rel="noreferrer"
          >
            {t("contact.altContact.platform")}
          </a>
          .
        </p>

        <div className={styles.servicesInfo}>
          <h2>{t("contact.services.title")}</h2>
          <p>{t("contact.services.description")}</p>
          <ul className={styles.servicesList}>
            <li>{t("contact.services.items.cover")}</li>
            <li>{t("contact.services.items.sequential")}</li>
            <li>{t("contact.services.items.character")}</li>
            <li>{t("contact.services.items.storyboard")}</li>
          </ul>
        </div>
      </header>

      <div className={styles.card}>
        <form ref={formRef} className={styles.form} onSubmit={handleSubmit(onSubmit)} noValidate>
          {/* Honeypot (oculto) */}
          <div className={styles.honeypot} aria-hidden="true">
            <label>
              Website
              <input type="text" tabIndex={-1} autoComplete="off" {...register("website")} />
            </label>
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="name">
                {t("contact.form.name.label")}
              </label>
              <input
                id="name"
                className={styles.input}
                type="text"
                autoComplete="name"
                {...register("name")}
              />
              {errors.name && <p className={styles.error}>{errors.name.message}</p>}
            </div>

            <div className={styles.field}>
              <label className={styles.label} htmlFor="email">
                {t("contact.form.email.label")}
              </label>
              <input
                id="email"
                className={styles.input}
                type="email"
                autoComplete="email"
                {...register("email")}
              />
              {errors.email && <p className={styles.error}>{errors.email.message}</p>}
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="company">
                {t("contact.form.company.label")}
              </label>
              <input
                id="company"
                className={styles.input}
                type="text"
                autoComplete="organization"
                {...register("company")}
              />
              {errors.company && (
                <p className={styles.error}>{errors.company.message as string}</p>
              )}
            </div>

            <div className={styles.field}>
              <label className={styles.label} htmlFor="subject">
                {t("contact.form.subject.label")}
              </label>
              <input
                id="subject"
                className={styles.input}
                type="text"
                {...register("subject")}
              />
              {errors.subject && (
                <p className={styles.error}>{errors.subject.message}</p>
              )}
            </div>
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="message">
              {t("contact.form.message.label")}
            </label>
            <textarea
              id="message"
              className={styles.textarea}
              rows={7}
              {...register("message")}
            />
            {errors.message && (
              <p className={styles.error}>{errors.message.message}</p>
            )}
            <p className={styles.hint}>
              {t("contact.form.message.hint")}
            </p>
          </div>

          <div className={styles.checkboxField}>
            <label className={styles.checkboxLabel}>
              <input type="checkbox" {...register("editorialInterest")} />
              <span>
                <Trans i18nKey="contact.form.editorialInterest.label" t={t} />
              </span>
            </label>
            {errors.editorialInterest && (
              <p className={styles.error}>{errors.editorialInterest.message}</p>
            )}
          </div>

          <div className={styles.actions}>
            {RECAPTCHA_KEY && (
              <div style={{ marginBottom: "1rem" }}>
                <ReCAPTCHA
                  sitekey={RECAPTCHA_KEY}
                  onChange={(token: string | null) => setCaptchaToken(token)}
                  ref={recaptchaRef}
                />
              </div>
            )}

            <button
              type="submit"
              className={styles.button}
              disabled={!isValid || status.state === "sending" || (!!RECAPTCHA_KEY && !captchaToken)}
            >
              {status.state === "sending" ? t("contact.form.submit.sending") : t("contact.form.submit.idle")}
            </button>

            {status.state === "success" && (
              <p className={styles.success}>{t("contact.status.success")}</p>
            )}

            {status.state === "error" && (
              <p className={styles.error}>
                {status.message}
              </p>
            )}

            {!canSendEmail() && status.state === "idle" && (
              <p className={styles.notice}>
                {t("contact.status.notConfigured")}
              </p>
            )}
          </div>
        </form>
      </div>
    </section>
  );
}
