import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const Hero = () => {
  return (
    <section id="home" className="relative overflow-hidden bg-gradient-to-br from-background via-accent to-secondary/20 py-20 md:py-32">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="mb-6 text-4xl font-bold tracking-tight text-foreground md:text-6xl lg:text-7xl">
            Handcrafted Elegance in Every Bead
          </h1>
          <p className="mb-8 text-lg text-muted-foreground md:text-xl">
            Discover our collection of exquisite handmade beaded accessories. 
            From statement necklaces to elegant bags, each piece tells a unique story.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Button size="lg" className="rounded-full px-8">
              Shop Collection
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" className="rounded-full px-8">
              Learn Our Story
            </Button>
          </div>
        </div>
      </div>
      
      <div className="absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
      <div className="absolute -top-20 -left-20 h-64 w-64 rounded-full bg-secondary/20 blur-3xl" />
    </section>
  );
};

export default Hero;
