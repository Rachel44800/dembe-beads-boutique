import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import heroBackground from "@/assets/hero-background.jpg";
import heroPortrait from "@/assets/hero-portrait.jpg";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const LINE_1 = "Handcrafted Elegance";
const LINE_2 = "in Every Bead.";

const Hero = () => {
  const navigate = useNavigate();
  const [displayedLine1, setDisplayedLine1] = useState("");
  const [displayedLine2, setDisplayedLine2] = useState("");
  const [isTypingComplete, setIsTypingComplete] = useState(false);

  useEffect(() => {
    let line1Index = 0;
    let line2Index = 0;
    let isLine1Complete = false;
    let pauseCount = 0;
    
    const typingInterval = setInterval(() => {
      if (!isLine1Complete) {
        // Type first line
        if (line1Index < LINE_1.length) {
          setDisplayedLine1(LINE_1.slice(0, line1Index + 1));
          line1Index++;
        } else {
          // Pause before starting second line (3 ticks = 300ms)
          if (pauseCount < 3) {
            pauseCount++;
          } else {
            isLine1Complete = true;
          }
        }
      } else {
        // Type second line
        if (line2Index < LINE_2.length) {
          setDisplayedLine2(LINE_2.slice(0, line2Index + 1));
          line2Index++;
        } else {
          setIsTypingComplete(true);
          clearInterval(typingInterval);
        }
      }
    }, 100); // Adjust speed here (lower = faster)

    return () => clearInterval(typingInterval);
  }, []);

  return (
    <section id="home" className="relative overflow-hidden min-h-screen flex flex-col justify-center items-center">
      {/* Images Container - Stacked on mobile, side-by-side on desktop */}
      <div className="absolute inset-0 flex flex-col md:flex-row">
        {/* Left Image (Portrait) */}
        <div className="w-full md:w-1/2 h-1/2 md:h-full relative overflow-hidden">
          <img
            src={heroPortrait}
                  alt="Dembe Beads Portrait"
            className="w-full h-full object-cover object-center"
          />
        </div>
        {/* Right Image (Background/Landscape) */}
        <div className="w-full md:w-1/2 h-1/2 md:h-full relative overflow-hidden">
          <img
            src={heroBackground}
                  alt="Dembe Beads Background"
            className="w-full h-full object-cover object-center"
          />
        </div>
      </div>
      
      {/* Dark overlay for text readability */}
      <div className="absolute inset-0 bg-black/40 md:bg-black/30" />
      
      {/* Content */}
      <div className="container mx-auto px-4 sm:px-6 relative z-10 pt-32 sm:pt-40 md:pt-52 lg:pt-64 pb-16 sm:pb-20 md:pb-24 lg:pb-32">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="mb-4 sm:mb-6 text-2xl font-bold tracking-tight text-white drop-shadow-lg sm:text-3xl md:text-4xl lg:text-5xl">
            <div>
              {displayedLine1}
              {displayedLine1.length === LINE_1.length && displayedLine2.length === 0 && <span className="animate-pulse">|</span>}
            </div>
            <div>
              {displayedLine2}
              {!isTypingComplete && <span className="animate-pulse">|</span>}
            </div>
          </h1>
          <p className="mb-6 sm:mb-8 text-base text-white/90 drop-shadow-md sm:text-lg md:text-xl px-2">
            Discover our collection of exquisite handmade beaded accessories. 
            From statement necklaces to elegant bags, each piece tells a unique story.
          </p>
          <div className="flex justify-center">
            <Button size="lg" variant="outline" className="rounded-md px-6 sm:px-8 text-base sm:text-lg bg-white/10 text-white border-white backdrop-blur-sm hover:bg-white hover:text-foreground" onClick={() => navigate('/shop')}>
              Shop Collection
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
