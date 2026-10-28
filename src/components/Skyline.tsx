// Sibiu at dusk, drawn rather than photographed: the Făgăraș ridge behind,
// Saxon rooftops with the city's eyelid dormers, the Council Tower, the
// Lutheran cathedral's spire and the Orthodox domes.
//
// Drawn twice: the wide crop fills big screens, the narrow crop keeps every
// landmark on a phone instead of slicing them off the sides.

function Drawing({ s }: { s: string }) {
  const u = (id: string) => `url(#${id}${s})`;
  return (
    <>
      <defs>
        {/* Only the last sliver fades, so the band melts into the section
            below without washing out the rooftops on the way down. */}
        <linearGradient id={`skyFade${s}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--sky-top)" stopOpacity="0" />
          <stop offset="82%" stopColor="var(--sky-top)" stopOpacity="0" />
          <stop offset="100%" stopColor="var(--sky-top)" stopOpacity="0.92" />
        </linearGradient>
        <radialGradient id={`dusk${s}`} cx="0.5" cy="1" r="0.62">
          <stop offset="0%" stopColor="var(--sky-glow)" stopOpacity="0.85" />
          <stop offset="60%" stopColor="var(--sky-glow)" stopOpacity="0.22" />
          <stop offset="100%" stopColor="var(--sky-glow)" stopOpacity="0" />
        </radialGradient>
        {/* warm bloom sitting just behind the eyelid dormers */}
        <radialGradient id={`eyeGlow${s}`} cx="0.5" cy="0.9" r="0.6">
          <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.34" />
          <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
        </radialGradient>
        {/* the eyelid dormer: flat along the roof slope, arched above */}
        <symbol id={`eye${s}`} viewBox="0 0 40 18">
          <ellipse cx="20" cy="16" rx="20" ry="14" fill={u("eyeGlow")} />
          <path d="M0 17 Q20 -4 40 17 Z" fill="var(--eye)" />
          <path d="M6 17 Q20 3 34 17 Z" fill="var(--eye-lid)" />
          <path d="M12 17 Q20 9 28 17 Z" fill="var(--eye-pupil)" opacity="0.8" />
        </symbol>
      </defs>

      {/* the last of the light, low and behind the towers */}
      <ellipse cx="900" cy="610" rx="820" ry="360" fill={u("dusk")} />

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

      <use href={`#eye${s}`} x="52" y="550" width="58" height="26" />
      <use href={`#eye${s}`} x="250" y="570" width="50" height="23" />
      <use href={`#eye${s}`} x="466" y="556" width="60" height="27" />
      <use href={`#eye${s}`} x="690" y="576" width="50" height="23" />
      <use href={`#eye${s}`} x="900" y="560" width="60" height="27" />
      <use href={`#eye${s}`} x="1114" y="574" width="50" height="23" />
      <use href={`#eye${s}`} x="1322" y="554" width="60" height="27" />

      {/* a few rooms still awake */}
      <g fill="var(--accent)">
        <rect x="238" y="512" width="7" height="11" opacity="0.5" />
        <rect x="978" y="506" width="7" height="11" opacity="0.35" />
        <rect x="1290" y="500" width="7" height="11" opacity="0.45" />
      </g>

      <rect width="1440" height="620" fill={u("skyFade")} />
    </>
  );
}

export default function Skyline() {
  return (
    <>
      <svg className="skyline wide" viewBox="0 0 1440 620" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
        <Drawing s="w" />
      </svg>
      <svg className="skyline narrow" viewBox="150 180 1100 440" preserveAspectRatio="xMidYMax meet" aria-hidden="true">
        <Drawing s="n" />
      </svg>
    </>
  );
}
