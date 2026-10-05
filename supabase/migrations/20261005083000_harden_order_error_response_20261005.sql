-- Migration: 20261005083000_harden_order_error_response_20261005
-- Prevent PostgreSQL error details from being returned to RPC callers.

DO $migration$
DECLARE
    v_def text;
    v_new_def text;
    v_old text;
    v_new text;
BEGIN
    SELECT pg_get_functiondef(
        'public.create_order_secure(
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
        )'::regprocedure
    )
    INTO v_def;

    v_old := $old$
EXCEPTION
    WHEN OTHERS THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', SQLERRM
        );
$old$;

    v_new := $new$
EXCEPTION
    WHEN OTHERS THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', 'تعذر إنشاء الطلب حاليًا',
            'code', 'ORDER_CREATION_FAILED'
        );
$new$;

    IF POSITION(v_old IN v_def) = 0 THEN
        RAISE EXCEPTION 'Expected exception block was not found';
    END IF;

    v_new_def := REPLACE(v_def, v_old, v_new);

    EXECUTE v_new_def;
END;
$migration$;
