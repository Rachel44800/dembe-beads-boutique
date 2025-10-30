import { Link, useLocation } from "react-router-dom";

const links = [
  { to: "/shipping", label: "Shipping & Payment" },
  { to: "/returns", label: "Return Policy" },
  { to: "/terms", label: "Terms & Conditions" },
  { to: "/privacy", label: "Privacy Policy" },
];

const PolicyNav = () => {
  const { pathname } = useLocation();

  return (
    <nav className="w-full">
      <ul className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-sm">
        {links.map((l, idx) => (
          <li key={l.to} className="flex items-center">
            <Link
              to={l.to}
              className={
                pathname === l.to
                  ? "font-semibold text-foreground"
                  : "text-muted-foreground hover:text-primary transition-colors"
              }
            >
              {l.label}
            </Link>
            {idx < links.length - 1 && (
              <span className="mx-2 text-muted-foreground/60">|</span>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default PolicyNav;


