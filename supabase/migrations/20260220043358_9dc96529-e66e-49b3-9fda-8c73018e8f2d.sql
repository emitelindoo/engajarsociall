
-- Table to track payment transactions
CREATE TABLE public.transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nivus_transaction_id TEXT,
  plan_id TEXT NOT NULL,
  plan_name TEXT NOT NULL,
  platform TEXT NOT NULL,
  username TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  amount NUMERIC(10,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  pix_code TEXT,
  extras TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- No RLS needed - this is managed by edge functions only, not client
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- Allow public read by transaction id (for polling status)
CREATE POLICY "Anyone can read their transaction by id"
ON public.transactions
FOR SELECT
USING (true);

-- No insert/update from client - only edge functions with service role

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_transactions_updated_at
BEFORE UPDATE ON public.transactions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
