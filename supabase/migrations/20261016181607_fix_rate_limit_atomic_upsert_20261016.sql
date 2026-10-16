CREATE OR REPLACE FUNCTION public.check_rate_limit(
    p_key text,
    p_max_requests integer DEFAULT 5,
    p_window_seconds integer DEFAULT 60
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public', 'pg_temp'
AS $function$
DECLARE
    v_count integer;
    v_now timestamptz := clock_timestamp();
BEGIN
    IF p_key IS NULL
       OR btrim(p_key) = ''
       OR p_max_requests IS NULL
       OR p_max_requests < 1
       OR p_max_requests > 1000000
       OR p_window_seconds IS NULL
       OR p_window_seconds < 1
       OR p_window_seconds > 31536000
    THEN
        RETURN false;
    END IF;

    INSERT INTO public.rate_limits AS rl (key, count, window_start)
    VALUES (p_key, 1, v_now)
    ON CONFLICT (key) DO UPDATE
    SET
        count = CASE
            WHEN COALESCE(rl.window_start, '-infinity'::timestamptz)
                 < v_now - make_interval(secs => p_window_seconds)
            THEN 1
            ELSE LEAST(COALESCE(rl.count, 0) + 1, p_max_requests + 1)
        END,
        window_start = CASE
            WHEN COALESCE(rl.window_start, '-infinity'::timestamptz)
                 < v_now - make_interval(secs => p_window_seconds)
            THEN v_now
            ELSE COALESCE(rl.window_start, v_now)
        END
    RETURNING count INTO v_count;

    RETURN v_count <= p_max_requests;
END;
$function$;
