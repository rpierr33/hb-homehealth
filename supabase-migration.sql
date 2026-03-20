-- Humanity & Blessings Home Health - Database Migration
-- Run this in the Supabase SQL Editor

create table if not exists inquiries (
  id uuid primary key default gen_random_uuid(),
  first_name text not null,
  last_name text not null,
  email text not null,
  phone text not null,
  service_needed text not null,
  message text,
  status text default 'new',
  created_at timestamptz default now()
);

create table if not exists referrals (
  id uuid primary key default gen_random_uuid(),
  referrer_name text not null,
  referrer_phone text not null,
  referrer_email text not null,
  patient_name text not null,
  patient_phone text not null,
  service_needed text not null,
  notes text,
  status text default 'new',
  created_at timestamptz default now()
);

create table if not exists applications (
  id uuid primary key default gen_random_uuid(),
  first_name text not null,
  last_name text not null,
  email text not null,
  phone text not null,
  position text not null,
  message text,
  status text default 'new',
  created_at timestamptz default now()
);

-- Enable Row Level Security
alter table inquiries enable row level security;
alter table referrals enable row level security;
alter table applications enable row level security;

-- RLS Policies: Only authenticated admin users can read/write
create policy "Admin read inquiries" on inquiries for select to authenticated using (true);
create policy "Admin insert inquiries" on inquiries for insert with check (true);
create policy "Admin update inquiries" on inquiries for update to authenticated using (true);

create policy "Admin read referrals" on referrals for select to authenticated using (true);
create policy "Admin insert referrals" on referrals for insert with check (true);
create policy "Admin update referrals" on referrals for update to authenticated using (true);

create policy "Admin read applications" on applications for select to authenticated using (true);
create policy "Admin insert applications" on applications for insert with check (true);
create policy "Admin update applications" on applications for update to authenticated using (true);
