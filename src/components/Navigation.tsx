import { ShoppingCart, UserCircle, Search, AlignJustify } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
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

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };


  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-4">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="shrink-0 h-9 w-9 sm:h-10 sm:w-10 hover-brand-bg">
                  <AlignJustify className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px]">
                <SheetHeader>
                  <SheetTitle className="text-left">Menu</SheetTitle>
                </SheetHeader>
                <div className="mt-8 flex flex-col gap-4">
                  <button 
                    onClick={() => navigate("/")} 
                    className="text-left text-lg font-medium text-foreground hover-brand-text hover-brand-underline py-2"
                  >
                    Home
                  </button>
                  <button 
                    onClick={() => navigate("/shop", { state: { from: "home" } })} 
                    className="text-left text-lg font-medium text-foreground hover-brand-text hover-brand-underline py-2"
                  >
                    Shop
                  </button>
                  <button 
                    onClick={() => navigate("/about")} 
                    className="text-left text-lg font-medium text-foreground hover-brand-text hover-brand-underline py-2"
                  >
                    About
                  </button>
                  <button 
                    onClick={() => navigate("/contact")} 
                    className="text-left text-lg font-medium text-foreground hover-brand-text hover-brand-underline py-2"
                  >
                    Contact
                  </button>
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
            <Button variant="ghost" size="icon" className="rounded-full h-9 w-9 sm:h-10 sm:w-10 hover-brand-bg">
              <Search className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
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
