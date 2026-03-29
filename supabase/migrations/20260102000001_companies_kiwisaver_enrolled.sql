alter table public.companies
  add column if not exists kiwisaver_enrolled boolean;

comment on column public.companies.kiwisaver_enrolled is 'Whether the business typically has KiwiSaver-enrolled employees (onboarding)';
