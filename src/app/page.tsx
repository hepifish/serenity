"use client";

import { useEffect, useState, useRef, useCallback } from "react";

export default function Home() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [scrollProgress, setScrollProgress] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImages, setLightboxImages] = useState<string[]>([]);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorRingRef = useRef<HTMLDivElement>(null);
  const mousePos = useRef({ x: 0, y: 0 });
  const ringPos = useRef({ x: 0, y: 0 });

  // Custom cursor tracking - exact same as original HTML
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
      // Small cursor follows mouse immediately
      if (cursorRef.current) {
        cursorRef.current.style.left = mousePos.current.x + "px";
        cursorRef.current.style.top = mousePos.current.y + "px";
      }
    };

    const animateRing = () => {
      // Ring follows with lag: rx+=(mx-rx)*.12
      ringPos.current.x += (mousePos.current.x - ringPos.current.x) * 0.12;
      ringPos.current.y += (mousePos.current.y - ringPos.current.y) * 0.12;

      if (cursorRingRef.current) {
        cursorRingRef.current.style.left = ringPos.current.x + "px";
        cursorRingRef.current.style.top = ringPos.current.y + "px";
      }
      requestAnimationFrame(animateRing);
    };

    const handleMouseEnterInteractive = () => {
      cursorRef.current?.classList.add("big");
      cursorRingRef.current?.classList.add("big");
    };

    const handleMouseLeaveInteractive = () => {
      cursorRef.current?.classList.remove("big");
      cursorRingRef.current?.classList.remove("big");
    };

    window.addEventListener("mousemove", handleMouseMove);
    animateRing();

    // Add hover effects to interactive elements
    const interactiveElements = document.querySelectorAll("a, button, .si img, .ap img");
    interactiveElements.forEach((el) => {
      el.addEventListener("mouseenter", handleMouseEnterInteractive);
      el.addEventListener("mouseleave", handleMouseLeaveInteractive);
    });

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      interactiveElements.forEach((el) => {
        el.removeEventListener("mouseenter", handleMouseEnterInteractive);
        el.removeEventListener("mouseleave", handleMouseLeaveInteractive);
      });
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrollTop / docHeight) * 100;
      setScrollProgress(progress);

      // Reveal animations. The 0.85 threshold can never be met by whatever
      // sits in the last screenful, so once scrolling bottoms out anything
      // on screen reveals too. Otherwise the contact email stays invisible.
      const atBottom = scrollTop + window.innerHeight >= document.documentElement.scrollHeight - 2;
      document.querySelectorAll(".rv, .rl").forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.85 || (atBottom && rect.top < window.innerHeight)) {
          el.classList.add("on");
        }
      });
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lightbox functions
  const openLightbox = useCallback((images: string[], index: number) => {
    setLightboxImages(images);
    setLightboxIndex(index);
    setLightboxOpen(true);
    document.body.style.overflow = "hidden";
  }, []);

  // Open the lightbox on a specific photo rather than a hand-counted index,
  // so reordering a gallery can't send the viewer to the wrong image.
  const openAt = useCallback(
    (gallery: string[], src: string) => openLightbox(gallery, Math.max(0, gallery.indexOf(src))),
    [openLightbox]
  );

  const closeLightbox = useCallback(() => {
    setLightboxOpen(false);
    document.body.style.overflow = "";
  }, []);

  const lightboxPrev = useCallback(() => {
    setLightboxIndex((prev) => (prev - 1 + lightboxImages.length) % lightboxImages.length);
  }, [lightboxImages.length]);

  const lightboxNext = useCallback(() => {
    setLightboxIndex((prev) => (prev + 1) % lightboxImages.length);
  }, [lightboxImages.length]);

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!lightboxOpen) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") lightboxPrev();
      if (e.key === "ArrowRight") lightboxNext();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxOpen, closeLightbox, lightboxPrev, lightboxNext]);

  // Gallery image arrays, ordered the way a guest wants to see a place:
  // the room you walk into first, then the rooms you sleep and cook in,
  // then the small details, and bathrooms at the end.
  const filmGallery = [
    "/images/film/Serenity2024-39.webp", // living, kitchen and dining, wide
    "/images/film/Serenity2024-29.webp", // yellow sofa under the poster wall
    "/images/film/Serenity2024-36.webp", // bedroom, black accent wall
    "/images/film/Serenity2024-34.webp", // Aspectomat projector on the shelf
    "/images/film/Serenity2024-40.webp", // kitchen counter, Nespresso
    "/images/film/Serenity2024-35.webp", // desk and green velvet curtain
    "/images/film/Serenity2024-33.webp", // Leon and Spirited Away prints
    "/images/film/Serenity2024-59.webp", // second bedroom
    "/images/film/Serenity2024-38.webp",
    "/images/film/Serenity2024-32.webp",
    "/images/film/Serenity2024-58.webp",
    "/images/film/Serenity2024-41.webp",
    "/images/film/Serenity2024-42.webp",
    "/images/film/Serenity2024-30.webp",
    "/images/film/Serenity2024-37.webp",
    "/images/film/Serenity2024-31.webp",
    "/images/film/Serenity2024-27.webp", // bathroom
    "/images/film/Serenity2024-28.webp",
  ];

  const gothicGallery = [
    "/images/gotic/Serenity2024-22.webp", // living under the vaults, wide
    "/images/gotic/Serenity2024-24.webp", // Tiffany lamp beside the bed
    "/images/gotic/Serenity2024-26.webp", // bedroom, wrought-iron chandelier
    "/images/gotic/Serenity2024-48.webp", // arched mirror holding the chandelier
    "/images/gotic/Serenity2024-20.webp", // living toward the arched window
    "/images/gotic/Serenity2024-19.webp", // peacock feathers, Dracula on the shelf
    "/images/gotic/Serenity2024-14.webp", // dining under the drapes
    "/images/gotic/Serenity2024-23.webp",
    "/images/gotic/Serenity2024-13.webp",
    "/images/gotic/Serenity2024-61.webp",
    "/images/gotic/Serenity2024-45.webp",
    "/images/gotic/Serenity2024-21.webp",
    "/images/gotic/Serenity2024-60.webp",
    "/images/gotic/Serenity2024-25.webp",
    "/images/gotic/Serenity2024-46.webp",
    "/images/gotic/Serenity2024-47.webp",
    "/images/gotic/Serenity2024-49.webp",
    "/images/gotic/Serenity2024-15.webp", // bathroom
    "/images/gotic/Serenity2024-16.webp",
    "/images/gotic/Serenity2024-17.webp",
    "/images/gotic/Serenity2024-18.webp",
  ];

  const artGallery = [
    "/images/art/Serenity2024-56.webp", // living, the full gallery wall
    "/images/art/Serenity2024-43.webp", // Rysselberghe and Rousseau prints
    "/images/art/Serenity2024-04.webp", // bedroom and desk, wide
    "/images/art/Serenity2024-08.webp", // bed under the wicker pendant
    "/images/art/Serenity2024-54.webp", // workspace, Edison lamp
    "/images/art/Serenity2024-51.webp", // candle and prints on the console
    "/images/art/Serenity2024-03.webp", // red sofa and dining, wide
    "/images/art/Serenity2024-05.webp",
    "/images/art/Serenity2024-12.webp",
    "/images/art/Serenity2024-55.webp",
    "/images/art/Serenity2024-50.webp",
    "/images/art/Serenity2024-06.webp",
    "/images/art/Serenity2024-07.webp",
    "/images/art/Serenity2024-52.webp",
    "/images/art/Serenity2024-53.webp",
    "/images/art/Serenity2024-02.webp",
    "/images/art/Serenity2024-01.webp",
    "/images/art/Serenity2024-09.webp", // bathroom
    "/images/art/Serenity2024-10.webp",
    "/images/art/Serenity2024-11.webp",
  ];

  // What each apartment leads with on the page. Every entry also lives in the
  // gallery array above, so openAt() can find it and open the lightbox there.
  const shown = {
    film: {
      hero: { src: filmGallery[0], alt: "Film Studio living area, kitchen and dining beyond" },
      detail: { src: filmGallery[1], alt: "Yellow sofa beneath the cinema poster wall" },
      tiles: [
        { src: filmGallery[2], alt: "Bedroom against the black accent wall" },
        { src: filmGallery[3], alt: "Vintage Aspectomat projector on the shelving unit" },
        { src: filmGallery[4], alt: "Kitchen counter with the Nespresso machine" },
      ],
    },
    gothic: {
      hero: { src: gothicGallery[0], alt: "Gothic Suite living area under medieval vaulted ceilings" },
      detail: { src: gothicGallery[1], alt: "Tiffany stained-glass lamp beside the bed" },
      tiles: [
        { src: gothicGallery[2], alt: "Bedroom beneath a wrought-iron chandelier" },
        { src: gothicGallery[3], alt: "Arched mirror reflecting the chandelier and vaults" },
        { src: gothicGallery[5], alt: "Peacock feathers and a Dracula volume on the shelf" },
      ],
    },
    art: {
      hero: { src: artGallery[0], alt: "Art Studio living area with its wall of museum prints" },
      detail: { src: artGallery[1], alt: "Rysselberghe and Rousseau prints above the red sofa" },
      tiles: [
        { src: artGallery[2], alt: "Bedroom with the desk by the window" },
        { src: artGallery[4], alt: "Minimalist workspace lit by an Edison lamp" },
        { src: artGallery[3], alt: "Bed under the boho wicker pendant" },
      ],
    },
  };

  // Stars sit above the skyline, so they only need the upper two thirds.
  // 120 at full opacity fought the drawing for attention; 70 softer ones read
  // as sky instead of confetti.
  //
  // Positions come from a hash of the index, not Math.random(): the server and
  // the client have to draw the same sky or React reports a hydration mismatch.
  const scatter = (n: number) => {
    const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
    return x - Math.floor(x);
  };
  // Rounded on purpose: React serialises full-precision floats into the SSR
  // style attribute at fewer significant digits than the client recomputes
  // ("80.0107%" vs "80.01070824393537%"), which is a hydration mismatch.
  const r = (n: number, places = 3) => Number(n.toFixed(places));
  const stars = Array.from({ length: 70 }).map((_, i) => ({
    id: i,
    left: r(scatter(i) * 100),
    top: r(scatter(i + 71) * 62),
    size: r(1 + scatter(i + 149) * 1.4, 2),
    opacity: r(0.18 + scatter(i + 233) * 0.42),
    duration: r(2 + scatter(i + 317) * 3, 2),
    delay: r(scatter(i + 419) * 2, 2),
  }));

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  return (
    <>
      {/* Custom Cursor */}
      <div className="cur" ref={cursorRef} />
      <div className="cr" ref={cursorRingRef} />

      {/* Progress Bar */}
      <div className="pr" style={{ width: `${scrollProgress}%` }} />

      {/* Navigation */}
      <nav>
        <a href="#" className="logo">
          Serenity<span>.</span>
        </a>
        <ul className="nl">
          <li><a href="#film">Film Studio</a></li>
          <li><a href="#gothic">Gothic Suite</a></li>
          <li><a href="#art">Art Studio</a></li>
          {/* Sibiu Guide hidden until its photos are in place: see src/app/_sibiu */}
          <li><a href="#contact">Contact</a></li>
        </ul>
        <div className="nr">
          <button
            className="tb"
            aria-label="Toggle theme"
            onClick={toggleTheme}
          />
          <a href="#contact" className="nc">Book Now</a>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="stars" id="stars">
          {/* Stars generated dynamically - 120 stars with varying properties */}
          {stars.map((star) => (
            <div
              key={star.id}
              className="star"
              style={{
                left: `${star.left}%`,
                top: `${star.top}%`,
                width: `${star.size}px`,
                height: `${star.size}px`,
                opacity: star.opacity,
                // @ts-expect-error CSS custom properties
                "--d": `${star.duration}s`,
                "--dl": `${star.delay}s`,
              }}
            />
          ))}
        </div>
        {/*
          Sibiu at dusk, drawn rather than photographed: the Fagaras ridge
          behind, Saxon rooftops with the city's eyelid dormers, the Council
          Tower, the Lutheran cathedral's gothic spire and the Orthodox domes.
          "slice" rather than "meet" so wide displays crop the edges instead
          of stretching every shape out of proportion.
        */}
        <svg
          className="hsky"
          viewBox="0 0 1440 620"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="xMidYMax slice"
          aria-hidden="true"
        >
          <defs>
            {/* Only the last sliver fades, so the band melts into the section
                below without washing out the rooftops on the way down. */}
            <linearGradient id="skyFade" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--sky-top)" stopOpacity="0" />
              <stop offset="82%" stopColor="var(--sky-top)" stopOpacity="0" />
              <stop offset="100%" stopColor="var(--sky-top)" stopOpacity="0.92" />
            </linearGradient>
            <radialGradient id="dusk" cx="0.5" cy="1" r="0.62">
              <stop offset="0%" stopColor="var(--sky-glow)" stopOpacity="0.85" />
              <stop offset="60%" stopColor="var(--sky-glow)" stopOpacity="0.22" />
              <stop offset="100%" stopColor="var(--sky-glow)" stopOpacity="0" />
            </radialGradient>
            {/* warm bloom sitting just behind the eyelid dormers */}
            <radialGradient id="eyeGlow" cx="0.5" cy="0.9" r="0.6">
              <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.34" />
              <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
            </radialGradient>
            {/* the eyelid dormer: flat along the roof slope, arched above */}
            <symbol id="eye" viewBox="0 0 40 18">
              <ellipse cx="20" cy="16" rx="20" ry="14" fill="url(#eyeGlow)" />
              <path d="M0 17 Q20 -4 40 17 Z" fill="var(--eye)" />
              <path d="M6 17 Q20 3 34 17 Z" fill="var(--eye-lid)" />
              <path d="M12 17 Q20 9 28 17 Z" fill="var(--eye-pupil)" opacity="0.8" />
            </symbol>
          </defs>

          {/* the last of the light, low and behind the towers */}
          <ellipse cx="900" cy="610" rx="820" ry="360" fill="url(#dusk)" />

          {/* Fagaras ridge */}
          <path
            d="M0 452 L88 402 L168 424 L262 356 L338 392 L430 336 L524 378 L604 328 L706 362
               L792 314 L884 352 L982 330 L1092 368 L1184 338 L1286 374 L1368 350 L1440 384
               L1440 620 L0 620 Z"
            fill="var(--ridge)"
          />
          <path
            d="M262 356 L302 375 L338 392 M430 336 L478 358 L524 378 M604 328 L656 346 L706 362
               M792 314 L840 334 L884 352"
            fill="none"
            stroke="var(--ridge-snow)"
            strokeWidth="2.5"
            strokeLinecap="round"
            opacity="0.5"
          />

          {/* rooftops, back row */}
          <g fill="var(--roof-far)">
            <path d="M-20 560 L70 486 L160 560 Z" />
            <path d="M140 560 L232 498 L324 560 Z" />
            <path d="M420 560 L516 492 L612 560 Z" />
            <path d="M860 560 L952 500 L1044 560 Z" />
            <path d="M1180 560 L1276 490 L1372 560 Z" />
            <rect x="-20" y="556" width="1480" height="64" />
          </g>

          {/* Council Tower, left of centre */}
          <g transform="translate(-30,0)">
          <g fill="var(--stone-mid)">
            <rect x="292" y="330" width="62" height="232" />
            <path d="M284 330 L362 330 L340 296 L306 296 Z" />
            <rect x="306" y="272" width="34" height="26" />
            <path d="M300 272 L346 272 L323 232 Z" />
            <rect x="288" y="386" width="70" height="6" opacity="0.55" />
            <rect x="288" y="452" width="70" height="6" opacity="0.55" />
          </g>
          <circle cx="323" cy="358" r="9" fill="none" stroke="var(--accent)" strokeWidth="1.5" opacity="0.6" />
          <line x1="323" y1="232" x2="323" y2="214" stroke="var(--stone-edge)" strokeWidth="1.5" />
          </g>

          {/* Lutheran cathedral: the tallest thing in Sibiu, right third */}
          <g transform="translate(400,0)">
          <g fill="var(--stone-near)">
            <rect x="676" y="288" width="88" height="276" />
            <path d="M664 288 L776 288 L748 250 L692 250 Z" />
            <rect x="694" y="216" width="52" height="36" />
            <path d="M686 216 L754 216 L720 104 Z" />
            <path d="M660 300 L672 240 L684 300 Z" />
            <path d="M756 300 L768 240 L780 300 Z" />
          </g>
          <g stroke="var(--stone-edge)" strokeWidth="1.4" fill="none" opacity="0.7">
            <line x1="720" y1="104" x2="720" y2="72" />
            <line x1="708" y1="86" x2="732" y2="86" />
          </g>
          <g fill="var(--window)" opacity="0.55">
            <path d="M700 340 q10 -18 20 0 v46 h-20 Z" />
            <path d="M728 340 q10 -18 20 0 v46 h-20 Z" />
          </g>
          </g>

          {/* Holy Trinity: drum, dome, flanking towers, far left */}
          <g transform="translate(-880,0)">
          <g fill="var(--stone-mid)">
            <rect x="1006" y="430" width="34" height="134" />
            <path d="M1002 430 Q1023 396 1044 430 Z" />
            <rect x="1120" y="430" width="34" height="134" />
            <path d="M1116 430 Q1137 396 1158 430 Z" />
            <rect x="1052" y="428" width="60" height="136" />
            <path d="M1046 428 Q1046 372 1082 350 Q1118 372 1118 428 Z" />
          </g>
          <g stroke="var(--stone-edge)" strokeWidth="1.3" opacity="0.6">
            <line x1="1082" y1="350" x2="1082" y2="330" />
            <line x1="1072" y1="340" x2="1092" y2="340" />
            <line x1="1023" y1="396" x2="1023" y2="384" />
            <line x1="1137" y1="396" x2="1137" y2="384" />
          </g>
          </g>

          {/* rooftops, front row, carrying the eyes */}
          <g fill="var(--roof-near)">
            <path d="M-20 620 L96 528 L212 620 Z" />
            <path d="M186 620 L296 546 L406 620 Z" />
            <path d="M388 620 L512 534 L636 620 Z" />
            <path d="M614 620 L732 552 L850 620 Z" />
            <path d="M828 620 L946 538 L1064 620 Z" />
            <path d="M1042 620 L1158 550 L1274 620 Z" />
            <path d="M1252 620 L1368 532 L1484 620 Z" />
            <rect x="-20" y="612" width="1480" height="20" />
          </g>

          <use href="#eye" x="52" y="550" width="58" height="26" />
          <use href="#eye" x="250" y="570" width="50" height="23" />
          <use href="#eye" x="466" y="556" width="60" height="27" />
          <use href="#eye" x="690" y="576" width="50" height="23" />
          <use href="#eye" x="900" y="560" width="60" height="27" />
          <use href="#eye" x="1114" y="574" width="50" height="23" />
          <use href="#eye" x="1322" y="554" width="60" height="27" />

          {/* a few rooms still awake */}
          <g fill="var(--accent)">
            <rect x="238" y="512" width="7" height="11" opacity="0.5" />
            <rect x="978" y="506" width="7" height="11" opacity="0.35" />
            <rect x="1290" y="500" width="7" height="11" opacity="0.45" />
          </g>

          <rect width="1440" height="620" fill="url(#skyFade)" />
        </svg>
        <div className="hc">
          <p className="ey">Sibiu, Romania &middot; Three Unique Stays</p>
          <h1 className="ht">
            Serenity<em>Apartments</em>
          </h1>
          <p className="hs">Where every room tells a different story</p>
        </div>
        <div className="hsc">
          <span>Scroll</span>
          <div className="sl" />
        </div>
      </section>

      {/* Intro Section */}
      <section className="intro">
        <p className="lb2 rv">Curated Spaces &middot; Sibiu</p>
        <h2 className="rv d1" style={{ fontFamily: "var(--font-cormorant), 'Cormorant Garamond', serif", fontSize: "clamp(2.5rem, 5vw, 4.5rem)", fontWeight: 300, lineHeight: 1.2, marginBottom: "2.5rem" }}>
          Three apartments.<br />Three <em style={{ fontStyle: "italic", color: "var(--film)" }}>worlds</em>.
        </h2>
        <p className="rv d2" style={{ fontSize: "1.05rem", lineHeight: 1.9, color: "var(--mu)", maxWidth: "580px", margin: "0 auto" }}>
          Nestled in the heart of Sibiu, each Serenity apartment is a handcrafted universe &mdash; designed not just for sleeping, but for <em style={{ fontStyle: "italic" }}>feeling</em>. Cinematic warmth. Gothic grandeur. Artistic silence. Which world calls to you?
        </p>
      </section>

      {/* Film Studio Section */}
      <section id="film">
        <div className="ah rv">
          <img src={shown.film.hero.src} alt={shown.film.hero.alt} />
          <div className="ov" />
          <div className="al">
            <div className="nn">01</div>
            <div className="bg">
              <span className="bgl" style={{ background: "var(--film)" }} />
              Apartment One
            </div>
            <h2>Film Studio</h2>
          </div>
        </div>

        <div className="ab">
          <div className="ai" style={{ background: "var(--bg2)" }}>
            <p className="lb2 rl" style={{ color: "var(--film)" }}>Apartment One &middot; Film Studio</p>
            <p className="dc rl d1">
              A love letter to cinema. Fall asleep beneath The Godfather, wake up to golden-hour light flooding through green velvet curtains. The vintage Aspectomat projector on the shelf, the yellow sofa that dares you to stay all day, the black accent wall that turns the bedroom into a private screening room.
            </p>
            <div className="fs rl d2">
              <div className="ft ftf">Up to 4 guests &middot; 2 bedrooms</div>
              <div className="ft ftf">Curated cinema poster collection</div>
              <div className="ft ftf">Vintage slide projector as d&eacute;cor</div>
              <div className="ft ftf">Yellow-accented kitchen &amp; living area</div>
              <div className="ft ftf">Designer workspace with Nespresso</div>
              <div className="ft ftf">Full bathroom with bathtub</div>
            </div>
            <div className="bk rl d3">
              <a href="https://www.airbnb.com" target="_blank" className="bn" style={{ background: "var(--film)", color: "#000", border: "1px solid var(--film)" }}>
                Book on Airbnb
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M7 17L17 7M17 7H7M17 7v10" />
                </svg>
              </a>
              <a href="https://www.booking.com" target="_blank" className="bn" style={{ background: "transparent", color: "var(--film)", border: "1px solid var(--bd)" }}>
                Book on Booking.com
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M7 17L17 7M17 7H7M17 7v10" />
                </svg>
              </a>
            </div>
          </div>
          <div className="ap" onClick={() => openAt(filmGallery, shown.film.detail.src)}>
            <img src={shown.film.detail.src} alt={shown.film.detail.alt} loading="lazy" decoding="async" />
          </div>
        </div>

        {/* Film Gallery */}
        <div className="st rv">
          {shown.film.tiles.map((t) => (
            <div className="si" key={t.src} onClick={() => openAt(filmGallery, t.src)}>
              <img src={t.src} alt={t.alt} loading="lazy" decoding="async" />
            </div>
          ))}
        </div>
        <div className="va rv">
          <button type="button" className="vab" onClick={() => openAt(filmGallery, filmGallery[0])}>
            View all {filmGallery.length} photos
          </button>
        </div>

      </section>

      {/* Divider */}
      <div className="dv rv">
        <div className="dvl" />
        <span className="dvt">&middot; Sibiu &middot;</span>
        <div className="dvl" />
      </div>

      {/* Gothic Suite Section */}
      <section id="gothic">
        <div className="ah rv">
          <img src={shown.gothic.hero.src} alt={shown.gothic.hero.alt} loading="lazy" decoding="async" />
          <div className="ov" />
          <div className="al">
            <div className="nn">02</div>
            <div className="bg">
              <span className="bgl" style={{ background: "var(--gold)" }} />
              Apartment Two
            </div>
            <h2>Gothic Suite</h2>
          </div>
        </div>

        <div className="ab">
          <div className="ap" onClick={() => openAt(gothicGallery, shown.gothic.detail.src)}>
            <img src={shown.gothic.detail.src} alt={shown.gothic.detail.alt} loading="lazy" decoding="async" />
          </div>
          <div className="ai" style={{ background: "var(--bg2)" }}>
            <p className="lb2 rl" style={{ color: "var(--gold)" }}>Apartment Two &middot; Gothic Suite</p>
            <p className="dc rl d1">
              Step through a medieval arch into another century. Vaulted ceilings soar above you, iron chandeliers cast amber light across ancient walls. A Bram Stoker paperback waits on the shelf. Peacock feathers catch the glow of Tiffany lamps. This is a space that remembers being a palace.
            </p>
            <div className="fs rl d2">
              <div className="ft ftg">Up to 4 guests &middot; 1 bedroom + sofa bed</div>
              <div className="ft ftg">Real medieval vaulted ceilings</div>
              <div className="ft ftg">Ornate iron chandelier &amp; pendant lanterns</div>
              <div className="ft ftg">Tiffany stained-glass bedside lamps</div>
              <div className="ft ftg">Peacock feathers, Dracula &amp; Dumas collection</div>
              <div className="ft ftg">Walk-in shower with dark stone tiles</div>
            </div>
            <div className="bk rl d3">
              <a href="https://www.airbnb.com" target="_blank" className="bn" style={{ background: "var(--gold)", color: "#000", border: "1px solid var(--gold)" }}>
                Book on Airbnb
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M7 17L17 7M17 7H7M17 7v10" />
                </svg>
              </a>
              <a href="https://www.booking.com" target="_blank" className="bn" style={{ background: "transparent", color: "var(--gold)", border: "1px solid var(--bd)" }}>
                Book on Booking.com
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M7 17L17 7M17 7H7M17 7v10" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Gothic Gallery */}
        <div className="st rv">
          {shown.gothic.tiles.map((t) => (
            <div className="si" key={t.src} onClick={() => openAt(gothicGallery, t.src)}>
              <img src={t.src} alt={t.alt} loading="lazy" decoding="async" />
            </div>
          ))}
        </div>
        <div className="va rv">
          <button type="button" className="vab" onClick={() => openAt(gothicGallery, gothicGallery[0])}>
            View all {gothicGallery.length} photos
          </button>
        </div>

        {/* Quote */}
        <div className="qs rv">
          <div className="qb" style={{ background: "linear-gradient(135deg, #0D0A14, #130E1E 50%, #0A0712)" }} />
          <div className="qi">
            <p className="qt" style={{ color: "var(--gold)", opacity: 0.85 }}>
              &ldquo;Welcome to my house! Enter freely. Go safely, and leave something of the happiness you bring.&rdquo;
            </p>
            <p className="qa">&mdash; Bram Stoker, Dracula &nbsp;&middot;&nbsp; <em style={{ fontStyle: "italic" }}>Found on the shelf</em></p>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="dv rv">
        <div className="dvl" />
        <span className="dvt">&middot; Sibiu &middot;</span>
        <div className="dvl" />
      </div>

      {/* Art Studio Section */}
      <section id="art">
        <div className="ah rv">
          <img src={shown.art.hero.src} alt={shown.art.hero.alt} loading="lazy" decoding="async" />
          <div className="ov" />
          <div className="al">
            <div className="nn">03</div>
            <div className="bg">
              <span className="bgl" style={{ background: "var(--art)" }} />
              Apartment Three
            </div>
            <h2>Art Studio</h2>
          </div>
        </div>

        <div className="ab">
          <div className="ai" style={{ background: "var(--bg2)" }}>
            <p className="lb2 rl" style={{ color: "var(--art)" }}>Apartment Three &middot; Art Studio</p>
            <p className="dc rl d1">
              A private gallery you get to live in. Five museum-print masters line the walls &mdash; van Gogh, Kandinsky, Matisse, Rysselberghe, Rousseau, Bosch. The red sofa demands attention. The Pop Art book on the console is not just d&eacute;cor. This apartment has a genuine point of view.
            </p>
            <div className="fs rl d2">
              <div className="ft fta">Up to 4 guests &middot; 1 bedroom</div>
              <div className="ft fta">Gallery wall of museum-print masters</div>
              <div className="ft fta">Red statement sofa &amp; sculptural wire chandelier</div>
              <div className="ft fta">Boho wicker pendant bedroom light</div>
              <div className="ft fta">Mondrian-print stool &amp; Pop Art library</div>
              <div className="ft fta">Minimalist workspace with Edison lamp</div>
              <div className="ft fta">White kitchenette &amp; round dining table</div>
            </div>
            <div className="bk rl d3">
              <a href="https://www.airbnb.com" target="_blank" className="bn" style={{ background: "var(--art)", color: "#000", border: "1px solid var(--art)" }}>
                Book on Airbnb
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M7 17L17 7M17 7H7M17 7v10" />
                </svg>
              </a>
              <a href="https://www.booking.com" target="_blank" className="bn" style={{ background: "transparent", color: "var(--art)", border: "1px solid var(--bd)" }}>
                Book on Booking.com
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M7 17L17 7M17 7H7M17 7v10" />
                </svg>
              </a>
            </div>
          </div>
          <div className="ap" onClick={() => openAt(artGallery, shown.art.detail.src)}>
            <img src={shown.art.detail.src} alt={shown.art.detail.alt} loading="lazy" decoding="async" />
          </div>
        </div>

        {/* Art Gallery */}
        <div className="st rv">
          {shown.art.tiles.map((t) => (
            <div className="si" key={t.src} onClick={() => openAt(artGallery, t.src)}>
              <img src={t.src} alt={t.alt} loading="lazy" decoding="async" />
            </div>
          ))}
        </div>
        <div className="va rv">
          <button type="button" className="vab" onClick={() => openAt(artGallery, artGallery[0])}>
            View all {artGallery.length} photos
          </button>
        </div>

        {/* Quote */}
        <div className="qs rv">
          <div className="qb" style={{ background: "var(--bg2)" }} />
          <div className="qi">
            <p className="qt" style={{ color: "var(--art)" }}>
              &ldquo;The purpose of art is washing the dust of daily life off our souls.&rdquo;
            </p>
            <p className="qa">&mdash; Pablo Picasso &nbsp;&middot;&nbsp; <em style={{ fontStyle: "italic" }}>Printed in the welcome card on the shelf</em></p>
          </div>
        </div>
      </section>

      {/* Sibiu Section */}
      <section className="sib">
        <div className="si2">
          <h2 className="rv">Discover Sibiu</h2>
          <p className="rv d1" style={{ fontSize: "1.05rem", lineHeight: 1.9, color: "var(--mu)", marginBottom: "2rem" }}>
            A medieval gem in Transylvania&apos;s heart. Cobblestone streets wind past pastel facades, and the iconic &ldquo;eyes&rdquo; of the city watch from rooftops. Walk to world-class restaurants, the Brukenthal Museum, and the famous Christmas Market &mdash; all within minutes of your door.
          </p>
          <p className="rv d2" style={{ fontFamily: "var(--font-cinzel), 'Cinzel', serif", fontSize: "0.62rem", letterSpacing: "0.4em", textTransform: "uppercase", color: "var(--mu)" }}>
            European Capital of Culture 2007 &middot; UNESCO Heritage Site
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="ct">
        <h2 className="rv">Begin Your <em>Story</em></h2>
        <p className="cs rv d1">Three worlds await. Which will you choose?</p>
        <a href="mailto:serenityhouseap@gmail.com" className="ce rv d2">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="2" y="4" width="20" height="16" rx="2" />
            <path d="M22 7l-10 6L2 7" />
          </svg>
          serenityhouseap@gmail.com
        </a>
      </section>

      {/* Footer */}
      <footer>
        <div className="fl">Serenity<span>.</span> Apartments</div>
        <div className="fc">&copy; 2025 Serenity Apartments. Sibiu, Romania.</div>
        <div className="ft2">Three rooms. One city. Endless stories.</div>
      </footer>

      {/* Lightbox */}
      {lightboxOpen && (
        <div className="lb" onClick={closeLightbox}>
          <button className="lbc" onClick={closeLightbox} aria-label="Close lightbox">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
          <button className="lbn lba" onClick={(e) => { e.stopPropagation(); lightboxPrev(); }} aria-label="Previous image">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <img
            className="lbi"
            src={lightboxImages[lightboxIndex]}
            alt={`Gallery image ${lightboxIndex + 1}`}
            onClick={(e) => e.stopPropagation()}
          />
          <button className="lbn" onClick={(e) => { e.stopPropagation(); lightboxNext(); }} aria-label="Next image">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
          <div className="lbd" onClick={(e) => e.stopPropagation()}>
            {lightboxIndex + 1} / {lightboxImages.length}
          </div>
        </div>
      )}
    </>
  );
}
