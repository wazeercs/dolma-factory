-- Migration: 20261005080000_harden_order_payment_method_20261005
-- Prevent direct creation of new card orders until a real payment gateway is integrated.

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
    IF LOWER(TRIM(p_payment_method)) NOT IN ('card', 'cash') THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', 'طريقة الدفع غير صالحة',
            'code', 'INVALID_PAYMENT_METHOD'
        );
    END IF;
$old$;

    v_new := $new$
    IF LOWER(TRIM(p_payment_method)) NOT IN ('card', 'cash') THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', 'طريقة الدفع غير صالحة',
            'code', 'INVALID_PAYMENT_METHOD'
        );
    END IF;

    IF LOWER(TRIM(p_payment_method)) = 'card' THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', 'الدفع الإلكتروني غير متاح حاليًا. اختر الدفع نقدًا.',
            'code', 'CARD_PAYMENT_UNAVAILABLE'
        );
    END IF;
$new$;

    IF POSITION(v_old IN v_def) = 0 THEN
        RAISE EXCEPTION 'Expected payment validation block was not found';
    END IF;

    v_new_def := REPLACE(v_def, v_old, v_new);

    EXECUTE v_new_def;
END;
$migration$;
