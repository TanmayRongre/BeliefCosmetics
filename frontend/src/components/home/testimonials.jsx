
import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    text: "Belief Cosmetics changed my skin routine completely. The products are luxurious and truly effective. Highly recommended!",
    author: "Priya Sharma",
    role: "Skincare Enthusiast",
    initials: "PS",
  },
  {
    text: "I have sensitive skin and was hesitant about trying new brands. Belief Cosmetics was a game-changer for me.",
    author: "Aisha Patel",
    role: "Beauty Blogger",
    initials: "AP",
  },
  {
    text: "The quality is unmatched. My clients absolutely love using these products as their base. Worth every penny!",
    author: "Neha Gupta",
    role: "Makeup Artist",
    initials: "NG",
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

function TestimonialCard({ testimonial, index, reducedMotion }) {
  return (
    <motion.article
      initial={
        reducedMotion
          ? false
          : {
            opacity: 0,
            y: 25,
          }
      }
      whileInView={{
        opacity: 1,
        y: 0,
      }}
      viewport={{
        once: true,
        amount: 0.2,
      }}
      transition={{
        duration: 0.7,
        delay: reducedMotion ? 0 : index * 0.12,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="
        group flex h-full min-h-[390px] flex-col
        border border-[#e5e8df]
        bg-[#fbfaf6]
        p-7 sm:p-8 lg:p-9
        shadow-[0_10px_35px_rgba(23,43,39,0.035)]
        transition-all duration-500
        hover:-translate-y-1
        hover:border-[#cbd6ca]
        hover:shadow-[0_20px_45px_rgba(23,43,39,0.07)]
        cursor-default select-text
      "
    >
      {/* Header */}

      <div className="mb-8 flex items-center justify-between">
        <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[#dfe5dc] bg-[#eef1e9] text-[#536b5c] transition-colors duration-500 group-hover:bg-[#294b40] group-hover:text-white">
          <Quote size={19} strokeWidth={1.4} />
        </div>

        <span className="font-editorial text-3xl italic text-[#a5b2a3]">
          0{index + 1}
        </span>
      </div>

      {/* Rating */}

      <div className="mb-6 flex items-center gap-1">
        {[...Array(5)].map((_, starIndex) => (
          <Star
            key={starIndex}
            size={13}
            strokeWidth={1.2}
            className="fill-[#a68b56] text-[#a68b56]"
          />
        ))}
      </div>

      {/* Review */}

      <blockquote className="flex-1">
        <p className="font-editorial text-[23px] leading-[1.45] text-[#263a32] sm:text-[25px]">
          “{testimonial.text}”
        </p>
      </blockquote>

      {/* Divider */}

      <div className="mb-6 mt-8 flex items-center gap-3">
        <span className="h-px w-9 bg-[#718477]" />
        <span className="h-px flex-1 bg-[#e3e7df]" />
      </div>

      {/* Author */}

      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#dfe5dc] bg-[#edf1e9] font-editorial text-lg text-[#294b40]">
          {testimonial.initials}
        </div>

        <div>
          <h3 className="font-sans text-[12px] font-semibold tracking-wide text-[#172b27]">
            {testimonial.author}
          </h3>

          <p className="mt-1 font-sans text-[10px] text-[#879188]">
            {testimonial.role}
          </p>
        </div>
      </div>
    </motion.article>
  );
}

export default function Testimonials() {
  const reducedMotion = useReducedMotion();

  return (
    <section className="relative isolate overflow-hidden bg-[#f8f6f0] px-5 py-24 sm:px-8 sm:py-28 lg:px-12 lg:py-36">

      {/* Background atmosphere */}

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 -top-40 -z-10 h-[500px] w-[500px] rounded-full bg-[#dce6da]/40 blur-[140px]"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-48 -left-40 -z-10 h-[450px] w-[450px] rounded-full bg-[#e5e9df]/50 blur-[130px]"
      />

      {/* Border frame */}

      <div className="pointer-events-none absolute inset-3 border border-[#dce2d9]/60 sm:inset-5" />

      <div className="relative z-10 mx-auto max-w-[1320px]">

        {/* Heading */}

        <motion.div
          initial={reducedMotion ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mx-auto mb-16 max-w-3xl text-center sm:mb-20"
        >
          <div className="mb-7">
            <SectionEyebrow>Words of appreciation</SectionEyebrow>
          </div>

          <h2 className="font-editorial text-[clamp(46px,6vw,78px)] leading-[0.94] tracking-[-0.04em] text-[#172b27]">
            Loved by
            <br />
            <span className="font-normal italic text-[#294b40]">
              our community.
            </span>
          </h2>

          <p className="mx-auto mt-6 max-w-lg font-sans text-[12px] font-light leading-[1.9] text-[#69746c] sm:text-[14px]">
            Real experiences, honest opinions and a little more love for
            every skin journey.
          </p>
        </motion.div>

        {/* Three cards — one horizontal row */}

        <div className="grid grid-cols-1 items-stretch gap-6 md:grid-cols-3 lg:gap-7 xl:gap-8">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard
              key={testimonial.author}
              testimonial={testimonial}
              index={index}
              reducedMotion={reducedMotion}
            />
          ))}
        </div>

        {/* Bottom statement */}

        <motion.div
          initial={reducedMotion ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mt-20 flex flex-col items-center text-center sm:mt-24"
        >
          <div className="mb-6 flex items-center gap-4">
            <span className="h-px w-12 bg-[#aab5ad]" />
            <span className="h-1.5 w-1.5 rounded-full bg-[#718477]" />
            <span className="h-px w-12 bg-[#aab5ad]" />
          </div>

          <p className="max-w-2xl font-editorial text-[29px] italic leading-tight text-[#536b5c] sm:text-4xl lg:text-[42px]">
            Your skin. Your story. Your confidence.
          </p>

          <div className="mt-7 flex items-center gap-3">
            <span className="h-px w-7 bg-[#718477]" />
            <span className="font-sans text-[8px] font-semibold uppercase tracking-[0.25em] text-[#879188]">
              Belief Cosmetics
            </span>
            <span className="h-px w-7 bg-[#718477]" />
          </div>
        </motion.div>

      </div>
    </section>
  );
}
