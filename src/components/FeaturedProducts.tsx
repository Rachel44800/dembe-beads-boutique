import { useNavigate } from "react-router-dom";
import beadedBags from "@/assets/beaded-bags.jpg";
import beadedNecklace from "@/assets/beaded-necklace.jpg";
import pearlBag from "@/assets/pearl-bag.jpg";
import blackTie from "@/assets/black-tie.jpg";

const featuredProducts = [
  {
    id: 1,
    name: "Beaded Mini Bags Collection",
    image: beadedBags,
  },
  {
    id: 2,
    name: "Statement Beaded Necklace",
    image: beadedNecklace,
  },
  {
    id: 3,
    name: "Pearl Beaded Handbag",
    image: pearlBag,
  },
  {
    id: 4,
    name: "Elegant Black Beaded Tie",
    image: blackTie,
  },
];

const FeaturedProducts = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/shop");
  };

  return (
    <section className="pt-8 sm:pt-12 pb-4 sm:pb-6 bg-gradient-to-br from-blue-50 via-cyan-50 to-sky-50 border-t border-border">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
          {featuredProducts.map((product) => (
            <button
              key={product.id}
              onClick={handleClick}
              className="group relative aspect-square overflow-hidden rounded-lg bg-secondary/20 hover-card-gradient focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              <img
                src={product.image}
                alt={product.name}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;

