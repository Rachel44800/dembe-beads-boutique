import { useNavigate } from "react-router-dom";
import beadedHandAndNeck from "@/assets/beaded hand and neck.jpg";
import { Button } from "@/components/ui/button";

const PromotionalBanner = () => {
  const navigate = useNavigate();

  return (
    <section className="py-4 sm:py-6 md:py-8 bg-white">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Left: Text Content */}
          <div className="text-left">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-black mb-4 sm:mb-6">
              Venda Look Beaded Malungu and More
            </h2>
            <p className="text-base sm:text-lg text-gray-600 mb-6 sm:mb-8 leading-relaxed">
              Explore our exquisite collection of authentic Venda beaded accessories. 
              From traditional Malungu pieces to contemporary designs, each creation 
              celebrates the rich heritage and artistry of handcrafted beadwork.
            </p>
            <Button 
              size="lg"
              onClick={() => navigate("/shop")}
              className="rounded-md px-8 sm:px-10 text-base sm:text-lg bg-black text-white hover:bg-gray-800"
            >
              Shop Now
            </Button>
          </div>

          {/* Right: Image */}
          <div className="relative h-[300px] sm:h-[400px] md:h-[450px] overflow-hidden rounded-lg">
            <div className="absolute inset-0">
              <img
                src={beadedHandAndNeck}
                alt="Venda Look Beaded Malungu"
                className="h-full w-full object-cover"
                style={{ objectPosition: 'center top' }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PromotionalBanner;

