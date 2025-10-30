 
import { useNavigate } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();
  return (
    <footer className="border-t border-border bg-black py-6 sm:py-8">
      <div className="container mx-auto px-4 sm:px-6 text-white">
        <div className="grid gap-6 sm:gap-8">
          <div>
            <ul className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm">
              <li>
                <button 
                  onClick={() => navigate("/about")}
                  className="text-white/90 hover:text-white transition-colors"
                >
                  About Us
                </button>
              </li>
              <li>
                <button 
                  onClick={() => navigate("/contact")}
                  className="text-white/90 hover:text-white transition-colors"
                >
                  Contact Us
                </button>
              </li>
              <li>
                <button 
                  onClick={() => navigate('/shipping')}
                  className="text-white/90 hover:text-white transition-colors"
                >
                  Shipping & Payment Info
                </button>
              </li>
              <li>
                <button 
                  onClick={() => navigate('/privacy')}
                  className="text-white/90 hover:text-white transition-colors"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button 
                  onClick={() => navigate('/terms')}
                  className="text-white/90 hover:text-white transition-colors"
                >
                  Terms & Conditions
                </button>
              </li>
              <li>
                <button 
                  onClick={() => navigate('/returns')}
                  className="text-white/90 hover:text-white transition-colors"
                >
                  Return Policy
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-2 sm:mt-3 pt-2 sm:pt-3 text-center text-xs sm:text-sm text-white/90">
          <p>&copy; 2025 Dembe Beads. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
