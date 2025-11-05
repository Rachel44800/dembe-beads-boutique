import { useNavigate } from "react-router-dom";
import personalizedKeychain from "@/assets/Personalized beaded intial keychain.jpg";
import malungu from "@/assets/Malungu.jpg";
import beadedTop from "@/assets/beaded top.jpg";
import beadedBag from "@/assets/beaded bag.jpg";

const bestSellers = [
  {
    id: 1,
    name: "Personalized Beaded Initial Keychain",
    image: personalizedKeychain,
    price: "R 420",
  },
  {
    id: 2,
    name: "Malungu Beaded Accessory",
    image: malungu,
    price: "R 825",
  },
  {
    id: 3,
    name: "Beaded Top",
    image: beadedTop,
    price: "R 1,125",
  },
  {
    id: 4,
    name: "Beaded Bag",
    image: beadedBag,
    price: "R 975",
  },
];

const BestSellers = () => {
  const navigate = useNavigate();

  const handleViewAll = () => {
    navigate("/shop");
  };

  return (
    <section className="py-4 sm:py-6 md:py-8 bg-white">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="mb-6 sm:mb-8 text-left">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3 sm:mb-4">
            Best Sellers
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground max-w-2xl">
            Our most loved pieces, handpicked by our customers
          </p>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 md:gap-8 mb-8 sm:mb-12">
          {bestSellers.map((product) => (
            <button
              key={product.id}
              onClick={handleViewAll}
              className="group text-left"
            >
              <div className="relative aspect-square overflow-hidden rounded-lg bg-secondary/20 mb-3 sm:mb-4 hover-card-gradient">
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
              </div>
              <h3 className="text-sm sm:text-base font-medium text-foreground mb-1 hover-brand-text">
                {product.name}
              </h3>
              <p className="text-sm sm:text-base font-semibold text-foreground">
                {product.price}
              </p>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BestSellers;

