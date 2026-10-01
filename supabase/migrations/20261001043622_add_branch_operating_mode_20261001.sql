-- ============================================================
-- Dolma Factory - Branch Operating Mode
-- Safe additive migration.
-- No existing data is deleted.
-- create_order_secure is NOT replaced.
-- ============================================================

-- ------------------------------------------------------------
-- 1. Add operating-mode configuration to branches
-- ------------------------------------------------------------

ALTER TABLE public.branches
  ADD COLUMN IF NOT EXISTS operating_status text
    NOT NULL DEFAULT 'OPEN'
    CHECK (operating_status IN (
      'OPEN',
      'BUSY',
      'VERY_BUSY',
      'CLOSED',
      'PAUSED'
    )),

  ADD COLUMN IF NOT EXISTS accepts_orders boolean
    NOT NULL DEFAULT true,

  ADD COLUMN IF NOT EXISTS delivery_enabled boolean
    NOT NULL DEFAULT true,

  ADD COLUMN IF NOT EXISTS pickup_enabled boolean
    NOT NULL DEFAULT true,

  ADD COLUMN IF NOT EXISTS preparation_time_min integer
    NOT NULL DEFAULT 15
    CHECK (
      preparation_time_min >= 0
      AND preparation_time_min <= 1440
    ),

  ADD COLUMN IF NOT EXISTS preparation_time_max integer
    NOT NULL DEFAULT 30
    CHECK (
      preparation_time_max >= 0
      AND preparation_time_max <= 1440
    ),

  ADD COLUMN IF NOT EXISTS minimum_order_amount numeric(10,2)
    NOT NULL DEFAULT 0
    CHECK (minimum_order_amount >= 0),

  ADD COLUMN IF NOT EXISTS product_visibility_mode text
    NOT NULL DEFAULT 'ALL'
    CHECK (
      product_visibility_mode IN (
        'ALL',
        'IN_STOCK_ONLY'
      )
    ),

  ADD COLUMN IF NOT EXISTS promotions_enabled boolean
    NOT NULL DEFAULT true,

  ADD COLUMN IF NOT EXISTS pause_reason text,

  ADD COLUMN IF NOT EXISTS resume_at timestamptz;


-- ------------------------------------------------------------
-- 2. Validate existing/new branch operating configuration
-- ------------------------------------------------------------

ALTER TABLE public.branches
  DROP CONSTRAINT IF EXISTS branches_preparation_time_range_check;

ALTER TABLE public.branches
  ADD CONSTRAINT branches_preparation_time_range_check
  CHECK (
    preparation_time_min >= 0
    AND preparation_time_max >= preparation_time_min
    AND preparation_time_max <= 1440
  );


