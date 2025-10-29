import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import FeaturedProducts from "@/components/FeaturedProducts";
import ProductCard from "@/components/ProductCard";
import beadedBags from "@/assets/beaded-bags.jpg";
import beadedNecklace from "@/assets/beaded-necklace.jpg";
import pearlBag from "@/assets/pearl-bag.jpg";
import blackTie from "@/assets/black-tie.jpg";
import { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SlidersHorizontal } from "lucide-react";

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

const categories = ["All", "Bags", "Necklaces", "Bracelets", "Earrings", "Ties", "Key Holders"];

const Shop = () => {
  const [searchParams] = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("featured");
  const [priceRange, setPriceRange] = useState("all");

  useEffect(() => {
    const categoryParam = searchParams.get('category');
    if (categoryParam && categories.includes(categoryParam)) {
      setSelectedCategory(categoryParam);
    }
  }, [searchParams]);

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = selectedCategory === "All" 
      ? [...allProducts] 
      : allProducts.filter(product => product.category === selectedCategory);

    // Filter by price range
    if (priceRange !== "all") {
      filtered = filtered.filter(product => {
        const price = parseFloat(product.price.replace("$", ""));
        if (priceRange === "under30") return price < 30;
        if (priceRange === "30to60") return price >= 30 && price <= 60;
        if (priceRange === "60to100") return price > 60 && price <= 100;
        if (priceRange === "over100") return price > 100;
        return true;
      });
    }

    // Sort products
    const sorted = [...filtered];
    switch (sortBy) {
      case "price-low":
        sorted.sort((a, b) => 
          parseFloat(a.price.replace("$", "")) - parseFloat(b.price.replace("$", ""))
        );
        break;
      case "price-high":
        sorted.sort((a, b) => 
          parseFloat(b.price.replace("$", "")) - parseFloat(a.price.replace("$", ""))
        );
        break;
      case "name-az":
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name-za":
        sorted.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        // featured - keep original order
        break;
    }

    return sorted;
  }, [selectedCategory, sortBy, priceRange]);

  return (
    <div className="min-h-screen">
      <Navigation />
      
      <div className="bg-gradient-to-b from-secondary/30 to-background py-8 sm:py-12">
        <div className="container mx-auto px-4 sm:px-6">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground text-center mb-3 sm:mb-4">
            Shop All Products
          </h1>
          <p className="text-sm sm:text-base text-center text-muted-foreground max-w-2xl mx-auto px-2">
            Explore our complete collection of handcrafted beaded accessories
          </p>
        </div>
      </div>

      <section className="py-6 sm:py-8 md:py-12">
        <div className="container mx-auto px-4 sm:px-6">
          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 sm:gap-3 justify-center mb-6 sm:mb-8">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => setSelectedCategory(category)}
                className="rounded-full text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2"
              >
                {category}
              </Button>
            ))}
          </div>

          {/* Sort and Filter Controls */}
          <div className="flex flex-col gap-3 sm:gap-4 sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8 pb-4 sm:pb-6 border-b border-border">
            <div className="flex items-center gap-2 text-muted-foreground">
              <SlidersHorizontal className="h-4 w-4" />
              <span className="text-xs sm:text-sm font-medium">
                {filteredAndSortedProducts.length} products
              </span>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto">
              {/* Price Range Filter */}
              <Select value={priceRange} onValueChange={setPriceRange}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Price Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Prices</SelectItem>
                  <SelectItem value="under30">Under $30</SelectItem>
                  <SelectItem value="30to60">$30 - $60</SelectItem>
                  <SelectItem value="60to100">$60 - $100</SelectItem>
                  <SelectItem value="over100">Over $100</SelectItem>
                </SelectContent>
              </Select>

              {/* Sort By */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="featured">Featured</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="name-az">Name: A to Z</SelectItem>
                  <SelectItem value="name-za">Name: Z to A</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Products Grid */}
          <div className="grid gap-4 sm:gap-6 md:gap-8 grid-cols-2 sm:grid-cols-2 lg:grid-cols-4">
            {filteredAndSortedProducts.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>

          {filteredAndSortedProducts.length === 0 && (
            <div className="text-center py-8 sm:py-12">
              <p className="text-muted-foreground text-sm sm:text-base md:text-lg">
                No products found matching your filters.
              </p>
            </div>
          )}
        </div>
      </section>

      <FeaturedProducts />
      <Footer />
    </div>
  );
};

export default Shop;
