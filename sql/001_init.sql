-- Serenity direct bookings. Apartments themselves live in code (src/lib/apartments.ts);
-- the database only holds what changes: prices and bookings.

-- One row per apartment: the everyday price, the Friday/Saturday price, the shortest stay.
create table if not exists rates (
  apartment     text primary key,
  base_price    integer not null check (base_price > 0),       -- RON per night
  weekend_price integer check (weekend_price > 0),             -- RON per Fri/Sat night, null = base
  min_nights    integer not null default 1 check (min_nights >= 1),
  cleaning_fee  integer not null default 0 check (cleaning_fee >= 0),  -- RON once per stay
  updated_at    timestamptz not null default now()
);

-- Seasons and special dates live in rate_periods (006).

create table if not exists bookings (
  id               uuid primary key default gen_random_uuid(),
  ref              text not null unique,                 -- short human code, e.g. SR-7K3Q
  access_token     text not null,                        -- lets the guest see their own booking page
  apartment        text not null,
  check_in         date not null,
  check_out        date not null check (check_out > check_in),
  guests           integer not null check (guests >= 1),
  -- guest contact, only what the stay and the invoice need
  guest_name       text not null,
  guest_email      text not null,
  guest_phone      text not null,
  guest_country    text not null,
  guest_note       text,
  lang             text not null default 'en',
  -- money, all RON
  lodging_total    numeric(10,2) not null,
  cleaning_fee     numeric(10,2) not null default 0,
  city_tax         numeric(10,2) not null,
  amount           numeric(10,2) not null,
  nightly          jsonb not null,                       -- [{night, price}] as quoted
  pay_method       text not null check (pay_method in ('card','voucher')),
  status           text not null default 'pending'
                   check (status in ('pending','paid','failed','cancelled','expired')),
  hold_until       timestamptz not null,                 -- a pending booking blocks its nights until then
  netopia_ntp_id   text,
  netopia_status   integer,
  netopia_message  text,
  created_at       timestamptz not null default now(),
  paid_at          timestamptz,
  updated_at       timestamptz not null default now()
);

create index if not exists bookings_apartment_dates on bookings (apartment, check_in, check_out);
create index if not exists bookings_status on bookings (status);
