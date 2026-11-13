
import { useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  Sparkles,
  Microscope,
  ShieldCheck,
  Leaf,
  ArrowDown,
  ArrowUpRight,
} from "lucide-react";

const benefits = [
  {
    number: "01",
    icon: Sparkles,
    title: "Clean, Beyond Reproach",
    description:
      "No black boxes, no hidden actives, no vague claims. Every formula is transparently disclosed — ingredient by ingredient — so you always know exactly what you're putting on your skin and why it works.",
    label: "Transparency",
    side: "left",
  },
  {
    number: "02",
    icon: Microscope,
    title: "Potent & Scientifically Designed",
    description:
      "Powered by dermatologist-approved actives and plant-based innovation, our formulations are crafted to deliver visible, measurable results — without compromising your skin barrier or long-term health.",
    label: "Science-led care",
    side: "right",
  },
  {
    number: "03",
    icon: ShieldCheck,
    title: "Dermat-Backed Expertise",
    description:
      "Each product is developed with dermatological insight, ensuring optimal safety, compatibility, and efficacy. Your skincare routine is supported by experts — from the very first step to your final glow.",
    label: "Expert care",
    side: "left",
  },
  {
    number: "04",
    icon: Leaf,
    title: "Conscious & Responsible",
    description:
      "Formulated with clean, verified ingredients and responsibly sourced components. Every product is PETA-certified vegan & cruelty-free — gentle on your skin and kind to the planet we all share.",
    label: "Conscious beauty",
    side: "right",
  },
];

function SectionEyebrow({ children }) {
  return (
    <div className="flex items-center justify-center gap-3">
      <span className="h-px w-8 bg-[#718477]" />
      <span className="font-sans text-[9px] font-semibold uppercase tracking-[0.28em] text-[#718477]">
        {children}
      </span>
      <span className="h-px w-8 bg-[#718477]" />
    </div>
  );
}

