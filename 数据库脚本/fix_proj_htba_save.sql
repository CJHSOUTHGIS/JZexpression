-- PROJ_HTBA 保存失败（saveComplexTaskData / boruntime 批量 UPDATE）
--
-- 【你看到的 25P02】= 事务里前面已有 SQL 失败，本条 UPDATE 被拒绝。
-- 日志里 “Call getNextException” 表示还有嵌套异常；需在 boruntime 日志搜同一次请求的
-- 第一条 ERROR，且不要只看 PROJ_HTBA 这一条。
--
-- 【在库里直接看到根因】新开连接、关闭自动事务后执行下面 0.1（勿在已失败的事务里重试）。

-- ========== 0. 在瀚高/Navicat 复现真实 ERROR（非 25P02）==========
-- 0.1 先查 rid 是否存在（明文主键）
-- SELECT rid, length(htsc::text) AS htsc_len FROM proj_htba WHERE rid = '635959bc-83b2-4ba5-a9b0-4667715a2cd7';

-- 0.2 仅测 HTSC 长度（报错里 enc 约 520 字符，varchar(255) 必失败）
-- UPDATE proj_htba SET htsc = repeat('x', 520) WHERE rid = '635959bc-83b2-4ba5-a9b0-4667715a2cd7';

-- 0.3 仅测 SET RID=长 enc（boruntime 会 SET RID='enc(...)'，rid 若为 varchar(36)/uuid 会失败）
-- UPDATE proj_htba SET rid = repeat('x', 120) WHERE rid = '635959bc-83b2-4ba5-a9b0-4667715a2cd7';

-- 0.4 数值列写入 enc 字符串（若 YDMJ/JZMJ/HTJE 迁成 numeric 会报 type 错误）
-- UPDATE proj_htba SET ydmj = 'enc(e90f47e81c4a6e62f9f1fab3742c5322)' WHERE rid = '635959bc-83b2-4ba5-a9b0-4667715a2cd7';

-- ========== 1. 诊断：本次 UPDATE 涉及列的类型与长度上限 ==========
SELECT
  a.attname AS column_name,
  pg_catalog.format_type(a.atttypid, a.atttypmod) AS data_type,
  CASE
    WHEN a.atttypmod > 0 AND (a.atttypid = 'varchar'::regtype OR a.atttypid = 'bpchar'::regtype)
    THEN (a.atttypmod - 4)
    ELSE NULL
  END AS char_max_length
FROM pg_catalog.pg_attribute a
JOIN pg_catalog.pg_class c ON a.attrelid = c.oid
JOIN pg_catalog.pg_namespace n ON c.relnamespace = n.oid
WHERE n.nspname = current_schema()
  AND lower(c.relname) = 'proj_htba'
  AND a.attnum > 0
  AND NOT a.attisdropped
  AND lower(a.attname) IN (
    'shyj', 'ydmj', 'sjly', 'gcbh', 'htmc', 'lxr', 'abnormalreason', 'shrid', 'xzq', 'jzmj',
    'cjzhuserid', 'gcmc', 'chsx', 'dzyx', 'htchzymj', 'tdly', 'shr', 'gcxxdd', 'xmysrq', 'xmtype',
    'kshrid', 'xmrid', 'jid', 'htje', 'chdw', 'ydwcsj', 'jsxz', 'wtsx', 'cjdwuserid', 'rid',
    'bzsm', 'isabnormal', 'xzqcode', 'ydyhid', 'shrq', 'htbh', 'lxdh', 'fwnr', 'lhchsd', 'sftgsh',
    'htqdrq', 'htsc', 'jsdw'
  )
ORDER BY a.attname;

-- 1.2 找出所有「有长度上限的 varchar」列（加密保存后易超长）
SELECT
  a.attname AS column_name,
  pg_catalog.format_type(a.atttypid, a.atttypmod) AS data_type
FROM pg_catalog.pg_attribute a
JOIN pg_catalog.pg_class c ON a.attrelid = c.oid
JOIN pg_catalog.pg_namespace n ON c.relnamespace = n.oid
WHERE n.nspname = current_schema()
  AND lower(c.relname) = 'proj_htba'
  AND a.attnum > 0
  AND NOT a.attisdropped
  AND pg_catalog.format_type(a.atttypid, a.atttypmod) LIKE 'character varying%'
