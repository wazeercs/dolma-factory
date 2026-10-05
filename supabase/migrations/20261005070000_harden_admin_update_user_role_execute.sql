-- Migration: 20261005070000_harden_admin_update_user_role_execute

REVOKE EXECUTE
ON FUNCTION public.admin_update_user_role(uuid, text, uuid)
FROM PUBLIC;

REVOKE EXECUTE
ON FUNCTION public.admin_update_user_role(uuid, text, uuid)
FROM anon;

GRANT EXECUTE
ON FUNCTION public.admin_update_user_role(uuid, text, uuid)
TO authenticated;
