CREATE OR REPLACE FUNCTION public.F_GET_PERF_PO(
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
                WHEN po.date_pending_1 IS NOT null THEN age(po."createdAt", po.date_pending_1)
                ELSE null
            END 
            AS age_time_pending_1,
            CASE
                WHEN po.date_pending_2 IS NOT null THEN age(po."createdAt", po.date_pending_2)
                ELSE null
            END 
            AS age_time_pending_2,
            CASE
                WHEN po.date_approve IS NOT null THEN age(po."createdAt", po.date_approve)
                ELSE null
            END 
            AS age_time_approve,
            CASE
                WHEN po.date_decline IS NOT null THEN age(po."createdAt", po.date_decline)
                ELSE null
            END 
            AS age_time_decline,
            po."createdAt" AS time_created,
            po.date_pending_1 AS time_pending_1,
            po.date_pending_2 AS time_pending_2,
            po.date_approve AS time_approve,
            po.date_decline AS time_decline,
            po.status_decline
        FROM purchase_order AS po
        WHERE po.status_t2 = TRUE OR po.status_decline = TRUE;
    ELSE
        RETURN QUERY
        SELECT
            CAST(COUNT(*) OVER() AS INTEGER) AS totalrecords,
            CASE
                WHEN po.date_pending_1 IS NOT null AND po.t2_user = in_user THEN age(po."createdAt", po.date_pending_1)
                ELSE null
            END 
            AS age_time_pending_1,
            CASE
                WHEN po.date_pending_2 IS NOT null AND po.t3_user = in_user THEN age(po."createdAt", po.date_pending_2)
                ELSE null
            END 
            AS age_time_pending_2,
            CASE
                WHEN po.date_approve IS NOT null AND po.approver_user = in_user THEN age(po."createdAt", po.date_approve)
                ELSE null
            END 
            AS age_time_approve,
            CASE
                WHEN po.date_decline IS NOT null THEN age(po."createdAt", po.date_decline)
                ELSE null
            END 
            AS age_time_decline,
            po."createdAt" AS time_created,
            po.date_pending_1 AS time_pending_1,
            po.date_pending_2 AS time_pending_2,
            po.date_approve AS time_approve,
            po.date_decline AS time_decline,
            po.status_decline 
        FROM purchase_order AS po
        WHERE (po.status_t2 = TRUE OR po.status_decline = TRUE) 
        AND po.create_user = in_user OR po.t2_user = in_user OR po.t3_user = in_user OR po.approver_user = in_user;
	END IF;
END;
$$;	