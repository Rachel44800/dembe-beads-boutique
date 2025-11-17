import { ShoppingCart, UserCircle, Search, AlignJustify, X, Home, Store, Info, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useCart } from "@/hooks/useCart";
import { Cart } from "@/components/Cart";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const Navigation = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const { itemCount } = useCart();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Close search when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchOpen && searchContainerRef.current) {
        const target = event.target as Node;
        if (!searchContainerRef.current.contains(target)) {
          setSearchOpen(false);
          setSearchQuery("");
        }
      }
    };

    if (searchOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [searchOpen]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const handleSearchToggle = () => {
    setSearchOpen(!searchOpen);
    if (!searchOpen) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    } else {
      setSearchQuery("");
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setSearchOpen(false);
      setSearchQuery("");
    }
  };


  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-4">
            <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="shrink-0 h-9 w-9 sm:h-10 sm:w-10 hover-brand-bg">
                  <AlignJustify className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[320px] sm:w-[360px] p-0 bg-gradient-to-br from-blue-50 via-cyan-50 to-sky-50 [&>button]:hidden">
                <div className="relative h-full flex flex-col">
                  {/* Header with gradient */}
                  <div className="relative px-6 pt-8 pb-6 border-b border-gray-200/50">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-cyan-500/5 to-blue-600/5" />
                    <div className="relative flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div>
                          <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                            Dembe Beads
                          </h2>
                          <p className="text-xs text-gray-500 mt-0.5">Navigation Menu</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setMenuOpen(false)}
                        className="group relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 hover:from-blue-600 hover:to-cyan-500 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/25 hover:scale-110 active:scale-95"
                        aria-label="Close menu"
                      >
                        <X className="h-5 w-5 text-gray-600 group-hover:text-white transition-colors duration-300 group-hover:rotate-90" />
                        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-600/0 to-cyan-500/0 group-hover:from-blue-600/20 group-hover:to-cyan-500/20 transition-all duration-300" />
                      </button>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
                    <button 
                      onClick={() => {
                        navigate("/");
                        setMenuOpen(false);
                      }} 
                      className="group w-full flex items-center gap-4 px-4 py-3.5 rounded-xl text-left transition-all duration-300 hover:bg-gradient-to-r hover:from-blue-600 hover:to-cyan-500 hover:shadow-lg hover:shadow-blue-500/25 hover:-translate-x-1"
                    >
                      <div className="flex-shrink-0 h-10 w-10 rounded-lg bg-gradient-to-br from-blue-100 to-cyan-100 group-hover:from-blue-500 group-hover:to-cyan-400 flex items-center justify-center transition-all duration-300">
                        <Home className="h-5 w-5 text-blue-600 group-hover:text-white transition-colors" />
                      </div>
                      <div className="flex-1">
                        <div className="text-base font-semibold text-gray-900 group-hover:text-white transition-colors">
                          Home
                        </div>
                        <div className="text-xs text-gray-500 group-hover:text-white/80 transition-colors">
                          Homepage
                        </div>
                      </div>
                      <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="h-1.5 w-1.5 rounded-full bg-white" />
                      </div>
                    </button>

                    <button 
                      onClick={() => {
                        navigate("/shop", { state: { from: "home" } });
                        setMenuOpen(false);
                      }} 
                      className="group w-full flex items-center gap-4 px-4 py-3.5 rounded-xl text-left transition-all duration-300 hover:bg-gradient-to-r hover:from-blue-600 hover:to-cyan-500 hover:shadow-lg hover:shadow-blue-500/25 hover:-translate-x-1"
                    >
                      <div className="flex-shrink-0 h-10 w-10 rounded-lg bg-gradient-to-br from-blue-100 to-cyan-100 group-hover:from-blue-500 group-hover:to-cyan-400 flex items-center justify-center transition-all duration-300">
                        <Store className="h-5 w-5 text-blue-600 group-hover:text-white transition-colors" />
                      </div>
                      <div className="flex-1">
                        <div className="text-base font-semibold text-gray-900 group-hover:text-white transition-colors">
                          Shop
                        </div>
                        <div className="text-xs text-gray-500 group-hover:text-white/80 transition-colors">
                          Browse all products
                        </div>
                      </div>
                      <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="h-1.5 w-1.5 rounded-full bg-white" />
                      </div>
                    </button>

                    <button 
                      onClick={() => {
                        navigate("/about");
                        setMenuOpen(false);
                      }} 
                      className="group w-full flex items-center gap-4 px-4 py-3.5 rounded-xl text-left transition-all duration-300 hover:bg-gradient-to-r hover:from-blue-600 hover:to-cyan-500 hover:shadow-lg hover:shadow-blue-500/25 hover:-translate-x-1"
                    >
                      <div className="flex-shrink-0 h-10 w-10 rounded-lg bg-gradient-to-br from-blue-100 to-cyan-100 group-hover:from-blue-500 group-hover:to-cyan-400 flex items-center justify-center transition-all duration-300">
                        <Info className="h-5 w-5 text-blue-600 group-hover:text-white transition-colors" />
                      </div>
                      <div className="flex-1">
                        <div className="text-base font-semibold text-gray-900 group-hover:text-white transition-colors">
                          About
                        </div>
                        <div className="text-xs text-gray-500 group-hover:text-white/80 transition-colors">
                          Our story & mission
                        </div>
                      </div>
                      <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="h-1.5 w-1.5 rounded-full bg-white" />
                      </div>
                    </button>

                    <button 
                      onClick={() => {
                        navigate("/contact");
                        setMenuOpen(false);
                      }} 
                      className="group w-full flex items-center gap-4 px-4 py-3.5 rounded-xl text-left transition-all duration-300 hover:bg-gradient-to-r hover:from-blue-600 hover:to-cyan-500 hover:shadow-lg hover:shadow-blue-500/25 hover:-translate-x-1"
                    >
                      <div className="flex-shrink-0 h-10 w-10 rounded-lg bg-gradient-to-br from-blue-100 to-cyan-100 group-hover:from-blue-500 group-hover:to-cyan-400 flex items-center justify-center transition-all duration-300">
                        <Mail className="h-5 w-5 text-blue-600 group-hover:text-white transition-colors" />
                      </div>
                      <div className="flex-1">
                        <div className="text-base font-semibold text-gray-900 group-hover:text-white transition-colors">
                          Contact
                        </div>
                        <div className="text-xs text-gray-500 group-hover:text-white/80 transition-colors">
                          Get in touch with us
                        </div>
                      </div>
                      <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="h-1.5 w-1.5 rounded-full bg-white" />
                      </div>
                    </button>
                  </div>

                  {/* Footer */}
                  <div className="px-6 py-4 border-t border-gray-200/50">
                    <div className="text-xs text-gray-500 text-center">
                      <p>© 2025 Dembe Beads</p>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>

            <h1 
              className="text-sm sm:text-base md:text-lg lg:text-xl font-semibold text-foreground cursor-pointer"
              onClick={() => navigate("/")}
            >
              Dembe Beads
            </h1>
          </div>

          <div className="flex items-center gap-1 sm:gap-2">
            {/* Search Toggle - Inline in Navigation */}
            <div ref={searchContainerRef} className="relative flex items-center">
              {!searchOpen ? (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="rounded-full h-9 w-9 sm:h-10 sm:w-10 hover-brand-bg transition-all"
                  onClick={handleSearchToggle}
                >
                  <Search className="h-4 w-4 sm:h-5 sm:w-5 transition-transform duration-200" />
                </Button>
              ) : (
                <form 
                  onSubmit={handleSearch}
                  className="flex items-center gap-2 bg-white rounded-lg shadow-lg border border-gray-200 px-3 py-1.5 min-w-[200px] sm:min-w-[280px] md:min-w-[320px] animate-in fade-in slide-in-from-right-2 duration-200"
                >
                  <Search className="h-4 w-4 text-gray-400 flex-shrink-0" />
                  <Input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={handleSearchKeyDown}
                    className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 h-8 text-sm px-0"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 rounded-full hover:bg-gray-100 flex-shrink-0"
                    onClick={() => {
                      setSearchQuery("");
                      setSearchOpen(false);
                    }}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </form>
              )}
            </div>
            {user ? (
              <Button variant="ghost" size="icon" onClick={() => navigate("/profile")} className="rounded-full h-9 w-9 sm:h-10 sm:w-10 hover-brand-bg">
                <UserCircle className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
            ) : (
              <Button variant="ghost" size="icon" onClick={() => navigate("/auth")} className="rounded-full h-9 w-9 sm:h-10 sm:w-10 hover-brand-bg">
                <UserCircle className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
            )}
            <Button variant="ghost" size="icon" className="rounded-full relative h-9 w-9 sm:h-10 sm:w-10 hover-brand-bg" onClick={() => setCartOpen(true)}>
              <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 sm:h-5 sm:w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-medium">
                  {itemCount}
                </span>
              )}
            </Button>
          </div>
        </div>
      </div>
      <Cart open={cartOpen} onOpenChange={setCartOpen} />
    </nav>
  );
};

export default Navigation;
