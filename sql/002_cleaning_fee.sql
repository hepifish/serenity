-- 001 already carries these columns for fresh databases; this brings older ones level.
alter table rates add column if not exists cleaning_fee integer not null default 0;
alter table bookings add column if not exists cleaning_fee numeric(10,2) not null default 0;
