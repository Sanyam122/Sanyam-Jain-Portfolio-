import { motion } from "motion/react";
import { useRef, useState } from "react";
import { hover, scrollReveal, tap, useReducedMotion } from "../lib/motion";

const CONTACT_EMAIL = "jainsanyam441@gmail.com";

export default function Contact() {
  const reduced = useReducedMotion();

  const reveal = scrollReveal(reduced);
  const btnHover = reduced ? {} : { whileHover: hover.scale, whileTap: tap.press };

  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<{ text: string; ok: boolean } | null>(
    null,
  );
  const formRef = useRef<HTMLFormElement>(null);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (!form.reportValidity()) return;
    const gotcha = form.elements.namedItem(
      "_gotcha",
    ) as HTMLInputElement | null;
    if (gotcha && gotcha.value) return;

    const nameInput = form.elements.namedItem("name") as HTMLInputElement;
    const emailInput = form.elements.namedItem("email") as HTMLInputElement;
    const messageInput = form.elements.namedItem(
      "message",
    ) as HTMLTextAreaElement;
    const data = {
      name: nameInput.value.trim(),
      email: emailInput.value.trim(),
      message: messageInput.value.trim(),
    };

    setBusy(true);
    setStatus({ text: "Sending…", ok: true });

    // No backend endpoint is configured, so fall back to the user's mail app.
    const subject = encodeURIComponent("Portfolio inquiry from " + data.name);
    const body = encodeURIComponent(
      data.message + "\n\n— " + data.name + " (" + data.email + ")",
    );

    setTimeout(() => {
      window.location.href =
        "mailto:" + CONTACT_EMAIL + "?subject=" + subject + "&body=" + body;
      form.reset();
      setBusy(false);
      setStatus({
        text: "Message sent. Thanks, " + data.name.split(" ")[0] + "! I'll reply soon.",
        ok: true,
      });
      setTimeout(() => setStatus(null), 5000);
    }, 600);
  };

  return (
    <motion.section
      id="contact"
      {...reveal}
      className="w-full contact-gradient-card rounded-[32px] p-8 sm:p-14 md:p-20 flex justify-center border border-black/[0.04] shadow-elevated"
    >
      <div className="w-full max-w-[840px] text-center space-y-8">
        <div className="space-y-4">
          <motion.h2
            {...scrollReveal(reduced, 0.06)}
            className="text-[36px] sm:text-[46px] md:text-[52px] font-medium text-[#222222] subhead-tight"
          >
            Contact with me to sizzle your project
          </motion.h2>
          <motion.p
            {...scrollReveal(reduced, 0.16)}
            className="text-[16px] sm:text-[18px] text-[#777777] max-w-[620px] mx-auto leading-relaxed"
          >
            Feel free to contact me if having any questions. I'm available for new projects or just for chatting.
          </motion.p>
        </div>

        {status && (
          <p
            id="form-status"
            role="status"
            aria-live="polite"
            className={`mt-3 text-center text-[14px] transition-opacity duration-300 ${
              status.ok ? "text-[#2F9FB3]" : "text-[#D14343]"
            }`}
          >
            {status.text}
          </p>
        )}

        <motion.form
          id="contact-form"
          ref={formRef}
          {...scrollReveal(reduced, 0.28)}
          onSubmit={onSubmit}
          className="space-y-4 pt-4 text-left"
          action="#"
          method="post"
        >
          <motion.div
            {...scrollReveal(reduced, 0.38)}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            <motion.input
              {...scrollReveal(reduced, 0.44)}
              type="text"
              id="name"
              name="name"
              placeholder="Name"
              aria-label="Your name"
              autoComplete="name"
              required
              disabled={busy}
              className="w-full px-6 py-4 rounded-full bg-white/70 backdrop-blur-md border border-white/80 text-[#222222] placeholder-[#888888] focus:outline-none focus:ring-2 focus:ring-[#6C63E8]/40 field text-[15px]"
            />
            <motion.input
              {...scrollReveal(reduced, 0.5)}
              type="email"
              id="email"
              name="email"
              placeholder="Email"
              aria-label="Your email"
              autoComplete="email"
              required
              disabled={busy}
              className="w-full px-6 py-4 rounded-full bg-white/70 backdrop-blur-md border border-white/80 text-[#222222] placeholder-[#888888] focus:outline-none focus:ring-2 focus:ring-[#6C63E8]/40 field text-[15px]"
            />
          </motion.div>
          <motion.div {...scrollReveal(reduced, 0.56)}>
            <motion.textarea
              {...scrollReveal(reduced, 0.62)}
              rows={5}
              id="message"
              name="message"
              placeholder="Work Description..."
              aria-label="Work description"
              required
              disabled={busy}
              className="w-full p-6 rounded-[28px] bg-white/70 backdrop-blur-md border border-white/80 text-[#222222] placeholder-[#888888] focus:outline-none focus:ring-2 focus:ring-[#6C63E8]/40 field text-[15px] resize-none"
            />
          </motion.div>
          <motion.div {...scrollReveal(reduced, 0.68)}>
            <input
              type="text"
              name="_gotcha"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden={true}
              className="hidden"
            />
            <motion.button
              {...btnHover}
              id="submit-btn"
              type="submit"
              disabled={busy}
              className={`w-full py-4 rounded-full text-white font-medium text-[16px] shadow-btn-dark btn btn-wide disabled:opacity-70 disabled:cursor-not-allowed ${
                busy ? "bg-[#666666]" : "bg-[#404247]"
              }`}
            >
              <span id="submit-label">{busy ? "Sending…" : "Submit"}</span>
            </motion.button>
          </motion.div>
        </motion.form>
      </div>
    </motion.section>
  );
}
