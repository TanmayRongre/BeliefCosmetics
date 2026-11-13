
import { Link } from "react-router-dom";
import {
  Facebook,
  Instagram,
  Twitter,
  ArrowUpRight,
} from "lucide-react";

const footerLinks = [
  {
    title: "Explore",
    links: [
      { label: "All Products", to: "/products" },
      { label: "Skincare", to: "/products?type=skincare" },
      { label: "Skin Analyzer", to: "/skin-analyzer" },
    ],
  },
  {
    title: "Discover",
    links: [
      { label: "Our Story", to: "/about" },
      { label: "Contact Us", to: "/contact" },
      { label: "Careers", to: "/careers" },
    ],
  },
  {
    title: "Information",
    links: [
      { label: "Privacy Policy", to: "/privacy" },
      { label: "Terms of Service", to: "/terms" },
      { label: "Returns & Refunds", to: "/returns" },
    ],
  },
];

const socialLinks = [
  {
    label: "Instagram",
    icon: Instagram,
    href: "#",
  },
  {
    label: "Facebook",
    icon: Facebook,
    href: "#",
  },
  {
    label: "Twitter",
    icon: Twitter,
    href: "#",
  },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative isolate mt-20 overflow-hidden bg-[#142923] text-[#F5F3EB]">

      {/* Background image */}
      <div className="absolute inset-0 -z-10">
        <img
          src="/Footer.png"
          alt=""
          aria-hidden="true"
          className="h-full w-full object-cover object-center opacity-30"
        />

        <div className="absolute inset-0 bg-[#10231E]/90" />

        <div className="absolute inset-0 bg-gradient-to-b from-[#142923]/70 via-[#142923]/85 to-[#0D1B17]" />
      </div>

      <div className="relative mx-auto max-w-[1440px] px-6 sm:px-10 lg:px-16">

        {/* Main footer */}
        <div className="grid grid-cols-1 gap-14 border-b border-white/15 py-16 md:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr] lg:gap-12 lg:py-20">

          {/* Brand section */}
          <div className="max-w-sm">

            <Link
              to="/"
              aria-label="Belief Cosmetics homepage"
              className="inline-block"
            >
              <img
                src="/darkBeliefCosmetics.png"
                alt="Belief Cosmetics"
                className="
                  mb-6
                  h-14 w-auto
                  object-contain
                  opacity-90
                  transition-opacity duration-300
                  hover:opacity-100
                "
              />
            </Link>

            <p className="mb-7 max-w-[300px] font-editorial text-2xl leading-relaxed text-[#E5E6D9]">
              Thoughtfully formulated.
              <br />
              Consciously created.
            </p>

            <p className="max-w-[300px] font-sans text-sm font-light leading-7 text-[#E5E9DF]/65">
              Premium skincare that understands your skin.
              Honest formulations, meaningful ingredients, and care
              without compromise.
            </p>

            {/* Brand signature */}
            <div className="mt-8 flex items-center gap-3">
              <span className="h-px w-8 bg-[#A5B59C]/70" />
              <span className="font-sans text-[9px] uppercase tracking-[0.3em] text-[#A5B59C]">
                The Belief Philosophy
              </span>
            </div>
          </div>

          {/* Navigation columns */}
          {footerLinks.map((section) => (
            <div key={section.title}>
              <h3 className="mb-7 font-sans text-[11px] font-semibold uppercase tracking-[0.22em] text-[#D9E0D4]">
                {section.title}
              </h3>

              <ul className="space-y-4">
                {section.links.map((link) => (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      className="
                        group inline-flex items-center gap-2
                        font-sans text-sm font-light
                        text-[#E5E9DF]/65
                        transition-colors duration-300
                        hover:text-[#F5F3EB]
                      "
                    >
                      <span>{link.label}</span>

                      <ArrowUpRight
                        size={13}
                        strokeWidth={1.5}
                        className="
                          -translate-x-1 opacity-0
                          transition-all duration-300
                          group-hover:translate-x-0
                          group-hover:opacity-100
                        "
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom footer */}
        <div className="flex flex-col gap-7 py-7 md:flex-row md:items-center md:justify-between">

          {/* Copyright */}
          <div className="text-center md:text-left">
            <p className="font-sans text-xs font-light tracking-wide text-[#E5E9DF]/55">
              © {currentYear} Belief Cosmetics.
              <span className="ml-1">All rights reserved.</span>
            </p>
          </div>

          {/* Social links */}
          <div className="flex items-center justify-center gap-3">
            <span className="mr-2 font-sans text-[9px] uppercase tracking-[0.22em] text-[#E5E9DF]/50">
              Follow us
            </span>

            {socialLinks.map((social) => {
              const Icon = social.icon;

              return (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  target={social.href === "#" ? undefined : "_blank"}
                  rel={social.href === "#" ? undefined : "noopener noreferrer"}
                  className="
                    flex h-10 w-10 items-center justify-center
                    rounded-full
                    border border-white/15
                    text-[#E5E9DF]/75
                    transition-all duration-300
                    hover:border-[#C0CBB5]
                    hover:bg-[#E5E9DF]
                    hover:text-[#142923]
                  "
                >
                  <Icon size={17} strokeWidth={1.6} />
                </a>
              );
            })}
          </div>

          {/* Back to top */}
          <button
            type="button"
            onClick={() =>
              window.scrollTo({
                top: 0,
                behavior: "smooth",
              })
            }
            className="
              group flex items-center justify-center gap-2
              font-sans text-[10px] uppercase tracking-[0.2em]
              text-[#E5E9DF]/65
              transition-colors duration-300
              hover:text-white
            "
          >
            Back to top

            <span className="
              flex h-8 w-8 items-center justify-center
              rounded-full border border-white/20
              transition-all duration-300
              group-hover:-translate-y-1
              group-hover:border-white/50
            ">
              <ArrowUpRight size={14} />
            </span>
          </button>
        </div>

      </div>
    </footer>
  );
}
