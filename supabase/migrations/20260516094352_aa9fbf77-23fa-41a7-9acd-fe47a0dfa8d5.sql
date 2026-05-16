-- Allow guests to read their just-inserted orders so PostgREST can return the row
CREATE POLICY "Guests can view guest orders"
ON public.orders
FOR SELECT
USING (user_id IS NULL);

CREATE POLICY "Guests can view guest order items"
ON public.order_items
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.orders o
    WHERE o.id = order_items.order_id AND o.user_id IS NULL
  )
);