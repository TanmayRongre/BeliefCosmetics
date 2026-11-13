
import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function BrandStory() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add(
        "(prefers-reduced-motion: no-preference)",
        () => {
          gsap.from(".story-eyebrow", {
            y: 20,
            opacity: 0,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: section,
              start: "top 78%",
              once: true,
            },
          });

          gsap.from(".story-heading-line", {
            yPercent: 110,
            opacity: 0,
            duration: 1.1,
            stagger: 0.16,
            ease: "power4.out",
            scrollTrigger: {
              trigger: ".story-heading",
              start: "top 85%",
              once: true,
            },
          });

          gsap.from(".story-copy", {
            y: 30,
            opacity: 0,
            duration: 0.9,
            stagger: 0.16,
            ease: "power3.out",
            scrollTrigger: {
              trigger: ".story-content",
              start: "top 85%",
              once: true,
            },
          });

          gsap.from(".story-image-frame", {
            clipPath: "inset(12% 8% 12% 8%)",
            scale: 0.96,
            duration: 1.4,
            ease: "power3.inOut",
            scrollTrigger: {
              trigger: ".story-image-frame",
              start: "top 82%",
              once: true,
            },
          });

          gsap.from(".story-image-caption", {
            y: 15,
            opacity: 0,
            duration: 0.8,
            delay: 0.5,
            ease: "power3.out",
            scrollTrigger: {
              trigger: ".story-image-frame",
              start: "top 82%",
              once: true,
            },
          });

          gsap.from(".story-cta", {
            y: 20,
            opacity: 0,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: ".story-cta",
              start: "top 90%",
              once: true,
            },
          });
        }
      );

      return () => mm.revert();
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-[#f8f6f0] py-24 text-[#172b27] sm:py-28 lg:py-36"
    >
      {/* Background decoration */}

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 top-1/4 h-[400px] w-[400px] rounded-full bg-[#e9eee7]/50 blur-[110px]"
      />

      <div className="relative mx-auto max-w-[1500px] px-6 sm:px-10 lg:px-[9.2%]">

        {/* Section eyebrow */}

        <div className="story-eyebrow mb-14 flex items-center justify-between border-b border-[#dfe4dc] pb-5 sm:mb-20">
          <div className="flex items-center gap-4">
            <span className="h-px w-9 bg-[#718477]" />

            <span className="font-sans text-[9px] font-semibold uppercase tracking-[0.28em] text-[#718477] sm:text-[10px]">
              The philosophy behind Belief
            </span>
          </div>

          <span className="hidden font-sans text-[9px] tracking-[0.2em] text-[#879188] sm:block">
            OUR STORY · 01
          </span>
        </div>

        {/* Editorial layout */}

        <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20">

          {/* =================================================
              LEFT — IMAGE COMPOSITION
          ================================================= */}

          <div className="relative order-2 lg:order-1">

            {/* Image frame */}

            <div className="story-image-frame relative aspect-[4/4.6] overflow-hidden bg-[#e9eee7] sm:aspect-[4/4.1] lg:aspect-[0.92/1]">

              <img
                src="/luxury-cosmetics-brand-story-founder-wellness.jpg"
                alt="Belief Cosmetics brand story"
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-[1400ms] ease-out hover:scale-[1.035]"
              />

              {/* Image overlay */}

              <div className="absolute inset-0 bg-gradient-to-t from-[#172b27]/25 via-transparent to-white/5" />

              {/* Image corner label */}

              <div className="absolute bottom-6 left-6 sm:bottom-8 sm:left-8">
                <p className="font-sans text-[8px] font-medium uppercase tracking-[0.28em] text-white/80">
                  Beauty with intention
                </p>

                <p className="mt-2 font-editorial text-2xl italic text-white sm:text-3xl">
                  A belief in better.
                </p>
              </div>
            </div>

            {/* Image caption */}

            <div className="story-image-caption mt-5 flex items-center justify-between">
              <span className="font-sans text-[9px] uppercase tracking-[0.2em] text-[#879188]">
                The Belief philosophy
              </span>

              <span className="font-editorial text-base italic text-[#718477]">
                Thoughtfully, always.
              </span>
            </div>

            {/* Decorative vertical detail */}

            <div
              aria-hidden="true"
              className="absolute -left-5 top-12 hidden h-28 w-px bg-[#aab5ad] lg:block"
            />
          </div>

          {/* =================================================
              RIGHT — EDITORIAL CONTENT
          ================================================= */}

          <div className="story-content order-1 lg:order-2 lg:pl-3">

            {/* Small label */}

            <div className="mb-7 flex items-center gap-3">
              <span className="h-px w-7 bg-[#718477]" />

              <span className="font-sans text-[9px] font-semibold uppercase tracking-[0.25em] text-[#718477]">
                More than skincare
              </span>
            </div>

            {/* Heading */}

            <h2 className="story-heading mb-9 font-editorial text-[clamp(58px,7vw,94px)] font-medium leading-[0.88] tracking-[-0.055em] text-[#172b27]">

              <span className="block overflow-hidden pb-[0.06em]">
                <span className="story-heading-line block">
                  Beauty
                </span>
              </span>

              <span className="block overflow-hidden pb-[0.06em]">
                <span className="story-heading-line block">
                  begins with
                </span>
              </span>

              <span className="block overflow-hidden pb-[0.09em]">
                <span className="story-heading-line block font-normal italic text-[#294b40]">
                  belief.
                </span>
              </span>
            </h2>

            {/* Intro statement */}

            <p className="story-copy mb-6 max-w-[440px] font-editorial text-[24px] leading-[1.35] text-[#294b40] sm:text-[28px]">
              Skincare should feel as personal as the skin you're in.
            </p>

            {/* Description */}

            <div className="max-w-[450px] space-y-5">
              <p className="story-copy font-sans text-[13px] leading-[2] text-[#69746c] sm:text-sm">
                Founded on a simple belief that skincare should be personal,
                effective and luxurious, Belief Cosmetics was born from a
                passion to bridge the gap between beauty and science.
              </p>

              <p className="story-copy font-sans text-[13px] leading-[2] text-[#69746c] sm:text-sm">
                Every product is carefully formulated with premium ingredients,
                cruelty-free practices and a commitment to thoughtful skincare.
                We believe great skincare should do more than care for your skin
                — it should help you feel confident in it.
              </p>
            </div>

            {/* Brand values */}

            <div className="story-copy mt-9 grid max-w-[450px] grid-cols-3 border-y border-[#dfe4dc] py-5">
              <div>
                <p className="font-editorial text-xl italic text-[#294b40] sm:text-2xl">
                  01
                </p>
                <p className="mt-2 font-sans text-[8px] font-semibold uppercase tracking-[0.14em] text-[#879188] sm:text-[9px]">
                  Thoughtful
                </p>
              </div>

              <div className="border-l border-[#dfe4dc] pl-4 sm:pl-6">
                <p className="font-editorial text-xl italic text-[#294b40] sm:text-2xl">
                  02
                </p>
                <p className="mt-2 font-sans text-[8px] font-semibold uppercase tracking-[0.14em] text-[#879188] sm:text-[9px]">
                  Effective
                </p>
              </div>

              <div className="border-l border-[#dfe4dc] pl-4 sm:pl-6">
                <p className="font-editorial text-xl italic text-[#294b40] sm:text-2xl">
                  03
                </p>
                <p className="mt-2 font-sans text-[8px] font-semibold uppercase tracking-[0.14em] text-[#879188] sm:text-[9px]">
                  Conscious
                </p>
              </div>
            </div>

            {/* CTA */}

            <div className="story-cta mt-9">
              <Link
                to="/about"
                className="group inline-flex min-h-[56px] items-center gap-8 rounded-full bg-[#172b27] py-1.5 pl-7 pr-2 text-white shadow-[0_10px_28px_rgba(23,43,39,0.10)] transition-all duration-500 hover:-translate-y-1 hover:bg-[#294b40] hover:shadow-[0_16px_35px_rgba(23,43,39,0.17)]"
              >
                <span className="font-sans text-[11px] font-semibold tracking-wide">
                  Discover our story
                </span>

                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f8f6f0] text-[#172b27] transition-transform duration-500 group-hover:rotate-45">
                  <ArrowUpRight size={18} strokeWidth={1.5} />
                </span>
              </Link>
            </div>

          </div>
        </div>

        {/* Bottom signature */}

        <div className="mt-24 flex items-center justify-center gap-4 opacity-50 sm:mt-32">
          <span className="h-px w-12 bg-[#718477]" />
          <span className="h-1 w-1 rounded-full bg-[#718477]" />
          <span className="h-px w-12 bg-[#718477]" />
        </div>

      </div>
    </section>
  );
}
