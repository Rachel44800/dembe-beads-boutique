import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import heroBackground from "@/assets/hero-background.jpg";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate();


  return (
    <section id="home" className="relative overflow-hidden min-h-screen flex items-center">
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroBackground})` }}
      />
      <div className="absolute inset-0 bg-black/30" />
      
      <div className="container mx-auto px-4 sm:px-6 relative z-10 py-20">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="mb-4 sm:mb-6 text-3xl font-bold tracking-tight text-foreground drop-shadow-lg sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl">
            Handcrafted Elegance in Every Bead
          </h1>
          <p className="mb-6 sm:mb-8 text-base text-foreground/90 drop-shadow-md sm:text-lg md:text-xl px-2">
            Discover our collection of exquisite handmade beaded accessories. 
            From statement necklaces to elegant bags, each piece tells a unique story.
          </p>
          <div className="flex flex-col gap-3 sm:gap-4 sm:flex-row sm:justify-center">
            <Button size="lg" className="rounded-full px-6 sm:px-8 shadow-lg text-base sm:text-lg" onClick={() => navigate('/shop')}>
              Shop Collection
              <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
            <Button size="lg" variant="secondary" className="rounded-full px-6 sm:px-8 shadow-lg text-base sm:text-lg" onClick={() => navigate('/about')}>
              Learn Our Story
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
