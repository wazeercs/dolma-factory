-- Migration: 20260927054423_finish_fk_indexes_and_rls_initplan

CREATE INDEX IF NOT EXISTS campaign_products_product_id_idx ON public.campaign_products (product_id);
CREATE INDEX IF NOT EXISTS user_roles_branch_id_idx ON public.user_roles (branch_id);
CREATE INDEX IF NOT EXISTS user_roles_granted_by_idx ON public.user_roles (granted_by);

DROP INDEX IF EXISTS public.order_items_order_id_idx;
DROP INDEX IF EXISTS public.user_roles_user_id_idx;

DROP POLICY IF EXISTS driver_read_orders ON public.orders;
CREATE POLICY driver_read_orders ON public.orders FOR SELECT
USING (
  is_active_user()
  AND get_my_role() = 'driver'
  AND driver_id IN (
    SELECT d.id FROM public.drivers d
    WHERE d.user_id = (select auth.uid())
  )
);

DROP POLICY IF EXISTS read_order_items_secure ON public.order_items;
CREATE POLICY read_order_items_secure ON public.order_items FOR SELECT
USING (
  is_active_user()
  AND order_id IN (
    SELECT o.id FROM public.orders o
    WHERE (
      (get_my_role() = ANY (ARRAY['cashier'::text, 'branch_manager'::text]))
      AND o.branch_id = get_my_branch()
    )
    OR is_admin()
    OR (
      get_my_role() = 'driver'
      AND o.driver_id IN (
        SELECT d.id FROM public.drivers d
        WHERE d.user_id = (select auth.uid())
      )
    )
  )
);

DROP POLICY IF EXISTS read_status_history_secure ON public.order_status_history;
CREATE POLICY read_status_history_secure ON public.order_status_history FOR SELECT
USING (
  is_active_user()
  AND order_id IN (
    SELECT o.id FROM public.orders o
    WHERE (
      (get_my_role() = ANY (ARRAY['cashier'::text, 'branch_manager'::text]))
      AND o.branch_id = get_my_branch()
    )
    OR is_admin()
    OR (
      get_my_role() = 'driver'
      AND o.driver_id IN (
        SELECT d.id FROM public.drivers d
        WHERE d.user_id = (select auth.uid())
      )
    )
  )
);
