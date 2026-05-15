-- Allow guest checkout: user_id becomes optional on orders
ALTER TABLE public.orders ALTER COLUMN user_id DROP NOT NULL;

-- Add guest contact fields so we can reach guest customers
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS guest_email TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS guest_name TEXT;

-- Update insert policy to allow either authenticated owner OR guest insert (no user_id)
DROP POLICY IF EXISTS "Users can insert their own orders" ON public.orders;
CREATE POLICY "Users or guests can insert orders"
ON public.orders
FOR INSERT
WITH CHECK (
  (auth.uid() IS NOT NULL AND auth.uid() = user_id)
  OR (user_id IS NULL)
);

-- Allow guests to insert order_items for orders without a user_id
CREATE POLICY "Guests can insert items for guest orders"
ON public.order_items
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.orders o
    WHERE o.id = order_items.order_id
      AND (
        (auth.uid() IS NOT NULL AND o.user_id = auth.uid())
        OR o.user_id IS NULL
      )
  )
);