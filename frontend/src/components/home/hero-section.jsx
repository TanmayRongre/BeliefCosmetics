
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

/* =========================================================
   BELIEF COSMETICS — EDITORIAL HERO
========================================================= */

const slides = [
  {
    id: "01",
    eyebrow: "THOUGHTFULLY FORMULATED SKINCARE",
    overline: "THE ART OF CONSCIOUS BEAUTY",
    title: ["Clean.", "Conscious.", "Clinical."],
    italic: "Skincare.",
    description:
      "Unreservedly honest products that work, be kind to skin and the planet.",
    accent: "No exceptions.",
    cta: "Explore the collection",
    href: "/products",
    image: "/product_Header.jpg",
    imageAlt: "Skincare products arranged in an editorial product composition",
    imagePosition: "center center",
    background: "#f8f6f0",
  },
  {
    id: "02",
    eyebrow: "A MORE PERSONAL APPROACH TO SKINCARE",
    overline: "BEAUTY, UNDERSTOOD",
    title: ["Your skin.", "Your routine.", "Your rules."],
    italic: "Perfectly matched.",
    description:
      "Discover a routine that understands your skin type, concerns and individual needs.",
    accent: "Made for you.",
    cta: "Discover your skin",
    href: "/skin-analyzer",
    image: "/Header2.png.png",
    imageAlt: "Skincare and beauty products arranged for a personalized routine",
    imagePosition: "center center",
    background: "#eef1ec",
  },
];

const ease = [0.22, 1, 0.36, 1];

/* =========================================================
   EDITORIAL TEXT ANIMATION
========================================================= */

