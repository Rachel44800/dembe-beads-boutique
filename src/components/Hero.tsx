import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import heroBackground from "@/assets/hero-background.jpg";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate();

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="home" className="relative overflow-hidden py-20 md:py-32">
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroBackground})` }}
      >
        <div className="absolute inset-0 bg-background/70 backdrop-blur-sm" />
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="mb-6 text-4xl font-bold tracking-tight text-foreground drop-shadow-lg md:text-6xl lg:text-7xl">
            Handcrafted Elegance in Every Bead
          </h1>
          <p className="mb-8 text-lg text-foreground/90 drop-shadow-md md:text-xl">
            Discover our collection of exquisite handmade beaded accessories. 
            From statement necklaces to elegant bags, each piece tells a unique story.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Button size="lg" className="rounded-full px-8 shadow-lg" onClick={() => navigate('/shop')}>
              Shop Collection
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="secondary" className="rounded-full px-8 shadow-lg" onClick={() => scrollToSection('about')}>
              Learn Our Story
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
