import { useState } from "react";
import { useForm } from "react-hook-form";
import ScrollReveal from "../common/ScrollReveal";
import SectionNumber from "../common/SectionNumber";
import ContactLink from "../ui/ContactLink";
import portfolioService from "../../services/portfolioService";
import { SITE_CONFIG } from "../../constants/data";

export default function ContactSection() {
  const [submitState, setSubmitState] = useState("idle"); // idle | sending | sent | error
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setSubmitState("sending");
    try {
      await portfolioService.submitContact(data);
      setSubmitState("sent");
      reset();
      setTimeout(() => setSubmitState("idle"), 3000);
    } catch {
      setSubmitState("error");
      setTimeout(() => setSubmitState("idle"), 3000);
    }
  };

  const inputClasses =
    "w-full bg-transparent border-0 border-b border-line text-ink font-instrument text-base font-light py-3.5 outline-none transition-colors duration-300 mb-8 placeholder:text-ink-4 focus:border-b-ink font-mono";

  const buttonStyles = {
    idle: "bg-ink border-ink text-cream hover:bg-accent hover:border-accent hover:-translate-y-0.5",
    sending: "bg-ink-3 border-ink-3 text-cream cursor-wait",
    sent: "bg-success border-success text-cream",
    error: "bg-red-600 border-red-600 text-cream",
  };

  const buttonText = {
    idle: "Send Message →",
    sending: "Sending...",
    sent: "Sent ✓",
    error: "Failed — Try Again",
  };

  return (
    <section
      id="contact"
      className="min-h-screen grid grid-cols-2 max-[960px]:grid-cols-1"
    >
      {/* Left */}
      <div className="px-16 pt-[100px] pb-16 border-r border-line flex flex-col justify-between max-[960px]:px-6 max-[960px]:pt-15 max-[960px]:pb-15 max-[960px]:border-r-0 max-[960px]:border-b max-[960px]:border-line">
        <div>
          <SectionNumber>
            <span className="text-[12px] font-pixelify">[06] — Contact</span>
          </SectionNumber>
          <ScrollReveal variant="heading">
            <h2
              className="font-PT-serif font-bold leading-none mb-8"
              style={{
                fontSize: "clamp(52px, 6vw, 80px)",
                letterSpacing: "-3.5px",
              }}
            >
              Let's
              <br />
              build
              <br />
              <em className="italic text-accent font-pixelify">something</em>
              <br />
              great.
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={0.08} variant="text">
            <p className="text-[16px] font-mono text-ink-2 leading-[1.8] font-light max-w-[400px] mb-12">
              Open for full-time roles, freelance work, and exciting
              collaborations. Reply within 24 hours.
            </p>
          </ScrollReveal>
          <ScrollReveal delay={0.15} variant="card">
            <div>
              {SITE_CONFIG.socials.map((social) => (
                <ContactLink
                  key={social.platform}
                  platform={social.platform}
                  url={social.url}
                  handle={social.handle}
                />
              ))}
            </div>
          </ScrollReveal>
        </div>
      </div>

      {/* Right — Form */}
      <ScrollReveal
        delay={0.1}
        className="px-16 pt-[100px] pb-16 flex flex-col justify-center max-[960px]:px-6 max-[960px]:pt-15 max-[960px]:pb-15"
      >
        <SectionNumber>
          <span className="mb-8 block text-[17px] font-pixelify">
            Send a message
          </span>
        </SectionNumber>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="grid grid-cols-2 gap-6 max-[960px]:grid-cols-1 max-[960px]:gap-0">
            <div>
              <label className="font-mono text-[12px] text-ink-4 tracking-[2px] uppercase mb-2 block">
                First Name
              </label>
              <input
                {...register("firstName", {
                  required: "First name is required",
                })}
                className={inputClasses}
                type="text"
                placeholder="Alex"
              />
              {errors.firstName && (
                <span className="text-accent text-xs -mt-6 mb-4 block">
                  {errors.firstName.message}
                </span>
              )}
            </div>
            <div>
              <label className="font-mono text-[12px] text-ink-4 tracking-[2px] uppercase mb-2 block">
                Last Name
              </label>
              <input
                {...register("lastName", { required: "Last name is required" })}
                className={inputClasses}
                type="text"
                placeholder="Johnson"
              />
              {errors.lastName && (
                <span className="text-accent text-xs -mt-6 mb-4 block">
                  {errors.lastName.message}
                </span>
              )}
            </div>
          </div>

          <label className="font-mono text-[12px] text-ink-4 tracking-[2px] uppercase mb-2 block">
            Email Address
          </label>
          <input
            {...register("email", {
              required: "Email is required",
              pattern: { value: /^\S+@\S+\.\S+$/, message: "Invalid email" },
            })}
            className={inputClasses}
            type="email"
            placeholder="alex@company.com"
          />
          {errors.email && (
            <span className="text-accent text-xs -mt-6 mb-4 block">
              {errors.email.message}
            </span>
          )}

          <label className="font-mono text-[12px] text-ink-4 tracking-[2px] uppercase mb-2 block">
            Subject
          </label>
          <input
            {...register("subject", { required: "Subject is required" })}
            className={inputClasses}
            type="text"
            placeholder="Project / Collaboration / Job"
          />
          {errors.subject && (
            <span className="text-accent text-xs -mt-6 mb-4 block">
              {errors.subject.message}
            </span>
          )}

          <label className="font-mono text-[12px] text-ink-4 tracking-[2px] uppercase mb-2 block">
            Message
          </label>
          <textarea
            {...register("message", { required: "Message is required" })}
            className={`${inputClasses} resize-none min-h-[100px]`}
            placeholder="Tell me about your project…"
          />
          {errors.message && (
            <span className="text-accent text-xs -mt-6 mb-4 block">
              {errors.message.message}
            </span>
          )}

          <button
            type="submit"
            disabled={submitState === "sending"}
            className={`cursor-hover w-full py-4.5 border font-pixelify text-sm font-normal tracking-[1.5px] uppercase rounded transition-all duration-300 mt-2 ${buttonStyles[submitState]}`}
          >
            {buttonText[submitState]}
          </button>
        </form>
      </ScrollReveal>
    </section>
  );
}
