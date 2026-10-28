-- Several apartments booked in one go share a group: one payment, one code.
alter table bookings add column if not exists group_id uuid;
alter table bookings add column if not exists group_ref text;
update bookings set group_id = id, group_ref = ref where group_id is null;
alter table bookings alter column group_id set not null;
alter table bookings alter column group_ref set not null;
create index if not exists bookings_group on bookings (group_id);
create index if not exists bookings_group_ref on bookings (group_ref);

-- Online check-in: what the invoice and the law need, filled in by the guest.
create table if not exists checkins (
  id            uuid primary key default gen_random_uuid(),
  source        text not null check (source in ('direct','booking','other')),
  reservation   text,                 -- our SR- code or the Booking.com number
  apartment     text,
  arrival       date not null,
  nights        integer,
  guests        integer,
  full_name     text not null,
  email         text not null,
  phone         text,
  street        text not null,
  city          text not null,
  postal_code   text,
  country       text not null,
  cnp_enc       text,                 -- AES-256-GCM, key in CHECKIN_KEY; never stored in clear
  company_name  text,
  company_cui   text,
  rules_accepted_at timestamptz not null,
  lang          text not null default 'en',
  created_at    timestamptz not null default now()
);
create index if not exists checkins_arrival on checkins (arrival desc);
