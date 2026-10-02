-- Migration: 20260927055047_add_branch_scoped_top_products_report

CREATE OR REPLACE FUNCTION public.report_top_products(
  p_from timestamptz,
  p_to timestamptz,
  p_limit integer DEFAULT 10,
  p_branch_id uuid DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path TO 'public', 'pg_temp'
AS $function$
DECLARE
  v_result JSONB;
  v_limit integer;
BEGIN
  IF NOT is_active_user() OR NOT is_admin() THEN
    RETURN jsonb_build_object('success', false, 'error', 'غير مصرح');
  END IF;

  v_limit := LEAST(GREATEST(COALESCE(p_limit, 10), 1), 100);

  SELECT jsonb_agg(row_to_json(t))
  INTO v_result
  FROM (
    SELECT
      oi.product_name,
      SUM(oi.quantity)::INT AS total_quantity,
      SUM(oi.total_price) AS total_revenue
    FROM order_items oi
    JOIN orders o ON o.id = oi.order_id
    WHERE o.created_at BETWEEN p_from AND p_to
      AND o.status = 'delivered'
      AND (p_branch_id IS NULL OR o.branch_id = p_branch_id)
    GROUP BY oi.product_name
    ORDER BY total_revenue DESC
    LIMIT v_limit
  ) t;

  RETURN jsonb_build_object(
    'success', true,
    'products', COALESCE(v_result, '[]'::jsonb)
  );
END;
$function$;
