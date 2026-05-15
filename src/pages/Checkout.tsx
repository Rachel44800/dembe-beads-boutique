import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/hooks/useCart";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ShoppingBag } from "lucide-react";
import { usePageTitle } from "@/hooks/usePageTitle";

const Checkout = () => {
  usePageTitle("Checkout");
  const navigate = useNavigate();
  const { items, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
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

  // Calculate subtotal for all items in cart (shipping is calculated once for entire order)
  const subtotal = items.reduce((sum, item) => sum + parsePrice(item.price) * item.quantity, 0);
  
  // Flat shipping rate regardless of order value (once for entire order)
  const shippingEstimate = 170;
  const total = subtotal + shippingEstimate;
  const deposit = Math.max(0, total * 0.5);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    
    // Phone validation: only allow digits and limit to 10
    if (name === "phone") {
      const digitsOnly = value.replace(/\D/g, "");
      if (digitsOnly.length <= 10) {
        setFormData({
          ...formData,
          [name]: digitsOnly,
        });
      }
      return;
    }
    
    setFormData({
      ...formData,
      [name]: value,
    });
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = async () => {
    const newErrors: Record<string, string> = {};

    // Phone validation
    if (!formData.phone.startsWith("0")) {
      newErrors.phone = "Phone number must start with 0";
    }
    if (formData.phone.length !== 10) {
      newErrors.phone = "Phone number must be exactly 10 digits";
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Required fields
    if (!formData.fullName?.trim()) newErrors.fullName = "Full name is required";
    if (!formData.address?.trim()) newErrors.address = "Address is required";
    if (!formData.city?.trim()) newErrors.city = "City is required";
    if (!formData.state?.trim()) newErrors.state = "State is required";
    if (!formData.zipCode?.trim()) newErrors.zipCode = "ZIP Code is required";
    
    // Validate shipping method specific fields
    if (formData.shippingMethod === "postnet" && !formData.postnetBranch?.trim()) {
      newErrors.postnetBranch = "PostNet branch is required";
    }
    if (formData.shippingMethod === "pep" && !formData.pepAddress?.trim()) {
      newErrors.pepAddress = "Address is required for PEP delivery";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Validate form
    const isValid = await validateForm();
    if (!isValid) {
      toast.error("Please fix the errors in the form");
      setLoading(false);
      return;
    }

    try {
      // Get current user (may be null for guest checkout)
      const {
        data: { user },
      } = await supabase.auth.getUser();

      // If logged in, ensure profile exists
      if (user) {
        const { error: profileError } = await supabase
          .from("profiles")
          .upsert(
            {
              id: user.id,
              email: user.email || formData.email,
              full_name: formData.fullName,
              phone: formData.phone,
            },
            { onConflict: "id" }
          );
        if (profileError) {
          console.error("Profile upsert error:", profileError);
        }
      }

      // Create shipping address string
      const shippingAddress = `${formData.fullName}\n${formData.address}\n${formData.city}, ${formData.state} ${formData.zipCode}\nEmail: ${formData.email}\nPhone: ${formData.phone}${formData.notes ? `\nNotes: ${formData.notes}` : ""}`;

      // Generate order number
      const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

      // Create order (user_id null for guests)
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert([
          {
            user_id: user?.id ?? null,
            guest_email: user ? null : formData.email,
            guest_name: user ? null : formData.fullName,
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
          } as any,
        ])
        .select()
        .single();

      if (orderError) {
        console.error("Order creation error:", orderError);
        throw new Error(`Failed to create order: ${orderError.message}`);
      }

      if (!order) {
        throw new Error("Order was not created");
      }

      // Create order items
      const orderItems = items.map((item) => ({
        order_id: order.id,
        product_name: item.name,
        product_image: item.image,
        price: parsePrice(item.price),
        quantity: item.quantity,
      }));

      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItems);

      if (itemsError) {
        console.error("Order items creation error:", itemsError);
        throw new Error(`Failed to create order items: ${itemsError.message}`);
      }

      // Clear cart and show success
      clearCart();
      toast.success("Order placed successfully! We will confirm your 50% deposit.");
      navigate(user ? "/profile" : "/");
    } catch (error: any) {
      console.error("Checkout error:", error);
      const errorMessage = error?.message || error?.toString() || "Failed to place order. Please try again.";
      toast.error(errorMessage);
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
      <div className="flex-1">
        <div className="bg-background py-6 sm:py-8">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="mb-2">
              <Breadcrumbs />
            </div>
          </div>
        </div>
        <div className="py-6 sm:py-8 md:py-12 bg-background">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="grid gap-6 sm:gap-8 lg:grid-cols-2 mt-4 sm:mt-6">
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
                        className={`text-base ${errors.fullName ? "border-destructive" : ""}`}
                      />
                      {errors.fullName && (
                        <p className="text-sm text-destructive">{errors.fullName}</p>
                      )}
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
                           className={`text-base ${errors.email ? "border-destructive" : ""}`}
                         />
                         {errors.email && (
                           <p className="text-sm text-destructive">{errors.email}</p>
                         )}
                      </div>
                      <div className="space-y-2 sm:col-span-1">
                        <Label htmlFor="phone" className="text-sm">Phone *</Label>
                         <Input
                           id="phone"
                           name="phone"
                           type="tel"
                           value={formData.phone}
                           onChange={handleInputChange}
                           placeholder="e.g., 0721234567"
                           maxLength={10}
                           required
                           className={`text-base ${errors.phone ? "border-destructive" : ""}`}
                         />
                         {errors.phone && (
                           <p className="text-sm text-destructive">{errors.phone}</p>
                         )}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="address" className="text-sm">Address *</Label>
                       <Input
                         id="address"
                         name="address"
                         value={formData.address}
                         onChange={handleInputChange}
                         placeholder="e.g., 123 Main Street, Pretoria"
                         required
                         className={`text-base ${errors.address ? "border-destructive" : ""}`}
                       />
                       {errors.address && (
                         <p className="text-sm text-destructive">{errors.address}</p>
                       )}
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
                          className={`text-base ${errors.postnetBranch ? "border-destructive" : ""}`}
                        />
                        {errors.postnetBranch && (
                          <p className="text-sm text-destructive">{errors.postnetBranch}</p>
                        )}
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
                          className={`text-base ${errors.pepAddress ? "border-destructive" : ""}`}
                        />
                        {errors.pepAddress && (
                          <p className="text-sm text-destructive">{errors.pepAddress}</p>
                        )}
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
                          className={`text-base ${errors.city ? "border-destructive" : ""}`}
                        />
                        {errors.city && (
                          <p className="text-sm text-destructive">{errors.city}</p>
                        )}
                      </div>
                      <div className="space-y-2 sm:col-span-1">
                        <Label htmlFor="state" className="text-sm">State *</Label>
                        <Input
                          id="state"
                          name="state"
                          value={formData.state}
                          onChange={handleInputChange}
                          required
                          className={`text-base ${errors.state ? "border-destructive" : ""}`}
                        />
                        {errors.state && (
                          <p className="text-sm text-destructive">{errors.state}</p>
                        )}
                      </div>
                      <div className="space-y-2 col-span-2 sm:col-span-1">
                        <Label htmlFor="zipCode" className="text-sm">ZIP Code *</Label>
                        <Input
                          id="zipCode"
                          name="zipCode"
                          value={formData.zipCode}
                          onChange={handleInputChange}
                          required
                          className={`text-base ${errors.zipCode ? "border-destructive" : ""}`}
                        />
                        {errors.zipCode && (
                          <p className="text-sm text-destructive">{errors.zipCode}</p>
                        )}
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
                      <span className="font-medium">R{subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Estimated Shipping</span>
                      <span className="font-medium">R{shippingEstimate.toFixed(2)}</span>
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
                      <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                        Please make a manual payment via EFT/bank transfer and send proof via WhatsApp. Your order will remain in Pending status until we confirm the deposit.
                      </p>
                      <div className="text-sm text-muted-foreground space-y-1">
                        <p><strong>WhatsApp:</strong> Send proof and your order number once submitted.</p>
                        <p><strong>Reference:</strong> Use your Order Number for EFT reference.</p>
                      </div>
                    </div>
                    <div className="rounded-lg bg-background/50 p-4 border border-primary/30">
                      <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                        <span className="text-xl">📦</span>
                        Shipping Details
                      </h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        PostNet: choose your nearest branch. PEP: we'll generate a Paxi code and send it to you for collection at your nearest PEP store.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Checkout;
