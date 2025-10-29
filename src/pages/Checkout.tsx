import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/hooks/useCart";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import FeaturedProducts from "@/components/FeaturedProducts";
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
    shippingMethod: "postnet" as "postnet" | "pep",
    postnetBranch: "",
    pepAddress: "",
  });

  const parsePrice = (priceStr: string) => {
    // Accept formats like "$123.45", "R123.45", or plain numbers as strings
    const cleaned = priceStr.replace(/[^0-9.,-]/g, "").replace(",", ".");
    const parsed = parseFloat(cleaned);
    return isNaN(parsed) ? 0 : parsed;
  };

  const total = items.reduce((sum, item) => sum + parsePrice(item.price) * item.quantity, 0);
  const deposit = Math.max(0, total * 0.5);

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
            payment_status: "pending_deposit",
            currency: "ZAR",
            deposit_required: deposit,
            shipping_method: formData.shippingMethod,
            postnet_branch: formData.shippingMethod === "postnet" ? formData.postnetBranch : null,
            pep_address: formData.shippingMethod === "pep" ? formData.pepAddress : null,
            notes: formData.notes || null,
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
      toast.success("Order placed successfully! We will confirm your 50% deposit.");
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
        <FeaturedProducts />
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
                      <Label className="text-sm">Shipping Method *</Label>
                      <div className="flex gap-4">
                        <label className="flex items-center gap-2 text-sm">
                          <input
                            type="radio"
                            name="shippingMethod"
                            value="postnet"
                            checked={formData.shippingMethod === "postnet"}
                            onChange={() => setFormData({ ...formData, shippingMethod: "postnet" })}
                          />
                          PostNet (collect at chosen branch)
                        </label>
                        <label className="flex items-center gap-2 text-sm">
                          <input
                            type="radio"
                            name="shippingMethod"
                            value="pep"
                            checked={formData.shippingMethod === "pep"}
                            onChange={() => setFormData({ ...formData, shippingMethod: "pep" })}
                          />
                          PEP (Paxi code for collection)
                        </label>
                      </div>
                    </div>
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
                    {formData.shippingMethod === "postnet" && (
                      <div className="space-y-2">
                        <Label htmlFor="postnetBranch" className="text-sm">Nearest PostNet Branch *</Label>
                        <Input
                          id="postnetBranch"
                          name="postnetBranch"
                          value={formData.postnetBranch}
                          onChange={handleInputChange}
                          required
                          className="text-base"
                        />
                      </div>
                    )}
                    {formData.shippingMethod === "pep" && (
                      <div className="space-y-2">
                        <Label htmlFor="pepAddress" className="text-sm">Your Address (for Paxi reference) *</Label>
                        <Input
                          id="pepAddress"
                          name="pepAddress"
                          value={formData.pepAddress}
                          onChange={handleInputChange}
                          required
                          className="text-base"
                        />
                      </div>
                    )}
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
                      A 50% non-refundable deposit is required to confirm your order.
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
                      <span className="font-medium">R{total.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Shipping</span>
                      <span className="font-medium">Calculated at delivery</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Deposit (50%)</span>
                      <span className="font-semibold">R{deposit.toFixed(2)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between">
                      <span className="text-lg font-semibold">Total</span>
                      <span className="text-2xl font-bold text-primary">R{total.toFixed(2)}</span>
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
                        A 50% deposit (R{deposit.toFixed(2)}) is required to confirm your order. Please make a manual
                        payment via EFT/bank transfer and send proof via WhatsApp. Your order will remain
                        in Pending status until we confirm the deposit.
                      </p>
                      <div className="mt-3 text-sm text-muted-foreground">
                        <p><strong>WhatsApp:</strong> Send proof and your order number once submitted.</p>
                        <p className="mt-1"><strong>Reference:</strong> Use your Order Number for EFT reference.</p>
                      </div>
                    </div>
                    <div className="rounded-lg bg-background/50 p-4 border border-primary/30">
                      <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                        <span className="text-xl">📦</span>
                        Shipping Details
                      </h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        PostNet: choose your nearest branch. PEP: we'll generate a Paxi code and send it to you
                        for collection at your nearest PEP store.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      <FeaturedProducts />
      <Footer />
    </div>
  );
};

export default Checkout;
