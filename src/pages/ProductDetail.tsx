import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Minus, Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error fetching product:", error);
      } else {
        setProduct(data);
      }
      setLoading(false);
    };

    fetchProduct();
  }, [id]);

  const parsePrice = (price: string) => {
    return parseFloat(price.replace(/[^0-9.]/g, ""));
  };

  const subtotal = product ? parsePrice(product.price) * quantity : 0;
  const shippingEstimate = 150; // Fixed shipping estimate
  const total = subtotal + shippingEstimate;

  const handleCheckout = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      // Store the intended destination
      sessionStorage.setItem("redirectAfterLogin", `/product/${id}`);
      navigate("/auth");
      return;
    }

    // Store product details for checkout
    sessionStorage.setItem("checkoutProduct", JSON.stringify({
      ...product,
      quantity
    }));
    
    navigate("/checkout");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-20 flex items-center justify-center">
          <p className="text-muted-foreground">Loading...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-20 flex items-center justify-center">
          <p className="text-muted-foreground">Product not found</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Product Image */}
            <div className="aspect-square overflow-hidden rounded-2xl bg-secondary/20">
              <img
                src={product.image_url}
                alt={product.name}
                className="h-full w-full object-cover"
              />
            </div>

            {/* Product Details */}
            <div className="flex flex-col gap-6">
              <div>
                <span className="inline-block rounded-full bg-accent px-3 py-1 text-xs font-medium text-accent-foreground mb-4">
                  {product.category}
                </span>
                <h1 className="text-3xl font-bold text-foreground mb-4">{product.name}</h1>
                <p className="text-muted-foreground mb-6">{product.description || "Handcrafted with premium materials"}</p>
                <p className="text-3xl font-bold text-primary">{product.price}</p>
              </div>

              {/* Quantity Selector */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-medium text-foreground">Quantity</span>
                    <div className="flex items-center gap-4">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        disabled={quantity <= 1}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="text-lg font-semibold w-8 text-center">{quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setQuantity(quantity + 1)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2 border-t pt-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="font-medium">R {subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Estimated Shipping</span>
                      <span className="font-medium">R {shippingEstimate.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold border-t pt-2 mt-2">
                      <span>Total</span>
                      <span className="text-primary">R {total.toFixed(2)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Button size="lg" className="w-full" onClick={handleCheckout}>
                Checkout
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="w-full"
                onClick={() => navigate("/shop")}
              >
                Continue Shopping
              </Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProductDetail;
