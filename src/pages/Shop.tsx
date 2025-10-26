import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import beadedBags from "@/assets/beaded-bags.jpg";
import beadedNecklace from "@/assets/beaded-necklace.jpg";
import pearlBag from "@/assets/pearl-bag.jpg";
import blackTie from "@/assets/black-tie.jpg";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const allProducts = [
  {
    id: 1,
    name: "Beaded Mini Bags Collection",
    price: "$45.00",
    image: beadedBags,
    category: "Bags"
  },
  {
    id: 2,
    name: "Statement Beaded Necklace",
    price: "$68.00",
    image: beadedNecklace,
    category: "Necklaces"
  },
  {
    id: 3,
    name: "Pearl Beaded Handbag",
    price: "$85.00",
    image: pearlBag,
    category: "Bags"
  },
  {
    id: 4,
    name: "Elegant Black Beaded Tie",
    price: "$32.00",
    image: blackTie,
    category: "Ties"
  },
  {
    id: 5,
    name: "Colorful Beaded Bracelet Set",
    price: "$28.00",
    image: beadedNecklace,
    category: "Bracelets"
  },
  {
    id: 6,
    name: "Deluxe Pearl Evening Bag",
    price: "$95.00",
    image: pearlBag,
    category: "Bags"
  },
  {
    id: 7,
    name: "Crystal Beaded Earrings",
    price: "$38.00",
    image: beadedNecklace,
    category: "Earrings"
  },
  {
    id: 8,
    name: "Handwoven Beaded Clutch",
    price: "$55.00",
    image: beadedBags,
    category: "Bags"
  }
];

const categories = ["All", "Bags", "Necklaces", "Bracelets", "Earrings", "Ties"];

const Shop = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredProducts = selectedCategory === "All" 
    ? allProducts 
    : allProducts.filter(product => product.category === selectedCategory);

  return (
    <div className="min-h-screen">
      <Navigation />
      
      <div className="bg-gradient-to-b from-secondary/30 to-background py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground text-center mb-4">
            Shop All Products
          </h1>
          <p className="text-center text-muted-foreground max-w-2xl mx-auto">
            Explore our complete collection of handcrafted beaded accessories
          </p>
        </div>
      </div>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-2 justify-center mb-12">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => setSelectedCategory(category)}
                className="rounded-full"
              >
                {category}
              </Button>
            ))}
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">
                No products found in this category.
              </p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Shop;
