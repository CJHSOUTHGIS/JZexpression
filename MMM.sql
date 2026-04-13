SELECT *
FROM (
    SELECT
        MAX(c.yddh) AS "yddh",
        c.USERID AS "USERID",
        c.DWMC AS "dwmc",
        MAX(c.RID) AS "rid",
        CONCAT(
            CASE
                WHEN MAX(SF.LNAME) IS NOT NULL THEN MAX(SF.LNAME)
                ELSE ''
            END,
            CASE
                WHEN MAX(S.LNAME) IS NOT NULL THEN MAX(S.LNAME)
                ELSE ''
            END,
            CASE
                WHEN MAX(XQ.LNAME) IS NOT NULL THEN MAX(XQ.LNAME)
                ELSE ''
            END,
            CASE
                WHEN MAX(c.BGXXDZ) IS NOT NULL THEN MAX(c.BGXXDZ)
                ELSE ''
            END
        ) AS "bgxxdz",
        MAX(c.BGPOS) AS bgpos,
        MAX(c.LXR) AS lxr,
        MAX(p.amount) AS "amount",
        MAX(c.ZZDJ) AS "zzdj",
        CASE
            WHEN SUM(pj) / COUNT(1) > 80 THEN 100
            WHEN SUM(pj) / COUNT(1) > 60 AND SUM(pj) / COUNT(1) <= 80 THEN 80
            WHEN SUM(pj) / COUNT(1) > 40 AND SUM(pj) / COUNT(1) <= 60 THEN 60
            WHEN SUM(pj) / COUNT(1) > 20 AND SUM(pj) / COUNT(1) <= 40 THEN 40
            WHEN SUM(pj) / COUNT(1) > 0 AND SUM(pj) / COUNT(1) <= 20 THEN 20
            ELSE NULL
        END AS zhpj
    FROM VIEW_PROJ_CHDWJBXX_EFFECTIVE c
    LEFT JOIN PROJ_MYDPJMB mb
        ON mb.chjg = c.dwmc
        OR mb.CHDWUSERID = c.USERID
    LEFT JOIN PROJ_MYDPJZB_PJLX lx
        ON INSTR(lx.SYS_PARENTRID, mb.rid) > 0
    LEFT JOIN azone SF
        ON c.BGDZSF = SF.CODE
    LEFT JOIN azone S
        ON c.BGDZS = S.CODE
    LEFT JOIN azone XQ
        ON c.BGDXQ = XQ.CODE
    LEFT JOIN (
        SELECT
            CHDWUSERID,
            COUNT(1) AS amount
        FROM (
            SELECT
                A.RID,
                SUBSTRING_INDEX(SUBSTRING_INDEX(A.CHDWUSERIDS, ';', numbers.n1), ';', -1) AS CHDWUSERID
            FROM (
                SELECT
                    p.RID,
                    p.CHDWUSERIDS
                FROM proj_lhchywdjb p
                LEFT JOIN job_base b
                    ON p.jid = b.jid
                LEFT JOIN ACT_RU_TASK t
                    ON b.WFRID = t.PROC_INST_ID_
                WHERE 1 = 1
                  AND (
                      t.TASK_DEF_KEY_ = 'exqkj7ypwdt'
                      OR t.TASK_DEF_KEY_ IS NULL
                  )
            ) A
            JOIN (
                SELECT n AS n1
                FROM view_split_number
            ) numbers
                ON LENGTH(A.CHDWUSERIDS) - LENGTH(REPLACE(A.CHDWUSERIDS, ';', '')) >= n1 - 1
        ) LC
        GROUP BY CHDWUSERID
    ) p
        ON p.CHDWUSERID = c.USERID
    WHERE c.SHJG = '通过'
      AND c.SJLX IS NULL
      AND (c.SFYTCBA IS NULL OR SFYTCBA != '1')
    GROUP BY
        c.USERID,
        c.DWMC
) AA
ORDER BY
    (CASE WHEN USERID IN (:sortChdwList) THEN 1 ELSE 2 END) ASC,
    zzdj DESC,
    (CASE WHEN ZZDJ = '甲级,乙级' AND USERID IN (:sortJjYjChdwList) THEN 1 ELSE 2 END) ASC;