-- ------------------------------------------------------------
-- 3. Admin RPC for changing branch operating mode
-- ------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.admin_update_branch_operating_mode(
  p_branch_id uuid,
  p_operating_status text,
  p_accepts_orders boolean,
  p_delivery_enabled boolean,
  p_pickup_enabled boolean,
  p_preparation_time_min integer,
  p_preparation_time_max integer,
  p_minimum_order_amount numeric,
  p_product_visibility_mode text,
  p_promotions_enabled boolean,
  p_pause_reason text DEFAULT NULL,
  p_resume_at timestamptz DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_user_id uuid := auth.uid();
BEGIN

  -- Only authenticated admins/super admins.
  IF v_user_id IS NULL OR NOT public.is_admin() THEN
    RAISE EXCEPTION 'غير مصرح';
  END IF;


  -- Operating status validation.
  IF p_operating_status NOT IN (
    'OPEN',
    'BUSY',
    'VERY_BUSY',
    'CLOSED',
    'PAUSED'
  ) THEN
    RAISE EXCEPTION 'حالة تشغيل غير صحيحة';
  END IF;


  -- Product visibility validation.
  IF p_product_visibility_mode NOT IN (
    'ALL',
    'IN_STOCK_ONLY'
  ) THEN
    RAISE EXCEPTION 'وضع المنتجات غير صحيح';
  END IF;


  -- Preparation time validation.
  IF p_preparation_time_min IS NULL
     OR p_preparation_time_max IS NULL
     OR p_preparation_time_min < 0
     OR p_preparation_time_max < p_preparation_time_min
     OR p_preparation_time_max > 1440 THEN

    RAISE EXCEPTION 'وقت التجهيز غير صحيح';
  END IF;


  -- Minimum order validation.
  IF p_minimum_order_amount IS NULL
     OR p_minimum_order_amount < 0 THEN

    RAISE EXCEPTION 'الحد الأدنى للطلب غير صحيح';
  END IF;


  -- Branch existence validation.
  IF NOT EXISTS (
    SELECT 1
    FROM public.branches
    WHERE id = p_branch_id
  ) THEN
    RAISE EXCEPTION 'الفرع غير موجود';
  END IF;


  -- Update operating configuration.
  UPDATE public.branches
  SET
    operating_status = p_operating_status,
    accepts_orders = COALESCE(p_accepts_orders, false),
    delivery_enabled = COALESCE(p_delivery_enabled, false),
    pickup_enabled = COALESCE(p_pickup_enabled, false),
    preparation_time_min = p_preparation_time_min,
    preparation_time_max = p_preparation_time_max,
    minimum_order_amount = p_minimum_order_amount,
    product_visibility_mode = p_product_visibility_mode,
    promotions_enabled = COALESCE(p_promotions_enabled, false),
    pause_reason = NULLIF(TRIM(COALESCE(p_pause_reason, '')), ''),
    resume_at = p_resume_at
  WHERE id = p_branch_id;


  RETURN jsonb_build_object(
    'success', true,
    'branch_id', p_branch_id
  );

END;
$$;


-- Do not expose this RPC to anonymous users.
REVOKE EXECUTE ON FUNCTION public.admin_update_branch_operating_mode(
  uuid,
  text,
  boolean,
  boolean,
  boolean,
  integer,
  integer,
  numeric,
  text,
  boolean,
  text,
  timestamptz
) FROM PUBLIC, anon;

GRANT EXECUTE ON FUNCTION public.admin_update_branch_operating_mode(
  uuid,
  text,
  boolean,
  boolean,
  boolean,
  integer,
  integer,
  numeric,
  text,
  boolean,
  text,
  timestamptz
) TO authenticated;


-- ------------------------------------------------------------
-- 4. Server-side protection for order creation
--
-- This does NOT replace create_order_secure.
-- It runs automatically before an order is inserted.
-- ------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.enforce_branch_operating_mode_on_order()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_branch public.branches%ROWTYPE;
BEGIN

  -- Verify branch exists and is active.
  SELECT *
  INTO v_branch
  FROM public.branches
  WHERE id = NEW.branch_id
    AND is_active = true;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'الفرع غير متاح';
  END IF;


  -- Closed or temporarily paused.
  IF v_branch.operating_status IN ('CLOSED', 'PAUSED') THEN

    RAISE EXCEPTION '%',
      COALESCE(
        NULLIF(TRIM(v_branch.pause_reason), ''),
        CASE
          WHEN v_branch.operating_status = 'PAUSED'
            THEN 'استقبال الطلبات متوقف مؤقتًا'
          ELSE
            'الفرع مغلق حاليًا'
        END
      );

  END IF;


  -- General order acceptance switch.
  IF NOT COALESCE(v_branch.accepts_orders, false) THEN
    RAISE EXCEPTION 'استقبال الطلبات متوقف حاليًا';
  END IF;


  -- Delivery switch.
  IF LOWER(TRIM(NEW.order_type)) = 'delivery'
     AND NOT COALESCE(v_branch.delivery_enabled, false) THEN

    RAISE EXCEPTION 'التوصيل غير متاح حاليًا لهذا الفرع';

  END IF;


  -- Pickup switch.
  IF LOWER(TRIM(NEW.order_type)) = 'pickup'
     AND NOT COALESCE(v_branch.pickup_enabled, false) THEN

    RAISE EXCEPTION 'الاستلام من الفرع غير متاح حاليًا';

  END IF;


  -- Minimum order amount.
  -- NEW.subtotal is already calculated by create_order_secure
  -- using database prices.
  IF COALESCE(v_branch.minimum_order_amount, 0) > 0
     AND COALESCE(NEW.subtotal, 0)
         < v_branch.minimum_order_amount THEN

    RAISE EXCEPTION
      'الحد الأدنى للطلب % ريال',
      v_branch.minimum_order_amount;

  END IF;


  RETURN NEW;

END;
$$;


-- ------------------------------------------------------------
-- 5. Install the order protection trigger
-- ------------------------------------------------------------

DROP TRIGGER IF EXISTS trg_enforce_branch_operating_mode
ON public.orders;

CREATE TRIGGER trg_enforce_branch_operating_mode
BEFORE INSERT ON public.orders
FOR EACH ROW
EXECUTE FUNCTION public.enforce_branch_operating_mode_on_order();


-- This function is internal and must not be directly callable
-- through the Supabase Data API.
REVOKE EXECUTE ON FUNCTION public.enforce_branch_operating_mode_on_order()
FROM PUBLIC, anon, authenticated;


-- ============================================================
-- END
-- ============================================================
