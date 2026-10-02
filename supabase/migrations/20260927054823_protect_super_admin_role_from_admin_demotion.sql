-- Migration: 20260927054823_protect_super_admin_role_from_admin_demotion

CREATE OR REPLACE FUNCTION public.admin_update_user_role(
  p_user_id uuid,
  p_new_role text,
  p_branch_id uuid DEFAULT NULL::uuid
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public', 'pg_temp'
AS $function$
DECLARE
  v_my_role text;
  v_target_role text;
BEGIN
  v_my_role := get_my_role();

  IF v_my_role NOT IN ('admin', 'super_admin') THEN
    RETURN jsonb_build_object('success', false, 'error', 'غير مصرح');
  END IF;

  IF p_new_role NOT IN (
    'customer',
    'cashier',
    'branch_manager',
    'driver',
    'admin',
    'super_admin'
  ) THEN
    RETURN jsonb_build_object('success', false, 'error', 'دور غير صالح');
  END IF;

  SELECT role
  INTO v_target_role
  FROM profiles
  WHERE id = p_user_id;

  IF v_target_role IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'المستخدم غير موجود');
  END IF;

  IF v_my_role = 'admin' AND v_target_role = 'super_admin' THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'لا يمكن للمشرف تعديل دور super_admin'
    );
  END IF;

  IF v_my_role = 'admin' AND p_new_role = 'super_admin' THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'لا يمكن للمشرف تعيين دور super_admin'
    );
  END IF;

  UPDATE profiles
  SET role = p_new_role,
      branch_id = p_branch_id,
      updated_at = NOW()
  WHERE id = p_user_id;

  RETURN jsonb_build_object('success', true);
END;
$function$;
