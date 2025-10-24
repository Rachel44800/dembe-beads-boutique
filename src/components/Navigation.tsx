import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";

const Navigation = () => {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-secondary" />
            <h1 className="text-xl font-semibold text-foreground">
              Dembe Beads Boutique
            </h1>
          </div>
          
          <div className="hidden md:flex items-center gap-8">
            <a href="#home" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
              Home
            </a>
            <a href="#products" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
              Products
            </a>
            <a href="#about" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
              About
            </a>
            <a href="#contact" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
              Contact
            </a>
          </div>

          <Button variant="default" size="sm" className="rounded-full">
            <ShoppingBag className="h-4 w-4 mr-2" />
            Cart
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
