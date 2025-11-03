import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import beadedBags from "@/assets/beaded-bags.jpg";
import beadedNecklace from "@/assets/beaded-necklace.jpg";
import pearlBag from "@/assets/pearl-bag.jpg";
import blackTie from "@/assets/black-tie.jpg";
import { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate, useSearchParams } from "react-router-dom";
import Breadcrumbs from "@/components/Breadcrumbs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SlidersHorizontal } from "lucide-react";
import personalizedKeychain from "@/assets/Personalized beaded intial keychain.jpg";
import malungu from "@/assets/Malungu.jpg";
import beadedTop from "@/assets/beaded top.jpg";
import beadedBag from "@/assets/beaded bag.jpg";
import handNeckHeadSet from "@/assets/hand, neck, head set .jpg";
import orangeBeadedBag from "@/assets/orange beaded bag.jpg";
import handsNeckBeadsSet from "@/assets/hands and neck beads set.jpg";
import beadsSet from "@/assets/beads set .jpg";

const allProducts = [
  {
    id: 1,
    name: "Beaded Mini Bags Collection",
    price: "R 675",
    image: beadedBags,
    category: "Bags"
  },
  {
    id: 2,
    name: "Statement Beaded Necklace",
    price: "R 1,020",
    image: beadedNecklace,
    category: "Necklaces"
  },
  {
    id: 4,
    name: "Elegant Black Beaded Tie",
    price: "R 480",
    image: blackTie,
    category: "Ties"
  },
  {
    id: 9,
    name: "Personalized Beaded Initial Keychain",
    price: "R 330",
    image: personalizedKeychain,
    category: "Key Holders"
  },
  {
    id: 10,
    name: "Malungu Beaded Accessory",
    price: "R 675",
    image: malungu,
    category: "Accessories"
  },
  {
    id: 11,
    name: "Beaded Top",
    price: "R 1,800",
    image: beadedTop,
    category: "Clothing"
  },
  {
    id: 12,
    name: "Classic Beaded Bag",
    price: "R 1,320",
    image: beadedBag,
    category: "Bags"
  },
  {
    id: 13,
    name: "Hand, Neck, Head Beaded Set",
    price: "R 1,200",
    image: handNeckHeadSet,
    category: "Accessories"
  },
  {
    id: 14,
    name: "Orange Beaded Bag",
    price: "R 850",
    image: orangeBeadedBag,
    category: "Bags"
  },
  {
    id: 15,
    name: "Hands and Neck Beads Set",
    price: "R 1,100",
    image: handsNeckBeadsSet,
    category: "Accessories"
  },
  {
    id: 16,
    name: "Beads Set",
    price: "R 950",
    image: beadsSet,
    category: "Accessories"
  }
];

const categories = ["All", "Bags", "Necklaces", "Bracelets", "Earrings", "Ties", "Key Holders", "Accessories", "Clothing"];

const Shop = () => {
  const navigate = useNavigate();
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
        const price = parseFloat(product.price.replace(/[R\s,]/g, ""));
        if (priceRange === "under30") return price < 450; // R450 ≈ $30
        if (priceRange === "30to60") return price >= 450 && price <= 900; // R450-900 ≈ $30-60
        if (priceRange === "60to100") return price > 900 && price <= 1500; // R900-1500 ≈ $60-100
        if (priceRange === "over100") return price > 1500; // R1500+ ≈ $100+
        return true;
      });
    }

    // Sort products
    const sorted = [...filtered];
    switch (sortBy) {
      case "price-low":
        sorted.sort((a, b) => 
          parseFloat(a.price.replace(/[R\s,]/g, "")) - parseFloat(b.price.replace(/[R\s,]/g, ""))
        );
        break;
      case "price-high":
        sorted.sort((a, b) => 
          parseFloat(b.price.replace(/[R\s,]/g, "")) - parseFloat(a.price.replace(/[R\s,]/g, ""))
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
    <div className="min-h-screen bg-white">
      <Navigation />
      
      <div className="bg-white py-6 sm:py-8">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="mb-2">
            <Breadcrumbs />
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground text-center mb-3 sm:mb-4">
            Shop All Products
          </h1>
          <p className="text-sm sm:text-base text-center text-muted-foreground max-w-2xl mx-auto px-2">
            Explore our complete collection of handcrafted beaded accessories
          </p>
        </div>
      </div>

      <section className="py-6 sm:py-8 md:py-12 bg-white">
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
          <div className="flex flex-col gap-3 sm:gap-4 sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8">
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
                  <SelectItem value="under30">Under R 450</SelectItem>
                  <SelectItem value="30to60">R 450 - R 900</SelectItem>
                  <SelectItem value="60to100">R 900 - R 1,500</SelectItem>
                  <SelectItem value="over100">Over R 1,500</SelectItem>
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

      <Footer />
    </div>
  );
};

export default Shop;
