-- Extend orders with deposit, payment, and shipping fields
ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS currency TEXT NOT NULL DEFAULT 'ZAR',
  ADD COLUMN IF NOT EXISTS payment_status TEXT NOT NULL DEFAULT 'pending_deposit',
  ADD COLUMN IF NOT EXISTS deposit_required NUMERIC(10,2) NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS deposit_received_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS manual_payment_reference TEXT,
  ADD COLUMN IF NOT EXISTS shipping_method TEXT,
  ADD COLUMN IF NOT EXISTS postnet_branch TEXT,
  ADD COLUMN IF NOT EXISTS pep_address TEXT,
  ADD COLUMN IF NOT EXISTS paxi_code TEXT,
  ADD COLUMN IF NOT EXISTS notes TEXT;

-- Optional: lightweight status check constraints (text-based for flexibility)
-- Commented out to avoid breaking existing data; uncomment if desired.
-- ALTER TABLE public.orders
--   ADD CONSTRAINT payment_status_valid CHECK (payment_status IN (
--     'pending_deposit','deposit_confirmed','paid_full','cancelled','refunded'
--   ));


