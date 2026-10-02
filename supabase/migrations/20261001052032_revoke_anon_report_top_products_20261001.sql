-- Migration: 20261001052032_revoke_anon_report_top_products_20261001

REVOKE EXECUTE ON FUNCTION public.report_top_products(
  timestamptz, timestamptz, integer, uuid
) FROM PUBLIC, anon;

GRANT EXECUTE ON FUNCTION public.report_top_products(
  timestamptz, timestamptz, integer, uuid
) TO authenticated;
