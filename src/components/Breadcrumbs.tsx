import { Link, useLocation } from "react-router-dom";
import { useRouteHistory } from "@/contexts/RouteHistoryContext";
import { products } from "@/data/products";

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

const getProductName = (pathname: string): string | null => {
  const match = pathname.match(/^\/product\/(\d+)$/);
  if (match) {
    const product = products.find((p: any) => p.id === Number(match[1]));
    return product ? product.name : "Product";
  }
  return null;
};

const getLabel = (path: string) => {
  if (pathToLabel[path]) return pathToLabel[path];
  const productName = getProductName(path);
  if (productName) return productName;
  return path.replace(/^\//, "").split("/")[0] || "Home";
};

const Breadcrumbs = () => {
  const { previousPathname } = useRouteHistory();
  const location = useLocation();
  const currentPath = location.pathname;

  // For product pages, always show Shop as the previous path
  const isProductPage = currentPath.startsWith("/product/");
  const prev = isProductPage ? "/shop" : (previousPathname ?? "/");

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


