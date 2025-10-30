import { createContext, useContext, useEffect, useRef, useState, ReactNode } from "react";
import { useLocation } from "react-router-dom";

type RouteHistoryContextValue = {
  previousPathname: string | null;
  currentPathname: string;
};

const RouteHistoryContext = createContext<RouteHistoryContextValue | undefined>(undefined);

export const RouteHistoryProvider = ({ children }: { children: ReactNode }) => {
  const location = useLocation();
  const [previousPathname, setPreviousPathname] = useState<string | null>(null);
  const currentPathRef = useRef<string>(location.pathname);

  useEffect(() => {
    if (location.pathname !== currentPathRef.current) {
      setPreviousPathname(currentPathRef.current);
      currentPathRef.current = location.pathname;
    }
  }, [location.pathname]);

  return (
    <RouteHistoryContext.Provider
      value={{ previousPathname, currentPathname: location.pathname }}
    >
      {children}
    </RouteHistoryContext.Provider>
  );
};

export const useRouteHistory = (): RouteHistoryContextValue => {
  const ctx = useContext(RouteHistoryContext);
  if (!ctx) throw new Error("useRouteHistory must be used within RouteHistoryProvider");
  return ctx;
};


