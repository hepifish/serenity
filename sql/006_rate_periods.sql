-- Prices as periods instead of single nights. Idempotent, like every file here.
--
-- Three layers, always in this order: a special date wins over a season, a
-- season wins over the apartment's base rate (rates). On a Friday or Saturday
-- night the winner's weekend price applies when it has one. The minimum stay
-- is read from the arrival night.
create table if not exists rate_periods (
  id            bigint generated always as identity primary key,
  apartment     text not null,
  kind          text not null check (kind in ('season', 'special')),
  label         text check (char_length(label) <= 60),
  first_night   date not null,
  last_night    date not null,                          -- inclusive: the last night slept
  yearly        boolean not null default false,         -- repeats on the same days every year
  price         integer not null check (price > 0),     -- RON per night
  weekend_price integer check (weekend_price > 0),      -- RON per Fri/Sat night, null = price
  min_nights    integer check (min_nights between 1 and 30), -- null = the layer below decides
  updated_at    timestamptz not null default now(),
  check (last_night >= first_night),
  check (not yearly or last_night < first_night + 366)  -- a yearly period fits in one year
);
create index if not exists rate_periods_apartment on rate_periods (apartment);

-- The backstop for dated periods: two of one kind never share a night in one
-- apartment. Yearly ones repeat, so the API checks those (src/lib/price-rules.ts).
do $$ begin
  if not exists (select 1 from pg_constraint where conname = 'rate_periods_no_overlap') then
    alter table rate_periods add constraint rate_periods_no_overlap
      exclude using gist (apartment with =, kind with =, daterange(first_night, last_night, '[]') with &&) where (not yearly);
  end if;
end $$;

-- rate_overrides held one price per night (the Booking.com snapshot). Each run
-- of consecutive nights at one price becomes a dated special period; nights
-- that equal the base rate are dropped, since they change nothing. Every
-- quote stays the same to the leu.
do $$ begin
  if to_regclass('rate_overrides') is not null then
    insert into rate_periods (apartment, kind, label, first_night, last_night, price)
    select apartment, 'special', 'Booking.com import', min(night), max(night), price
    from (
      select o.apartment, o.night, o.price,
             o.night - (row_number() over (partition by o.apartment, o.price order by o.night))::int as run
      from rate_overrides o
      left join rates r on r.apartment = o.apartment
      where r.apartment is null
         or o.price <> case when extract(isodow from o.night) in (5, 6) then coalesce(r.weekend_price, r.base_price) else r.base_price end
    ) nights
    group by apartment, price, run;
    drop table rate_overrides;
  end if;
end $$;
