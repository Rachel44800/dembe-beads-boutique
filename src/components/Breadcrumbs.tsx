import { Link, useLocation } from "react-router-dom";
import { useRouteHistory } from "@/contexts/RouteHistoryContext";

const pathToLabel: Record<string, string> = {
  "/": "Home",
  "/shop": "Shop",
  "/about": "About",
  "/contact": "Contact",
  "/checkout": "Checkout",
  "/profile": "Profile",
  "/auth": "Sign In",
  "/shipping": "Shipping & Payment",
  "/returns": "Return Policy",
  "/terms": "Terms & Conditions",
  "/privacy": "Privacy Policy",
};

const getLabel = (path: string) => (pathToLabel[path] ?? path.replace(/^\//, "").split("/")[0]) || "Home";

const Breadcrumbs = () => {
  const { previousPathname } = useRouteHistory();
  const location = useLocation();
  const currentPath = location.pathname;

  const prev = previousPathname ?? "/";

  return (
    <nav className="text-xs sm:text-sm text-muted-foreground" aria-label="Breadcrumb">
      <ol className="flex items-center gap-1">
        <li>
          <Link to={prev} className="hover:text-primary">
            {getLabel(prev)}
          </Link>
        </li>
        <li>/</li>
        <li className="text-foreground">{getLabel(currentPath)}</li>
      </ol>
    </nav>
  );
};

export default Breadcrumbs;


