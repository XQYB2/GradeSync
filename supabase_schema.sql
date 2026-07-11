create table gwa_records (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null unique,
  semesters jsonb not null,
  gwa numeric not null,
  updated_at timestamptz default now()
);

alter table gwa_records enable row level security;

create policy "Users can manage their own records"
  on gwa_records
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
