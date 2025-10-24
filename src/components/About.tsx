import { Card, CardContent } from "@/components/ui/card";
import { Heart, Award, Sparkles } from "lucide-react";

const About = () => {
  return (
    <section id="about" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-4xl">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
              Our Story
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              Dembe Beads Boutique was born from a passion for creating beautiful, 
              handcrafted accessories that celebrate individuality and elegance.
            </p>
          </div>

          <div className="mb-12 rounded-3xl bg-gradient-to-br from-primary/5 via-secondary/10 to-accent/20 p-8 md:p-12">
            <p className="mb-6 text-foreground">
              Every piece in our collection is meticulously handcrafted with love and attention to detail. 
              We believe that accessories should be more than just additions to an outfit—they should 
              be expressions of personality, craftsmanship, and artistry.
            </p>
            <p className="text-foreground">
              From statement necklaces to elegant beaded bags, each item is created using premium 
              materials and traditional beading techniques passed down through generations. 
              We're committed to sustainable practices and supporting local artisans.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <Card className="rounded-2xl border-border">
              <CardContent className="p-6 text-center">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <Heart className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 font-semibold text-foreground">Handmade with Love</h3>
                <p className="text-sm text-muted-foreground">
                  Every piece crafted with care and attention
                </p>
              </CardContent>
            </Card>

            <Card className="rounded-2xl border-border">
              <CardContent className="p-6 text-center">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-secondary/20">
                  <Award className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 font-semibold text-foreground">Premium Quality</h3>
                <p className="text-sm text-muted-foreground">
                  Only the finest materials and beads
                </p>
              </CardContent>
            </Card>

            <Card className="rounded-2xl border-border">
              <CardContent className="p-6 text-center">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-accent/40">
                  <Sparkles className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 font-semibold text-foreground">Unique Designs</h3>
                <p className="text-sm text-muted-foreground">
                  One-of-a-kind pieces you won't find elsewhere
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
