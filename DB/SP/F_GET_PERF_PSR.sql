CREATE OR REPLACE FUNCTION public.F_GET_PERF_PSR(
	IN in_user VARCHAR
)
    RETURNS TABLE(
	totalrecords INTEGER,
	age_time_pending_1 INTERVAL,
    age_time_pending_2 INTERVAL,
    age_time_approve INTERVAL,
    age_time_decline INTERVAL,
    time_created TIMESTAMP WITH TIME ZONE,
    time_pending_1 TIMESTAMP WITH TIME ZONE,
    time_pending_2 TIMESTAMP WITH TIME ZONE,
    time_approve TIMESTAMP WITH TIME ZONE,
    time_decline TIMESTAMP WITH TIME ZONE,
    status_decline BOOLEAN
	)
    LANGUAGE 'plpgsql'
AS $$
BEGIN
	IF in_user IS null THEN
        RETURN QUERY
        SELECT
            CAST(COUNT(*) OVER() AS INTEGER) AS totalrecords,
            CASE
                WHEN psr.date_pending_1 IS NOT null THEN age(psr."createdAt", psr.date_pending_1)
                ELSE null
            END 
            AS age_time_pending_1,
            CASE
                WHEN psr.date_pending_2 IS NOT null THEN age(psr."createdAt", psr.date_pending_2)
                ELSE null
            END 
            AS age_time_pending_2,
            CASE
                WHEN psr.date_approve IS NOT null THEN age(psr."createdAt", psr.date_approve)
                ELSE null
            END 
            AS age_time_approve,
            CASE
                WHEN psr.date_decline IS NOT null THEN age(psr."createdAt", psr.date_decline)
                ELSE null
            END 
            AS age_time_decline,
            psr."createdAt" AS time_created,
            psr.date_pending_1 AS time_pending_1,
            psr.date_pending_2 AS time_pending_2,
            psr.date_approve AS time_approve,
            psr.date_decline AS time_decline,
            psr.status_decline
        FROM psr
        WHERE psr.status_t2 = TRUE OR psr.status_decline = TRUE;
    ELSE
        RETURN QUERY
        SELECT
            CAST(COUNT(*) OVER() AS INTEGER) AS totalrecords,
            CASE
                WHEN psr.date_pending_1 IS NOT null AND psr.t2_user = in_user THEN age(psr."createdAt", psr.date_pending_1)
                ELSE null
            END 
            AS time_pending_1,
            CASE
                WHEN psr.date_pending_2 IS NOT null AND psr.t3_user = in_user THEN age(psr."createdAt", psr.date_pending_2)
                ELSE null
            END 
            AS time_pending_2,
            CASE
                WHEN psr.date_approve IS NOT null AND psr.approver_user = in_user THEN age(psr."createdAt", psr.date_approve)
                ELSE null
            END 
            AS time_approve,
            CASE
                WHEN psr.date_decline IS NOT null THEN age(psr."createdAt", psr.date_decline)
                ELSE null
            END 
            AS time_decline,
            psr."createdAt" AS time_created,
            psr.date_pending_1 AS time_pending_1,
            psr.date_pending_2 AS time_pending_2,
            psr.date_approve AS time_approve,
            psr.date_decline AS time_decline,
            psr.status_decline
        FROM psr
        WHERE (psr.status_t2 = TRUE OR psr.status_decline = TRUE) 
        AND psr.create_user = in_user OR psr.t2_user = in_user OR psr.t3_user = in_user OR psr.approver_user = in_user;
	END IF;
END;
$$;	