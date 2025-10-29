import { ShoppingBag, User, Search, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useCart } from "@/hooks/useCart";
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

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="shrink-0">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px]">
              <SheetHeader>
                <SheetTitle className="text-left">Menu</SheetTitle>
              </SheetHeader>
              <div className="mt-8 flex flex-col gap-4">
                <button 
                  onClick={() => scrollToSection("home")} 
                  className="text-left text-lg font-medium text-foreground hover:text-primary transition-colors py-2"
                >
                  Home
                </button>
                <button 
                  onClick={() => navigate("/shop")} 
                  className="text-left text-lg font-medium text-foreground hover:text-primary transition-colors py-2"
                >
                  Shop
                </button>
                <button 
                  onClick={() => scrollToSection("products")} 
                  className="text-left text-lg font-medium text-foreground hover:text-primary transition-colors py-2"
                >
                  Featured
                </button>
                <button 
                  onClick={() => scrollToSection("about")} 
                  className="text-left text-lg font-medium text-foreground hover:text-primary transition-colors py-2"
                >
                  About
                </button>
                <button 
                  onClick={() => scrollToSection("contact")} 
                  className="text-left text-lg font-medium text-foreground hover:text-primary transition-colors py-2"
                >
                  Contact
                </button>
              </div>
            </SheetContent>
          </Sheet>

          <h1 
            className="absolute left-1/2 transform -translate-x-1/2 text-lg md:text-xl font-semibold text-foreground cursor-pointer"
            onClick={() => navigate("/")}
          >
            Dembe Beads Boutique
          </h1>

          <div className="flex items-center gap-1 md:gap-2">
            <Button variant="ghost" size="icon" className="rounded-full">
              <Search className="h-5 w-5" />
            </Button>
            {user ? (
              <Button variant="ghost" size="icon" onClick={() => navigate("/profile")} className="rounded-full">
                <User className="h-5 w-5" />
              </Button>
            ) : (
              <Button variant="ghost" size="icon" onClick={() => navigate("/auth")} className="rounded-full">
                <User className="h-5 w-5" />
              </Button>
            )}
            <Button variant="ghost" size="icon" className="rounded-full relative" onClick={() => navigate("/shop")}>
              <ShoppingBag className="h-5 w-5" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-medium">
                  {itemCount}
                </span>
              )}
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
