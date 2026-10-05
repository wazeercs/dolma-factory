-- Migration: 20261005073000_harden_public_order_rpc_execute

REVOKE EXECUTE
ON FUNCTION public.create_order_secure(
    uuid,
    text,
    text,
    text,
    text,
    text,
    double precision,
    double precision,
    text,
    text,
    text,
    text,
    jsonb
)
FROM PUBLIC;

GRANT EXECUTE
ON FUNCTION public.create_order_secure(
    uuid,
    text,
    text,
    text,
    text,
    text,
    double precision,
    double precision,
    text,
    text,
    text,
    text,
    jsonb
)
TO anon, authenticated;

REVOKE EXECUTE
ON FUNCTION public.track_order(integer, text)
FROM PUBLIC;

GRANT EXECUTE
ON FUNCTION public.track_order(integer, text)
TO anon, authenticated;
