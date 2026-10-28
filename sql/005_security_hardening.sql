-- Hardening before launch. Idempotent, like every file here.

-- A payment that arrives after its nights went to someone else becomes
-- 'conflict' (money taken, apartment not), never a second 'paid'.
alter table bookings drop constraint if exists bookings_status_check;
alter table bookings add constraint bookings_status_check
  check (status in ('pending','paid','failed','cancelled','expired','conflict'));

-- The backstop: two paid stays can never share a night in one apartment.
-- The IPN takes the apartment locks and routes the loser to 'conflict' first,
-- so this only fires if that code is ever wrong. Holds are not in it: their
-- expiry (hold_until > now()) cannot live in a constraint.
create extension if not exists btree_gist;
do $$ begin
  if not exists (select 1 from pg_constraint where conname = 'bookings_no_double_paid') then
    alter table bookings add constraint bookings_no_double_paid
      exclude using gist (apartment with =, daterange(check_in, check_out) with &&) where (status = 'paid');
  end if;
end $$;

-- Who asked for a hold, so one visitor cannot keep the whole calendar on hold.
alter table bookings add column if not exists client_ip text;
create index if not exists bookings_live_holds on bookings (hold_until) where status = 'pending';

-- Request counts per IP for the public forms and the admin login.
create table if not exists rate_hits (
  bucket text not null,
  ip     text not null,
  at     timestamptz not null default now()
);
create index if not exists rate_hits_lookup on rate_hits (bucket, ip, at);
