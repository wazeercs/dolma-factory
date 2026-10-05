-- Migration: 20261005081500_harden_order_input_lengths_20261005
-- Add server-side length validation for order input fields.

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
    -- =====================================================
    -- 5. Validate name
    -- =====================================================
    IF LENGTH(TRIM(p_customer_name)) < 2 THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', 'الاسم غير صالح'
        );
    END IF;
$old$;

    v_new := $new$
    -- =====================================================
    -- 5. Validate name
    -- =====================================================
    IF LENGTH(TRIM(p_customer_name)) < 2
       OR LENGTH(TRIM(p_customer_name)) > 50 THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', 'الاسم غير صالح',
            'code', 'INVALID_NAME_LENGTH'
        );
    END IF;

    IF p_delivery_address IS NOT NULL
       AND LENGTH(p_delivery_address) > 300 THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', 'عنوان التوصيل طويل جدًا',
            'code', 'INVALID_ADDRESS_LENGTH'
        );
    END IF;

    IF p_notes IS NOT NULL
       AND LENGTH(p_notes) > 500 THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', 'الملاحظات طويلة جدًا',
            'code', 'INVALID_NOTES_LENGTH'
        );
    END IF;

    IF p_idempotency_key IS NOT NULL
       AND LENGTH(TRIM(p_idempotency_key)) > 200 THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', 'مفتاح الطلب غير صالح',
            'code', 'INVALID_IDEMPOTENCY_KEY'
        );
    END IF;
$new$;

    IF POSITION(v_old IN v_def) = 0 THEN
        RAISE EXCEPTION 'Expected name validation block was not found';
    END IF;

    v_new_def := REPLACE(v_def, v_old, v_new);

    EXECUTE v_new_def;
END;
$migration$;
