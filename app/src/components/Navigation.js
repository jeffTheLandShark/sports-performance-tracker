import { Link, useLocation } from "react-router-dom";

export default function Navigation({ className }) {
  const location = useLocation();

  const isActive = (path) =>
    location.pathname === path
      ? "bg-sidebar-accent text-sidebar-accent-foreground"
      : "text-sidebar-foreground hover:bg-sidebar-accent/50";

  return (
    <nav className={`${className || ""} p-4 space-y-2`}>
      <Link
        to="/"
        className={`flex items-center gap-3 px-4 py-2 rounded-md transition-colors ${isActive(
          "/",
        )}`}
      >
        <span>📊</span>
        <span>Dashboard</span>
      </Link>
      <Link
        to="/create"
        className={`flex items-center gap-3 px-4 py-2 rounded-md transition-colors ${isActive(
          "/create",
        )}`}
      >
        <span>➕</span>
        <span>Log Performance</span>
      </Link>
      <Link
        to="/archive"
        className={`flex items-center gap-3 px-4 py-2 rounded-md transition-colors ${isActive(
          "/archive",
        )}`}
      >
        <span>📁</span>
        <span>All Performances</span>
      </Link>
    </nav>
  );
}
