import { Card, CardContent } from "@/components/ui/card";
import { Gem, ShoppingBag, Sparkles, Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";

const categories = [
  {
    name: "Necklaces",
    icon: Gem,
    description: "Statement pieces that elevate any outfit",
    color: "from-primary/20 to-primary/5"
  },
  {
    name: "Bags",
    icon: ShoppingBag,
    description: "Handcrafted beaded bags for every occasion",
    color: "from-secondary/30 to-secondary/10"
  },
  {
    name: "Ties",
    icon: Sparkles,
    description: "Unique beaded ties for special moments",
    color: "from-accent/40 to-accent/20"
  },
  {
    name: "Key Holders",
    icon: Heart,
    description: "Charming accessories for your everyday",
    color: "from-primary/10 to-secondary/10"
  }
];

const Categories = () => {
  const navigate = useNavigate();

  const handleCategoryClick = (categoryName: string) => {
    navigate(`/shop?category=${categoryName}`);
  };

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
            Browse by Category
          </h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            Explore our diverse collection of handmade beaded accessories
          </p>
        </div>
        
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <Card 
                key={category.name} 
                className="group cursor-pointer overflow-hidden rounded-2xl border-border transition-all hover:shadow-lg hover:scale-105"
                onClick={() => handleCategoryClick(category.name)}
              >
                <CardContent className="p-8">
                  <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary">
                    <Icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="mb-2 text-xl font-semibold text-foreground">
                    {category.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {category.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Categories;
