-- Migration: 20260927054231_harden_function_search_paths_and_cleanup_grants

ALTER FUNCTION public.cleanup_idempotency()
  SET search_path = public, pg_temp;

ALTER FUNCTION public.update_updated_at()
  SET search_path = public, pg_temp;

ALTER FUNCTION public.get_nearest_branch(double precision, double precision, double precision)
  SET search_path = public, pg_temp;

ALTER FUNCTION public.cleanup_rate_limits()
  SET search_path = public, pg_temp;

ALTER FUNCTION public.to_hijri_ar(date)
  SET search_path = public, pg_temp;

ALTER FUNCTION public.calculate_tier(integer)
  SET search_path = public, pg_temp;

ALTER FUNCTION public.to_hijri(date)
  SET search_path = public, pg_temp;

REVOKE EXECUTE ON FUNCTION public.cleanup_idempotency() FROM anon, authenticated;

REVOKE EXECUTE ON FUNCTION public.cleanup_rate_limits() FROM anon, authenticated;

REVOKE EXECUTE ON FUNCTION public.rls_auto_enable() FROM anon, authenticated;