function EditorialText({
  children,
  className = "",
  delay = 0,
  reduced = false,
}) {
  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, y: 22 }}
      animate={{ opacity: 1, y: 0 }}
      exit={reduced ? undefined : { opacity: 0, y: -12 }}
      transition={{
        duration: reduced ? 0 : 0.8,
        delay: reduced ? 0 : delay,
        ease,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* =========================================================
   MAIN HERO SECTION
========================================================= */

export default function HeroSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const reduced = useReducedMotion();
  const activeSlide = slides[activeIndex];

  /* SLIDE CONTROLS */

  const goToSlide = (index) => {
    setActiveIndex((index + slides.length) % slides.length);
  };

  const nextSlide = () => {
    setActiveIndex((current) => (current + 1) % slides.length);
  };

  const previousSlide = () => {
    setActiveIndex(
      (current) => (current - 1 + slides.length) % slides.length
    );
  };

  /* AUTOMATIC SLIDE TRANSITION */

  useEffect(() => {
    if (paused || reduced) return undefined;

    const interval = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % slides.length);
    }, 8500);

    return () => window.clearInterval(interval);
  }, [paused, reduced]);

  /* KEYBOARD NAVIGATION */

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "ArrowRight") nextSlide();
      if (event.key === "ArrowLeft") previousSlide();
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <section
      aria-label="Belief Cosmetics featured collection"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      className="relative isolate min-h-[760px] overflow-hidden bg-[#f8f6f0] text-[#172b27] sm:min-h-[780px] lg:h-[min(850px,calc(100svh-16px))] lg:min-h-[690px]"
    >
      {/* =================================================
          1. BACKGROUND
      ================================================= */}

      <AnimatePresence mode="wait">
        <motion.div
          key={activeSlide.id + "-background"}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.9 }}
          className="absolute inset-0"
          style={{ backgroundColor: activeSlide.background }}
        />
      </AnimatePresence>

      {/* =================================================
          2. FULL-BLEED PRODUCT IMAGE
      ================================================= */}

      <div className="absolute inset-0 z-0 overflow-hidden">
        <AnimatePresence mode="sync">
          <motion.div
            key={activeSlide.id + "-image"}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.1 }}
          >
            <motion.img
              src={activeSlide.image}
              alt={activeSlide.imageAlt}
              className="h-full w-full object-cover"
              style={{
                objectPosition: activeSlide.imagePosition,
              }}
              initial={reduced ? false : { scale: 1.08 }}
              animate={{ scale: 1 }}
              transition={{
                duration: reduced ? 0 : 9,
                ease: "linear",
              }}
            />

            {/* Desktop cream-to-image blend */}
            <div
              className="absolute inset-0 hidden lg:block"
              style={{
                background:
                  "linear-gradient(90deg, #f8f6f0 0%, rgba(248,246,240,0.98) 24%, rgba(248,246,240,0.88) 35%, rgba(248,246,240,0.58) 47%, rgba(248,246,240,0.16) 64%, transparent 80%)",
              }}
            />

            {/* Tablet blend */}
            <div
              className="absolute inset-0 hidden sm:block lg:hidden"
              style={{
                background:
                  "linear-gradient(90deg, rgba(248,246,240,0.98) 0%, rgba(248,246,240,0.90) 42%, rgba(248,246,240,0.35) 75%, rgba(248,246,240,0.12) 100%)",
              }}
            />

            {/* Mobile blend */}
            <div
              className="absolute inset-0 sm:hidden"
              style={{
                background:
                  "linear-gradient(180deg, rgba(248,246,240,0.94) 0%, rgba(248,246,240,0.84) 48%, rgba(248,246,240,0.46) 100%)",
              }}
            />

            <div className="absolute inset-0 bg-gradient-to-t from-[#172b27]/10 via-transparent to-white/10" />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* =================================================
          3. SUBTLE EDITORIAL GRAIN
      ================================================= */}

      <div
        className="pointer-events-none absolute inset-0 z-[1] opacity-[0.09]"
        style={{
          backgroundImage:
            'url("data:image/svg+xml,%3Csvg viewBox=%270 0 180 180%27 xmlns=%27http://www.w3.org/2000/svg%27%3E%3Cfilter id=%27n%27%3E%3CfeTurbulence type=%27fractalNoise%27 baseFrequency=%27.9%27 numOctaves=%273%27 stitchTiles=%27stitch%27/%3E%3C/filter%3E%3Crect width=%27100%25%27 height=%27100%25%27 filter=%27url(%23n)%27 opacity=%27.15%27/%3E%3C/svg%3E")',
        }}
      />

      {/* =================================================
          4. MAIN EDITORIAL CONTENT

          Desktop: additional navbar clearance.
          Mobile: original positioning preserved.
      ================================================= */}

      <div className="relative z-10 mx-auto flex min-h-[760px] max-w-[1800px] items-center px-7 pb-40 pt-36 sm:min-h-[780px] sm:px-12 sm:pb-40 lg:h-full lg:min-h-0 lg:translate-y-7 lg:px-[9.2%] lg:pb-36 lg:pt-28">
        <div className="w-full max-w-[690px]">

          {/* Eyebrow */}

          <AnimatePresence mode="wait">
            <EditorialText
              key={activeSlide.id + "-eyebrow"}
              delay={0.1}
              reduced={reduced}
              className="mb-11"
            >
              <div className="flex items-center gap-4">
                <span className="h-px w-9 bg-[#718477]" />

                <span className="font-sans text-[9px] font-semibold uppercase tracking-[0.28em] text-[#536b5c] sm:text-[10px]">
                  {activeSlide.eyebrow}
                </span>
              </div>
            </EditorialText>
          </AnimatePresence>

          {/* Heading overline */}

          <AnimatePresence mode="wait">
            <EditorialText
              key={activeSlide.id + "-overline"}
              delay={0.2}
              reduced={reduced}
              className="mb-5"
            >
              <p className="font-sans text-[9px] font-medium uppercase tracking-[0.28em] text-[#879188] sm:text-[10px]">
                {activeSlide.overline}
              </p>
            </EditorialText>
          </AnimatePresence>

          {/* Main heading */}

          <div className="mb-8 max-w-[690px]">
            <AnimatePresence mode="wait">
              <motion.h1
                key={activeSlide.id + "-heading"}
                initial={reduced ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={reduced ? undefined : { opacity: 0 }}
                transition={{ duration: reduced ? 0 : 0.35 }}
                className="font-editorial text-[clamp(58px,7.1vw,104px)] font-medium leading-[0.88] tracking-[-0.055em] text-[#172b27] sm:text-[clamp(68px,7vw,102px)]"
              >
                {activeSlide.title.map((line, index) => (
                  <span
                    key={line}
                    className="block overflow-hidden pb-[0.045em]"
                  >
                    <motion.span
                      initial={reduced ? false : { y: "110%" }}
                      animate={{ y: "0%" }}
                      transition={{
                        duration: reduced ? 0 : 0.9,
                        delay: reduced ? 0 : 0.12 + index * 0.12,
                        ease,
                      }}
                      className="block"
                    >
                      {line}
                    </motion.span>
                  </span>
                ))}

                <span className="block overflow-hidden pb-[0.075em]">
                  <motion.span
                    initial={reduced ? false : { y: "110%" }}
                    animate={{ y: "0%" }}
                    transition={{
                      duration: reduced ? 0 : 1,
                      delay: reduced ? 0 : 0.52,
                      ease,
                    }}
                    className="block font-normal italic text-[#294b40]"
                  >
                    {activeSlide.italic}
                  </motion.span>
                </span>
              </motion.h1>
            </AnimatePresence>
          </div>

          {/* Description */}

          <AnimatePresence mode="wait">
            <EditorialText
              key={activeSlide.id + "-description"}
              delay={0.55}
              reduced={reduced}
              className="mb-9 max-w-[440px]"
            >
              <p className="font-sans text-[13px] leading-[1.9] text-[#53645a] sm:text-sm md:text-[15px]">
                {activeSlide.description}

                <span className="ml-2 font-editorial text-xl italic text-[#718477] sm:text-2xl">
                  {activeSlide.accent}
                </span>
              </p>
            </EditorialText>
          </AnimatePresence>

          {/* CTA */}

          <AnimatePresence mode="wait">
            <EditorialText
              key={activeSlide.id + "-cta"}
              delay={0.7}
              reduced={reduced}
            >
              <Link
                to={activeSlide.href}
                className="group inline-flex min-h-[60px] items-center gap-8 rounded-full bg-[#172b27] py-1.5 pl-8 pr-2 text-white shadow-[0_12px_30px_rgba(23,43,39,0.12)] transition-all duration-500 hover:-translate-y-1 hover:bg-[#294b40] hover:shadow-[0_18px_40px_rgba(23,43,39,0.19)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#718477]"
              >
                <span className="font-sans text-[11px] font-semibold tracking-wide sm:text-xs">
                  {activeSlide.cta}
                </span>

                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#f8f6f0] text-[#172b27] transition-transform duration-500 group-hover:rotate-45">
                  <ArrowUpRight size={19} strokeWidth={1.5} />
                </span>
              </Link>
            </EditorialText>
          </AnimatePresence>
        </div>
      </div>

      {/* =================================================
          5. BOTTOM SLIDE NAVIGATION
      ================================================= */}

      <div className="absolute bottom-7 left-7 right-7 z-20 flex items-center justify-between sm:bottom-9 sm:left-12 sm:right-12 lg:bottom-9 lg:left-[9.2%] lg:right-[9.2%]">

        {/* Slide progress */}

        <div className="flex items-center gap-4 sm:gap-5">
          <span className="font-sans text-[8px] font-semibold uppercase tracking-[0.25em] text-[#536b5c]">
            Explore
          </span>

          <div className="flex items-center gap-2.5">
            {slides.map((slide, index) => (
              <button
                key={slide.id}
                type="button"
                onClick={() => goToSlide(index)}
                aria-label={`Show slide ${index + 1}`}
                aria-pressed={activeIndex === index}
                className="flex h-8 items-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#294b40]"
              >
                <motion.span
                  animate={{
                    width: activeIndex === index ? 42 : 18,
                    backgroundColor:
                      activeIndex === index ? "#172b27" : "#aab5ad",
                  }}
                  transition={{ duration: 0.45, ease }}
                  className="block h-[2px] rounded-full"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Previous / Next / Counter */}

        <div className="flex items-center gap-3 sm:gap-4">
          <button
            type="button"
            onClick={previousSlide}
            aria-label="Previous slide"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-[#718477]/35 text-[#172b27] transition-all duration-300 hover:bg-[#172b27] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#294b40]"
          >
            <ChevronLeft size={15} strokeWidth={1.5} />
          </button>

          <button
            type="button"
            onClick={nextSlide}
            aria-label="Next slide"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-[#718477]/35 text-[#172b27] transition-all duration-300 hover:bg-[#172b27] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#294b40]"
          >
            <ChevronRight size={15} strokeWidth={1.5} />
          </button>

          <span className="ml-1 min-w-[55px] text-right font-sans text-[9px] font-medium tracking-[0.2em] text-[#172b27] sm:ml-2 sm:text-[10px]">
            <AnimatePresence mode="wait">
              <motion.span
                key={activeSlide.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.25 }}
                className="inline-block"
              >
                {activeSlide.id}
              </motion.span>
            </AnimatePresence>

            <span className="mx-2 text-[#879188]">/</span>
            <span>02</span>
          </span>
        </div>
      </div>

      {/* =================================================
          6. BOTTOM BORDER
      ================================================= */}

      <div className="pointer-events-none absolute bottom-0 left-0 right-0 z-20 h-px bg-[#718477]/20" />
    </section>
  );
}
