
import { Link } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Mail,
  Store,
  BarChart2,
  ChevronRight,
} from "lucide-react";

const AdminSidebar = ({ currentSection, setCurrentSection }) => {
  const menuItems = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "products", label: "Products", icon: Package },
    { id: "orders", label: "Orders", icon: ShoppingCart },
    { id: "customers", label: "Customers", icon: Users },
    { id: "messages", label: "Messages", icon: Mail },
  ];

  const analyzerItem = {
    id: "skin-analyzer",
    label: "Skin Analyzer Insights",
    icon: BarChart2,
  };

  const renderMenuItem = (item) => {
    const Icon = item.icon;
    const isActive = currentSection === item.id;

    return (
      <button
        key={item.id}
        type="button"
        onClick={() => setCurrentSection(item.id)}
        className={`
          group flex w-full items-center gap-3
          rounded-xl px-3.5 py-3
          text-left font-sans text-[13px] font-medium
          transition-all duration-300
          ${isActive
            ? "bg-[#172B27] text-[#F8F6F0] shadow-[0_5px_15px_rgba(23,43,39,0.12)]"
            : "text-[#68766D] hover:bg-[#EDEFE8] hover:text-[#172B27]"
          }
        `}
      >
        <Icon
          size={18}
          strokeWidth={1.7}
          className={`
            shrink-0 transition-colors duration-300
            ${isActive
              ? "text-[#F8F6F0]"
              : "text-[#849489] group-hover:text-[#294B40]"
            }
          `}
        />

        <span className="flex-1">{item.label}</span>

        {isActive && (
          <span className="h-1.5 w-1.5 rounded-full bg-[#B9C9B9]" />
        )}

        {!isActive && (
          <ChevronRight
            size={14}
            className="opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:opacity-60"
          />
        )}
      </button>
    );
  };

  return (
    <aside className="
      sticky left-0 top-0 z-30
      flex h-screen w-64 shrink-0
      flex-col overflow-hidden
      border-r border-[#E7EAE3]
      bg-[#F8F6F0]
    ">

      {/* Logo */}
      <div className="flex h-24 shrink-0 items-center justify-center border-b border-[#E7EAE3] px-5">
        <Link
          to="/"
          className="flex items-center justify-center"
          aria-label="Belief Cosmetics homepage"
        >
          <img
            src="/beliefCosmetics.png"
            alt="Belief Cosmetics"
            className="h-12 w-auto object-contain"
          />
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-8 overflow-y-auto px-4 py-7">

        {/* Main Menu */}
        <div>
          <div className="mb-3 flex items-center justify-between px-3">
            <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.2em] text-[#929B91]">
              Main Menu
            </p>
            <span className="h-px w-8 bg-[#E0E4DC]" />
          </div>

          <div className="space-y-1">
            {menuItems.map(renderMenuItem)}
          </div>
        </div>

        {/* Analytics */}
        <div>
          <div className="mb-3 flex items-center justify-between px-3">
            <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.2em] text-[#929B91]">
              Analytics
            </p>
            <span className="h-px w-8 bg-[#E0E4DC]" />
          </div>

          <div className="space-y-1">
            {renderMenuItem(analyzerItem)}
          </div>
        </div>
      </nav>

      {/* Footer */}
      <div className="shrink-0 border-t border-[#E7EAE3] bg-[#F4F2EA] p-4">
        <Link
          to="/"
          className="
            group flex w-full items-center justify-center
            gap-2.5 rounded-full
            border border-[#DDE2D9]
            bg-transparent px-4 py-3
            font-sans text-[11px] font-semibold
            uppercase tracking-[0.1em]
            text-[#294B40]
            transition-all duration-300
            hover:border-[#172B27]
            hover:bg-[#172B27]
            hover:text-[#F8F6F0]
          "
        >
          <Store size={16} strokeWidth={1.7} />
          <span>Back to Shop</span>
          <ChevronRight
            size={14}
            className="transition-transform duration-300 group-hover:translate-x-1"
          />
        </Link>

        <p className="mt-4 text-center font-sans text-[9px] tracking-[0.12em] text-[#A0A69F]">
          BELIEF COSMETICS · ADMIN
        </p>
      </div>
    </aside>
  );
};

export default AdminSidebar;
