import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
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
import { SlidersHorizontal, Grid3x3, List, X, Sparkles, Filter, Search } from "lucide-react";
import { products as allProducts } from "@/data/products";
import { usePageTitle } from "@/hooks/usePageTitle";

const categories = ["All", "Bags", "Necklaces", "Bracelets", "Earrings", "Ties", "Key Holders", "Accessories", "Clothing"];

const Shop = () => {
  usePageTitle("Shop");
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("featured");
  const [priceRange, setPriceRange] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  useEffect(() => {
    const categoryParam = searchParams.get('category');
    if (categoryParam && categories.includes(categoryParam)) {
      setSelectedCategory(categoryParam);
    }
    const searchParam = searchParams.get('search');
    if (searchParam) {
      // Search query will be handled in filteredAndSortedProducts
    }
  }, [searchParams]);

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = selectedCategory === "All" 
      ? [...allProducts] 
      : allProducts.filter(product => product.category === selectedCategory);

    // Filter by search query
    const searchQuery = searchParams.get('search');
    if (searchQuery) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query)
      );
    }

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
  }, [selectedCategory, sortBy, priceRange, searchParams]);

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (selectedCategory !== "All") count++;
    if (priceRange !== "all") count++;
    if (searchParams.get('search')) count++;
    return count;
  }, [selectedCategory, priceRange, searchParams]);

  const clearAllFilters = () => {
    setSelectedCategory("All");
    setPriceRange("all");
    navigate("/shop");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-sky-50">
      <Navigation />
      
      {/* Hero Header Section */}
      <div className="relative bg-gradient-to-br from-blue-50 via-cyan-50 to-sky-50 py-4 sm:py-6 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-blue-400/10 blur-3xl" />
          <div className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-cyan-400/10 blur-3xl" />
        </div>
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="mb-2">
            <Breadcrumbs />
          </div>
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-600 bg-clip-text text-transparent mb-2">
              Shop All Products
            </h1>
            <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto">
              Explore our complete collection of handcrafted beaded accessories
            </p>
          </div>
        </div>
      </div>

      <section className="py-4 sm:py-6 bg-gradient-to-br from-blue-50 via-cyan-50 to-sky-50">
        <div className="container mx-auto px-4 sm:px-6">
          {/* Top Controls Bar */}
          <div className="bg-white/80 backdrop-blur-xl rounded-xl border border-white/50 shadow-md p-3 sm:p-4 mb-4 sm:mb-6">
            <div className="flex flex-col lg:flex-row gap-3 lg:items-center lg:justify-between">
              {/* Left: Category Filter Pills */}
              <div className="flex flex-wrap gap-1.5 sm:gap-2 items-center">
                <span className="text-xs font-semibold text-gray-700 hidden sm:inline mr-1">Categories:</span>
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {categories.map((category) => (
                    <Button
                      key={category}
                      variant={selectedCategory === category ? "default" : "outline"}
                      onClick={() => setSelectedCategory(category)}
                      className={`rounded-full text-xs px-3 py-1.5 h-8 transition-all duration-200 ${
                        selectedCategory === category 
                          ? "" 
                          : "hover-brand-bg border-gray-200"
                      }`}
                    >
                      {category}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Right: Controls */}
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 items-stretch sm:items-center">
                {/* Results Count & Active Filters */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5 text-gray-600">
                    <SlidersHorizontal className="h-3.5 w-3.5" />
                    <span className="text-xs font-medium">
                      <span className="font-bold text-gray-900">{filteredAndSortedProducts.length}</span> products
                    </span>
                  </div>
                  {activeFiltersCount > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearAllFilters}
                      className="text-xs text-gray-600 hover:text-gray-900 h-7 px-2"
                    >
                      <X className="h-3 w-3 mr-1" />
                      Clear ({activeFiltersCount})
                    </Button>
                  )}
                </div>

                {/* View Mode Toggle */}
                <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-0.5">
                  <Button
                    variant={viewMode === "grid" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                    className="h-7 px-2.5"
                  >
                    <Grid3x3 className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                    className="h-7 px-2.5"
                  >
                    <List className="h-3.5 w-3.5" />
                  </Button>
                </div>

                {/* Sort and Filter Dropdowns */}
                <div className="flex flex-col sm:flex-row gap-2">
                  {/* Price Range Filter */}
                  <Select value={priceRange} onValueChange={setPriceRange}>
                    <SelectTrigger className="w-full sm:w-[140px] h-9 bg-white border-gray-200 hover:border-blue-500 transition-all text-xs">
                      <div className="flex items-center gap-1.5">
                        <Filter className="h-3.5 w-3.5 text-gray-400" />
                        <SelectValue placeholder="Price Range" />
                      </div>
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
                    <SelectTrigger className="w-full sm:w-[140px] h-9 bg-white border-gray-200 hover:border-blue-500 transition-all text-xs">
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
            </div>
          </div>

          {/* Products Display */}
          {filteredAndSortedProducts.length > 0 ? (
            <div 
              className={
                viewMode === "grid"
                  ? "grid gap-3 sm:gap-4 md:gap-5 grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                  : "space-y-3"
              }
            >
              {filteredAndSortedProducts.map((product, index) => (
                <div
                  key={product.id}
                  className="animate-in fade-in slide-in-from-bottom-4"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <ProductCard {...product} viewMode={viewMode} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 sm:py-16">
              <div className="inline-flex items-center justify-center mb-3">
                <div className="rounded-full bg-gray-100 p-3">
                  <Search className="h-6 w-6 text-gray-400" />
                </div>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                No products found
              </h3>
              <p className="text-gray-600 text-sm mb-4 max-w-md mx-auto">
                {searchParams.get('search') 
                  ? `We couldn't find any products matching "${searchParams.get('search')}". Try adjusting your search or filters.` 
                  : "No products match your current filters. Try adjusting your selection."}
              </p>
              {activeFiltersCount > 0 && (
                <Button
                  onClick={clearAllFilters}
                  size="sm"
                  className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white"
                >
                  Clear All Filters
                </Button>
              )}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Shop;
