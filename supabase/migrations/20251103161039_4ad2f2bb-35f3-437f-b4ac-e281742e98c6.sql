-- Add missing columns to orders table
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS payment_status text DEFAULT 'pending_deposit',
ADD COLUMN IF NOT EXISTS currency text DEFAULT 'ZAR',
ADD COLUMN IF NOT EXISTS deposit_required numeric,
ADD COLUMN IF NOT EXISTS shipping_method text,
ADD COLUMN IF NOT EXISTS postnet_branch text,
ADD COLUMN IF NOT EXISTS pep_address text,
ADD COLUMN IF NOT EXISTS paxi_code text,
ADD COLUMN IF NOT EXISTS notes text;