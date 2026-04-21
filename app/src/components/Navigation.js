import { SideNav, SideNavItem } from "@leafygreen-ui/side-nav";
import { Link, useLocation } from "react-router-dom";

export default function Navigation({ className }) {
  const location = useLocation();

  return (
    <SideNav aria-label="Navigation Bar" className={className}>
      <SideNavItem
        aria-label="Home"
        as={Link}
        active={location.pathname === "/"}
        to="/"
      >
        Dashboard
      </SideNavItem>
      <SideNavItem
        aria-label="Log Performance"
        as={Link}
        active={location.pathname === "/create"}
        to="/create"
      >
        Log Performance
      </SideNavItem>
      <SideNavItem
        aria-label="All Performances"
        as={Link}
        active={location.pathname === "/archive"}
        to="/archive"
      >
        All Performances
      </SideNavItem>
    </SideNav>
  );
}
