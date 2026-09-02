ALTER TABLE public.transactions ADD COLUMN IF NOT EXISTS cakto_offer_id TEXT;
GRANT SELECT ON public.transactions TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.transactions TO authenticated;
GRANT ALL ON public.transactions TO service_role;