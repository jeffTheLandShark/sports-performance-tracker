import { Link, useLocation } from "react-router-dom";

export default function Navigation({ className }) {
  const location = useLocation();

  const isActive = (path) =>
    location.pathname === path
      ? "bg-slate-900 text-white shadow-md"
      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900";

  const navItems = [
    { to: "/", icon: "📊", label: "Dashboard" },
    { to: "/create", icon: "➕", label: "Log Performance" },
    { to: "/archive", icon: "📁", label: "All Performances" },
  ];

  return (
    <nav className={`${className || ""} p-3 md:p-4`}>
      <p className="mb-3 px-2 text-xs font-semibold uppercase tracking-[0.11em] text-slate-400">
        Navigation
      </p>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 md:grid-cols-1">
        {navItems.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className={`group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all ${isActive(
              item.to,
            )}`}
          >
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-white/70 text-base shadow-sm transition-all group-hover:scale-105">
              {item.icon}
            </span>
            <span>{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
