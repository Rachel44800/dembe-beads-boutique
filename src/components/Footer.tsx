 
import { useNavigate } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();
  return (
    <footer className="border-t border-border bg-gradient-to-br from-secondary/30 via-primary/20 to-accent/20 py-6 sm:py-8">
      <div className="container mx-auto px-4 sm:px-6 text-foreground">
        <div className="grid gap-6 sm:gap-8">
          <div>
            <ul className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm">
              <li>
                <button 
                  onClick={() => navigate("/about")}
                  className="text-foreground hover-brand-text hover-brand-underline transition-colors"
                >
                  About Us
                </button>
              </li>
              <li>
                <button 
                  onClick={() => navigate("/contact")}
                  className="text-foreground hover-brand-text hover-brand-underline transition-colors"
                >
                  Contact Us
                </button>
              </li>
              <li>
                <button 
                  onClick={() => navigate('/shipping')}
                  className="text-foreground hover-brand-text hover-brand-underline transition-colors"
                >
                  Shipping & Payment Info
                </button>
              </li>
              <li>
                <button 
                  onClick={() => navigate('/privacy')}
                  className="text-foreground hover-brand-text hover-brand-underline transition-colors"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button 
                  onClick={() => navigate('/terms')}
                  className="text-foreground hover-brand-text hover-brand-underline transition-colors"
                >
                  Terms & Conditions
                </button>
              </li>
              <li>
                <button 
                  onClick={() => navigate('/returns')}
                  className="text-foreground hover-brand-text hover-brand-underline transition-colors"
                >
                  Return Policy
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-2 sm:mt-3 pt-2 sm:pt-3 text-center text-xs sm:text-sm text-muted-foreground">
          <p>&copy; 2025 Dembe Beads. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
