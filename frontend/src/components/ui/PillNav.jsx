
import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import gsap from "gsap";
import { Menu, X } from "lucide-react";

const PillNav = ({
  logo = "/beliefCosmetics.png",
  logoAlt = "Belief Cosmetics",
  items = [],
  activeHref,
  className = "",
  ease = "power3.out",
  baseColor = "transparent",
  pillColor = "#172b27",
  pillTextColor = "#172b27",
  hoveredPillTextColor = "#f8f6f0",
  hoverCircleColor = "#172b27",
  initialLoadAnimation = false,
  rightElement,
  onMobileMenuClick,
}) => {
  const location = useLocation();

  const [mobileOpen, setMobileOpen] = useState(false);

  const navRef = useRef(null);
  const menuRef = useRef(null);
  const circleRefs = useRef([]);
  const itemRefs = useRef([]);
  const mobileMenuRef = useRef(null);
  const mobileTimeline = useRef(null);

  const currentPath = activeHref || location.pathname;

  const isActive = (item) => {
    const href = item.href || item.link || item.path;

    if (!href) return false;

    return (
      currentPath === href ||
      (href !== "/" && currentPath.startsWith(href))
    );
  };

  const getHref = (item) =>
    item.href || item.link || item.path || "#";

  const isExternal = (href) =>
    href.startsWith("http://") ||
    href.startsWith("https://") ||
    href.startsWith("mailto:");

  const closeMobileMenu = () => {
    setMobileOpen(false);
    onMobileMenuClick?.(false);
  };

  const toggleMobileMenu = () => {
    const nextState = !mobileOpen;

    setMobileOpen(nextState);
    onMobileMenuClick?.(nextState);
  };

  // Navigation pill hover animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      itemRefs.current.forEach((item, index) => {
        const circle = circleRefs.current[index];

        if (!item || !circle) return;

        gsap.set(circle, {
          scale: 0,
          opacity: 0,
          transformOrigin: "center center",
        });

        const enter = () => {
          gsap.to(circle, {
            scale: 1,
            opacity: 1,
            duration: 0.35,
            ease,
          });

          gsap.to(item.querySelector(".pill-label"), {
            color: hoveredPillTextColor,
            duration: 0.25,
            ease,
          });
        };
        const leave = () => {
          gsap.to(circle, {
            scale: 0,
            opacity: 0,
            duration: 0.3,
            ease,
          });

          gsap.to(item.querySelector(".pill-label"), {
            color: isActive(items[index])
              ? hoveredPillTextColor
              : pillTextColor,
            duration: 0.25,
            ease,
          });
        };

        item.addEventListener("mouseenter", enter);
        item.addEventListener("mouseleave", leave);

        item._cleanup = () => {
          item.removeEventListener("mouseenter", enter);
          item.removeEventListener("mouseleave", leave);
        };
      });

      if (initialLoadAnimation) {
        gsap.fromTo(
          navRef.current,
          { opacity: 0, y: -12 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease,
            clearProps: "transform",
          }
        );
      }
    }, navRef);

    return () => {
      itemRefs.current.forEach((item) => {
        item?._cleanup?.();
      });

      ctx.revert();
    };
  }, [
    ease,
    hoveredPillTextColor,
    pillTextColor,
    initialLoadAnimation,
  ]);

  // Mobile menu animation
  useEffect(() => {
    if (!mobileMenuRef.current) return;

    if (mobileTimeline.current) {
      mobileTimeline.current.kill();
    }

    if (mobileOpen) {
      mobileTimeline.current = gsap.fromTo(
        mobileMenuRef.current,
        {
          opacity: 0,
          y: -12,
          visibility: "hidden",
        },
        {
          opacity: 1,
          y: 0,
          visibility: "visible",
          duration: 0.35,
          ease,
        }
      );
    } else {
      gsap.set(mobileMenuRef.current, {
        opacity: 0,
        y: -12,
        visibility: "hidden",
      });
    }

    return () => {
      mobileTimeline.current?.kill();
    };
  }, [mobileOpen, ease]);

  // Close mobile menu after route change
  useEffect(() => {
    closeMobileMenu();
  }, [location.pathname]);

  // Close mobile menu when pressing Escape
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        closeMobileMenu();
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const renderNavLink = (item, index, mobile = false) => {
    const href = getHref(item);
    const active = isActive(item);

    const label =
      item.label || item.title || item.name || "Link";

    const linkClass = mobile
      ? `block w-full rounded-xl px-4 py-3 text-sm font-medium transition-colors duration-200 ${active
        ? "bg-[#172b27] text-[#f8f6f0]"
        : "text-[#172b27] hover:bg-[#e7eae3]"
      }`
      : `relative z-10 block whitespace-nowrap px-5 py-2.5 text-[12px] font-semibold uppercase tracking-[0.13em] transition-colors duration-200 ${active
        ? "text-[#f8f6f0]"
        : "text-[#172b27]"
      }`;

    const content = (
      <>
        {label}
      </>
    );

    if (isExternal(href)) {
      return (
        <a
          key={`${label}-${index}`}
          href={href}
          target={item.target || "_blank"}
          rel="noopener noreferrer"
          className={linkClass}
          onClick={mobile ? closeMobileMenu : undefined}
        >
          {content}
        </a>
      );
    }

    return (
      <Link
        key={`${label}-${index}`}
        to={href}
        className={linkClass}
        onClick={mobile ? closeMobileMenu : undefined}
      >
        {content}
      </Link>
    );
  };

  return (
    <div
      ref={navRef}
      className={`relative z-50 w-full ${className}`}
    >
      {/* Main Navbar */}
      <nav
        className="
          relative mx-auto flex h-20 w-full
          items-center justify-between
          px-5 py-0
          sm:px-8
          lg:px-12
        "
        style={{ backgroundColor: baseColor }}
      >
        {/* Brand Logo */}
        <div className="relative z-20 flex h-full shrink-0 items-center">
          <Link
            to="/"
            aria-label="Belief Cosmetics home"
            className="flex items-center"
          >
            <img
              src={logo}
              alt={logoAlt}
              className="
                h-11 w-auto object-contain
                sm:h-12
                lg:h-14
              "
            />
          </Link>
        </div>

        {/* Desktop Navigation - Always Centered */}
        <div
          ref={menuRef}
          className="
            absolute left-1/2 top-1/2
            hidden -translate-x-1/2 -translate-y-1/2
            items-center
            rounded-full
            border border-[#e7eae3]
            bg-[#f8f6f0]/95
            p-[5px]
            shadow-[0_5px_24px_rgba(23,43,39,0.07)]
            backdrop-blur-xl
            md:flex
          "
        >
          {items.map((item, index) => {
            const active = isActive(item);

            return (
              <div
                key={`${getHref(item)}-${index}`}
                ref={(element) => {
                  itemRefs.current[index] = element;
                }}
                className="
                  relative isolate flex
                  cursor-pointer items-center
                  justify-center overflow-hidden
                  rounded-full
                "
              >
                {/* Hover Circle */}
                <span
                  ref={(element) => {
                    circleRefs.current[index] = element;
                  }}
                  className="
                    pointer-events-none absolute inset-0
                    rounded-full
                  "
                  style={{ backgroundColor: hoverCircleColor }}
                />

                {/* Navigation Link */}
                {isExternal(getHref(item)) ? (
                  <a
                    href={getHref(item)}
                    target={item.target || "_blank"}
                    rel="noopener noreferrer"
                    className={`
                      pill-label relative z-10
                      block whitespace-nowrap
                      px-5 py-2.5
                      text-[12px] font-semibold
                      uppercase tracking-[0.13em]
                      transition-colors duration-200
                      ${active
                        ? "text-[#f8f6f0]"
                        : "text-[#172b27]"
                      }
                    `}
                    style={{
                      color: active
                        ? hoveredPillTextColor
                        : pillTextColor,
                    }}
                  >
                    {item.label || item.title || item.name}
                  </a>
                ) : (
                  <Link
                    to={getHref(item)}
                    className={`
                      pill-label relative z-10
                      block whitespace-nowrap
                      px-5 py-2.5
                      text-[12px] font-semibold
                      uppercase tracking-[0.13em]
                      transition-colors duration-200
                    `}
                    style={{
                      color: active
                        ? hoveredPillTextColor
                        : pillTextColor,
                    }}
                  >
                    {item.label || item.title || item.name}
                  </Link>
                )}

                {/* Active Background */}
                {active && (
                  <span
                    className="
                      pointer-events-none absolute inset-0
                      -z-0 rounded-full
                    "
                    style={{
                      backgroundColor: pillColor,
                    }}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Right Side Elements */}
        {rightElement && (
          <div className="relative z-20 hidden shrink-0 items-center md:flex">
            {rightElement}
          </div>
        )}

        {/* Mobile Menu Toggle */}
        <button
          type="button"
          onClick={toggleMobileMenu}
          aria-label={
            mobileOpen ? "Close navigation menu" : "Open navigation menu"
          }
          aria-expanded={mobileOpen}
          className="
            relative z-30 flex h-11 w-11
            items-center justify-center
            rounded-full border border-[#e7eae3]
            bg-[#f8f6f0] text-[#172b27]
            transition-colors duration-200
            hover:bg-[#e7eae3]
            md:hidden
          "
        >
          {mobileOpen ? (
            <X size={21} strokeWidth={1.7} />
          ) : (
            <Menu size={21} strokeWidth={1.7} />
          )}
        </button>
      </nav>

      {/* Mobile Navigation Menu */}
      <div
        ref={mobileMenuRef}
        className="
          invisible absolute left-0 right-0 top-full
          z-50 mx-3 mt-2
          rounded-2xl border border-[#e7eae3]
          bg-[#f8f6f0] p-4
          shadow-[0_12px_35px_rgba(23,43,39,0.12)]
          md:hidden
        "
      >
        {/* Mobile Nav Links */}
        <div className="flex flex-col gap-1">
          {items.map((item, index) =>
            renderNavLink(item, index, true)
          )}
        </div>

        {/* Mobile Right Elements */}
        {rightElement && (
          <div className="mt-4 border-t border-[#e7eae3] pt-4">
            {rightElement}
          </div>
        )}
      </div>
    </div>
  );
};

export default PillNav;