function BenefitCard({ benefit, index, reducedMotion }) {
  const Icon = benefit.icon;
  const fromLeft = benefit.side === "left";

  return (
    <motion.article
      initial={
        reducedMotion
          ? false
          : {
            opacity: 0,
            x: fromLeft ? -35 : 35,
            y: index % 2 === 0 ? 12 : -12,
          }
      }
      whileInView={{
        opacity: 1,
        x: 0,
        y: 0,
      }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{
        duration: 0.75,
        delay: reducedMotion ? 0 : 0.12,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="group relative flex h-full min-h-[300px] flex-col border border-[#e4e8df] bg-[#fbfaf6] p-6 transition-all duration-500 hover:-translate-y-1 hover:border-[#b9c7b9] hover:shadow-[0_20px_50px_rgba(23,43,39,0.07)] sm:p-8 lg:min-h-[330px]"
    >
      {/* Card header */}

      <div className="mb-8 flex items-center justify-between">
        <div className="flex h-11 w-11 items-center justify-center rounded-full border border-[#dfe5dc] bg-[#eef1e9] text-[#294b40] transition-colors duration-500 group-hover:bg-[#294b40] group-hover:text-white">
          <Icon size={19} strokeWidth={1.4} />
        </div>

        <span className="font-editorial text-3xl italic text-[#a3b0a2]">
          {benefit.number}
        </span>
      </div>

      {/* Card text */}

      <span className="mb-3 font-sans text-[9px] font-semibold uppercase tracking-[0.2em] text-[#879188]">
        {benefit.label}
      </span>

      <h3 className="mb-4 max-w-[300px] font-editorial text-[29px] leading-[1.08] text-[#172b27] sm:text-[32px]">
        {benefit.title}
      </h3>

      <p className="font-sans text-[12px] font-light leading-[1.9] text-[#69746c] sm:text-[13px]">
        {benefit.description}
      </p>

      {/* Card footer */}

      <div className="mt-auto flex items-center gap-3 pt-7">
        <span className="h-px w-8 bg-[#718477] transition-all duration-500 group-hover:w-12" />

        <span className="font-sans text-[8px] font-medium uppercase tracking-[0.2em] text-[#879188]">
          Thoughtfully formulated
        </span>
      </div>

      <ArrowUpRight
        size={15}
        strokeWidth={1.2}
        className="absolute right-7 top-7 text-[#a6b2a5] opacity-0 transition-all duration-500 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:opacity-100"
      />
    </motion.article>
  );
}

export default function BenefitsSection() {
  const sectionRef = useRef(null);
  const reducedMotion = useReducedMotion();

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-[#f8f6f0] px-5 py-24 sm:px-8 sm:py-32 lg:px-12 xl:px-16"
    >
      {/* Background details */}

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 top-0 h-[480px] w-[480px] rounded-full bg-[#e1e9df]/50 blur-[130px]"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-40 -left-40 h-[450px] w-[450px] rounded-full bg-[#e8e9df]/60 blur-[130px]"
      />

      {/* Inner border */}

      <div className="pointer-events-none absolute inset-3 border border-[#dce2d9]/60 sm:inset-5" />

      <div className="relative z-10 mx-auto max-w-[1440px]">

        {/* Section heading */}

        <motion.div
          initial={reducedMotion ? false : { opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto mb-16 max-w-3xl text-center sm:mb-20 lg:mb-24"
        >
          <div className="mb-6">
            <SectionEyebrow>Our philosophy</SectionEyebrow>
          </div>

          <h2 className="font-editorial text-[clamp(43px,6vw,78px)] leading-[0.94] tracking-[-0.045em] text-[#172b27]">
            The principles behind
            <br />
            <span className="font-normal italic text-[#294b40]">
              better skincare.
            </span>
          </h2>

          <p className="mx-auto mt-6 max-w-xl font-sans text-[12px] leading-[1.9] text-[#69746c] sm:text-[14px]">
            Thoughtful formulations. Honest ingredients. A more considered
            approach to your skin.
          </p>
        </motion.div>

        {/* Main editorial layout */}

        <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(300px,0.9fr)_minmax(0,1fr)] lg:gap-7 xl:gap-10">

          {/* LEFT COLUMN */}

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-1 lg:gap-8">
            <BenefitCard
              benefit={benefits[0]}
              index={0}
              reducedMotion={reducedMotion}
            />

            <BenefitCard
              benefit={benefits[2]}
              index={2}
              reducedMotion={reducedMotion}
            />
          </div>

          {/* CENTER IMAGE */}

          <motion.div
            initial={reducedMotion ? false : { opacity: 0, scale: 0.94 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{
              duration: 1,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="order-first flex flex-col items-center justify-center lg:order-none"
          >
            <div className="relative mx-auto w-full max-w-[390px]">
              {/* Image border */}

              <div className="absolute -inset-3 rotate-[4deg] rounded-[48%] border border-[#718477]/35" />

              {/* Main image */}

              <div className="relative aspect-[0.78] overflow-hidden rounded-[48%] shadow-[0_30px_90px_rgba(23,43,39,0.13)]">
                <img
                  src="/image2.png"
                  alt="Nature-inspired skincare products"
                  loading="lazy"
                  className="h-full w-full object-cover object-center transition-transform duration-[1400ms] hover:scale-105"
                />

                <div className="absolute inset-0 bg-[#172b27]/10 mix-blend-multiply" />
              </div>

              {/* Image caption */}

              <div className="mt-15 text-center">
                <span className="font-editorial text-base italic tracking-wide text-[#718477] sm:text-lg">
                  Beauty, thoughtfully considered.
                </span>
              </div>
            </div>
          </motion.div>

          {/* RIGHT COLUMN */}

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-1 lg:gap-8">
            <BenefitCard
              benefit={benefits[1]}
              index={1}
              reducedMotion={reducedMotion}
            />

            <BenefitCard
              benefit={benefits[3]}
              index={3}
              reducedMotion={reducedMotion}
            />
          </div>
        </div>

        {/* Bottom signature */}

        <motion.div
          initial={reducedMotion ? false : { opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="mt-16 flex flex-col items-center gap-4 sm:mt-20"
        >
          <div className="flex items-center gap-3">
            <span className="h-px w-8 bg-[#aab5ad]" />

            <span className="font-sans text-[9px] font-semibold uppercase tracking-[0.25em] text-[#718477]">
              Belief Cosmetics
            </span>

            <span className="h-px w-8 bg-[#aab5ad]" />
          </div>

          <div className="flex flex-col items-center gap-2 text-[#718477]">
            <span className="font-sans text-[8px] font-medium uppercase tracking-[0.24em]">
              Discover our standards
            </span>

            <ArrowDown size={15} strokeWidth={1.3} />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
