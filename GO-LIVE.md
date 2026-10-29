# Go-live checklist

The site is live on https://serenityapartments.ro behind a password (`SITE_GATE_PASSWORD` in Vercel Production).
Tick a box when it is done. **Owner** = Pati (needs her logins or her decision). **Agent** = Claude can do it.

## 1. Before the password comes off

### Payments (Netopia)
- [ ] **Owner** Log in once at sandbox.netopia-payments.com.
- [ ] **Agent** Sandbox key into a preview deployment, run a full sandbox payment with the test card, check the IPN arrives and the booking turns paid.
- [ ] **Owner** Live API key from the Netopia console (Setări tehnice). **Agent** puts it in Vercel Production as `NETOPIA_API_KEY`.
- [ ] **Owner** Confirm the IPN public key in the Netopia console matches `.netopia/netopia-ipn-public-key.pem`.
- [ ] **Owner + Agent** One small real-card payment on the live site, then refund it from the Netopia console. Check the booking goes paid, then cancelled.
- [ ] **Owner** Ask Netopia to enable card pre-authorisation on the POS (optional, for a 500 lei damage hold; not built yet).

### Calendars: keep every channel in sync (no double bookings)
Direction 1, channels → our site (we read their calendars):
- [x] Booking.com iCal exports for Film Studio, Gothic Chambers, Art Station, Pink Panther are read (`BOOKING_ICAL_*`).
- [ ] **Owner** Airbnb (Pink Panther): Airbnb → listing → Availability → Sync calendars → Export calendar, copy the link. **Agent** stores it as `AIRBNB_ICAL_PINK` in Vercel (Production and Preview). The code already reads it.

Direction 2, our site → channels (they read ours; only paid stays are sent):
- [ ] **Owner** In `/admin/bookings`, copy the 4 export links (one per apartment).
- [ ] **Owner** Booking.com extranet → Rates & availability → Sync calendars → Import calendar: paste the link for each of the 3 units (property 4817269) and for Pink Panther (separate property, hotel_id 8022771).
- [ ] **Owner** Airbnb (Pink Panther) → Sync calendars → Import calendar: paste the Pink Panther export link.
- [ ] **Agent** Test: a paid test stay shows as closed on Booking and Airbnb after their next sync; cancel it and check it reopens.
- Note: Booking and Airbnb refresh imported calendars every few hours, not instantly. For the last few hours before a stay there is a small double-booking window between channels; the site reads Booking/Airbnb live before taking money, so it never sells a night they already sold.

### Prices
- [ ] **Owner** In `/admin/prices`: set a real base price and the seasons (the base is 225 RON, carried over from the Christmas market nights, so all of 2027 is too high).
- [ ] **Owner** Delete the "Booking.com import" special dates once seasons cover those nights.
- [ ] Remember: Booking and Airbnb prices do NOT sync with the site. Change prices in each place.

### Database
- [x] Migrations 001 to 006 on Neon (production builds now run new migrations automatically).
- [ ] **Agent + Owner** Separate Neon branch for previews (previews currently share the live database).

### Email (booking confirmations, owner alerts)
- [ ] **Owner** Create a Resend account.
- [ ] **Agent** Add Resend's DNS records (SPF, DKIM) for serenityapartments.ro in Romarg, then `RESEND_API_KEY` and `EMAIL_FROM` in Vercel. Without them, production emails fail on purpose (they are never silently dropped).

### Legal and content
- [ ] **Owner** A Romanian lawyer reads terms clauses 12 to 14 (damage) once.
- [ ] **Owner** Classification certificate number (`src/content/legal.ts`, `COMPANY.classification`).
- [ ] **Owner** Pink Panther: street, number, floor and postcode.
- [ ] **Owner** Confirm the public phone number (+40 749 061 490).
- [ ] **Owner** "Your hosts": a first name and a photo.
- [ ] **Owner** Open questions: Pink Panther city tax on Booking (7% vs Sibiu's 2%), Pink Panther cancellation (30 days on Booking vs 7 on the site), "VAT 11% included" on Booking while the company is not VAT-registered, check-in method (key box or met on site).
- [ ] **Agent** Official Visa, Mastercard and NETOPIA logos in `PayLogos.tsx`.

## 2. The day the password comes off
- [ ] **Agent** Delete `SITE_GATE_PASSWORD` in Vercel Production and redeploy.
- [ ] **Agent** Re-narrow the proxy matcher (it was widened for the gate).
- [ ] **Agent** Check: no `noindex` header, robots and sitemap open, a test page in each language.
- [ ] **Owner** Google Search Console and Bing Webmaster Tools: verify the domain (Agent adds the DNS TXT), submit `https://serenityapartments.ro/sitemap.xml`.
- [ ] **Owner** Google Business Profile: claim or update with the exact address, phone and the website link.
- [ ] **Owner** Booking.com and Airbnb listings: add the website where allowed, keep name and address identical everywhere.

## 3. First week
- [ ] **Agent** Watch Vercel runtime errors and the IPN log daily.
- [ ] **Agent** Uptime check on `/api/availability` and an alert when an IPN fails.
- [ ] **Owner** Save `CHECKIN_KEY`, `ADMIN_SECRET`, `ICAL_EXPORT_KEY` in a password manager (losing `CHECKIN_KEY` makes stored ID data unreadable).
- [ ] **Owner** Optional: buy `serenitysibiu.ro` and redirect it to the main domain.
- [ ] **Agent** Backups: Neon Launch plan or a weekly `pg_dump`.

## Later
- Landing pages: card de vacanță (RO), "where to stay in Sibiu / Wo übernachten in Hermannstadt", Christmas Market (Nov to Jan).
- Prices in one place for all channels (a channel manager like Beds24), if keeping them in sync by hand gets tiring.
- [ ] **Pati + Agent** Revisit: ship only the visitor's language to the browser (`src/i18n/{ro,en,de}.ts`). Tried twice on 2026-10-29 and measured 0 KB saved: the plurals ("20 de nopți") are functions, so the dictionaries can't be split across the server/client line and the bundler keeps all three languages together. The fix is to turn the plural functions into plain data (e.g. `Intl.PluralRules` + strings), for about 15 KB less JS per page. Decide if it's worth it.