ORDER BY a.attname;

-- ========== 2. 修复：长 enc 字段 → TEXT（优先执行，对应当前报错 HTSC/CHSX/SHRID 等）==========
ALTER TABLE proj_htba ALTER COLUMN htsc TYPE TEXT;
ALTER TABLE proj_htba ALTER COLUMN chsx TYPE TEXT;
ALTER TABLE proj_htba ALTER COLUMN gcxxdd TYPE TEXT;
ALTER TABLE proj_htba ALTER COLUMN fwnr TYPE TEXT;
ALTER TABLE proj_htba ALTER COLUMN bzsm TYPE TEXT;
ALTER TABLE proj_htba ALTER COLUMN abnormalreason TYPE TEXT;
ALTER TABLE proj_htba ALTER COLUMN shyj TYPE TEXT;
ALTER TABLE proj_htba ALTER COLUMN shrid TYPE TEXT;
ALTER TABLE proj_htba ALTER COLUMN kshrid TYPE TEXT;
ALTER TABLE proj_htba ALTER COLUMN cjzhuserid TYPE TEXT;
ALTER TABLE proj_htba ALTER COLUMN cjdwuserid TYPE TEXT;
ALTER TABLE proj_htba ALTER COLUMN xmrid TYPE TEXT;
ALTER TABLE proj_htba ALTER COLUMN ydyhid TYPE TEXT;
ALTER TABLE proj_htba ALTER COLUMN chdw TYPE TEXT;
ALTER TABLE proj_htba ALTER COLUMN gcmc TYPE TEXT;

-- ========== 3. 修复：boruntime 会 SET RID='enc(...)'，列宽必须 ≥ 约 120，勿 uuid/varchar(36) ==========
ALTER TABLE proj_htba ALTER COLUMN rid TYPE VARCHAR(512) USING rid::text;

-- ========== 4. 修复：加密保存下“日期/金额”在库里也应是字符型（勿 timestamp/numeric + enc 字符串）==========
ALTER TABLE proj_htba ALTER COLUMN htqdrq TYPE VARCHAR(128) USING htqdrq::text;
ALTER TABLE proj_htba ALTER COLUMN ydwcsj TYPE VARCHAR(128) USING ydwcsj::text;
ALTER TABLE proj_htba ALTER COLUMN shrq TYPE VARCHAR(128) USING shrq::text;
ALTER TABLE proj_htba ALTER COLUMN xmysrq TYPE VARCHAR(128) USING xmysrq::text;
ALTER TABLE proj_htba ALTER COLUMN ydmj TYPE VARCHAR(256) USING ydmj::text;
ALTER TABLE proj_htba ALTER COLUMN jzmj TYPE VARCHAR(256) USING jzmj::text;
ALTER TABLE proj_htba ALTER COLUMN htje TYPE VARCHAR(256) USING htje::text;
ALTER TABLE proj_htba ALTER COLUMN htchzymj TYPE VARCHAR(256) USING htchzymj::text;

-- ========== 5. 修复：标志位（boolean 无法写 NULL/enc 时改为可空字符）==========
-- 若 ISABNORMAL/SFTGSH 已是 boolean 且仅写 NULL，可跳过；若仍报错再执行：
-- ALTER TABLE proj_htba ALTER COLUMN isabnormal TYPE VARCHAR(32) USING isabnormal::text;
-- ALTER TABLE proj_htba ALTER COLUMN sftgsh TYPE VARCHAR(32) USING sftgsh::text;

-- ========== 6. 表名/列名为大写（带引号建表）时改用 ==========
-- ALTER TABLE "PROJ_HTBA" ALTER COLUMN "HTSC" TYPE TEXT;
-- ALTER TABLE "PROJ_HTBA" ALTER COLUMN "RID" TYPE VARCHAR(512) USING "RID"::text;

-- ========== 7. 若改完 PROJ_HTBA 仍 25P02：失败发生在同事务更早的其它表 ==========
-- 在 boruntime 日志按时间搜 saveComplexTaskData 请求 ID，找 PROJ_HTBA 之前第一条 ERROR
-- （常见 PROJ_LHCHYWDJB、job_base、子表批量 insert）。
