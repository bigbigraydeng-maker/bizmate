-- ===========================================
-- Job Listings (华人招聘平台)
-- ===========================================

create table public.job_listings (
  id uuid primary key default gen_random_uuid(),
  company_id uuid references public.companies(id) on delete cascade,
  poster_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  title_zh text,
  description text not null,
  description_zh text,
  job_type text not null default 'full_time'
    check (job_type in ('full_time', 'part_time', 'casual', 'contract', 'internship')),
  location text not null,
  salary_min numeric,
  salary_max numeric,
  salary_type text default 'annual'
    check (salary_type in ('hourly', 'annual')),
  languages_required text[],
  visa_sponsorship boolean default false,
  is_active boolean default true,
  expires_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_jobs_poster_id on public.job_listings(poster_id);
create index idx_jobs_location on public.job_listings(location);
create index idx_jobs_active on public.job_listings(is_active) where is_active = true;

alter table public.job_listings enable row level security;

create policy "Anyone can view active jobs"
  on public.job_listings for select using (is_active = true);
create policy "Posters can manage own jobs"
  on public.job_listings for all using (auth.uid() = poster_id);

-- ===========================================
-- GP Directory (家庭医生)
-- ===========================================

create table public.gp_practices (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  address text not null,
  suburb text,
  city text not null,
  region text not null,
  latitude numeric,
  longitude numeric,
  phone text,
  website text,
  healthpoint_url text,
  languages_spoken text[],
  accepting_new_patients boolean,
  fee_adult numeric,
  fee_child numeric,
  fee_csc numeric,
  enrolled_population int,
  last_scraped_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_gp_city on public.gp_practices(city);
create index idx_gp_languages on public.gp_practices using gin(languages_spoken);
create index idx_gp_accepting on public.gp_practices(accepting_new_patients)
  where accepting_new_patients = true;

alter table public.gp_practices enable row level security;
create policy "Anyone can view GP practices"
  on public.gp_practices for select using (true);

-- ===========================================
-- Flight Price Tracking (机票监控)
-- ===========================================

create table public.flight_alerts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  origin text not null default 'AKL',
  destination text not null,
  target_price numeric,
  is_active boolean default true,
  created_at timestamptz not null default now()
);

create table public.flight_prices (
  id uuid primary key default gen_random_uuid(),
  origin text not null,
  destination text not null,
  departure_date date not null,
  airline text,
  price numeric not null,
  currency text not null default 'NZD',
  is_direct boolean default false,
  scraped_at timestamptz not null default now()
);

create index idx_flight_prices_route on public.flight_prices(origin, destination);
create index idx_flight_prices_date on public.flight_prices(departure_date);

alter table public.flight_alerts enable row level security;
create policy "Users can manage own alerts"
  on public.flight_alerts for all using (auth.uid() = user_id);

alter table public.flight_prices enable row level security;
create policy "Anyone can view flight prices"
  on public.flight_prices for select using (true);
