
"use client";

import { Link } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";
import { UserRound, Store, ChevronRight } from "lucide-react";

export default function AdminHeader() {
  const { authUser } = useAuthStore();

  const displayName =
    authUser?.name || authUser?.fullName || "Administrator";

  const initials = displayName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

  return (
    <header className="sticky top-0 z-20 w-full border-b border-[#e7eae3] bg-[#f8f6f0]/95 backdrop-blur-md">
      <div className="flex min-h-[76px] items-center justify-between gap-4 px-5 sm:px-8">

        {/* Brand */}
        <Link
          to="/"
          className="flex shrink-0 items-center gap-3"
          aria-label="Belief Cosmetics home"
        >
          <img
            src="/beliefCosmetics.png"
            alt="Belief Cosmetics"
            className="h-10 w-auto object-contain"
          />

          <span className="hidden h-8 w-px bg-[#dfe4dc] sm:block" />

          <span className="hidden font-editorial text-lg text-[#294b40] sm:block">
            Admin Studio
          </span>
        </Link>

        {/* Right Actions */}
        <div className="flex items-center gap-3 sm:gap-5">

          {/* Store Link */}
          <Link
            to="/"
            className="group inline-flex items-center gap-2 rounded-full border border-[#dfe4dc] px-3 py-2 text-xs font-semibold tracking-wide text-[#294b40] transition-all duration-300 hover:border-[#294b40] hover:bg-[#172b27] hover:text-[#f8f6f0] sm:px-4 sm:text-sm"
          >
            <Store size={15} strokeWidth={1.8} />

            <span>View Store</span>

            <ChevronRight
              size={14}
              className="transition-transform duration-300 group-hover:translate-x-0.5"
            />
          </Link>

          {/* Divider */}
          <div className="hidden h-8 w-px bg-[#dfe4dc] sm:block" />

          {/* Admin Profile */}
          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#879188]">
                Signed in as
              </p>

              <p className="mt-0.5 max-w-[150px] truncate text-sm font-semibold text-[#172b27]">
                {displayName}
              </p>
            </div>

            <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full border border-[#dfe4dc] bg-[#e9eee7] text-sm font-semibold text-[#294b40]">
              {authUser?.profilePicture || authUser?.avatar ? (
                <img
                  src={authUser.profilePicture || authUser.avatar}
                  alt={displayName}
                  className="h-full w-full object-cover"
                />
              ) : initials ? (
                initials
              ) : (
                <UserRound size={18} />
              )}
            </div>
          </div>

        </div>
      </div>
    </header>
  );
}
