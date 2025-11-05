import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Minus, Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { products } from "@/data/products";
import { useCart } from "@/hooks/useCart";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, updateQuantity, items } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const foundProduct = products.find(p => p.id === Number(id));
    setProduct(foundProduct || null);
    setLoading(false);
  }, [id]);

  const parsePrice = (price: string) => {
    return parseFloat(price.replace(/[^0-9.]/g, "").replace(",", ""));
  };

  // Get other cart items (excluding current product if it's in cart)
  const otherCartItems = items.filter(item => item.id !== Number(id));

  // Calculate cart items subtotal
  const cartSubtotal = otherCartItems.reduce((sum, item) => {
    return sum + parsePrice(item.price) * item.quantity;
  }, 0);

  // Calculate selected product subtotal
  const selectedProductSubtotal = product ? parsePrice(product.price) * quantity : 0;

  // Combined subtotal (selected product + existing cart items)
  const combinedSubtotal = selectedProductSubtotal + cartSubtotal;

  // Flat shipping rate regardless of order value
  const shippingEstimate = 170;
  const total = combinedSubtotal + shippingEstimate;

  const handleCheckout = async () => {
    // Add product to cart first (before checking auth) so it's available after login
    const existingCartItem = items.find(item => item.id === product.id);
    if (existingCartItem) {
      // If product is already in cart, update quantity to include selected quantity
      updateQuantity(product.id, existingCartItem.quantity + quantity);
    } else {
      // Add product to cart with selected quantity
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        category: product.category,
      });
      
      // If quantity > 1, update it to the selected quantity
      if (quantity > 1) {
        setTimeout(() => {
          updateQuantity(product.id, quantity);
        }, 100);
      }
    }

    // Check if user is authenticated
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      // Store the intended destination to return to checkout after login
      sessionStorage.setItem("redirectAfterLogin", "/checkout");
      navigate("/auth");
      return;
    }
    
    // Navigate to checkout
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
                src={product.image}
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
                <h1 className="text-3xl font-semibold text-foreground hover-brand-text mb-4">{product.name}</h1>
                <p className="text-muted-foreground mb-6">{product.description || "Handcrafted with premium materials"}</p>
                <p className="text-3xl font-medium text-primary/90">{product.price}</p>
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

                  {/* Selected Product Summary */}
                  <div className="space-y-2 border-t pt-4 mb-4">
                    <p className="text-xs font-medium text-muted-foreground mb-2">Selected Product</p>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{product.name} × {quantity}</span>
                      <span className="font-medium">R {selectedProductSubtotal.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Other Cart Items */}
                  {otherCartItems.length > 0 && (
                    <div className="space-y-3 border-t pt-4 mb-4">
                      <p className="text-xs font-medium text-muted-foreground mb-2">Other Items in Cart</p>
                      {otherCartItems.map((item) => (
                        <div key={item.id} className="flex items-center gap-3">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="h-12 w-12 rounded-md object-cover flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-muted-foreground truncate">{item.name}</p>
                            <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                          </div>
                          <span className="font-medium text-sm flex-shrink-0">R {(parsePrice(item.price) * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Combined Summary */}
                  <div className="space-y-2 border-t pt-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Combined Subtotal</span>
                      <span className="font-medium">R {combinedSubtotal.toFixed(2)}</span>
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
