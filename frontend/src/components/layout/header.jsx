
import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

import {
  ShoppingBag,
  Heart,
  User,
  LogOut,
  Search,
  X,
  Package,
  LayoutDashboard,
} from "lucide-react";

import { useAuthStore } from "../../store/useAuthStore";
import { useCartStore } from "../../store/useCartStore";

import PillNav from "../ui/PillNav";
import Dock from "../ui/Dock";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const [profileOpen, setProfileOpen] = useState(false);

  const searchInputRef = useRef(null);

  const { authUser, logout } = useAuthStore();
  const { cart, getCart } = useCartStore();

  const navigate = useNavigate();
  const location = useLocation();

  const isHome = location.pathname === "/";
  const cartItemCount = cart?.items?.length || 0;

  // Navigation links
  const navItems = [
    { label: "Products", href: "/products" },
    { label: "Skin Analyzer", href: "/skin-analyzer" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ];

  // Fetch cart
  useEffect(() => {
    if (authUser) {
      getCart();
    }
  }, [authUser, getCart]);

  // Header scroll behaviour
  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const threshold = window.innerHeight * 0.08;

      setIsScrolled(currentScrollY > threshold);

      if (isSearchOpen) {
        setIsVisible(true);
      } else if (
        currentScrollY > lastScrollY &&
        currentScrollY > threshold
      ) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }

      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isSearchOpen]);

  // Search input focus
  useEffect(() => {
    if (isSearchOpen) {
      const timer = setTimeout(() => {
        searchInputRef.current?.focus();
      }, 250);

      return () => clearTimeout(timer);
    }
  }, [isSearchOpen]);

  // Sync search with product URL
  useEffect(() => {
    if (location.pathname === "/products") {
      setSearchValue(
        new URLSearchParams(location.search).get("q") || ""
      );
    }
  }, [location.pathname, location.search]);

  // Search actions
  const openSearch = () => {
    setProfileOpen(false);
    setIsVisible(true);
    setIsSearchOpen(true);
  };

  const closeSearch = () => {
    setIsSearchOpen(false);
    setSearchValue("");
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();

    const query = searchValue.trim();

    if (!query) return;

    navigate(`/products?q=${encodeURIComponent(query)}`);

    setIsSearchOpen(false);
  };

  // Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setIsSearchOpen(false);
        setProfileOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // Logout
  const handleLogout = async () => {
    setProfileOpen(false);

    await logout();

    navigate("/");
  };

  // Dock actions
  const dockItems = [
    {
      icon: <Search className="h-5 w-5" />,
      label: "Search",
      onClick: openSearch,
      className: "rounded-xl bg-[#e9eee6] text-[#172b27]",
    },
    {
      icon: <Heart className="h-5 w-5" />,
      label: "Wishlist",
      onClick: () => navigate("/wishlist"),
      className: "rounded-xl bg-[#e9eee6] text-[#172b27]",
    },
    {
      icon: (
        <div className="relative flex items-center justify-center">
          <ShoppingBag className="h-5 w-5" />

          {cartItemCount > 0 && (
            <span className="
              absolute -right-2 -top-2
              flex h-4 min-w-4 items-center justify-center
              rounded-full bg-[#294b40]
              px-1 text-[9px] font-semibold text-white
            ">
              {cartItemCount}
            </span>
          )}
        </div>
      ),
      label: "Cart",
      onClick: () => navigate("/cart"),
      className: "rounded-xl bg-[#e9eee6] text-[#172b27]",
    },
  ];

  // Header background
  const solidBackground =
    isScrolled || !isHome || isSearchOpen;

  // Desktop and mobile actions
  const rightElement = (
    <>
      {/* Desktop actions */}
      <div className="hidden items-center gap-3 md:flex">
        <Dock
          items={dockItems}
          panelHeight={40}
          baseItemSize={30}
          magnification={60}
          distance={100}
        />

        {/* Account button */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setProfileOpen((prev) => !prev)}
            aria-label="Open account menu"
            aria-expanded={profileOpen}
            className="
              flex h-11 w-11 items-center justify-center
              rounded-full
              border border-[#e7eae3]
              bg-[#f8f6f0]
              text-[#294b40]
              shadow-[0_3px_12px_rgba(23,43,39,0.04)]
              transition-all duration-300
              hover:border-[#718477]
              hover:bg-[#e9eee6]
            "
          >
            {authUser?.avatar ? (
              <img
                src={authUser.avatar}
                alt={authUser.name || "User"}
                className="h-9 w-9 rounded-full object-cover"
              />
            ) : (
              <User className="h-5 w-5" />
            )}
          </button>

          {profileOpen && (
            <>
              <button
                type="button"
                aria-label="Close account menu"
                className="fixed inset-0 z-40 cursor-default"
                onClick={() => setProfileOpen(false)}
              />

              <div className="
                absolute right-0 top-full z-50 mt-4
                w-64 overflow-hidden
                rounded-[20px]
                border border-[#e7eae3]
                bg-[#fffefa]
                shadow-[0_20px_60px_rgba(23,43,39,0.13)]
                animate-in fade-in slide-in-from-top-2 duration-200
              ">
                {authUser ? (
                  <>
                    <div className="border-b border-[#e7eae3] px-5 py-5">
                      <p className="truncate font-editorial text-2xl text-[#172b27]">
                        {authUser.name}
                      </p>

                      <p className="mt-1 truncate font-sans text-xs text-[#879188]">
                        {authUser.email}
                      </p>
                    </div>

                    <div className="p-2">
                      <Link
                        to="/profile"
                        onClick={() => setProfileOpen(false)}
                        className="
                          flex items-center gap-3
                          rounded-xl px-4 py-3
                          font-sans text-sm text-[#34483d]
                          transition-colors hover:bg-[#edf1e9]
                        "
                      >
                        <User className="h-4 w-4" />
                        My Profile
                      </Link>

                      <Link
                        to="/profile"
                        onClick={() => setProfileOpen(false)}
                        className="
                          flex items-center gap-3
                          rounded-xl px-4 py-3
                          font-sans text-sm text-[#34483d]
                          transition-colors hover:bg-[#edf1e9]
                        "
                      >
                        <Package className="h-4 w-4" />
                        My Orders
                      </Link>

                      {authUser.role === "admin" && (
                        <Link
                          to="/admin"
                          onClick={() => setProfileOpen(false)}
                          className="
                            flex items-center gap-3
                            rounded-xl px-4 py-3
                            font-sans text-sm text-[#34483d]
                            transition-colors hover:bg-[#edf1e9]
                          "
                        >
                          <LayoutDashboard className="h-4 w-4" />
                          Admin Dashboard
                        </Link>
                      )}

                      <div className="my-2 h-px bg-[#e7eae3]" />

                      <button
                        type="button"
                        onClick={handleLogout}
                        className="
                          flex w-full items-center gap-3
                          rounded-xl px-4 py-3
                          font-sans text-sm text-red-500
                          transition-colors hover:bg-red-50
                        "
                      >
                        <LogOut className="h-4 w-4" />
                        Log Out
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="p-5">
                    <p className="mb-4 font-editorial text-2xl text-[#172b27]">
                      Welcome to Belief
                    </p>

                    <button
                      type="button"
                      onClick={() => {
                        setProfileOpen(false);
                        navigate("/login");
                      }}
                      className="
                        w-full rounded-full
                        bg-[#172b27] px-5 py-3
                        font-sans text-xs font-semibold
                        uppercase tracking-[0.12em] text-[#f8f6f0]
                        transition-colors hover:bg-[#294b40]
                      "
                    >
                      Sign In
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Mobile actions - displayed inside PillNav mobile menu */}
      <div className="grid grid-cols-3 gap-2 md:hidden">
        <button
          type="button"
          onClick={openSearch}
          className="
            flex flex-col items-center justify-center gap-2
            rounded-xl border border-[#e7eae3]
            bg-[#e9eee6] py-4
            text-[#294b40]
            transition-colors hover:bg-[#dfe8dc]
          "
        >
          <Search className="h-5 w-5" />
          <span className="font-sans text-[11px] font-medium">
            Search
          </span>
        </button>

        <button
          type="button"
          onClick={() => navigate("/wishlist")}
          className="
            flex flex-col items-center justify-center gap-2
            rounded-xl border border-[#e7eae3]
            bg-[#e9eee6] py-4
            text-[#294b40]
            transition-colors hover:bg-[#dfe8dc]
          "
        >
          <Heart className="h-5 w-5" />
          <span className="font-sans text-[11px] font-medium">
            Wishlist
          </span>
        </button>

        <button
          type="button"
          onClick={() => navigate("/cart")}
          className="
            flex flex-col items-center justify-center gap-2
            rounded-xl border border-[#e7eae3]
            bg-[#e9eee6] py-4
            text-[#294b40]
            transition-colors hover:bg-[#dfe8dc]
          "
        >
          <div className="relative">
            <ShoppingBag className="h-5 w-5" />

            {cartItemCount > 0 && (
              <span className="
                absolute -right-2 -top-2
                flex h-4 min-w-4 items-center justify-center
                rounded-full bg-[#294b40]
                px-1 text-[9px] text-white
              ">
                {cartItemCount}
              </span>
            )}
          </div>

          <span className="font-sans text-[11px] font-medium">
            Cart
          </span>
        </button>
      </div>

      {/* Mobile account actions */}
      <div className="mt-4 border-t border-[#e7eae3] pt-4 md:hidden">
        {authUser ? (
          <div className="flex items-center justify-between gap-3">
            <Link
              to="/profile"
              className="flex min-w-0 items-center gap-3"
            >
              {authUser.avatar ? (
                <img
                  src={authUser.avatar}
                  alt={authUser.name || "User"}
                  className="h-10 w-10 rounded-full object-cover"
                />
              ) : (
                <div className="
                  flex h-10 w-10 items-center justify-center
                  rounded-full bg-[#e5ebe3]
                ">
                  <User className="h-5 w-5 text-[#294b40]" />
                </div>
              )}

              <div className="min-w-0">
                <p className="truncate font-sans text-sm font-semibold text-[#172b27]">
                  {authUser.name}
                </p>
                <p className="font-sans text-xs text-[#879188]">
                  My Account
                </p>
              </div>
            </Link>

            <button
              type="button"
              onClick={handleLogout}
              className="
                flex shrink-0 items-center gap-2
                font-sans text-xs font-medium text-red-500
              "
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="
              w-full rounded-full
              bg-[#172b27] px-5 py-3.5
              font-sans text-xs font-semibold
              uppercase tracking-[0.12em] text-[#f8f6f0]
              transition-colors hover:bg-[#294b40]
            "
          >
            Sign In / Create Account
          </button>
        )}
      </div>
    </>
  );

  return (
    <>
      <header
        className={`
          fixed left-0 top-0 z-50
          h-20 w-full
          transition-all duration-500 ease-in-out
          ${isVisible ? "translate-y-0" : "-translate-y-full"}
          ${solidBackground
            ? "border-b border-[#e7eae3]/80 bg-[#f8f6f0]/95 shadow-[0_4px_30px_rgba(23,43,39,0.06)] backdrop-blur-xl"
            : "bg-transparent"
          }
        `}
      >
        {/* Main navigation */}
        <div
          className={`
            absolute inset-0
            transition-all duration-300
            ${isSearchOpen
              ? "invisible opacity-0"
              : "visible opacity-100"
            }
          `}
        >
          <PillNav
            logo="/beliefCosmetics.png"
            logoAlt="Belief Cosmetics"
            items={navItems}
            activeHref={location.pathname}
            rightElement={rightElement}
            baseColor="transparent"
            pillColor="#172b27"
            pillTextColor="#172b27"
            hoveredPillTextColor="#f8f6f0"
            hoverCircleColor="#172b27"
            initialLoadAnimation={false}
            className="!w-full"
          />
        </div>

        {/* Search overlay */}
        <div
          className={`
            absolute inset-0 z-[60]
            flex items-center justify-center
            bg-[#f8f6f0]/95 px-5
            backdrop-blur-2xl
            transition-all duration-500
            md:px-12
            ${isSearchOpen
              ? "visible translate-y-0 opacity-100"
              : "invisible -translate-y-4 opacity-0 pointer-events-none"
            }
          `}
        >
          <form
            onSubmit={handleSearchSubmit}
            className="flex w-full max-w-5xl items-center gap-4 md:gap-6"
          >
            <Search className="h-5 w-5 shrink-0 text-[#718477] md:h-6 md:w-6" />

            <input
              ref={searchInputRef}
              type="text"
              placeholder="What are you looking for?"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="
                min-w-0 flex-1
                border-b border-[#cbd5ca]
                bg-transparent py-3
                font-editorial text-xl text-[#172b27]
                outline-none
                placeholder:text-[#a5aea5]
                transition-colors duration-300
                focus:border-[#294b40]
                md:text-3xl
              "
            />

            <button
              type="submit"
              disabled={!searchValue.trim()}
              className="
                hidden font-sans text-xs font-semibold
                uppercase tracking-[0.18em]
                text-[#536b5c]
                transition-colors hover:text-[#172b27]
                disabled:opacity-40
                sm:block
              "
            >
              Search
            </button>

            <button
              type="button"
              onClick={closeSearch}
              aria-label="Close search"
              className="
                flex h-10 w-10 shrink-0 items-center justify-center
                rounded-full text-[#294b40]
                transition-colors hover:bg-[#e9eee6]
              "
            >
              <X className="h-5 w-5" />
            </button>
          </form>
        </div>
      </header>

      {/* Page spacing */}
      {!isHome && <div className="h-20" />}
    </>
  );
}
