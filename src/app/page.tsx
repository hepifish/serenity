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
    const interactiveElements = document.querySelectorAll("a, button, .si img, .dst img, .dss img");
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

      // Reveal animations
      document.querySelectorAll(".rv, .rl").forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.85) {
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

  // Gallery image arrays
  const filmGallery = [
    "/images/film/Serenity2024-27.webp",
    "/images/film/Serenity2024-28.webp",
    "/images/film/Serenity2024-29.webp",
    "/images/film/Serenity2024-30.webp",
    "/images/film/Serenity2024-31.webp",
    "/images/film/Serenity2024-32.webp",
    "/images/film/Serenity2024-33.webp",
    "/images/film/Serenity2024-34.webp",
    "/images/film/Serenity2024-35.webp",
    "/images/film/Serenity2024-36.webp",
    "/images/film/Serenity2024-37.webp",
    "/images/film/Serenity2024-38.webp",
    "/images/film/Serenity2024-39.webp",
    "/images/film/Serenity2024-40.webp",
    "/images/film/Serenity2024-41.webp",
    "/images/film/Serenity2024-42.webp",
    "/images/film/Serenity2024-58.webp",
    "/images/film/Serenity2024-59.webp",
  ];

  const gothicGallery = [
    "/images/gotic/Serenity2024-13.webp",
    "/images/gotic/Serenity2024-14.webp",
    "/images/gotic/Serenity2024-15.webp",
    "/images/gotic/Serenity2024-16.webp",
    "/images/gotic/Serenity2024-17.webp",
    "/images/gotic/Serenity2024-18.webp",
    "/images/gotic/Serenity2024-19.webp",
    "/images/gotic/Serenity2024-20.webp",
    "/images/gotic/Serenity2024-21.webp",
    "/images/gotic/Serenity2024-22.webp",
    "/images/gotic/Serenity2024-23.webp",
    "/images/gotic/Serenity2024-24.webp",
    "/images/gotic/Serenity2024-25.webp",
    "/images/gotic/Serenity2024-26.webp",
    "/images/gotic/Serenity2024-45.webp",
    "/images/gotic/Serenity2024-46.webp",
    "/images/gotic/Serenity2024-47.webp",
    "/images/gotic/Serenity2024-48.webp",
    "/images/gotic/Serenity2024-49.webp",
    "/images/gotic/Serenity2024-60.webp",
    "/images/gotic/Serenity2024-61.webp",
  ];

  const artGallery = [
    "/images/art/Serenity2024-01.webp",
    "/images/art/Serenity2024-02.webp",
    "/images/art/Serenity2024-03.webp",
    "/images/art/Serenity2024-04.webp",
    "/images/art/Serenity2024-05.webp",
    "/images/art/Serenity2024-06.webp",
    "/images/art/Serenity2024-07.webp",
    "/images/art/Serenity2024-08.webp",
    "/images/art/Serenity2024-09.webp",
    "/images/art/Serenity2024-10.webp",
    "/images/art/Serenity2024-11.webp",
    "/images/art/Serenity2024-12.webp",
    "/images/art/Serenity2024-43.webp",
    "/images/art/Serenity2024-50.webp",
    "/images/art/Serenity2024-51.webp",
    "/images/art/Serenity2024-52.webp",
    "/images/art/Serenity2024-53.webp",
    "/images/art/Serenity2024-54.webp",
    "/images/art/Serenity2024-55.webp",
    "/images/art/Serenity2024-56.webp",
  ];

  // Generate stars with varying properties (120 stars like original)
  const stars = Array.from({ length: 120 }).map((_, i) => ({
    id: i,
    left: Math.random() * 100,
    top: Math.random() * 100,
    size: 1 + Math.random() * 2,
    opacity: 0.3 + Math.random() * 0.7,
    duration: 2 + Math.random() * 3,
    delay: Math.random() * 2,
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
          <li><a href="/sibiu">Sibiu Guide</a></li>
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
        <svg className="hsky" viewBox="0 0 1440 500" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMax meet">
          <defs>
            <linearGradient id="gD" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0A0A0B" stopOpacity="0" />
              <stop offset="100%" stopColor="#0A0A0B" stopOpacity="1" />
            </linearGradient>
          </defs>
          <rect width="1440" height="500" fill="#0A0A0B" />
          <g opacity=".14" fill="#8A8580">
            <rect x="50" y="280" width="60" height="220" />
            <rect x="100" y="240" width="40" height="260" />
            <rect x="1250" y="260" width="70" height="240" />
            <rect x="1320" y="285" width="50" height="215" />
          </g>
          <g fill="#1E1C1A" stroke="#3A3530" strokeWidth="1">
            <polygon points="160,160 190,90 220,160" fill="#252220" />
            <rect x="160" y="160" width="60" height="200" />
            <polygon points="292,150 338,76 384,150" fill="#282420" />
            <rect x="292" y="150" width="92" height="210" />
          </g>
          <g fill="#1A1614" stroke="#3A3530" strokeWidth="1">
            <rect x="645" y="105" width="150" height="355" />
            <rect x="630" y="82" width="180" height="28" />
            <polygon points="710,5 710,57 730,57 730,5 720,22" fill="#252018" />
          </g>
          <rect x="0" y="440" width="1440" height="60" fill="#0F0E0C" opacity=".85" />
          <circle cx="1100" cy="80" r="34" fill="none" stroke="#F5C842" strokeWidth="1" opacity=".12" />
          <rect width="1440" height="500" fill="url(#gD)" />
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
          <img src="/images/film/Serenity2024-27.webp" alt="Film Studio" />
          <div className="ov" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 50%)" }} />
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
          <div style={{ overflow: "hidden" }}>
            <img src="/images/film/Serenity2024-28.webp" alt="Film Studio Detail" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
        </div>

        {/* Film Gallery */}
        <div className="st rv">
          <div className="si t" onClick={() => openLightbox(filmGallery, 2)}><img src="/images/film/Serenity2024-29.webp" alt="Film Gallery 1" /></div>
          <div className="si w" onClick={() => openLightbox(filmGallery, 3)}><img src="/images/film/Serenity2024-30.webp" alt="Film Gallery 2" /></div>
          <div className="si s" onClick={() => openLightbox(filmGallery, 4)}><img src="/images/film/Serenity2024-31.webp" alt="Film Gallery 3" /></div>
          <div className="si s" onClick={() => openLightbox(filmGallery, 5)}><img src="/images/film/Serenity2024-32.webp" alt="Film Gallery 4" /></div>
          <div className="si t" onClick={() => openLightbox(filmGallery, 6)}><img src="/images/film/Serenity2024-33.webp" alt="Film Gallery 5" /></div>
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
          <img src="/images/gotic/Serenity2024-13.webp" alt="Gothic Suite" />
          <div className="ov" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 50%)" }} />
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
          <div style={{ overflow: "hidden" }}>
            <img src="/images/gotic/Serenity2024-14.webp" alt="Gothic Suite Detail" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
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
        <div className="ds rv">
          <div className="dst" onClick={() => openLightbox(gothicGallery, 2)}><img src="/images/gotic/Serenity2024-15.webp" alt="Gothic Gallery 1" /></div>
          <div className="dss" onClick={() => openLightbox(gothicGallery, 3)}><img src="/images/gotic/Serenity2024-16.webp" alt="Gothic Gallery 2" /></div>
          <div className="dss" onClick={() => openLightbox(gothicGallery, 4)}><img src="/images/gotic/Serenity2024-17.webp" alt="Gothic Gallery 3" /></div>
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
          <img src="/images/art/Serenity2024-12.webp" alt="Art Studio" />
          <div className="ov" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 50%)" }} />
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
          <div style={{ overflow: "hidden" }}>
            <img src="/images/art/Serenity2024-43.webp" alt="Art Studio Detail" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
        </div>

        {/* Art Gallery */}
        <div className="st rv">
          <div className="si t" onClick={() => openLightbox(artGallery, 13)}><img src="/images/art/Serenity2024-50.webp" alt="Art Gallery 1" /></div>
          <div className="si w" onClick={() => openLightbox(artGallery, 14)}><img src="/images/art/Serenity2024-51.webp" alt="Art Gallery 2" /></div>
          <div className="si s" onClick={() => openLightbox(artGallery, 15)}><img src="/images/art/Serenity2024-52.webp" alt="Art Gallery 3" /></div>
          <div className="si s" onClick={() => openLightbox(artGallery, 16)}><img src="/images/art/Serenity2024-53.webp" alt="Art Gallery 4" /></div>
          <div className="si t" onClick={() => openLightbox(artGallery, 17)}><img src="/images/art/Serenity2024-54.webp" alt="Art Gallery 5" /></div>
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
        <a href="mailto:hello@serenityapartments.ro" className="ce rv d2">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="2" y="4" width="20" height="16" rx="2" />
            <path d="M22 7l-10 6L2 7" />
          </svg>
          hello@serenityapartments.ro
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
