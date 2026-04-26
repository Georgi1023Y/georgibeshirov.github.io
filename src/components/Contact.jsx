import React, { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Loader2, Sparkles } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { isSupabaseConfigured } from "../supabase/supabaseClient";
import { submitContactForm } from "../supabase/contactService";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const formTransition = { type: "spring", stiffness: 360, damping: 30 };

function FloatingField({
  id,
  name,
  label,
  value,
  onChange,
  type = "text",
  error,
  disabled,
  isTextarea = false,
  maxLength,
}) {
  const [focused, setFocused] = useState(false);
  const floated = focused || value.length > 0;

  const baseClass =
    "peer w-full rounded-ds-lg border bg-white px-4 text-sm text-slate-900 backdrop-blur-sm transition-all duration-300 outline-none placeholder:text-transparent dark:bg-slate-950/50 dark:text-slate-100";
  const ringClass = error
    ? "border-rose-400 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/15 dark:border-rose-500/70"
    : "border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/15 dark:border-slate-600 dark:focus:border-indigo-400";

  return (
    <div className="relative">
      {isTextarea ? (
        <textarea
          id={id}
          name={name}
          rows={5}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          disabled={disabled}
          maxLength={maxLength}
          placeholder={label}
          className={`${baseClass} ${ringClass} min-h-[140px] resize-y py-4`}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={error ? `${id}-error` : undefined}
        />
      ) : (
        <input
          id={id}
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          disabled={disabled}
          maxLength={maxLength}
          placeholder={label}
          className={`${baseClass} ${ringClass} h-14 py-4`}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={error ? `${id}-error` : undefined}
        />
      )}

      <label
        htmlFor={id}
        className={`pointer-events-none absolute left-3.5 rounded px-1 transition-all duration-300 ${
          floated
            ? "-top-2 bg-white text-[11px] font-semibold uppercase tracking-[0.08em] text-indigo-600 dark:bg-slate-950 dark:text-indigo-400"
            : "top-4 text-sm text-slate-500 dark:text-slate-400"
        }`}
      >
        {label}
      </label>

      {error ? (
        <motion.p
          id={`${id}-error`}
          role="alert"
          initial={{ opacity: 0, y: -3 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-1.5 text-xs font-medium text-rose-600 dark:text-rose-300"
        >
          {error}
        </motion.p>
      ) : null}
    </div>
  );
}

function SuccessOverlay({ warning, emailNotificationSent, onReset }) {
  const confetti = useMemo(
    () =>
      Array.from({ length: 14 }, (_, i) => ({
        id: i,
        left: `${(i * 100) / 14}%`,
        delay: i * 0.04,
        duration: 1.2 + (i % 4) * 0.2,
      })),
    []
  );

  return (
    <motion.div
      key="success"
      role="status"
      aria-live="polite"
      initial={{ opacity: 0, y: 12, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10 }}
      transition={formTransition}
      className="relative overflow-hidden rounded-ds-2xl border border-slate-200/90 bg-white p-7 text-center shadow-lg backdrop-blur-sm dark:border-slate-700/60 dark:bg-slate-900/50 sm:p-10"
    >
      <div className="pointer-events-none absolute inset-0">
        {confetti.map((piece) => (
          <motion.span
            key={piece.id}
            className="absolute top-0 inline-block h-2.5 w-2.5 rounded-full bg-gradient-to-r from-indigo-400 to-emerald-400"
            style={{ left: piece.left }}
            initial={{ y: -20, opacity: 0, scale: 0.5 }}
            animate={{ y: 220, opacity: [0, 1, 0], scale: [0.5, 1, 0.8] }}
            transition={{
              duration: piece.duration,
              delay: piece.delay,
              ease: "easeOut",
            }}
          />
        ))}
      </div>

      <motion.div
        className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-ds-full bg-emerald-50 ring-1 ring-emerald-300/60"
        initial={{ scale: 0.7, rotate: -25 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 320, damping: 20 }}
      >
        <Check className="h-8 w-8 text-emerald-600" />
      </motion.div>

      <h3 className="font-display text-2xl font-bold text-slate-900 dark:text-slate-50">
        Thank you, Georgi will get back to you soon!
      </h3>
      <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 sm:text-base">
        Your message has been received and saved successfully.
      </p>

      {!emailNotificationSent && (
        <p className="mt-3 text-xs font-medium text-amber-800">
          {warning || "Message saved; email notification may not have been delivered."}
        </p>
      )}

      <motion.button
        type="button"
        onClick={onReset}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="mt-8 inline-flex min-h-[46px] items-center justify-center rounded-ds-full border border-slate-200 bg-slate-50 px-6 py-2.5 text-sm font-semibold text-slate-900 transition hover:bg-slate-100 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
      >
        Send another message
      </motion.button>
    </motion.div>
  );
}

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [fieldErrors, setFieldErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [lastMeta, setLastMeta] = useState({
    emailNotificationSent: true,
    warning: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const next = {};
    const name = form.name.trim();
    const email = form.email.trim();
    const message = form.message.trim();

    if (name.length < 2) {
      next.name = "Please enter at least 2 characters.";
    } else if (name.length > 100) {
      next.name = "Name must be at most 100 characters.";
    }
    if (!emailPattern.test(email)) {
      next.email = "Please provide a valid email address.";
    }
    if (message.length < 10) {
      next.message = "Please add a message (minimum 10 characters).";
    } else if (message.length > 5000) {
      next.message = "Message is too long (maximum 5000 characters).";
    }

    setFieldErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isSupabaseConfigured) {
      toast.error("Contact form backend is not configured yet.");
      return;
    }
    if (!validate()) return;

    setIsSubmitting(true);
    const { data, fnError } = await submitContactForm({
      name: form.name.trim(),
      email: form.email.trim(),
      message: form.message.trim(),
      timestamp: new Date().toISOString(),
    });
    setIsSubmitting(false);

    if (!data?.success) {
      toast.error(fnError || "Could not send message. Please try again.");
      return;
    }

    if (data?.warning) {
      toast(data.warning, { icon: "ℹ️", duration: 5000 });
    }

    setLastMeta({
      emailNotificationSent: data?.emailNotificationSent !== false,
      warning: data?.warning ?? null,
    });
    setSent(true);
    setFieldErrors({});
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <section
      id="contact"
      className="w-full min-w-0 max-w-full overflow-x-hidden border-t border-slate-200/80 bg-white px-gutter py-16 text-slate-900 dark:border-slate-700/60 dark:bg-[#020617] sm:px-gutter-sm sm:py-20 lg:px-gutter-lg"
    >
      <Toaster position="top-center" />
      <div className="mx-auto flex w-full max-w-content flex-col items-center">
        <h2 className="text-center font-display text-3xl font-bold text-slate-900 dark:text-slate-50 sm:text-4xl">
          Start a high-trust build conversation
        </h2>

        <motion.span
          animate={{ scale: [1, 1.04, 1] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          className="mt-4 inline-flex items-center gap-2 rounded-ds-full border border-emerald-200/80 bg-emerald-50 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.1em] text-emerald-800 dark:border-emerald-500/30 dark:bg-emerald-950/40 dark:text-emerald-300/90"
        >
          <Sparkles className="h-3.5 w-3.5" />
          Currently available for new high-impact projects
        </motion.span>

        <p className="mb-8 mt-4 max-w-xl px-1 text-center text-pretty text-slate-600 dark:text-slate-300">
          Send your project details below, or email{" "}
          <a
            href="mailto:beshirovgeorgi3@gmail.com"
            className="font-medium text-indigo-600 underline underline-offset-2 dark:text-indigo-400"
          >
            beshirovgeorgi3@gmail.com
          </a>
          .
        </p>

        {!isSupabaseConfigured && (
          <p className="mb-6 max-w-xl text-center text-sm text-amber-800">
            Backend not configured. Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`, then deploy the `submit-contact` edge function.
          </p>
        )}

        <div className="relative w-full max-w-xl min-w-0">
          <AnimatePresence mode="wait" initial={false}>
            {sent ? (
              <SuccessOverlay
                warning={lastMeta.warning}
                emailNotificationSent={lastMeta.emailNotificationSent}
                onReset={() => {
                  setSent(false);
                  setLastMeta({ emailNotificationSent: true, warning: null });
                }}
              />
            ) : (
              <motion.form
                key="contact-form"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={formTransition}
                onSubmit={handleSubmit}
                noValidate
                className="relative overflow-hidden rounded-ds-2xl border border-slate-200/90 bg-slate-50/50 p-5 shadow-sm backdrop-blur-sm dark:border-slate-700/60 dark:bg-slate-900/50 sm:p-8"
              >
                <div className="absolute -inset-px -z-10 rounded-ds-2xl bg-gradient-to-r from-indigo-500/10 to-emerald-500/8 opacity-50 blur-2xl dark:from-indigo-500/5 dark:to-emerald-500/5" />

                <div className="space-y-5">
                  <FloatingField
                    id="contact-name"
                    name="name"
                    label="Name"
                    value={form.name}
                    onChange={handleChange}
                    error={fieldErrors.name}
                    disabled={isSubmitting}
                    maxLength={100}
                  />
                  <FloatingField
                    id="contact-email"
                    name="email"
                    label="Email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    error={fieldErrors.email}
                    disabled={isSubmitting}
                  />
                  <FloatingField
                    id="contact-message"
                    name="message"
                    label="Message"
                    value={form.message}
                    onChange={handleChange}
                    error={fieldErrors.message}
                    disabled={isSubmitting}
                    maxLength={5000}
                    isTextarea
                  />
                  <div className="text-right text-xs text-slate-500 dark:text-slate-400">
                    {form.message.length} / 5000
                  </div>
                </div>

                <motion.button
                  type="submit"
                  disabled={isSubmitting || !isSupabaseConfigured}
                  whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                  whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                  className="mt-7 inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-ds-full bg-indigo-600 px-8 py-3 font-semibold text-white shadow-md transition-all hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                >
                  <AnimatePresence mode="wait" initial={false}>
                    {isSubmitting ? (
                      <motion.span
                        key="loading"
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        className="inline-flex items-center gap-2"
                      >
                        <Loader2 className="h-4.5 w-4.5 animate-spin" />
                        Sending...
                      </motion.span>
                    ) : (
                      <motion.span
                        key="send"
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                      >
                        Send Message
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="mt-16 w-full max-w-2xl rounded-ds-2xl border border-slate-200/90 bg-slate-50/80 px-6 py-8 text-center backdrop-blur-sm dark:border-slate-700/60 dark:bg-slate-900/50"
        >
          <p className="font-display text-lg font-bold text-slate-900 dark:text-slate-50 sm:text-xl">
            Ready to build the next big thing? Let&apos;s discuss your project ROI.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default Contact;
