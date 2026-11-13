
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { gsap } from "gsap";

const PillNav = ({
  logo,
  logoAlt = "Belief Cosmetics",
  items = [],
  activeHref,
  className = "",
  ease = "power3.out",
  baseColor = "#F8F7F2",
  pillColor = "#F8F7F2",
  hoveredPillTextColor = "#F8F7F2",
  pillTextColor = "#243B32",
  onMobileMenuClick,
  initialLoadAnimation = true,
  rightElement,
  hoverCircleColor = "#243B32",
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const circleRefs = useRef([]);
  const tlRefs = useRef([]);
  const activeTweenRefs = useRef([]);
  const hamburgerRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const navItemsRef = useRef(null);

  const cssVars = {
    "--base": baseColor,
    "--pill-bg": pillColor,
    "--hover-text": hoveredPillTextColor,
    "--pill-text": pillTextColor,
    "--nav-h": "44px",
    "--pill-pad-x": "21px",
    "--pill-gap": "5px",
    "--hover-circle": hoverCircleColor,
  };

  const isExternalLink = (href = "") =>
    href.startsWith("http://") ||
    href.startsWith("https://") ||
    href.startsWith("//") ||
    href.startsWith("mailto:") ||
    href.startsWith("tel:") ||
    href.startsWith("#");

  const isRouterLink = (href) =>
    href && !isExternalLink(href);

  const isActive = (href) => activeHref === href;

  // Original bottom-expanding GSAP hover animation
  useEffect(() => {
    const layout = () => {
      circleRefs.current.forEach((circle, index) => {
        if (!circle?.parentElement) return;

        const pill = circle.parentElement;
        const { width: w, height: h } = pill.getBoundingClientRect();

        if (!w || !h) return;

        const R = (w * w / 4 + h * h) / (2 * h);
        const D = Math.ceil(2 * R) + 2;

        const delta =
          Math.ceil(
            R - Math.sqrt(Math.max(0, R * R - w * w / 4))
          ) + 1;

        circle.style.width = `${D}px`;
        circle.style.height = `${D}px`;
        circle.style.bottom = `-${delta}px`;

        gsap.set(circle, {
          xPercent: -50,
          scale: 0,
          transformOrigin: `50% ${D - delta}px`,
        });

        const label = pill.querySelector(".pill-label");
        const hoverLabel = pill.querySelector(".pill-label-hover");

        if (label) {
          gsap.set(label, { y: 0 });
        }

        if (hoverLabel) {
          gsap.set(hoverLabel, {
            y: h + 12,
            opacity: 0,
          });
        }

        tlRefs.current[index]?.kill();

        const timeline = gsap.timeline({ paused: true });

        timeline.to(
          circle,
          {
            scale: 1.2,
            xPercent: -50,
            duration: 0.55,
            ease,
            overwrite: "auto",
          },
          0
        );

        if (label) {
          timeline.to(
            label,
            {
              y: -(h + 8),
              duration: 0.55,
              ease,
              overwrite: "auto",
            },
            0
          );
        }

        if (hoverLabel) {
          gsap.set(hoverLabel, {
            y: h + 12,
            opacity: 0,
          });

          timeline.to(
            hoverLabel,
            {
              y: 0,
              opacity: 1,
              duration: 0.55,
              ease,
              overwrite: "auto",
            },
            0
          );
        }

        tlRefs.current[index] = timeline;
      });
    };

    layout();

    const resizeObserver = new ResizeObserver(layout);

    if (navItemsRef.current) {
      resizeObserver.observe(navItemsRef.current);
    }

    window.addEventListener("resize", layout);

    document.fonts?.ready?.then(layout).catch(() => { });

    if (mobileMenuRef.current) {
      gsap.set(mobileMenuRef.current, {
        visibility: "hidden",
        opacity: 0,
        y: 10,
      });
    }

    // Keep original navigation entrance animation.
    // Logo remains static.
    if (initialLoadAnimation && navItemsRef.current) {
      gsap.fromTo(
        navItemsRef.current,
        { opacity: 0, y: -8 },
        {
          opacity: 1,
          y: 0,
          duration: 0.65,
          delay: 0.1,
          ease,
        }
      );
    }

    return () => {
      window.removeEventListener("resize", layout);
      resizeObserver.disconnect();

      tlRefs.current.forEach((timeline) => timeline?.kill());
      activeTweenRefs.current.forEach((tween) => tween?.kill());
    };
  }, [items, ease, initialLoadAnimation]);

  // Hover in
  const handleEnter = (index) => {
    const timeline = tlRefs.current[index];

    if (!timeline) return;

    activeTweenRefs.current[index]?.kill();

    activeTweenRefs.current[index] = timeline.tweenTo(
      timeline.duration(),
      {
        duration: 0.3,
        ease,
        overwrite: "auto",
      }
    );
  };

  // Hover out
  const handleLeave = (index) => {
    const timeline = tlRefs.current[index];

    if (!timeline) return;

    activeTweenRefs.current[index]?.kill();

    activeTweenRefs.current[index] = timeline.tweenTo(0, {
      duration: 0.22,
      ease,
      overwrite: "auto",
    });
  };

  // Mobile menu animation
  const toggleMobileMenu = () => {
    const nextState = !isMobileMenuOpen;

    setIsMobileMenuOpen(nextState);

    const lines = hamburgerRef.current?.querySelectorAll(
      ".hamburger-line"
    );

    const menu = mobileMenuRef.current;

    if (lines?.length) {
      if (nextState) {
        gsap.to(lines[0], {
          rotation: 45,
          y: 3.5,
          duration: 0.25,
          ease,
        });

        gsap.to(lines[1], {
          rotation: -45,
          y: -3.5,
          duration: 0.25,
          ease,
        });
      } else {
        gsap.to(lines, {
          rotation: 0,
          y: 0,
          duration: 0.25,
          ease,
        });
      }
    }

    if (menu) {
      if (nextState) {
        gsap.set(menu, { visibility: "visible" });

        gsap.fromTo(
          menu,
          { opacity: 0, y: 10 },
          {
            opacity: 1,
            y: 0,
            duration: 0.3,
            ease,
          }
        );
      } else {
        gsap.to(menu, {
          opacity: 0,
          y: 8,
          duration: 0.2,
          ease,
          onComplete: () => {
            gsap.set(menu, { visibility: "hidden" });
          },
        });
      }
    }

    onMobileMenuClick?.(nextState);
  };

  const closeMobileMenu = () => {
    if (!isMobileMenuOpen) return;

    setIsMobileMenuOpen(false);
    onMobileMenuClick?.(false);

    gsap.to(
      hamburgerRef.current?.querySelectorAll(".hamburger-line"),
      {
        rotation: 0,
        y: 0,
        duration: 0.2,
        ease,
      }
    );

    gsap.to(mobileMenuRef.current, {
      opacity: 0,
      y: 8,
      duration: 0.2,
      ease,
      onComplete: () => {
        gsap.set(mobileMenuRef.current, {
          visibility: "hidden",
        });
      },
    });
  };

  // Desktop pill content
  const renderPillContent = (item, index, active) => (
    <>
      {/* Expanding circular background */}
      <span
        ref={(element) => {
          circleRefs.current[index] = element;
        }}
        className="
          hover-circle pointer-events-none
          absolute bottom-0 left-1/2 z-[1]
          block rounded-full
        "
        style={{
          background: "var(--hover-circle)",
          willChange: "transform",
        }}
        aria-hidden="true"
      />

      {/* Original and hover labels */}
      <span className="label-stack relative z-[2] inline-block overflow-hidden leading-none">
        <span
          className="pill-label relative z-[2] inline-block"
          style={{
            color: active
              ? "var(--hover-text)"
              : "var(--pill-text)",
            willChange: "transform",
          }}
        >
          {item.label}
        </span>

        <span
          className="
            pill-label-hover absolute left-0 top-0
            z-[3] inline-block whitespace-nowrap
          "
          style={{
            color: "var(--hover-text)",
            willChange: "transform, opacity",
          }}
          aria-hidden="true"
        >
          {item.label}
        </span>
      </span>
    </>
  );

  return (
    <div
      className={`absolute left-0 top-0 z-[1000] w-full ${className}`}
      style={cssVars}
    >
      <nav
        aria-label="Primary navigation"
        className="
          relative mx-auto flex h-20 w-full
          max-w-[1440px]
          items-center justify-between
          px-5 py-0
          sm:px-8 lg:px-12
        "
      >
        {/* Brand Logo - No hover animation */}
        <Link
          to="/"
          aria-label="Go to homepage"
          className="relative z-20 flex shrink-0 items-center"
        >
          {logo && (
            <img
              src={logo}
              alt={logoAlt}
              className="
                h-12 w-auto object-contain
                sm:h-14
                lg:h-16
              "
            />
          )}
        </Link>

        {/* Desktop Navigation */}
        <div
          ref={navItemsRef}
          className="
            absolute left-1/2 top-1/2
            hidden -translate-x-1/2 -translate-y-1/2
            items-center
            rounded-full
            border border-[#E7E5DC]
            bg-[#F8F7F2]/95
            p-[4px]
            shadow-[0_4px_20px_rgba(36,59,50,0.06)]
            backdrop-blur-xl
            md:flex
          "
        >
          <ul
            role="menubar"
            className="
              m-0 flex h-full list-none
              items-center gap-[3px] p-0
            "
          >
            {items.map((item, index) => {
              const active = isActive(item.href);

              const pillStyle = {
                background: active
                  ? "var(--hover-circle)"
                  : "transparent",
                color: active
                  ? "var(--hover-text)"
                  : "var(--pill-text)",
                paddingLeft: "var(--pill-pad-x)",
                paddingRight: "var(--pill-pad-x)",
              };

              const linkClasses = `
                relative inline-flex h-[38px]
                items-center justify-center
                overflow-hidden rounded-full
                whitespace-nowrap
                text-[11px] font-semibold
                uppercase tracking-[1.1px]
                ${active ? "shadow-sm" : ""}
              `;

              const content = renderPillContent(
                item,
                index,
                active
              );

              return (
                <li
                  key={item.href}
                  role="none"
                  className="flex"
                >
                  {isRouterLink(item.href) ? (
                    <Link
                      role="menuitem"
                      to={item.href}
                      className={linkClasses}
                      style={pillStyle}
                      aria-label={item.ariaLabel || item.label}
                      aria-current={active ? "page" : undefined}
                      onMouseEnter={() => handleEnter(index)}
                      onMouseLeave={() => handleLeave(index)}
                    >
                      {content}
                    </Link>
                  ) : (
                    <a
                      role="menuitem"
                      href={item.href}
                      className={linkClasses}
                      style={pillStyle}
                      aria-label={item.ariaLabel || item.label}
                      onMouseEnter={() => handleEnter(index)}
                      onMouseLeave={() => handleLeave(index)}
                    >
                      {content}
                    </a>
                  )}
                </li>
              );
            })}
          </ul>
        </div>

        {/* Right-side Dock / Icons */}
        <div className="relative z-20 hidden shrink-0 items-center md:flex">
          {rightElement}
        </div>

        {/* Mobile Hamburger */}
        <button
          ref={hamburgerRef}
          type="button"
          onClick={toggleMobileMenu}
          aria-label={
            isMobileMenuOpen ? "Close menu" : "Open menu"
          }
          aria-expanded={isMobileMenuOpen}
          className="
            relative z-20 flex h-11 w-11
            flex-col items-center justify-center
            gap-[5px] rounded-full
            border border-[#E4E2D8]
            bg-[#F8F7F2]
            shadow-sm
            transition-colors duration-300
            hover:bg-[#EEEDE5]
            md:hidden
          "
        >
          <span className="hamburger-line h-[1.5px] w-[17px] rounded-full bg-[#243B32]" />
          <span className="hamburger-line h-[1.5px] w-[17px] rounded-full bg-[#243B32]" />
        </button>
      </nav>

      {/* Mobile Navigation */}
      <div
        ref={mobileMenuRef}
        className="
          absolute left-4 right-4 top-[76px]
          z-[998] origin-top
          rounded-[24px]
          border border-[#E7E5DC]
          bg-[#F8F7F2]
          p-2
          shadow-[0_12px_40px_rgba(36,59,50,0.12)]
          backdrop-blur-xl
          md:hidden
        "
        style={{
          visibility: "hidden",
          opacity: 0,
        }}
      >
        <ul className="m-0 flex list-none flex-col gap-1 p-0">
          {items.map((item) => {
            const active = isActive(item.href);

            const linkClasses = `
              flex w-full items-center justify-between
              rounded-full px-5 py-3.5
              text-[12px] font-semibold uppercase
              tracking-[1.2px]
              transition-all duration-200
              ${active
                ? "bg-[#243B32] text-[#F8F7F2]"
                : "bg-transparent text-[#243B32] hover:bg-[#EEEDE5]"
              }
            `;

            const content = (
              <>
                <span>{item.label}</span>
                <span className="text-[15px] opacity-60">↗</span>
              </>
            );

            return (
              <li key={item.href}>
                {isRouterLink(item.href) ? (
                  <Link
                    to={item.href}
                    className={linkClasses}
                    aria-current={active ? "page" : undefined}
                    onClick={closeMobileMenu}
                  >
                    {content}
                  </Link>
                ) : (
                  <a
                    href={item.href}
                    className={linkClasses}
                    onClick={closeMobileMenu}
                  >
                    {content}
                  </a>
                )}
              </li>
            );
          })}
        </ul>

        {/* Mobile right-side actions */}
        {rightElement && (
          <div className="mt-2 border-t border-[#E7E5DC] px-3 py-3">
            {rightElement}
          </div>
        )}
      </div>
    </div>
  );
};

export default PillNav;
