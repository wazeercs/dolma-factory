-- Migration: 20260927054412_add_missing_fk_indexes_and_optimize_auth_uid_policies_v2

CREATE INDEX IF NOT EXISTS coupons_branch_id_idx ON public.coupons (branch_id);
CREATE INDEX IF NOT EXISTS drivers_branch_id_idx ON public.drivers (branch_id);
CREATE INDEX IF NOT EXISTS menu_campaigns_branch_id_idx ON public.menu_campaigns (branch_id);
CREATE INDEX IF NOT EXISTS order_idempotency_order_id_idx ON public.order_idempotency (order_id);
CREATE INDEX IF NOT EXISTS order_items_order_id_idx ON public.order_items (order_id);
CREATE INDEX IF NOT EXISTS order_items_product_id_idx ON public.order_items (product_id);
CREATE INDEX IF NOT EXISTS order_status_history_order_id_idx ON public.order_status_history (order_id);
CREATE INDEX IF NOT EXISTS orders_driver_id_idx ON public.orders (driver_id);
CREATE INDEX IF NOT EXISTS orders_coupon_id_idx ON public.orders (coupon_id);
CREATE INDEX IF NOT EXISTS product_flavors_product_id_idx ON public.product_flavors (product_id);
CREATE INDEX IF NOT EXISTS product_variants_product_id_idx ON public.product_variants (product_id);
CREATE INDEX IF NOT EXISTS products_branch_id_idx ON public.products (branch_id);
CREATE INDEX IF NOT EXISTS user_roles_user_id_idx ON public.user_roles (user_id);

DROP POLICY IF EXISTS driver_self_read ON public.drivers;
CREATE POLICY driver_self_read ON public.drivers FOR SELECT
USING (is_active_user() AND user_id = (select auth.uid()));

DROP POLICY IF EXISTS profiles_self_read ON public.profiles;
CREATE POLICY profiles_self_read ON public.profiles FOR SELECT
USING (id = (select auth.uid()));

DROP POLICY IF EXISTS profiles_self_update_safe ON public.profiles;
CREATE POLICY profiles_self_update_safe ON public.profiles FOR UPDATE
USING ((id = (select auth.uid())) OR is_admin())
WITH CHECK (
  (id = (select auth.uid()))
  AND role = (select p.role from public.profiles p where p.id = (select auth.uid()))
  AND is_active = (select p.is_active from public.profiles p where p.id = (select auth.uid()))
  AND not (branch_id is distinct from (select p.branch_id from public.profiles p where p.id = (select auth.uid())))
  OR is_admin()
);
