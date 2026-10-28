-- Evidence that a guest accepted one exact version of the terms: a booking group
-- at checkout, or a guest at online check-in. Kept 3 years after the stay
-- (limitation period, art. 2517 Civil Code), longer while a claim is open.
create table if not exists terms_acceptances (
  id            uuid primary key default gen_random_uuid(),
  context       text not null check (context in ('booking','checkin')),
  group_id      uuid,                 -- bookings.group_id, for context 'booking'
  checkin_id    uuid references checkins (id) on delete cascade,
  terms_version text not null,        -- a key of TERMS_VERSIONS in src/content/terms
  terms_lang    text not null,        -- the language the guest read (RO is binding)
  terms_sha256  text not null,        -- SHA-256 of that version's text in that language
  statement     text not null,        -- what the ticked checkbox said, word for word
  ip            text,                 -- first hop of x-forwarded-for
  user_agent    text,
  accepted_at   timestamptz not null default now(),
  check ((context = 'booking') = (group_id is not null)),
  check ((context = 'checkin') = (checkin_id is not null))
);
create index if not exists terms_acceptances_group on terms_acceptances (group_id);
create index if not exists terms_acceptances_checkin on terms_acceptances (checkin_id);
