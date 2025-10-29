import { Instagram, Facebook, Mail, Phone } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();
  return (
    <footer className="border-t border-border bg-gradient-to-br from-accent/20 to-secondary/10 py-8 sm:py-12">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid gap-6 sm:gap-8 sm:grid-cols-2 md:grid-cols-4">
          <div className="sm:col-span-2">
            <div className="mb-4 flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-secondary" />
              <h3 className="text-lg font-semibold text-foreground">
                Dembe Beads Boutique
              </h3>
            </div>
            <p className="mb-4 text-sm text-muted-foreground">
              Handcrafted beaded accessories made with love and care. 
              Each piece is unique and tells its own story.
            </p>
            <div className="flex gap-4">
              <a 
                href="https://instagram.com" 
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a 
                href="https://facebook.com" 
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a 
                href="mailto:info@dembebeads.com"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
              >
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="mb-4 font-semibold text-foreground">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button 
                  onClick={() => navigate("/")}
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Home
                </button>
              </li>
              <li>
                <button 
                  onClick={() => navigate("/shop")}
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Shop
                </button>
              </li>
              <li>
                <button 
                  onClick={() => navigate("/about")}
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  About Us
                </button>
              </li>
              <li>
                <button 
                  onClick={() => navigate("/contact")}
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Contact
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-semibold text-foreground">Contact Us</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <a href="mailto:info@dembebeads.com" className="hover:text-primary transition-colors">
                  info@dembebeads.com
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span>+1 (555) 123-4567</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-6 sm:mt-8 border-t border-border pt-6 sm:pt-8 text-center text-xs sm:text-sm text-muted-foreground">
          <p>&copy; 2025 Dembe Beads Boutique. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
