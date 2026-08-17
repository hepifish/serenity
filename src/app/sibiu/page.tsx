"use client";

import { useEffect, useState } from "react";
import "./sibiu.css";

export default function SibiuGuide() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [scrolled, setScrolled] = useState(false);
  const [activeMonth, setActiveMonth] = useState("all");
  const [activeFoodCat, setActiveFoodCat] = useState("all");
  const [activeItin, setActiveItin] = useState("artsy");

  useEffect(() => {
    const saved = localStorage.getItem("sibiu-theme");
    if (saved === "light") {
      setTheme("light");
      document.documentElement.classList.add("light");
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 60);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    document.documentElement.classList.toggle("light");
    localStorage.setItem("sibiu-theme", newTheme);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("visible");
            observer.unobserve(e.target);
          }
        });
      },
      { threshold: 0.08 }
    );
    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const months = ["all", "jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
  const monthNames: Record<string, string> = {
    jan: "January", feb: "February", mar: "March", apr: "April",
    may: "May", jun: "June", jul: "July", aug: "August",
    sep: "September", oct: "October", nov: "November", dec: "December"
  };

  const events = [
    { month: "jan", name: "Sibiu Christmas Market", info: "Winter market wrapping up — mulled wine, crafts and lights on Piata Mare. One of Romania's most magical winter experiences.", domain: "Lifestyle", price: "Free", loc: "Piata Mare", time: "until ~5 Jan" },
    { month: "jan", name: "New Year Concerts", info: "The Filarmonica opens the year with classical concerts at Sala Thalia — a beloved Sibiu ritual. Book early.", domain: "Music", price: "30-100 lei", loc: "Sala Thalia", time: "Early Jan" },
    { month: "feb", name: "Dragobete Events", info: "Romania's answer to Valentine's Day — outdoor gatherings, themed performances and love-soaked events city-wide.", domain: "Culture", price: "Free-50 lei", loc: "City-wide", time: "24 Feb" },
    { month: "mar", name: "Women's Day Events", info: "Concerts, themed dinners and evening shows celebrate 8 March across restaurants and cultural spaces.", domain: "Music / Lifestyle", price: "100-200 lei", loc: "Various", time: "8 Mar" },
    { month: "apr", name: "Easter Market", info: "Painted eggs, handmade crafts and traditional food stalls transform Piata Mare into a spring fair.", domain: "Culture", price: "Free", loc: "Piata Mare", time: "April" },
    { month: "may", name: "Spring Festivals", info: "Food stalls, flower markets and local fairs spill across the city. Outdoor cafe season officially begins.", domain: "Lifestyle", price: "Free", loc: "City-wide", time: "May" },
    { month: "jun", name: "FITS — Sibiu International Theatre Festival", info: "One of the world's largest theatre festivals — 500+ events in 10 days spanning every corner of the Old Town.", domain: "Theatre / Arts", price: "Free-150 lei", loc: "City-wide", time: "Mid-Late June", highlight: true },
    { month: "jul", name: "Feeric Fashion Week", info: "International fashion shows in unexpected venues — castle courtyards and medieval halls. Sibiu's most glamorous week.", domain: "Fashion", price: "Mostly Free", loc: "Unique locations", time: "Mid July" },
    { month: "aug", name: "ARTmania Festival", info: "Hard rock and metal descend on Piata Mare — a uniquely dramatic setting for a festival that has hosted genre legends since 2007.", domain: "Music - Rock", price: "300-600 lei", loc: "Piata Mare", time: "Early Aug", highlight: true },
    { month: "aug", name: "Medieval Festival", info: "Knights, craftsmen and re-enactors fill the Old Town with jousting, archery and period music. Free and family-friendly.", domain: "Culture", price: "Free", loc: "Old Town", time: "Mid Aug" },
    { month: "sep", name: "Astra Multicultural Festival", info: "Traditional crafts, regional food and folk performances celebrate Romania's ethnic diversity at the world's largest open-air ethnography museum.", domain: "Culture", price: "~20 lei", loc: "Astra Museum", time: "Sep" },
    { month: "oct", name: "Astra Film Festival", info: "One of Europe's most respected documentary festivals — 10 days of premieres, masterclasses and debates across the city's cinemas.", domain: "Film", price: "30-100 lei", loc: "City-wide", time: "Mid Oct", highlight: true },
    { month: "nov", name: "Indoor Culture Season", info: "Concerts, theatre, opera and gallery nights — November is arguably the richest month for indoor culture in Sibiu.", domain: "Arts", price: "50-150 lei", loc: "Various", time: "Nov" },
    { month: "dec", name: "Sibiu Christmas Market", info: "Consistently ranked among Europe's best Christmas markets — Piata Mare transforms into a fairytale of lights.", domain: "Lifestyle", price: "Free entry", loc: "Piata Mare", time: "Nov-Dec", highlight: true },
  ];

  const activities = [
    { name: "Walk the Old Town", desc: "Cobblestone alleys, baroque facades and the iconic 'eyes' of Sibiu's rooftops. Start in Piata Mare and get lost.", icon: "🏛️", tags: ["Walking", "Free", "Central"] },
    { name: "ASTRA Open-Air Museum", desc: "300+ traditional houses from across Romania, set on 96 hectares of parkland. Europe's largest open-air ethnographic museum.", icon: "🏡", tags: ["Museum", "Half-day", "4km out"], featured: true },
    { name: "Brukenthal Museum", desc: "One of the oldest museums in Europe. Baroque art, Romanian paintings, and Transylvanian history in a stunning palace.", icon: "🎨", tags: ["Art", "2-3h", "Central"] },
    { name: "Council Tower", desc: "Climb the medieval tower for panoramic views over Piata Mica and the surrounding rooftops.", icon: "🗼", tags: ["Views", "30min", "Central"] },
    { name: "Day Trip: Transfagarasan", desc: "One of the world's most dramatic roads. Serpentine switchbacks through the Fagaras Mountains. Open June-October.", icon: "🏔️", tags: ["Day trip", "Scenic", "Seasonal"] },
    { name: "Sibiu Zoo", desc: "A compact zoo in Dumbrava Forest, great for families. Bears, wolves, and local species.", icon: "🦁", tags: ["Family", "Half-day", "4km out"] },
  ];

  const restaurants = [
    // Top Restaurants
    { name: "Kombinat", type: "Modern Romanian", desc: "Consistently one of Sibiu's most praised restaurants — contemporary takes on Romanian dishes executed with real precision. Excellent price-to-quality ratio that keeps locals coming back.", price: "●●○  35–70 lei", tags: ["🔥 Top-rated", "🍽 Modern Romanian"], cat: "restaurant", stars: "★★★★★", emoji: "🔥", badge: "Top Rated" },
    { name: "Plai Restaurant", type: "Modern Seasonal", desc: "A small, refined menu built around what's in season — one of the highest-rated spots in the city. Boutique feel, attentive service and dishes that feel genuinely thought through.", price: "●●○  40–80 lei", tags: ["🌿 Seasonal menu", "⭐ ~4.9 rating"], cat: "restaurant", stars: "★★★★★", emoji: "✨", badge: "~4.9 ★ Boutique" },
    { name: "Casa Grinda", type: "European / Local", desc: "Less talked-about than its peers but the reviews speak for themselves — near-perfect ratings and quality comfort food executed with remarkable consistency. The definition of a hidden gem.", price: "●●○  35–70 lei", tags: ["💎 Hidden gem", "👌 ~5.0 rating"], cat: "restaurant", stars: "★★★★★", emoji: "💎", badge: "~5.0 ★ Hidden Gem" },
    { name: "Grand Plaza", type: "Romanian / European", desc: "Traditional Romanian dishes done very well — strong reviews, family-friendly atmosphere and the kind of reliable cooking that earns loyal repeat customers across all age groups.", price: "●●○  30–60 lei", tags: ["🇷🇴 Authentic dishes", "👨‍👩‍👧 Family-friendly"], cat: "restaurant traditional", stars: "★★★★★", emoji: "🇷🇴", badge: "Family-Friendly" },
    { name: "Crama Sibiul Vechi", type: "Traditional Romanian Cellar", desc: "Stone vaults, live folk music on weekends and legendary portions of pork knuckle and polenta. One of the most visited restaurants in the city — justifiably so.", price: "●●○  30–60 lei", tags: ["🏺 Authentic cellar", "🍖 Large portions"], cat: "restaurant traditional", stars: "★★★★★", emoji: "🏺", badge: "Very Popular" },
    { name: "Kulinarium", type: "International / Local Mix", desc: "Tourist-friendly without being a tourist trap — prime location, consistent quality and a menu broad enough to satisfy every member of a mixed group. Reliable every time.", price: "●●○  35–70 lei", tags: ["📍 Prime location", "🌍 Mixed menu"], cat: "restaurant brunch craft-beer traditional", stars: "★★★★☆", emoji: "🌍", badge: "Consistent Quality" },
    { name: "Hochmeister Delikat'essen", type: "Bistro / German-Influenced", desc: "Refined but genuinely accessible — a historic building, polished service and a food-and-wine pairing approach that elevates dinner without requiring a special-occasion budget.", price: "●●●  50–90 lei", tags: ["🏛 Historic building", "🍷 Food + wine"], cat: "restaurant brunch wine", stars: "★★★★★", emoji: "🏛️", badge: "Elevated Bistro" },
    { name: "Benjamin Steakhouse & Bar", type: "Steakhouse", desc: "Popular, reliable and consistently well-reviewed — strong meat dishes, group-friendly layout and the kind of place where nobody leaves disappointed. High volume for a reason.", price: "●●●  50–90 lei", tags: ["🥩 Strong meat dishes", "👥 Group-friendly"], cat: "restaurant brunch", stars: "★★★★☆", emoji: "🥩", badge: "High Volume · Reliable" },
    { name: "Old Lisbon", type: "Seafood / Portuguese", desc: "One of the very few seafood-focused restaurants in a landlocked city — and it works brilliantly. Portuguese influences, fresh fish and a completely different perspective from anything else in Sibiu.", price: "●●●  50–90 lei", tags: ["🐟 Unique cuisine", "🌍 Portuguese"], cat: "restaurant", stars: "★★★★★", emoji: "🐟", badge: "Unique in Sibiu" },
    { name: "Max – The Original Restaurant", type: "European / Garden", desc: "A beautiful garden terrace, reliable European menu and an atmosphere that makes meals feel like occasions. The best outdoor dining experience in Sibiu, especially on long summer evenings.", price: "●●●  50–90 lei", tags: ["🌿 Garden seating", "✨ Great atmosphere"], cat: "restaurant brunch wine", stars: "★★★★★", emoji: "🌿", badge: "Garden Dining" },
    // Cafés
    { name: "146 I Love Coffee", type: "Specialty / Minimalist", desc: "Small, high-quality coffee spot with zero fuss — walk in, get a flawless espresso, walk out happy. The most reliable grab-and-go in the Old Town.", price: "●○○  10–22 lei", tags: ["⚡ Very fast", "📍 Central"], cat: "cafe", emoji: "☕", badge: "Specialty" },
    { name: "NOD Prăjitoria de Cafea", type: "Specialty / In-house Roastery", desc: "They roast their own beans on-site — the smell alone is worth the visit. Design-forward interior, genuinely educational coffee experience for enthusiasts.", price: "●●○  15–30 lei", tags: ["🔥 Own roast", "🎨 Design interior"], cat: "cafe brunch", emoji: "🔥", badge: "Roastery" },
    { name: "Hug the Mug", type: "Fast Urban Coffee", desc: "Ultra-central, ultra-fast, ultra-reliable. If you need your morning coffee before exploring the square, this is the move.", price: "●○○  10–20 lei", tags: ["🚀 Speed", "📍 Ultra-central"], cat: "cafe brunch", emoji: "🚀", badge: "Coffee-to-go" },
    { name: "The Refresh", type: "Coffee + Smoothies", desc: "Health-conscious café with coffee, smoothies and light bites. Great lifestyle positioning — airy, energetic and a favourite with the fitness-oriented crowd.", price: "●●○  15–35 lei", tags: ["🥤 Healthy", "🧘 Wellness vibe"], cat: "cafe brunch", emoji: "🥤", badge: "Healthy / Modern" },
    { name: "Arhiva de Cafea și Ceai", type: "Specialty Coffee + Tea", desc: "Rare beans and serious tea expertise under one roof. Quiet, intellectual vibe — ideal for a slow afternoon with a book and something extraordinary in your cup.", price: "●●○  15–30 lei", tags: ["☕ Rare beans", "🍵 Tea expertise"], cat: "cafe", emoji: "🍵", badge: "Niche / Connoisseur" },
    { name: "Cafe Wien", type: "Traditional Viennese Café", desc: "Old-Europe atmosphere with proper Viennese coffee and house-made desserts. The most charming choice if you want to feel like you're in Habsburg-era Transylvania.", price: "●●○  20–40 lei", tags: ["🏛 Historic vibe", "🍰 Desserts"], cat: "cafe brunch", emoji: "🏛️", badge: "Classic Viennese" },
    { name: "Flow Coffee Roasters", type: "Specialty / Small Batch", desc: "Precision coffee in its purest form — minimal distractions, maximal craft. Small-batch roasting, thoughtful extraction, no Instagram fluff.", price: "●○○  10–25 lei", tags: ["🔬 Craft roasting", "👌 Minimalist"], cat: "cafe", emoji: "🎯", badge: "Specialty" },
    { name: "Mahalo Coffee & Pastry", type: "Coffee + Pastries", desc: "Strong visual identity, great pastry selection and reliable specialty coffee. The branding alone makes it worth a visit — the food keeps you coming back.", price: "●●○  20–40 lei", tags: ["🥐 Pastry focus", "🌴 Stylish brand"], cat: "cafe brunch", emoji: "🥐", badge: "Trendy Café" },
    { name: "Erasmus Bookcafe", type: "Quiet Reading Space", desc: "Books line the walls, the music is low and the coffee is good. A rare sanctuary for solo travellers who want to slow down and read for an hour.", price: "●○○  10–25 lei", tags: ["📚 Books & culture", "🤫 Quiet"], cat: "cafe", emoji: "📚", badge: "Book Café" },
    { name: "Tucano Coffee", type: "Cozy, Colorful Chain", desc: "Recognisable brand, comfortable seating and a warm vibe. The reliable choice when you want something familiar — consistently good across all visits.", price: "●●○  15–35 lei", tags: ["🌍 Known brand", "🛋 Comfortable"], cat: "cafe", emoji: "🌍", badge: "Chain Café" },
    { name: "Stravagante Caffe", type: "Boutique Café", desc: "Premium feel, genuine coffee quality focus and a refined experience. Smaller, more personal — the kind of place regulars fiercely protect.", price: "●●○  20–40 lei", tags: ["🎩 Premium feel", "☕ Quality focus"], cat: "cafe", emoji: "🎩", badge: "Boutique" },
    // Brunch
    { name: "Lumos – Coffee & Brunch", type: "Most Popular Brunch Spot", desc: "Beautiful interior, a genuinely strong and consistent menu and the kind of natural light that makes everything look good. The default answer when someone asks \"where's brunch?\"", price: "●●○  30–60 lei", tags: ["🌿 Beautiful interior", "📸 Instagram magnet"], cat: "brunch cafe", emoji: "🌿", badge: "Brunch · Aesthetic" },
    { name: "Charlie's Specialty Coffee", type: "Trendy, Higher-End Brunch", desc: "Premium plating, elevated dishes and a stylish crowd that dresses for the occasion. Expect a wait on weekends — worth every minute of it.", price: "●●●  40–80 lei", tags: ["✨ Premium plating", "🍽 Elevated dishes"], cat: "brunch cafe", emoji: "✨", badge: "Premium Brunch" },
    { name: "AM PM Coffee & More", type: "Relaxed, Balanced Menu", desc: "No pressure, no queue, just a cosy space with a good all-round brunch menu. The social-friendly layout makes it equally good for solo mornings or group catch-ups.", price: "●●○  30–60 lei", tags: ["🛋 Cozy vibe", "👯 Social-friendly"], cat: "brunch cafe", emoji: "🛋️", badge: "Cozy Brunch" },
    // Wine Bars
    { name: "Manufactura", type: "Natural Wine & Small Plates", desc: "Rotating Romanian and European natural wines with charcuterie boards. Cash-friendly, cosy and unhurried — the kind of bar you stay in for three hours.", price: "●●○", tags: ["Natural wine", "Local crowd"], cat: "wine", emoji: "🍷", badge: "Wine Bar" },
    { name: "Wine Not?", type: "Cozy Wine Bar", desc: "Curated Romanian and international wine list served by staff who actually know what they're talking about. Intimate, low-lit and perfect for a long evening conversation.", price: "●●○  25–60 lei/glass", tags: ["🍷 Strong selection", "🧠 Knowledgeable staff"], cat: "wine", emoji: "🍷", badge: "Wine Bar" },
    { name: "Enoteca Il Calice", type: "Premium Wine Cellar", desc: "High-end wine bar with Italian influence — premium bottles, expert pairings and an elegant atmosphere. The finest wine experience in Sibiu, full stop.", price: "●●●  40–100+ lei", tags: ["🍇 Premium wines", "🧀 Pairings"], cat: "wine restaurant", emoji: "🍇", badge: "Wine Cellar" },
    { name: "Atrium Classic Café", type: "Wine + Coffee, Central Terrace", desc: "Prime location, relaxed terrace and a crowd that moves between espresso and wine depending on the hour. The definition of a versatile central spot.", price: "●●○  25–60 lei", tags: ["📍 Prime location", "🌿 Chill terrace"], cat: "wine cafe", emoji: "🌿", badge: "Wine + Café" },
    { name: "Crama Sibiană", type: "Traditional Romanian Wine Cellar", desc: "Local wines in an authentic cellar setting with traditional food to match. The most Romanian experience on this list — honest, warm and completely unpretentious.", price: "●●○  30–70 lei", tags: ["🇷🇴 Local wines", "🍲 Traditional food"], cat: "wine traditional", emoji: "🏺", badge: "Wine Cellar" },
    // Cocktail Bars
    { name: "Oldies Pub", type: "Party / Live Music", desc: "One of Sibiu's most popular nightlife spots — high energy, live music and a crowd that actually dances. Gets going late and stays that way.", price: "●●○  20–40 lei", tags: ["🎶 Live music", "🕺 Party energy"], cat: "cocktail", emoji: "🎶", badge: "Live Music Bar" },
    { name: "Music Pub", type: "Daily Live Music", desc: "One of the oldest nightlife venues in Sibiu with a loyal crowd and a consistent programme of live acts. The kind of pub that never disappoints on a Friday night.", price: "●●○  20–40 lei", tags: ["🎸 Daily live music", "🔥 Consistent crowd"], cat: "cocktail", emoji: "🎸", badge: "Live Music Bar" },
    { name: "NOD Pub", type: "Day-to-Night Café & Bar", desc: "Coffee in the morning, cocktails by night — NOD transitions seamlessly. A social hub with great evening energy, a trendy crowd and regular live events.", price: "●●○  25–50 lei", tags: ["🌗 Day-to-night", "🍸 Trendy crowd"], cat: "cocktail cafe", emoji: "🌗", badge: "Hybrid Bar" },
    { name: "St. Andrew's Scottish Pub", type: "Classic Pub — Beer & Whisky", desc: "Proper whisky selection, imported beers and that unmistakable pub atmosphere. The most international feel in Sibiu — a reliable expat and traveller favourite.", price: "●●○  20–50 lei", tags: ["🥃 Whisky selection", "🌍 International vibe"], cat: "cocktail", emoji: "🥃", badge: "Scottish Pub" },
    { name: "Charlie's Bar (Evening)", type: "Brunch Crossover → Cocktails", desc: "Transitions into an evening cocktail bar as the sun goes down. Aesthetic drinks, a stylish crowd and the kind of place you end up staying longer than planned.", price: "●●●  30–60 lei", tags: ["🍸 Aesthetic cocktails", "📸 Stylish crowd"], cat: "cocktail", emoji: "🍸", badge: "Cocktail Bar" },
    { name: "Imperium Pub", type: "Relaxed, Budget-Friendly", desc: "Affordable drinks, casual atmosphere and a young crowd that doesn't take itself too seriously. Exactly what it is — and all the better for it.", price: "●○○  15–30 lei", tags: ["💰 Budget-friendly", "👥 Young crowd"], cat: "cocktail", emoji: "🎯", badge: "Student Bar" },
    { name: "El Gringo", type: "Mexican Bar & Cocktails", desc: "Tequila, mezcal, margaritas and a lively Mexican theme — the most fun you'll have in a themed bar in Sibiu. Great for groups looking for something different.", price: "●●○  20–45 lei", tags: ["🌮 Theme experience", "🍹 Fun cocktails"], cat: "cocktail", emoji: "🌮", badge: "Themed Bar" },
    { name: "La Țevi", type: "Casual Local Bar", desc: "Very casual, very local, very cheap. No pretensions whatsoever — just cold beer, good company and the authentic feeling of drinking where Sibiu residents actually drink.", price: "●○○  10–25 lei", tags: ["🧢 Local feel", "💰 Cheap drinks"], cat: "cocktail", emoji: "🧢", badge: "Local Bar" },
    { name: "Doors Club", type: "Live Music & Cocktail Bar", desc: "The go-to late-night spot for jazz, blues and rock in an intimate basement venue. Loyal regulars, no-nonsense attitude to music. Starts late, ends later.", price: "●●○", tags: ["Live music", "Late night"], cat: "cocktail", emoji: "🎶", badge: "Live Music" },
    // Craft Beer
    { name: "Brew Pub Sibiu", type: "Local Craft Beers", desc: "Brewed locally, served fresh — experimental styles alongside reliable house taps. The best place to try what Sibiu's craft beer scene is actually making.", price: "●●○  20–40 lei", tags: ["🍺 Local brews", "🧪 Experimental"], cat: "craft-beer", emoji: "🧪", badge: "Brew Pub" },
    { name: "St. Andrew's — Beer Selection", type: "Imported Beer & Whisky Focus", desc: "Beyond the pub classics — St. Andrew's stocks a rotating selection of imported craft beers alongside their famous whisky wall. Deep menu for serious drinkers.", price: "●●○  25–50 lei", tags: ["🍺 Imported beers", "🥃 Whisky bar"], cat: "craft-beer", emoji: "🥃", badge: "Beer + Whisky" },
  ];

  const facts = [
    { num: "01", title: "A City of Firsts", text: "Sibiu holds more Romanian firsts than any other city — first hospital, first library, first school, first pharmacy, first theatre building, first museum, first cast-iron bridge, first zoo, first open-air cinema, first printing press in Transylvania, first newspaper in Transylvania, and the first national bank with Romanian capital." },
    { num: "02", title: "European Capital of Culture 2007", text: "Sibiu was the European Capital of Culture in 2007, alongside Luxembourg — the first city in South-Eastern Europe to receive this title. Over 2,000 events took place that year, and the momentum has never stopped. The year 2007 wasn't the peak; it was the engine." },
    { num: "03", title: "Capital of Transylvania", text: "Sibiu served as the capital of the Transylvanian principality from 1692 to 1791, and again from 1850 to 1867. The military commander of Transylvania had his headquarters here from 1688 until November 1918 — over 230 years of administrative importance." },
    { num: "04", title: "The Oldest Museum in Romania", text: "Baron Samuel von Brukenthal built his baroque palace between 1777 and 1787. It opened to the public in 1817 — making the Brukenthal Museum the oldest in Romania and one of the oldest in South-Eastern Europe. It houses over 800 paintings across 13 halls." },
    { num: "05", title: "Romania's Oldest Mountain Resort Next Door", text: "Păltiniș, 32 km from Sibiu, is Romania's oldest mountain resort, founded in 1894 by the Transylvanian Carpathian Society at 1,442 metres altitude — the highest resort in the country. It was originally visited for mountain air therapy and has been a ski destination ever since." },
    { num: "06", title: "Invincible Against the Ottomans", text: "As a fortress, Sibiu proved invincible against Ottoman attacks throughout the medieval period. Its three rings of fortification walls — of which large sections still stand — made it one of the most strategically important defensive cities in the region. The walls carry 900 years of attested history." },
    { num: "07", title: "The Bridge of Lies", text: "Dating from 1859, the Bridge of Lies is the first forged-iron bridge in Romania and the second in Europe. Legend has it the bridge will collapse if someone stands on it and tells a lie. The name may also come from the deals merchants made beneath it — or the promises sweethearts broke upon it." },
    { num: "08", title: "A Multicultural City for Centuries", text: "Romanian, Saxon, Hungarian and Roma communities have coexisted peacefully in Sibiu for centuries. The city transformed this diversity into a cultural brand — three major churches of different confessions (Orthodox, Evangelical, Catholic) stand within a few hundred metres of each other in the historic centre." },
    { num: "09", title: "World-Class Sports Events", text: "Sibiu hosts the Tour of Sibiu (the most important bicycle race in South-Eastern Europe), Red Bull Romaniacs (considered the toughest Hard Enduro motorbike race in the world), the Sibiu Rally and the Sibiu Open tennis tournament — an extraordinary concentration of international sport for a city of its size." },
    { num: "10", title: "The ASTRA Museum — Largest of Its Kind", text: "The ASTRA Museum of Traditional Civilisation, set in the Dumbrava Forest 4 km from the city, stretches across 96 hectares with an exhibition circuit of 10 km. With over 300 original monuments — farmhouses, windmills, watermill complexes, churches — it is the world's largest open-air ethnography museum." },
  ];

  const itineraries = [
    {
      id: "artsy",
      icon: "🎨",
      title: "The Artsy / Slow Tourist",
      subtitle: "Late mornings · Aesthetics · Culture · Photos · Bookstores",
      steps: [
        { time: "11:00", content: <><strong>Lumos</strong> — aesthetic coffee start, beautiful interior, ease into the day</> },
        { time: "12:00", content: <><strong>Wander the Old Town</strong> — Piaţa Mică → Bridge of Lies → hidden streets. No map required</> },
        { time: "13:00", content: <><strong>Brukenthal Museum</strong> — Dutch & Flemish masters, baroque architecture. Allow 2 hours</> },
        { time: "15:00", content: <><strong>Charlie's or AM PM</strong> — late brunch, sit outside if the weather allows</> },
        { time: "17:00", content: <><strong>Erasmus Bookcafe</strong> — browse, read, journal. The perfect afternoon slow-down</> },
        { time: "19:30", content: <><strong>Kombinat</strong> — modern Romanian, cool vibe, exactly your crowd</> },
        { time: "21:30", content: <><strong>Wine Not?</strong> — intimate, unhurried, the right ending to a slow day</> },
      ],
      alt: <>Replace the museum with <strong>Astra Museum</strong> (beautiful light, vast open-air space) · Replace dinner with <strong>Max</strong> garden</>,
      altLabel: "🌿 Alternative"
    },
    {
      id: "wellness",
      icon: "🧘",
      title: "The Wellness / Slow Living Couple",
      subtitle: "Nature · Calm · No rush · Experience over ticking boxes",
      steps: [
        { time: "09:30", content: <><strong>The Refresh</strong> — smoothie, coffee, light breakfast. Healthy start</> },
        { time: "10:30", content: <><strong>Astra Museum or Dumbrava Forest</strong> — nature walk through 96 hectares of forest and folk heritage</> },
        { time: "13:30", content: <><strong>Lumos</strong> — long, relaxed brunch. Order slowly, stay long</> },
        { time: "15:30", content: <>Rest / nap — no guilt, this is the whole point</> },
        { time: "17:30", content: <><strong>Sunset walk</strong> — city walls, Turnul Sfatului area, golden hour light</> },
        { time: "19:30", content: <><strong>Plai</strong> — seasonal, intimate, genuinely quiet restaurant</> },
        { time: "21:30", content: <><strong>Enoteca Il Calice</strong> — elegant wine cellar, expert staff, no rush</> },
      ],
      alt: <>Lunch → <strong>Kulinarium</strong> (Romanian, local) · Evening → <strong>Max</strong> garden terrace</>,
      altLabel: "🌿 Alternative"
    },
    {
      id: "nomad",
      icon: "💻",
      title: "The Digital Nomad",
      subtitle: "Coffee · Laptop · Structure · Productivity + chill",
      steps: [
        { time: "08:30", content: <><strong>NOD Prăjitoria de Cafea</strong> — best work vibe in the city, design-forward space, excellent coffee</> },
        { time: "11:30", content: <><strong>Walk break</strong> — quick Old Town loop to reset the brain. 20 minutes minimum</> },
        { time: "12:30", content: <><strong>AM PM</strong> — easy lunch, comfortable seating, no pressure to leave</> },
        { time: "13:30", content: <><strong>Erasmus Bookcafe</strong> — quiet afternoon work session. The city's best silence</> },
        { time: "17:30", content: <><strong>146 I Love Coffee</strong> — quick reset espresso before wrapping up</> },
        { time: "19:30", content: <><strong>Kombinat</strong> — dinner, unwind properly</> },
        { time: "21:30", content: <><strong>NOD Pub or St. Andrew's</strong> — social end to a productive day</> },
      ],
      alt: <>Work spot → <strong>Hug the Mug</strong> (fast, central) · Evening → <strong>Oldies</strong> (more social energy)</>,
      altLabel: "⚡ Alternative"
    },
    {
      id: "girls",
      icon: "💅",
      title: "The Girls Trip / Social Weekend",
      subtitle: "Brunch · Photos · Drinks · Vibe · Outfits",
      steps: [
        { time: "10:30", content: <><strong>Charlie's Specialty Coffee</strong> — dress up, this is the moment 💅 Premium brunch, polished setting</> },
        { time: "12:30", content: <><strong>Photo walk</strong> — Piaţa Mare, the colourful facades, Piaţa Mică. The whole city is a backdrop</> },
        { time: "14:00", content: <><strong>Mahalo</strong> — coffee and pastries, strong visual identity, good for photos</> },
        { time: "16:00", content: <><strong>Chill / shopping</strong> — small boutiques, souvenirs, the antique market around Piaţa Mică</> },
        { time: "19:00", content: <><strong>Hochmeister</strong> — cute and classy dinner. Elevated without being stuffy</> },
        { time: "21:30", content: <><strong>NOD Pub</strong> — stylish crowd, day-to-night energy</> },
        { time: "23:00", content: <><strong>Oldies or Music Pub</strong> — the party is happening here</> },
      ],
      alt: <>Drinks → <strong>Wine Not?</strong> · Skip the late-night — sunset walk + wine instead</>,
      altLabel: "🍸 Alternative"
    },
    {
      id: "couple",
      icon: "💕",
      title: "The Romantic Couple",
      subtitle: "Slow · Intimate · Memorable spots · No itinerary pressure",
      steps: [
        { time: "10:00", content: <><strong>Arhiva de Cafea și Ceai</strong> — quiet, intimate, rare beans. The perfect morning for two</> },
        { time: "11:30", content: <><strong>Walk</strong> — Bridge of Lies → hidden alleys of the Lower Town. Take your time</> },
        { time: "13:00", content: <><strong>Lumos</strong> — relaxed brunch together, no rush</> },
        { time: "15:00", content: <><strong>Brukenthal or Astra Museum</strong> — culture, conversation, a shared afternoon</> },
        { time: "18:00", content: <>Rest and get ready — the evening deserves effort</> },
        { time: "19:30", content: <><strong>Max</strong> — garden dinner. The most romantic outdoor table in Sibiu</> },
        { time: "21:30", content: <><strong>Enoteca Il Calice</strong> — premium wine, elegant atmosphere, the perfect ending</> },
      ],
      alt: <>Dinner → <strong>Plai</strong> (seasonal, intimate) · Wine → <strong>Wine Not?</strong></>,
      altLabel: "🌙 Alternative"
    },
    {
      id: "firsttime",
      icon: "🏛️",
      title: "The First-Time Visitor",
      subtitle: "Wants to see Sibiu properly · Not rushed · Classic route",
      steps: [
        { time: "09:30", content: <><strong>146 I Love Coffee</strong> — fast, central, excellent espresso to start</> },
        { time: "10:00", content: <><strong>Old Town exploration</strong> — Piaţa Mare → Piaţa Mică → Turnul Sfatului (climb it for the views)</> },
        { time: "12:30", content: <><strong>Crama Sibiul Vechi</strong> — traditional Romanian lunch in a stone cellar. The authentic Sibiu experience</> },
        { time: "14:30", content: <><strong>Brukenthal Museum</strong> — Romania's oldest museum, essential stop on your first visit</> },
        { time: "17:00", content: <><strong>Walk / relax</strong> — city walls, the parks, the fortification towers</> },
        { time: "19:30", content: <><strong>Kulinarium</strong> — reliable, central, good mix of local and international dishes</> },
        { time: "21:30", content: <><strong>St. Andrew's Scottish Pub</strong> — comfortable, international feel, good place to meet fellow travellers</> },
      ],
      alt: <>Lunch → <strong>Grand Plaza</strong> · Dinner → <strong>Kombinat</strong></>,
      altLabel: "🏺 Alternative"
    },
    {
      id: "party",
      icon: "🎉",
      title: "The Fun / Party Traveller",
      subtitle: "Energy · Social · Less culture · Bar hopping welcome",
      steps: [
        { time: "11:00", content: <><strong>AM PM</strong> — recovery brunch. Relaxed, balanced menu, no judgement</> },
        { time: "13:00", content: <><strong>Walk / light activity</strong> — Old Town loop, get some air, feel human again</> },
        { time: "16:00", content: <><strong>Atrium Classic Café</strong> — afternoon drinks on the terrace, prime location, mixed crowd</> },
        { time: "19:30", content: <><strong>Benjamin Steakhouse</strong> — substantial dinner before the night ahead</> },
        { time: "21:30", content: <><strong>Bar hop:</strong> NOD Pub → Music Pub → Oldies. In that order</> },
      ],
      alt: <>El Gringo for a fun themed stop · La Țevi for the cheap local round · Doors Club for live music late</>,
      altLabel: "🍹 Note"
    },
  ];

  const foodCats = ["all", "restaurant", "cafe", "brunch", "wine", "cocktail", "craft-beer", "traditional"];
  const foodCatLabels: Record<string, string> = {
    all: "All",
    restaurant: "Restaurants",
    cafe: "Cafés",
    brunch: "Brunch",
    wine: "Wine Bars",
    cocktail: "Cocktail Bars",
    "craft-beer": "Craft Beer",
    traditional: "Traditional"
  };

  return (
    <>
      {/* NAV */}
      <nav className={scrolled ? "scrolled" : ""}>
        <a href="/" className="nav-logo">SIBIU</a>
        <ul className="nav-links">
          <li><a href="#photos">Gallery</a></li>
          <li><a href="#events">Events</a></li>
          <li><a href="#activities">Activities</a></li>
          <li><a href="#food">Eat &amp; Drink</a></li>
          <li><a href="#facts">Facts</a></li>
          <li><a href="#itineraries">Itineraries</a></li>
        </ul>
        <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
          <span className="toggle-track">
            <span className="toggle-sun">☀</span>
            <span className="toggle-moon">☾</span>
            <span className="toggle-thumb"></span>
          </span>
        </button>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="hero-grid">
          <div className="hp hp1"><img src="/images/sibiu/hero1.webp" alt="Sibiu" /></div>
          <div className="hp hp2"><img src="/images/sibiu/hero2.webp" alt="Sibiu" /></div>
          <div className="hp hp3"><img src="/images/sibiu/hero3.webp" alt="Sibiu" /></div>
          <div className="hp hp4"><img src="/images/sibiu/hero4.webp" alt="Sibiu" /></div>
          <div className="hp hp5"><img src="/images/sibiu/hero5.webp" alt="Sibiu" /></div>
        </div>
        <div className="hero-wash" />
        <div className="hero-text">
          <p className="hero-eyebrow">Transylvania &middot; Romania</p>
          <h1 className="hero-h1">SIBIU</h1>
          <div className="hero-rule" />
          <p className="hero-sub">Hermannstadt &middot; Pearl of Transylvania</p>
        </div>
        <div className="scroll-cue">
          <span>SCROLL</span>
          <div className="drip" />
        </div>
      </section>

      {/* PHOTOS/COLLAGE */}
      <section id="photos">
        <div className="section-wrap">
          <div className="section-header reveal">
            <h2>Gallery</h2>
            <div className="sh-line" />
            <span className="sh-tag">Moments from the city</span>
          </div>
          <p className="section-intro reveal reveal-delay-1">
            From cobblestone squares to mountain vistas, Sibiu rewards photographers at every turn. These snapshots capture the essence of a city where medieval and modern coexist beautifully.
          </p>
          <div className="collage-board" id="board">
            <div className="card c1"><img src="/images/sibiu/gallery1.webp" alt="Piata Mare at dusk" /><span className="cap">Piata Mare at dusk</span></div>
            <div className="card c2"><img src="/images/sibiu/gallery2.webp" alt="The Eyes of Sibiu" /><span className="cap">The Eyes of Sibiu</span></div>
            <div className="card c3"><img src="/images/sibiu/gallery3.webp" alt="Autumn in Dumbrava" /><span className="cap">Autumn in Dumbrava</span></div>
            <div className="card c4"><img src="/images/sibiu/gallery4.webp" alt="Council Tower" /><span className="cap">Council Tower</span></div>
            <div className="card c5"><img src="/images/sibiu/gallery5.webp" alt="Bridge of Lies" /><span className="cap">Bridge of Lies</span></div>
            <span className="pin" style={{ top: "8%", left: "52%" }}>Transylvania</span>
            <span className="pin" style={{ bottom: "12%", right: "35%" }}>Est. 1191</span>
          </div>
        </div>
      </section>

      {/* EVENTS */}
      <section id="events" className="events-section">
        <div className="section-wrap">
          <div className="section-header reveal">
            <h2>Events 2026</h2>
            <div className="sh-line" />
            <span className="sh-tag">Every season, something extraordinary</span>
          </div>
          <p className="section-intro reveal reveal-delay-1">
            From the last embers of the Christmas Market in January to grand New Year&apos;s Eve celebrations, Sibiu never stops performing. Filter by month to plan your visit.
          </p>

          <div className="month-tabs reveal reveal-delay-2">
            {months.map((m) => (
              <button
                key={m}
                className={`mtab ${m === "all" ? "all-tab" : ""} ${activeMonth === m ? "active" : ""}`}
                onClick={() => setActiveMonth(m)}
              >
                {m === "all" ? "All" : m.charAt(0).toUpperCase() + m.slice(1)}
              </button>
            ))}
          </div>

          <div className="events-grid">
            {events
              .filter((ev) => activeMonth === "all" || ev.month === activeMonth)
              .map((ev, i) => (
                <div key={i} className={`ev-card ${ev.highlight ? "highlight" : ""}`}>
                  <span className={`ev-month-tag ${ev.highlight ? "hl" : ""}`}>
                    {monthNames[ev.month]} {ev.highlight && <>&nbsp;★ Must-see</>}
                  </span>
                  <div className="ev-name">{ev.name}</div>
                  <div className="ev-info">{ev.info}</div>
                  <div className="ev-meta">
                    <span className="ev-badge badge-domain">{ev.domain}</span>
                    <span className={`ev-badge ${ev.price === "Free" || ev.price === "Free entry" ? "badge-free" : "badge-price"}`}>
                      {ev.price}
                    </span>
                  </div>
                  <div className="ev-loc">
                    <svg width="9" height="11" viewBox="0 0 10 12" fill="none">
                      <path d="M5 0C2.24 0 0 2.24 0 5c0 3.75 5 7 5 7s5-3.25 5-7c0-2.76-2.24-5-5-5z" fill="currentColor"/>
                    </svg>
                    {ev.loc} &nbsp;&middot;&nbsp; {ev.time}
                  </div>
                </div>
              ))}
          </div>

          <div className="recurring-strip reveal">
            <h3>🔁 &nbsp;All-year regulars</h3>
            <div className="recurring-list">
              <div className="rec-pill">Filarmonica Concerts<span>Weekly · 30-100 lei</span></div>
              <div className="rec-pill">Radu Stanca Theatre<span>Weekly · 50-150 lei</span></div>
              <div className="rec-pill">Guided City Tours<span>Weekly · €10-20</span></div>
              <div className="rec-pill">Stand-up Comedy<span>Monthly · 80-150 lei</span></div>
            </div>
          </div>
        </div>
      </section>

      {/* ACTIVITIES */}
      <section id="activities" className="activities-section">
        <div className="section-wrap">
          <div className="section-header reveal">
            <h2>Things to Do</h2>
            <div className="sh-line" />
            <span className="sh-tag">Sibiu beyond the square</span>
          </div>
          <p className="section-intro reveal reveal-delay-1">
            Whether you have a free afternoon or a full week, Sibiu rewards curiosity at every turn — cobblestone alleys, mountain trails, baroque museums and living folk traditions all within reach.
          </p>
          <div className="activities-grid">
            {activities.map((act, i) => (
              <div key={i} className={`act-card ${act.featured ? "featured" : ""} reveal`}>
                {act.featured && <div className="act-img"><img src="/images/sibiu/astra.webp" alt={act.name} /></div>}
                <div className={act.featured ? "act-body" : ""}>
                  <span className="act-icon">{act.icon}</span>
                  <div className="act-name">{act.name}</div>
                  <div className="act-desc">{act.desc}</div>
                  <div className="act-meta">
                    {act.tags.map((tag, j) => <span key={j} className="act-tag">{tag}</span>)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOD */}
      <section id="food" className="food-section">
        <div className="section-wrap">
          <div className="section-header reveal">
            <h2>Eat &amp; Drink</h2>
            <div className="sh-line" />
            <span className="sh-tag">Where Sibians dine</span>
          </div>
          <p className="section-intro reveal reveal-delay-1">
            From vaulted cellars serving sarmale to sleek wine bars pouring natural reds — Sibiu&apos;s food scene punches well above its weight.
          </p>

          <div className="food-filters reveal reveal-delay-2">
            {foodCats.map((cat) => (
              <button
                key={cat}
                className={`ftab ${activeFoodCat === cat ? "active" : ""}`}
                onClick={() => setActiveFoodCat(cat)}
              >
                {foodCatLabels[cat]}
              </button>
            ))}
          </div>

          <div className="restaurants-grid">
            {restaurants
              .filter((r) => activeFoodCat === "all" || r.cat.includes(activeFoodCat))
              .map((r, i) => (
                <div key={i} className={`rest-card reveal ${i % 3 === 1 ? "reveal-delay-1" : i % 3 === 2 ? "reveal-delay-2" : ""}`}>
                  <div className="rest-top" />
                  <div className="rest-img-wrap">
                    <span className="rest-emoji">{r.emoji}</span>
                    <span className="rest-category-badge">{r.badge}</span>
                  </div>
                  <div className="rest-body">
                    {r.stars && <div className="rest-stars">{r.stars}</div>}
                    <div className="rest-name">{r.name}</div>
                    <div className="rest-type">{r.type}</div>
                    <div className="rest-desc">{r.desc}</div>
                    <div className="rest-meta">
                      <span className="rest-price">{r.price}</span>
                      {r.tags.map((tag, j) => <span key={j} className="rest-tag">{tag}</span>)}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </section>

      {/* FACTS */}
      <section id="facts">
        <div className="section-wrap">
          <div className="section-header reveal">
            <h2>Did You Know?</h2>
            <div className="sh-line" />
            <span className="sh-tag">Fascinating facts about Sibiu</span>
          </div>
          <div className="facts-grid">
            {facts.map((f, i) => (
              <div key={i} className="fact-card reveal">
                <div className="fact-num">{f.num}</div>
                <div>
                  <div className="fact-title">{f.title}</div>
                  <div className="fact-text">{f.text}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ITINERARIES */}
      <section id="itineraries">
        <div className="section-wrap">
          <div className="section-header reveal">
            <h2>Itineraries</h2>
            <div className="sh-line" />
            <span className="sh-tag">Sample days in Sibiu</span>
          </div>
          <p className="section-intro reveal reveal-delay-1">
            Not sure where to start? These curated day plans will help you make the most of your time — whether you&apos;re here for brunch, culture or bar-hopping.
          </p>

          <div className="itin-tabs reveal reveal-delay-2">
            {itineraries.map((it) => (
              <button
                key={it.id}
                className={`itab ${activeItin === it.id ? "active" : ""}`}
                onClick={() => setActiveItin(it.id)}
              >
                {it.icon} {it.title}
              </button>
            ))}
          </div>

          <div className="itin-panels">
            {itineraries.map((it) => (
              <div key={it.id} className={`itin-panel ${activeItin === it.id ? "active" : ""}`} data-itin={it.id}>
                <div className="itin-header">
                  <span className="itin-icon">{it.icon}</span>
                  <div>
                    <div className="itin-title">{it.title}</div>
                    <div className="itin-subtitle">{it.subtitle}</div>
                  </div>
                </div>
                <div className="itin-timeline">
                  {it.steps.map((step, i) => (
                    <div key={i} className={`itin-step ${i === it.steps.length - 1 ? "itin-last" : ""}`}>
                      <div className="itin-time">{step.time}</div>
                      <div className="itin-content">{step.content}</div>
                    </div>
                  ))}
                </div>
                <div className="itin-alt">
                  <span className="itin-alt-label">{it.altLabel}</span>
                  {it.alt}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="site-footer">
        <div className="flogo">SIBIU</div>
        <div className="ftag">Hermannstadt &nbsp;·&nbsp; Pearl of Transylvania</div>
        <ul className="footer-links">
          <li><a href="#photos">Gallery</a></li>
          <li><a href="#events">Events 2026</a></li>
          <li><a href="#activities">Things to Do</a></li>
          <li><a href="#food">Eat &amp; Drink</a></li>
          <li><a href="#facts">Did You Know?</a></li>
          <li><a href="#itineraries">Itineraries</a></li>
        </ul>
        <div className="footer-copy">A traveller&apos;s guide to Sibiu, Romania &nbsp;·&nbsp; European Capital of Culture 2007</div>
      </footer>
    </>
  );
}
