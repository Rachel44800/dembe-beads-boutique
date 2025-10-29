import { useNavigate } from "react-router-dom";
import beadedBags from "@/assets/beaded-bags.jpg";
import beadedNecklace from "@/assets/beaded-necklace.jpg";
import pearlBag from "@/assets/pearl-bag.jpg";
import blackTie from "@/assets/black-tie.jpg";

const newArrivals = [
  {
    id: 5,
    name: "Colorful Beaded Bracelet Set",
    image: beadedNecklace,
    price: "R 420",
  },
  {
    id: 6,
    name: "Deluxe Pearl Evening Bag",
    image: pearlBag,
    price: "R 1,425",
  },
  {
    id: 7,
    name: "Crystal Beaded Earrings",
    image: beadedNecklace,
    price: "R 570",
  },
  {
    id: 8,
    name: "Handwoven Beaded Clutch",
    image: beadedBags,
    price: "R 825",
  },
];

const NewArrivals = () => {
  const navigate = useNavigate();

  const handleViewAll = () => {
    navigate("/shop");
  };

  return (
    <section className="py-4 sm:py-6 md:py-8 bg-white">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="mb-6 sm:mb-8 text-left">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-black mb-3 sm:mb-4">
            New Arrivals
          </h2>
          <p className="text-sm sm:text-base text-gray-600 max-w-2xl">
            Fresh pieces added to our collection
          </p>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 md:gap-8 mb-8 sm:mb-12">
          {newArrivals.map((product) => (
            <button
              key={product.id}
              onClick={handleViewAll}
              className="group text-left"
            >
              <div className="relative aspect-square overflow-hidden rounded-lg bg-secondary/20 mb-3 sm:mb-4 transition-transform hover:scale-105">
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
              </div>
              <h3 className="text-sm sm:text-base font-medium text-black mb-1 group-hover:text-primary transition-colors">
                {product.name}
              </h3>
              <p className="text-sm sm:text-base font-semibold text-black">
                {product.price}
              </p>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default NewArrivals;

