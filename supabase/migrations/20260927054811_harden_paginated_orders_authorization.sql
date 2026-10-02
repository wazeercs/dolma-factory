-- Migration: 20260927054811_harden_paginated_orders_authorization

CREATE OR REPLACE FUNCTION public.fetch_orders_paginated(
  p_branch_id uuid DEFAULT NULL::uuid,
  p_only_active boolean DEFAULT false,
  p_limit integer DEFAULT 20,
  p_offset integer DEFAULT 0,
  p_status text DEFAULT NULL::text,
  p_search text DEFAULT NULL::text
)
RETURNS jsonb
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path TO 'public', 'pg_temp'
AS $function$
DECLARE
  v_result JSONB;
  v_total INT;
  v_role TEXT;
BEGIN
  IF NOT is_active_user() THEN
    RETURN jsonb_build_object('success', false, 'error', 'غير مصرح');
  END IF;

  v_role := get_my_role();

  IF v_role NOT IN ('admin', 'super_admin', 'cashier', 'branch_manager') THEN
    RETURN jsonb_build_object('success', false, 'error', 'غير مصرح');
  END IF;

  IF v_role IN ('cashier', 'branch_manager') THEN
    p_branch_id := get_my_branch();

    IF p_branch_id IS NULL THEN
      RETURN jsonb_build_object('success', false, 'error', 'الفرع غير محدد');
    END IF;
  END IF;

  p_limit := LEAST(GREATEST(COALESCE(p_limit, 20), 1), 100);
  p_offset := GREATEST(COALESCE(p_offset, 0), 0);

  IF p_search IS NOT NULL THEN
    p_search := LEFT(TRIM(p_search), 100);
  END IF;

  SELECT COUNT(*) INTO v_total
  FROM orders
  WHERE (p_branch_id IS NULL OR branch_id = p_branch_id)
    AND (NOT p_only_active OR status NOT IN ('delivered', 'cancelled', 'rejected'))
    AND (p_status IS NULL OR status = p_status)
    AND (
      p_search IS NULL
      OR customer_name ILIKE '%' || p_search || '%'
      OR customer_phone ILIKE '%' || p_search || '%'
      OR order_number::text = p_search
    );

  WITH page_data AS (
    SELECT
      o.id,
      o.order_number,
      o.customer_name,
      o.customer_phone,
      o.order_type,
      o.status,
      o.payment_method,
      o.payment_status,
      o.total,
      o.discount,
      o.delivery_fee,
      o.coupon_code,
      o.driver_id,
      o.driver_name,
      o.created_at,
      o.updated_at,
      o.branch_id,
      (
        SELECT jsonb_agg(
          jsonb_build_object(
            'id', oi.id,
            'product_name', oi.product_name,
            'flavor_name', oi.flavor_name,
            'variant_name', oi.variant_name,
            'quantity', oi.quantity,
            'unit_price', oi.unit_price,
            'total_price', oi.total_price
          )
        )
        FROM order_items oi
        WHERE oi.order_id = o.id
      ) AS order_items
    FROM orders o
    WHERE (p_branch_id IS NULL OR o.branch_id = p_branch_id)
      AND (NOT p_only_active OR o.status NOT IN ('delivered', 'cancelled', 'rejected'))
      AND (p_status IS NULL OR o.status = p_status)
      AND (
        p_search IS NULL
        OR o.customer_name ILIKE '%' || p_search || '%'
        OR o.customer_phone ILIKE '%' || p_search || '%'
        OR o.order_number::text = p_search
      )
    ORDER BY o.created_at DESC
    LIMIT p_limit OFFSET p_offset
  )
  SELECT jsonb_agg(row_to_json(p)) INTO v_result
  FROM page_data p;

  RETURN jsonb_build_object(
    'success', true,
    'orders', COALESCE(v_result, '[]'::jsonb),
    'total', v_total,
    'limit', p_limit,
    'offset', p_offset
  );
END;
$function$;
