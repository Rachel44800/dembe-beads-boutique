-- Add INSERT policy for order_items table
-- This allows users to insert order items for orders they own

DROP POLICY IF EXISTS "Users can insert their own order items" ON public.order_items;

CREATE POLICY "Users can insert their own order items"
  ON public.order_items FOR INSERT
  WITH CHECK (auth.uid() IN (SELECT user_id FROM public.orders WHERE id = order_id));

