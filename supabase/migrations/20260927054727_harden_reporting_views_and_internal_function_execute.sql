-- Migration: 20260927054727_harden_reporting_views_and_internal_function_execute

ALTER VIEW public.v_daily_sales
  SET (security_invoker = true);

ALTER VIEW public.v_top_products
  SET (security_invoker = true);

ALTER VIEW public.v_driver_performance
  SET (security_invoker = true);

REVOKE EXECUTE ON FUNCTION public.rls_auto_enable() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.rls_auto_enable() FROM anon, authenticated;

REVOKE EXECUTE ON FUNCTION public.st_estimatedextent(text, text) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.st_estimatedextent(text, text) FROM anon, authenticated;

REVOKE EXECUTE ON FUNCTION public.st_estimatedextent(text, text, text) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.st_estimatedextent(text, text, text) FROM anon, authenticated;

REVOKE EXECUTE ON FUNCTION public.st_estimatedextent(text, text, text, boolean) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.st_estimatedextent(text, text, text, boolean) FROM anon, authenticated;
