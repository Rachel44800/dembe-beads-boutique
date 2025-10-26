import ProductCard from "./ProductCard";
import { Button } from "@/components/ui/button";
import beadedBags from "@/assets/beaded-bags.jpg";
import beadedNecklace from "@/assets/beaded-necklace.jpg";
import pearlBag from "@/assets/pearl-bag.jpg";
import blackTie from "@/assets/black-tie.jpg";

const products = [
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
  }
];

const ProductGrid = () => {
  return (
    <section id="products" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
            Featured Collection
          </h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            Each piece is lovingly handcrafted with premium beads and materials, 
            ensuring quality and uniqueness in every accessory.
          </p>
        </div>
        
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <Button size="lg" variant="outline" className="rounded-full px-8">
            Shop All Products
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ProductGrid;
