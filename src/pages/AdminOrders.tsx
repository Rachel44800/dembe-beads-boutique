import { useEffect, useMemo, useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Copy } from "lucide-react";
import { usePageTitle } from "@/hooks/usePageTitle";

type Order = {
  id: string;
  order_number: string;
  user_id: string;
  total_amount: number;
  status: string;
  payment_status: string;
  currency: string;
  shipping_method: string | null;
  postnet_branch: string | null;
  pep_address: string | null;
  paxi_code: string | null;
  deposit_required: number | null;
  deposit_received_at: string | null;
  created_at: string;
};

type OrderWithItems = Order & { items: Array<{ id: string; product_name: string; quantity: number; price: number }>} ;

const AdminOrders = () => {
  usePageTitle("Admin Orders");
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [orders, setOrders] = useState<OrderWithItems[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setIsAdmin(false); return; }
      const { data, error } = await supabase.rpc("has_role", { _user_id: user.id, _role: "admin" });
      if (error) { console.error(error); setIsAdmin(false); return; }
      setIsAdmin(!!data);
    };
    checkAdmin();
  }, []);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const { data: ordersData, error } = await supabase
        .from("orders")
        .select("*, order_items(id, product_name, quantity, price)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      const normalized: OrderWithItems[] = (ordersData || []).map((o: any) => ({
        id: o.id,
        order_number: o.order_number,
        user_id: o.user_id,
        total_amount: Number(o.total_amount),
        status: o.status,
        payment_status: o.payment_status,
        currency: o.currency || "ZAR",
        shipping_method: o.shipping_method,
        postnet_branch: o.postnet_branch,
        pep_address: o.pep_address,
        paxi_code: o.paxi_code,
        deposit_required: o.deposit_required ?? null,
        deposit_received_at: o.deposit_received_at ?? null,
        created_at: o.created_at,
        items: o.order_items || [],
      }));
      setOrders(normalized);
    } catch (e) {
      console.error(e);
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { if (isAdmin) { loadOrders(); } }, [isAdmin]);

  const handleConfirmDeposit = async (order: OrderWithItems) => {
    try {
      const { error } = await supabase
        .from("orders")
        .update({ payment_status: "deposit_confirmed" } as any)
        .eq("id", order.id);
      if (error) throw error;
      toast.success(`Deposit confirmed for ${order.order_number}`);
      loadOrders();
    } catch (e) {
      console.error(e);
      toast.error("Failed to confirm deposit");
    }
  };

  const handleUpdatePaxiCode = async (order: OrderWithItems, paxiCode: string) => {
    try {
      const { error } = await supabase
        .from("orders")
        .update({ paxi_code: paxiCode })
        .eq("id", order.id);
      if (error) throw error;
      toast.success("Paxi code saved");
      loadOrders();
    } catch (e) {
      console.error(e);
      toast.error("Failed to save Paxi code");
    }
  };

  const handleUpdateStatus = async (order: OrderWithItems, status: string) => {
    try {
      const { error } = await supabase
        .from("orders")
        .update({ status })
        .eq("id", order.id);
      if (error) throw error;
      toast.success("Order status updated");
      loadOrders();
    } catch (e) {
      console.error(e);
      toast.error("Failed to update status");
    }
  };

  const buildWhatsappMessage = (order: OrderWithItems) => {
    const lines = [
      `Order ${order.order_number}`,
      `Total: R${order.total_amount.toFixed(2)}`,
      order.deposit_required ? `Deposit required: R${order.deposit_required.toFixed(2)}` : undefined,
      `Payment status: ${order.payment_status}`,
      order.shipping_method ? `Shipping: ${order.shipping_method}` : undefined,
      order.shipping_method === "postnet" && order.postnet_branch ? `PostNet branch: ${order.postnet_branch}` : undefined,
      order.shipping_method === "pep" && order.paxi_code ? `Paxi code: ${order.paxi_code}` : undefined,
    ].filter(Boolean);
    return lines.join("\n");
  };

  const copyWhatsappTemplate = async (order: OrderWithItems) => {
    try {
      await navigator.clipboard.writeText(buildWhatsappMessage(order));
      toast.success("Message copied");
    } catch {
      toast.error("Failed to copy message");
    }
  };

  const content = useMemo(() => {
    if (isAdmin === null) return <div className="py-24 text-center">Checking permissions…</div>;
    if (isAdmin === false) return <div className="py-24 text-center">Not authorized</div>;
    return (
      <div className="container mx-auto px-4 sm:px-6 py-8 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Orders</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div>Loading…</div>
            ) : (
              <div className="space-y-6">
                {orders.map((order) => (
                  <div key={order.id} className="border rounded-lg p-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div>
                        <div className="text-sm text-muted-foreground">Order</div>
                        <div className="font-semibold">{order.order_number}</div>
                        <div className="text-sm">Placed: {new Date(order.created_at).toLocaleString()}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-muted-foreground">Total</div>
                        <div className="font-bold">R{order.total_amount.toFixed(2)}</div>
                      </div>
                    </div>
                    <Separator className="my-3" />
                    <div className="grid gap-3 sm:grid-cols-3">
                      <div>
                        <div className="text-sm text-muted-foreground">Payment</div>
                        <div className="font-medium">{order.payment_status}</div>
                        {order.deposit_required ? (
                          <div className="text-xs text-muted-foreground">Deposit: R{order.deposit_required.toFixed(2)}</div>
                        ) : null}
                        <div className="mt-2 flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => handleConfirmDeposit(order)}>Confirm Deposit</Button>
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Shipping</div>
                        <div className="font-medium capitalize">{order.shipping_method || "-"}</div>
                        {order.shipping_method === "postnet" && (
                          <div className="text-xs text-muted-foreground">Branch: {order.postnet_branch || "-"}</div>
                        )}
                        {order.shipping_method === "pep" && (
                          <div className="text-xs text-muted-foreground">Paxi code: {order.paxi_code || "-"}</div>
                        )}
                        {order.shipping_method === "pep" && (
                          <div className="mt-2 flex items-center gap-2">
                            <Input
                              placeholder="Enter Paxi code"
                              defaultValue={order.paxi_code || ""}
                              onBlur={(e) => handleUpdatePaxiCode(order, e.target.value)}
                            />
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Order Status</div>
                        <div className="mt-2 flex gap-2 flex-wrap">
                          {[
                            "pending",
                            "processing",
                            "shipped",
                            "delivered",
                            "cancelled",
                          ].map((s) => (
                            <Button key={s} size="sm" variant={order.status === s ? "default" : "outline"} onClick={() => handleUpdateStatus(order, s)}>
                              {s}
                            </Button>
                          ))}
                        </div>
                        <div className="mt-3 flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => copyWhatsappTemplate(order)}>
                            <Copy className="h-4 w-4 mr-1" /> Copy WhatsApp message
                          </Button>
                          <a
                            className="inline-flex items-center"
                            href={`https://wa.me/?text=${encodeURIComponent(buildWhatsappMessage(order))}`}
                            target="_blank"
                            rel="noreferrer"
                          >
                            <Button size="sm" variant="outline">Open WhatsApp</Button>
                          </a>
                        </div>
                      </div>
                    </div>
                    <Separator className="my-3" />
                    <div className="space-y-1">
                      {order.items.map((it) => (
                        <div key={it.id} className="flex justify-between text-sm">
                          <span>{it.product_name} × {it.quantity}</span>
                          <span>R{(it.price * it.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }, [isAdmin, loading, orders]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <div className="flex-1 bg-background">{content}</div>
      <Footer />
    </div>
  );
};

export default AdminOrders;


