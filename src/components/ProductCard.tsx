import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface ProductCardProps {
  id: number;
  name: string;
  price: string;
  image: string;
  category: string;
  viewMode?: "grid" | "list";
}

const ProductCard = ({ id, name, price, image, category, viewMode = "grid" }: ProductCardProps) => {
  const navigate = useNavigate();

  const handleBuyNow = () => {
    navigate(`/product/${id}`);
  };

  if (viewMode === "list") {
    return (
      <Card className="group overflow-hidden rounded-xl border border-gray-200 bg-white hover:shadow-lg transition-all duration-300">
        <div className="flex flex-col sm:flex-row">
          <CardContent className="p-0 sm:w-48 flex-shrink-0">
            <div className="relative aspect-square sm:aspect-auto sm:h-full overflow-hidden bg-secondary/20">
              <img
                src={image}
                alt={name}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute top-3 left-3">
                <span className="rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-3 py-1 text-xs font-medium shadow-md hover:from-blue-500 hover:to-cyan-400 transition-all duration-300 cursor-default">
                  {category}
                </span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex-1 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-6">
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">{name}</h3>
              <p className="text-xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">{price}</p>
            </div>
            <Button 
              className="w-full sm:w-auto min-w-[120px] rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white shadow-md hover:shadow-lg transition-all" 
              size="default" 
              onClick={handleBuyNow}
            >
              Buy Now
            </Button>
          </CardFooter>
        </div>
      </Card>
    );
  }

  return (
    <Card className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <CardContent className="p-0">
        <div className="relative aspect-square overflow-hidden bg-secondary/20">
          <img
            src={image}
            alt={name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute top-4 left-4">
            <span className="rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-3 py-1 text-xs font-medium shadow-md hover:from-blue-500 hover:to-cyan-400 transition-all duration-300 cursor-default">
              {category}
            </span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col items-start gap-3 p-6">
        <div className="w-full">
          <h3 className="text-lg font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">{name}</h3>
          <p className="text-lg font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">{price}</p>
        </div>
        <Button 
          className="w-full rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white shadow-md hover:shadow-lg transition-all" 
          size="sm" 
          onClick={handleBuyNow}
        >
          Buy Now
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
