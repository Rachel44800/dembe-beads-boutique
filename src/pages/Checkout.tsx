import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/hooks/useCart";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ArrowLeft, ShoppingBag } from "lucide-react";

const Checkout = () => {
  const navigate = useNavigate();
  const { items, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    notes: "",
  });

  const total = items.reduce((sum, item) => {
    const price = parseFloat(item.price.replace("$", ""));
    return sum + price * item.quantity;
  }, 0);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Check if user is authenticated
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Please log in to complete your order");
        navigate("/auth");
        return;
      }

      // Create shipping address string
      const shippingAddress = `${formData.fullName}\n${formData.address}\n${formData.city}, ${formData.state} ${formData.zipCode}\nEmail: ${formData.email}\nPhone: ${formData.phone}${formData.notes ? `\nNotes: ${formData.notes}` : ""}`;

      // Generate order number
      const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

      // Create order
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert([
          {
            user_id: user.id,
            order_number: orderNumber,
            total_amount: total,
            shipping_address: shippingAddress,
            status: "pending",
          },
        ])
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items
      const orderItems = items.map((item) => ({
        order_id: order.id,
        product_name: item.name,
        product_image: item.image,
        price: parseFloat(item.price.replace("$", "")),
        quantity: item.quantity,
      }));

      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItems);

      if (itemsError) throw itemsError;

      // Clear cart and show success
      clearCart();
      toast.success("Order placed successfully!");
      navigate("/profile");
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error("Failed to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4">
            <ShoppingBag className="h-16 w-16 text-muted-foreground mx-auto" />
            <h2 className="text-2xl font-bold text-foreground">Your cart is empty</h2>
            <p className="text-muted-foreground">Add some items to checkout</p>
            <Button onClick={() => navigate("/shop")}>Go to Shop</Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <div className="flex-1 py-6 sm:py-8 md:py-12 bg-background">
        <div className="container mx-auto px-4 sm:px-6">
          <Button
            variant="ghost"
            onClick={() => navigate("/shop")}
            className="mb-4 sm:mb-6 text-sm sm:text-base"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Shop
          </Button>

          <div className="grid gap-6 sm:gap-8 lg:grid-cols-2">
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Shipping Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName" className="text-sm">Full Name *</Label>
                      <Input
                        id="fullName"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        required
                        className="text-base"
                      />
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2 sm:col-span-1">
                        <Label htmlFor="email" className="text-sm">Email *</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          className="text-base"
                        />
                      </div>
                      <div className="space-y-2 sm:col-span-1">
                        <Label htmlFor="phone" className="text-sm">Phone *</Label>
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={handleInputChange}
                          required
                          className="text-base"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="address" className="text-sm">Address *</Label>
                      <Input
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        required
                        className="text-base"
                      />
                    </div>
                    <div className="grid gap-4 grid-cols-2 sm:grid-cols-3">
                      <div className="space-y-2 sm:col-span-1">
                        <Label htmlFor="city" className="text-sm">City *</Label>
                        <Input
                          id="city"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          required
                          className="text-base"
                        />
                      </div>
                      <div className="space-y-2 sm:col-span-1">
                        <Label htmlFor="state" className="text-sm">State *</Label>
                        <Input
                          id="state"
                          name="state"
                          value={formData.state}
                          onChange={handleInputChange}
                          required
                          className="text-base"
                        />
                      </div>
                      <div className="space-y-2 col-span-2 sm:col-span-1">
                        <Label htmlFor="zipCode" className="text-sm">ZIP Code *</Label>
                        <Input
                          id="zipCode"
                          name="zipCode"
                          value={formData.zipCode}
                          onChange={handleInputChange}
                          required
                          className="text-base"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="notes" className="text-sm">Order Notes (Optional)</Label>
                      <Textarea
                        id="notes"
                        name="notes"
                        value={formData.notes}
                        onChange={handleInputChange}
                        placeholder="Any special instructions..."
                        className="min-h-[100px] text-base"
                      />
                    </div>
                    <Button
                      type="submit"
                      className="w-full"
                      size="lg"
                      disabled={loading}
                    >
                      {loading ? "Submitting Order..." : "Submit Order Request"}
                    </Button>
                    <p className="text-xs text-center text-muted-foreground mt-2">
                      We'll contact you to arrange payment and shipping after your order is submitted.
                    </p>
                  </form>
                </CardContent>
              </Card>
            </div>

            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-3 sm:gap-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-16 w-16 sm:h-20 sm:w-20 rounded-md object-cover flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-foreground text-sm sm:text-base truncate">{item.name}</h4>
                        <p className="text-xs sm:text-sm text-muted-foreground">
                          {item.category}
                        </p>
                        <p className="text-xs sm:text-sm text-muted-foreground">
                          Qty: {item.quantity}
                        </p>
                      </div>
                      <p className="font-semibold text-primary text-sm sm:text-base flex-shrink-0">{item.price}</p>
                    </div>
                  ))}
                  <Separator />
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="font-medium">${total.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Shipping</span>
                      <span className="font-medium">Calculated at delivery</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between">
                      <span className="text-lg font-semibold">Total</span>
                      <span className="text-2xl font-bold text-primary">
                        ${total.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="mt-4 border-primary/20 bg-primary/5">
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="rounded-lg bg-background/50 p-4 border border-primary/30">
                      <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                        <span className="text-xl">💳</span>
                        Payment Information
                      </h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        We currently don't have payment processing set up. After you submit your order, 
                        we'll review it and contact you via email or phone to arrange payment and confirm 
                        shipping details. Your order will be placed on hold until payment is confirmed.
                      </p>
                    </div>
                    <div className="rounded-lg bg-background/50 p-4 border border-primary/30">
                      <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                        <span className="text-xl">📦</span>
                        Shipping Details
                      </h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        Shipping costs will be calculated based on your location and delivery preferences. 
                        We'll contact you with shipping options and estimated delivery times after your order 
                        is placed.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Checkout;
