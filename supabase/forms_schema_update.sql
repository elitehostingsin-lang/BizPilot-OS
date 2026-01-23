-- FORMS
create table public.forms (
  id text primary key,
  user_id uuid references auth.users not null,
  title text not null,
  questions jsonb default '[]'::jsonb,
  responses jsonb default '[]'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- RLS
alter table public.forms enable row level security;
create policy "Users can manage own forms" on public.forms for all using (auth.uid() = user_id);
create policy "Public can read forms" on public.forms for select using (true);
create policy "Public can update forms (submit responses)" on public.forms for update using (true);
