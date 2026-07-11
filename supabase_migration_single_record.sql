-- Run this in the Supabase SQL editor to migrate from "many saves per user"
-- to "one ongoing record per user" (keeps only the most recent save per user).

delete from gwa_records a using gwa_records b
  where a.user_id = b.user_id and a.created_at < b.created_at;

alter table gwa_records add constraint gwa_records_user_id_key unique (user_id);

alter table gwa_records rename column created_at to updated_at;
