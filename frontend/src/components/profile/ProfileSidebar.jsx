
import { Link } from "react-router-dom"
import {
  Package,
  MapPin,
  CreditCard,
  User,
  LogOut,
  Store,
  ArrowUpRight,
} from "lucide-react"
import { useAuthStore } from "@/store/useAuthStore"

const ProfileSidebar = ({ activeTab, setActiveTab }) => {
  const { logout } = useAuthStore()

  const menuItems = [
    { id: "orders", label: "My Orders", icon: Package },
    { id: "addresses", label: "Saved Addresses", icon: MapPin },
    { id: "payment", label: "Payment Methods", icon: CreditCard },
    { id: "account", label: "Account Details", icon: User },
  ]

  return (
    <aside className="relative z-30 flex h-full w-64 shrink-0 flex-col overflow-hidden border-r border-[#e7eae3] bg-[#f8f6f0]">

      {/* Brand */}
      <div className="flex h-24 shrink-0 items-center justify-center border-b border-[#e7eae3] px-6">
        <Link
          to="/"
          className="flex items-center justify-center transition-opacity duration-300 hover:opacity-75"
        >
          <img
            src="/beliefCosmetics.png"
            alt="Belief Cosmetics"
            className="h-12 w-auto object-contain"
          />
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-4 py-8">

        <div className="mb-5 px-3">
          <span className="font-sans text-[9px] font-semibold uppercase tracking-[0.25em] text-[#879188]">
            Your Space
          </span>

          <h2 className="mt-2 font-editorial text-2xl text-[#172b27]">
            My Account
          </h2>
        </div>

        <div className="space-y-1.5">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = activeTab === item.id

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveTab(item.id)}
                aria-current={isActive ? "page" : undefined}
                className={`group relative flex w-full items-center gap-3.5 rounded-sm px-4 py-3.5 text-left transition-all duration-300 ${isActive
                    ? "bg-[#172b27] text-[#f8f6f0] shadow-sm"
                    : "text-[#718078] hover:bg-[#e9eee8] hover:text-[#172b27]"
                  }`}
              >
                <Icon
                  size={17}
                  strokeWidth={1.6}
                  className={`shrink-0 transition-colors duration-300 ${isActive
                      ? "text-[#dce5d9]"
                      : "text-[#879188] group-hover:text-[#294b40]"
                    }`}
                />

                <span className="font-sans text-[11px] font-medium tracking-wide">
                  {item.label}
                </span>

                {isActive && (
                  <span className="ml-auto h-1.5 w-1.5 rounded-full bg-[#c5d5c3]" />
                )}
              </button>
            )
          })}
        </div>
      </nav>

      {/* Bottom Actions */}
      <div className="shrink-0 border-t border-[#e7eae3] px-4 py-5">

        <button
          type="button"
          onClick={logout}
          className="group flex w-full items-center gap-3 rounded-sm px-4 py-3 text-[#879188] transition-all duration-300 hover:bg-[#f1e9e5] hover:text-[#9b5145]"
        >
          <LogOut
            size={17}
            strokeWidth={1.6}
            className="transition-transform duration-300 group-hover:-translate-x-0.5"
          />

          <span className="font-sans text-[11px] font-medium tracking-wide">
            Log Out
          </span>
        </button>

        <Link
          to="/"
          className="group mt-2 flex w-full items-center justify-between border border-[#dfe4dc] px-4 py-3.5 text-[#294b40] transition-all duration-300 hover:border-[#294b40] hover:bg-[#e9eee8]"
        >
          <span className="flex items-center gap-3">
            <Store size={17} strokeWidth={1.6} />

            <span className="font-sans text-[10px] font-semibold uppercase tracking-[0.15em]">
              Continue Shopping
            </span>
          </span>

          <ArrowUpRight
            size={15}
            className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          />
        </Link>

        <p className="mt-5 text-center font-sans text-[8px] uppercase tracking-[0.2em] text-[#a1aaa1]">
          Belief Cosmetics
        </p>
      </div>
    </aside>
  )
}

export default ProfileSidebar
