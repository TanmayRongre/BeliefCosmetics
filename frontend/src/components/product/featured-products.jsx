
import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import ThreeDProductCard from "./ThreeDProductCard";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const products = [
  {
    title: "Sun Screen",
    price: "899.00",
    image: "/sunscreen.png",
    bgImage: "/sunscreen.jpg",
    category: "Sunscreen",
  },
  {
    title: "Toner",
    price: "699.00",
    image: "/toner.png",
    bgImage: "/toner.jpg",
    category: "Toner",
  },
  {
    title: "Serum",
    price: "999.00",
    image: "/serum.png",
    bgImage: "/serum.jpg",
    category: "Serum",
  },
  {
    title: "Moisturiser",
    price: "499.00",
    image: "/moisturiser.png",
    bgImage: "/moisturiser.jpg",
    category: "Moisturizer",
  },
];

export default function FeaturedProducts() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add(
        "(prefers-reduced-motion: no-preference)",
        () => {
          // Section eyebrow
          gsap.from(".featured-label", {
            y: 18,
            opacity: 0,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: ".featured-header",
              start: "top 82%",
              once: true,
            },
          });

          // Editorial heading
          gsap.from(".featured-heading-line", {
            yPercent: 110,
            opacity: 0,
            duration: 1.1,
            stagger: 0.16,
            ease: "power4.out",
            scrollTrigger: {
              trigger: ".featured-heading",
              start: "top 85%",
              once: true,
            },
          });

          // Description
          gsap.from(".featured-description", {
            y: 20,
            opacity: 0,
            duration: 0.9,
            delay: 0.2,
            ease: "power3.out",
            scrollTrigger: {
              trigger: ".featured-header",
              start: "top 80%",
              once: true,
            },
          });

          // Product cards
          gsap.from(".featured-card", {
            y: 55,
            opacity: 0,
            scale: 0.97,
            duration: 1,
            stagger: 0.13,
            ease: "power3.out",
            scrollTrigger: {
              trigger: ".featured-grid",
              start: "top 82%",
              once: true,
            },
          });

          // Bottom CTA
          gsap.from(".featured-footer", {
            y: 25,
            opacity: 0,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: {
              trigger: ".featured-footer",
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
      {/* Subtle background detail */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 top-20 h-[420px] w-[420px] rounded-full bg-[#e9eee7]/50 blur-[100px]"
      />

      <div className="relative mx-auto max-w-[1500px] px-6 sm:px-10 lg:px-[9.2%]">

        {/* =================================================
            EDITORIAL SECTION HEADER
        ================================================= */}

        <div className="featured-header mb-16 grid grid-cols-1 items-end gap-8 md:mb-20 md:grid-cols-[1fr_0.65fr] lg:mb-24">

          <div>
            {/* Eyebrow */}

            <div className="featured-label mb-7 flex items-center gap-4">
              <span className="h-px w-9 bg-[#718477]" />

              <span className="font-sans text-[9px] font-semibold uppercase tracking-[0.3em] text-[#718477] sm:text-[10px]">
                The Belief Edit · 01
              </span>
            </div>

            {/* Heading */}

            <h2 className="featured-heading max-w-[750px] font-editorial text-[clamp(58px,7vw,100px)] font-medium leading-[0.86] tracking-[-0.055em] text-[#172b27]">
              <span className="block overflow-hidden pb-[0.06em]">
                <span className="featured-heading-line block">
                  Considered
                </span>
              </span>

              <span className="block overflow-hidden pb-[0.08em]">
                <span className="featured-heading-line block font-normal italic text-[#294b40]">
                  essentials.
                </span>
              </span>
            </h2>
          </div>

          {/* Description */}

          <div className="md:justify-self-end md:pb-2">
            <p className="featured-description max-w-[360px] font-sans text-[13px] leading-[2] text-[#69746c] sm:text-sm">
              Skincare, thoughtfully selected. Discover everyday essentials
              created to nourish, protect and celebrate your natural skin.
            </p>

            <div className="featured-description mt-6 flex items-center gap-3">
              <span className="h-px w-7 bg-[#aab5ad]" />

              <span className="font-editorial text-lg italic text-[#718477]">
                A little more intentional.
              </span>
            </div>
          </div>
        </div>

        {/* =================================================
            PRODUCT COLLECTION
        ================================================= */}

        <div className="mb-5 flex items-center justify-between border-y border-[#dfe4dc] py-4">
          <span className="font-sans text-[9px] font-semibold uppercase tracking-[0.24em] text-[#718477]">
            Shop the collection
          </span>

          <span className="font-sans text-[9px] tracking-[0.18em] text-[#879188]">
            01 — 04
          </span>
        </div>

        <div className="featured-grid grid grid-cols-1 justify-items-center gap-x-7 gap-y-14 py-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-x-6 lg:gap-y-10">

          {products.map((product, index) => (
            <div
              key={product.title}
              className="featured-card group w-full max-w-[340px]"
            >
              {/* Product number and category */}

              <div className="mb-3 flex items-center justify-between px-1">
                <span className="font-sans text-[9px] tracking-[0.2em] text-[#a0aaa1]">
                  0{index + 1}
                </span>

                <span className="font-sans text-[9px] uppercase tracking-[0.17em] text-[#718477]">
                  {product.category}
                </span>
              </div>

              {/* Existing 3D product card */}

              <ThreeDProductCard
                {...product}
                className="featured-product-visual"
              />

              {/* Editorial product details */}

              <div className="mt-5 flex items-start justify-between border-b border-[#dfe4dc] px-1 pb-4">
                <div>
                  <h3 className="font-editorial text-[27px] font-medium leading-none tracking-tight text-[#172b27] transition-colors duration-300 group-hover:text-[#718477]">
                    {product.title}
                  </h3>

                  <p className="mt-2 font-sans text-[9px] uppercase tracking-[0.17em] text-[#879188]">
                    Thoughtfully formulated
                  </p>
                </div>

                <span className="pt-1 font-sans text-xs font-medium tracking-wide text-[#294b40]">
                  ₹{product.price}
                </span>
              </div>
            </div>
          ))}

        </div>

        {/* =================================================
            EDITORIAL FOOTER / CTA
        ================================================= */}

        <div className="featured-footer mt-16 flex flex-col items-center justify-between gap-8 border-t border-[#dfe4dc] pt-10 sm:mt-20 sm:flex-row">

          <div className="text-center sm:text-left">
            <p className="font-sans text-[9px] font-semibold uppercase tracking-[0.25em] text-[#718477]">
              Find your everyday ritual
            </p>

            <p className="mt-2 font-editorial text-2xl italic text-[#294b40] sm:text-3xl">
              Good skin begins with intention.
            </p>
          </div>

          <Link
            to="/products"
            className="group inline-flex min-h-[56px] items-center gap-8 rounded-full bg-[#172b27] py-1.5 pl-7 pr-2 text-white shadow-[0_10px_28px_rgba(23,43,39,0.10)] transition-all duration-500 hover:-translate-y-1 hover:bg-[#294b40] hover:shadow-[0_16px_35px_rgba(23,43,39,0.17)]"
          >
            <span className="font-sans text-[11px] font-semibold tracking-wide">
              Explore all products
            </span>

            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f8f6f0] text-[#172b27] transition-transform duration-500 group-hover:rotate-45">
              <ArrowUpRight size={18} strokeWidth={1.5} />
            </span>
          </Link>
        </div>

        {/* Bottom decorative signature */}

        <div className="mt-20 flex items-center justify-center gap-4 opacity-50">
          <span className="h-px w-12 bg-[#718477]" />
          <span className="h-1 w-1 rounded-full bg-[#718477]" />
          <span className="h-px w-12 bg-[#718477]" />
        </div>

      </div>
    </section>
  );
}
