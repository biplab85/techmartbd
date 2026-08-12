/* ==========================================================================
   TECHCARTBD — shared asset layer for the Facebook banner set.

   WHY A SCRIPT AND NOT PARTIALS
   These banners are rendered by pointing headless Chrome at a local http
   server, so a plain <script src> is the only include mechanism that works
   without a build step. Every banner gets the same logo and the same product
   art from here, which means a brand tweak is one edit, not twenty.

   TWO KINDS OF SLOT
     <div class="lg"   data-logo="dark|light" style="--h:64px"></div>
     <div class="pslot" data-p="watch"></div>

   SWAPPING IN REAL PHOTOGRAPHY
   Drop a background-free cutout at banners/products/<name>.png and it wins
   automatically — the vector below is only the fallback. Names are listed in
   PRODUCTS; keep the same file name and nothing else has to change.
   ========================================================================== */

/* --------------------------------------------------------------------------
   Logo — traced from logo.svg, unchanged geometry.
   Gradient ids are suffixed per instance so two logos on one canvas never
   collide (a duplicate id would make the second lockup render from the
   first one's gradient stops).
   -------------------------------------------------------------------------- */
function LOGO(variant, uid) {
  var typeFill = variant === 'light' ? '#FFFFFF' : '#12303B';
  var domFill  = variant === 'light' ? 'rgba(255,255,255,.72)' : '#5A6E74';
  return ''
  + '<svg viewBox="0 0 236 72" role="img" aria-label="TechCartBD">'
  + '<defs>'
  + '<linearGradient id="bar' + uid + '" gradientUnits="userSpaceOnUse" x1="11" y1="21" x2="46.9" y2="15">'
  +   '<stop offset="0" stop-color="#109450"/><stop offset=".21" stop-color="#269146"/>'
  +   '<stop offset=".48" stop-color="#609C26"/><stop offset=".75" stop-color="#83BA0E"/>'
  +   '<stop offset="1" stop-color="#86BD08"/></linearGradient>'
  + '<linearGradient id="stem' + uid + '" gradientUnits="userSpaceOnUse" x1="26.5" y1="24" x2="26.5" y2="58.8">'
  +   '<stop offset="0" stop-color="#067F57"/><stop offset=".6" stop-color="#046E65"/>'
  +   '<stop offset="1" stop-color="#036474"/></linearGradient>'
  + '<linearGradient id="arm' + uid + '" gradientUnits="userSpaceOnUse" x1="56" y1="13.4" x2="56" y2="24">'
  +   '<stop offset="0" stop-color="#10905A"/><stop offset="1" stop-color="#0C8150"/></linearGradient>'
  + '<linearGradient id="hook' + uid + '" gradientUnits="userSpaceOnUse" x1="38" y1="25.2" x2="70.8" y2="58.8">'
  +   '<stop offset="0" stop-color="#7FB80A"/><stop offset=".28" stop-color="#519827"/>'
  +   '<stop offset=".48" stop-color="#03795F"/><stop offset="1" stop-color="#016270"/></linearGradient>'
  + '</defs>'
  + '<path fill="url(#bar' + uid + ')" d="M11 13.4H46.86L38.61 24H11Z"/>'
  + '<path fill="url(#stem' + uid + ')" d="M21 24h11v34.8H21z"/>'
  + '<path fill="url(#arm' + uid + ')" d="M49.86 13.4H71.86L63.61 24H41.61Z"/>'
  + '<path fill="url(#hook' + uid + ')" d="M38 25.2H48.5V44.7A3.6 3.6 0 0 0 52.1 48.3H70.8L63.8 58.8H52.1A14.1 14.1 0 0 1 38 44.7Z"/>'
  + '<text x="84" y="39.5" font-family="Montserrat, Segoe UI, Arial, sans-serif" font-size="21.4"'
  +   ' font-weight="800" letter-spacing="-0.3" textLength="129.5" lengthAdjust="spacing">'
  +   '<tspan fill="' + typeFill + '">TECH</tspan><tspan fill="#7AB80C">CART</tspan>'
  +   '<tspan fill="' + typeFill + '">BD</tspan></text>'
  + '<text x="85" y="57.5" font-family="Montserrat, Segoe UI, Arial, sans-serif" font-size="11.4"'
  +   ' font-weight="500" letter-spacing="0.15" fill="' + domFill + '"'
  +   ' textLength="83.5" lengthAdjust="spacing">techcartbd.com</text>'
  + '</svg>';
}

/* --------------------------------------------------------------------------
   Trust icons — single-weight outlines on a 24 grid, matching the reference's
   thin circular marks. Stroke colour and width come from .t .ico in fb.css.
   -------------------------------------------------------------------------- */
var ICONS = {
  check:    '<circle cx="12" cy="12" r="9.2"/><path d="M8 12.2l2.7 2.7L16 9.6"/>',
  shield:   '<path d="M12 3l7 2.6v5.9c0 4.3-2.9 7.7-7 9.5-4.1-1.8-7-5.2-7-9.5V5.6z"/>' +
            '<path d="M9 12.2l2.2 2.2L15 10.6"/>',
  truck:    '<path d="M2.6 6.4h10.2v9.1H2.6z"/><path d="M12.8 9.4h3.9l2.9 3v3.1h-6.8z"/>' +
            '<circle cx="6.4" cy="17.6" r="1.9"/><circle cx="15.9" cy="17.6" r="1.9"/>',
  medal:    '<circle cx="12" cy="10" r="5.4"/><path d="M9.4 14.8L8 21l4-2.1L16 21l-1.4-6.2"/>' +
            '<path d="M12 7.9l.8 1.7 1.8.2-1.4 1.3.4 1.8-1.6-.9-1.6.9.4-1.8-1.4-1.3 1.8-.2z"/>',
  ret:      '<path d="M4.6 12a7.4 7.4 0 0 1 12.6-5.3l1.9 1.9"/><path d="M19.4 4.9v3.9h-3.9"/>' +
            '<path d="M19.4 12a7.4 7.4 0 0 1-12.6 5.3l-1.9-1.9"/><path d="M4.6 19.1v-3.9h3.9"/>',
  cash:     '<rect x="2.6" y="6" width="18.8" height="12" rx="2"/><circle cx="12" cy="12" r="2.9"/>' +
            '<path d="M6 9.6h.01M18 14.4h.01"/>',
  headset:  '<path d="M4.8 14.4v-2.5a7.2 7.2 0 0 1 14.4 0v2.5"/>' +
            '<rect x="2.9" y="13.2" width="3.8" height="6" rx="1.9"/>' +
            '<rect x="17.3" y="13.2" width="3.8" height="6" rx="1.9"/>' +
            '<path d="M19.2 19.2a3.4 3.4 0 0 1-3.4 2.4h-1.9"/>',
  tag:      '<path d="M11 3H3v8l10 10 8-8z"/><circle cx="7.2" cy="7.2" r="1.5"/>',
  bolt:     '<path d="M13.2 2.4L4.8 13.2h5.6l-.8 8.4 8.4-10.8h-5.6z"/>',
  pin:      '<path d="M12 21.6s7-6.1 7-11a7 7 0 1 0-14 0c0 4.9 7 11 7 11z"/><circle cx="12" cy="10.4" r="2.6"/>'
};

/* --------------------------------------------------------------------------
   Product art.
   Drawn on a common 0 0 400 520 stage with the object standing on y=500, so
   any two products placed side by side share a floor line and read as one
   photograph rather than as clip art dropped at random heights.
   -------------------------------------------------------------------------- */
var PRODUCTS = {

/* ---- smart watch ------------------------------------------------------ */
watch: '<svg viewBox="0 0 400 520">' +
  '<defs>' +
    '<linearGradient id="wcase" x1="0" y1="0" x2="1" y2="1">' +
      '<stop offset="0" stop-color="#D9B25E"/><stop offset=".38" stop-color="#8E6F2E"/>' +
      '<stop offset=".62" stop-color="#EBC97E"/><stop offset="1" stop-color="#6E5423"/></linearGradient>' +
    '<linearGradient id="wscr" x1="0" y1="0" x2="1" y2="1">' +
      '<stop offset="0" stop-color="#1B2340"/><stop offset="1" stop-color="#05070E"/></linearGradient>' +
    '<linearGradient id="wstrap" x1="0" y1="0" x2="1" y2="0">' +
      '<stop offset="0" stop-color="#15171A"/><stop offset=".42" stop-color="#3A3E44"/>' +
      '<stop offset="1" stop-color="#0D0F11"/></linearGradient>' +
    '<linearGradient id="wglass" x1="0" y1="0" x2=".7" y2="1">' +
      '<stop offset="0" stop-color="#fff" stop-opacity=".26"/>' +
      '<stop offset=".45" stop-color="#fff" stop-opacity=".03"/>' +
      '<stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>' +
    '<linearGradient id="wring" x1="0" y1="0" x2="1" y2="1">' +
      '<stop offset="0" stop-color="#FF3B6B"/><stop offset=".5" stop-color="#FFC542"/>' +
      '<stop offset="1" stop-color="#28E0A8"/></linearGradient>' +
  '</defs>' +
  /* lower strap — starts above the case bottom so the lug never shows a gap */
  '<path fill="url(#wstrap)" d="M150 262h100l-8 216a16 16 0 0 1-16 14h-60a16 16 0 0 1-16-14z"/>' +
  '<g fill="#000" opacity=".42">' +
    '<rect x="158" y="330" width="84" height="4" rx="2"/><rect x="159" y="368" width="82" height="4" rx="2"/>' +
    '<rect x="160" y="406" width="80" height="4" rx="2"/><rect x="161" y="444" width="78" height="4" rx="2"/>' +
  '</g>' +
  /* upper strap, likewise tucked under the case */
  '<path fill="url(#wstrap)" d="M152 34h96l4 96H148z"/>' +
  '<g fill="#000" opacity=".42">' +
    '<rect x="158" y="52" width="84" height="4" rx="2"/><rect x="157" y="86" width="86" height="4" rx="2"/>' +
  '</g>' +
  /* case */
  '<rect x="126" y="96" width="148" height="196" rx="44" fill="url(#wcase)"/>' +
  '<rect x="134" y="104" width="132" height="180" rx="38" fill="#0A0C10"/>' +
  /* screen */
  '<rect x="142" y="112" width="116" height="164" rx="32" fill="url(#wscr)"/>' +
  /* activity rings */
  '<g fill="none" stroke-linecap="round" stroke-width="9" transform="translate(200 168)">' +
    '<circle r="34" stroke="#2A1420"/><circle r="34" stroke="#FF3B6B" stroke-dasharray="170 44" transform="rotate(-90)"/>' +
    '<circle r="23" stroke="#12281F"/><circle r="23" stroke="#28E0A8" stroke-dasharray="112 33" transform="rotate(-90)"/>' +
    '<circle r="12" stroke="#2A2412"/><circle r="12" stroke="#FFC542" stroke-dasharray="56 20" transform="rotate(-90)"/>' +
  '</g>' +
  '<text x="200" y="240" text-anchor="middle" font-family="Montserrat, Arial, sans-serif"' +
    ' font-size="34" font-weight="800" fill="#F4F7FA" letter-spacing="-1">10:09</text>' +
  '<rect x="142" y="112" width="116" height="164" rx="32" fill="url(#wglass)"/>' +
  /* digital crown + side button */
  '<rect x="272" y="140" width="14" height="30" rx="7" fill="url(#wcase)"/>' +
  '<rect x="274" y="184" width="10" height="40" rx="5" fill="#4A3A18"/>' +
  '</svg>',

/* ---- blender ---------------------------------------------------------- */
blender: '<svg viewBox="0 0 400 520">' +
  '<defs>' +
    '<linearGradient id="bjar" x1="0" y1="0" x2="1" y2="0">' +
      '<stop offset="0" stop-color="#fff" stop-opacity=".46"/>' +
      '<stop offset=".18" stop-color="#fff" stop-opacity=".10"/>' +
      '<stop offset=".72" stop-color="#fff" stop-opacity=".06"/>' +
      '<stop offset=".9" stop-color="#fff" stop-opacity=".40"/></linearGradient>' +
    '<linearGradient id="bbase" x1="0" y1="0" x2="1" y2="0">' +
      '<stop offset="0" stop-color="#6E767C"/><stop offset=".22" stop-color="#D8DEE2"/>' +
      '<stop offset=".5" stop-color="#F2F5F7"/><stop offset=".78" stop-color="#B9C1C7"/>' +
      '<stop offset="1" stop-color="#5C6469"/></linearGradient>' +
    '<linearGradient id="blid" x1="0" y1="0" x2="1" y2="0">' +
      '<stop offset="0" stop-color="#0E1113"/><stop offset=".3" stop-color="#41474C"/>' +
      '<stop offset="1" stop-color="#0B0D0F"/></linearGradient>' +
  '</defs>' +
  /* jar body, tapering slightly toward the collar.
     Kept near-transparent: a heavier tint turns the glass milky and the fruit
     behind it goes grey, which is exactly what the reference does not do. */
  '<path fill="#EAF2F6" fill-opacity=".12" d="M118 118h164l-14 176H132z"/>' +
  /* fruit */
  '<g>' +
    '<circle cx="163" cy="252" r="27" fill="#E23B4B"/><circle cx="155" cy="243" r="8" fill="#fff" opacity=".28"/>' +
    '<circle cx="215" cy="262" r="30" fill="#F0902B"/><circle cx="206" cy="252" r="9" fill="#fff" opacity=".26"/>' +
    '<circle cx="248" cy="228" r="22" fill="#E8C33A"/>' +
    '<circle cx="186" cy="212" r="25" fill="#D8313F"/><circle cx="178" cy="204" r="7" fill="#fff" opacity=".3"/>' +
    '<circle cx="230" cy="190" r="20" fill="#F2A93B"/>' +
    '<circle cx="152" cy="196" r="16" fill="#EFD24A"/>' +
    '<path fill="#3E8C2F" d="M186 187a25 25 0 0 1 14-6l-4 12a25 25 0 0 0-10-6z"/>' +
  '</g>' +
  /* glass over the fruit */
  '<path fill="url(#bjar)" d="M118 118h164l-14 176H132z"/>' +
  '<path fill="none" stroke="#9FB4BD" stroke-width="3" d="M118 118h164l-14 176H132z"/>' +
  /* collar + pour lip */
  '<path fill="#C9D6DC" d="M114 108h172v12H114z"/>' +
  '<path fill="#DCE6EA" d="M114 108l-20 4 4 12 16-4z"/>' +
  /* handle — closed C so it reads as moulded plastic, not a stray stroke */
  '<path fill="#C3D0D6" d="M282 148c44 8 44 84 0 96v-16c26-9 26-55 0-64z"/>' +
  '<path fill="#8E9BA2" d="M282 148c44 8 44 84 0 96v-5c38-12 38-74 0-86z" opacity=".55"/>' +
  /* lid */
  '<rect x="112" y="76" width="176" height="34" rx="14" fill="url(#blid)"/>' +
  '<rect x="168" y="58" width="64" height="24" rx="11" fill="#22282C"/>' +
  /* jar-to-base collar */
  '<path fill="#8E979D" d="M132 294h136l-6 22H138z"/>' +
  /* motor base */
  '<path fill="url(#bbase)" d="M126 316h148l-10 116a22 22 0 0 1-22 20H158a22 22 0 0 1-22-20z"/>' +
  '<circle cx="200" cy="392" r="34" fill="#2E3438"/>' +
  '<circle cx="200" cy="392" r="26" fill="url(#bbase)"/>' +
  '<rect x="197" y="370" width="6" height="16" rx="3" fill="#3A4145"/>' +
  '<rect x="150" y="336" width="100" height="6" rx="3" fill="#fff" opacity=".5"/>' +
  /* foot */
  '<path fill="#1E2427" d="M142 452h116l-4 14H146z"/>' +
  '</svg>',

/* ---- rice cooker ------------------------------------------------------ */
cooker: '<svg viewBox="0 0 400 520">' +
  '<defs>' +
    '<linearGradient id="cbody" x1="0" y1="0" x2="1" y2="0">' +
      '<stop offset="0" stop-color="#C9D2D6"/><stop offset=".16" stop-color="#FAFCFD"/>' +
      '<stop offset=".5" stop-color="#FFFFFF"/><stop offset=".84" stop-color="#DCE4E8"/>' +
      '<stop offset="1" stop-color="#A9B4B9"/></linearGradient>' +
    '<linearGradient id="clid" x1="0" y1="0" x2="1" y2="0">' +
      '<stop offset="0" stop-color="#D4DCE0"/><stop offset=".3" stop-color="#FFFFFF"/>' +
      '<stop offset=".72" stop-color="#EAF0F3"/><stop offset="1" stop-color="#B3BEC3"/></linearGradient>' +
  '</defs>' +
  /* body */
  '<path fill="url(#cbody)" d="M96 210h208v168a34 34 0 0 1-34 34H130a34 34 0 0 1-34-34z"/>' +
  /* lid */
  '<ellipse cx="200" cy="210" rx="104" ry="30" fill="url(#clid)"/>' +
  '<ellipse cx="200" cy="200" rx="104" ry="30" fill="url(#clid)"/>' +
  '<ellipse cx="200" cy="196" rx="78" ry="21" fill="#F3F7F9"/>' +
  '<ellipse cx="200" cy="186" rx="26" ry="10" fill="#C6D0D5"/>' +
  '<rect x="188" y="164" width="24" height="24" rx="11" fill="#8F9BA1"/>' +
  /* floral decal, the detail that reads as "Miyako-class kitchen appliance" */
  '<g fill="#5B8FC7" opacity=".72">' +
    '<circle cx="170" cy="300" r="7"/><circle cx="186" cy="288" r="6"/><circle cx="186" cy="312" r="6"/>' +
    '<circle cx="154" cy="288" r="6"/><circle cx="154" cy="312" r="6"/><circle cx="170" cy="300" r="4" fill="#F0B93C"/>' +
    '<circle cx="228" cy="326" r="6"/><circle cx="242" cy="316" r="5"/><circle cx="242" cy="336" r="5"/>' +
    '<circle cx="214" cy="316" r="5"/><circle cx="214" cy="336" r="5"/><circle cx="228" cy="326" r="3" fill="#F0B93C"/>' +
  '</g>' +
  '<path fill="none" stroke="#6FA05C" stroke-width="3" opacity=".6"' +
    ' d="M148 336c22-10 44-6 66 8M196 268c18 6 30 18 36 34"/>' +
  /* control panel */
  '<rect x="160" y="356" width="80" height="46" rx="7" fill="#9AA5AA"/>' +
  '<rect x="166" y="362" width="68" height="34" rx="4" fill="#E9EEF0"/>' +
  '<rect x="176" y="370" width="48" height="12" rx="3" fill="#7E8A90"/>' +
  '<circle cx="184" cy="390" r="4" fill="#E0453C"/><circle cx="216" cy="390" r="4" fill="#F0A62E"/>' +
  /* handles */
  '<path fill="none" stroke="#B7C1C6" stroke-width="12" stroke-linecap="round" d="M96 262c-22 0-24 34-2 36"/>' +
  '<path fill="none" stroke="#B7C1C6" stroke-width="12" stroke-linecap="round" d="M304 262c22 0 24 34 2 36"/>' +
  /* base */
  '<path fill="#3F484D" d="M118 412h164l-6 22a12 12 0 0 1-12 10H136a12 12 0 0 1-12-10z"/>' +
  '</svg>',

/* ---- usb rechargeable fan --------------------------------------------- */
fan: '<svg viewBox="0 0 400 520">' +
  '<defs>' +
    '<radialGradient id="fhead" cx=".36" cy=".3" r=".8">' +
      '<stop offset="0" stop-color="#FFFFFF"/><stop offset=".55" stop-color="#E4EAEE"/>' +
      '<stop offset="1" stop-color="#A6B2B8"/></radialGradient>' +
    '<linearGradient id="fblade" x1="0" y1="0" x2="1" y2="1">' +
      '<stop offset="0" stop-color="#8FD00E"/><stop offset="1" stop-color="#0F8654"/></linearGradient>' +
    '<linearGradient id="fstand" x1="0" y1="0" x2="1" y2="0">' +
      '<stop offset="0" stop-color="#9AA5AB"/><stop offset=".3" stop-color="#F0F4F6"/>' +
      '<stop offset="1" stop-color="#8C979D"/></linearGradient>' +
  '</defs>' +
  /* stand */
  '<path fill="url(#fstand)" d="M186 300h28v122h-28z"/>' +
  '<ellipse cx="200" cy="432" rx="86" ry="24" fill="#394247"/>' +
  '<ellipse cx="200" cy="424" rx="86" ry="24" fill="url(#fstand)"/>' +
  '<ellipse cx="200" cy="424" rx="58" ry="15" fill="#E2E8EB"/>' +
  '<rect x="176" y="414" width="48" height="16" rx="8" fill="#2F373B"/>' +
  '<circle cx="188" cy="422" r="4" fill="#8FD00E"/><circle cx="204" cy="422" r="4" fill="#5A656B"/>' +
  '<circle cx="216" cy="422" r="4" fill="#5A656B"/>' +
  /* housing */
  '<circle cx="200" cy="196" r="132" fill="url(#fhead)"/>' +
  '<circle cx="200" cy="196" r="120" fill="#2B3236"/>' +
  '<circle cx="200" cy="196" r="112" fill="#161B1E"/>' +
  /* blades */
  '<g transform="translate(200 196)" fill="url(#fblade)" opacity=".95">' +
    '<path d="M0 0C36-44 78-40 96-6 62-2 30 12 0 0z"/>' +
    '<path d="M0 0C36-44 78-40 96-6 62-2 30 12 0 0z" transform="rotate(72)"/>' +
    '<path d="M0 0C36-44 78-40 96-6 62-2 30 12 0 0z" transform="rotate(144)"/>' +
    '<path d="M0 0C36-44 78-40 96-6 62-2 30 12 0 0z" transform="rotate(216)"/>' +
    '<path d="M0 0C36-44 78-40 96-6 62-2 30 12 0 0z" transform="rotate(288)"/>' +
  '</g>' +
  /* grille */
  '<g fill="none" stroke="#C9D3D8" stroke-width="3" opacity=".85">' +
    '<circle cx="200" cy="196" r="26"/><circle cx="200" cy="196" r="48"/>' +
    '<circle cx="200" cy="196" r="70"/><circle cx="200" cy="196" r="92"/><circle cx="200" cy="196" r="110"/>' +
  '</g>' +
  '<g stroke="#C9D3D8" stroke-width="3" opacity=".85">' +
    '<path d="M200 86v220"/><path d="M90 196h220"/>' +
    '<path d="M122 118l156 156"/><path d="M278 118L122 274"/>' +
  '</g>' +
  '<circle cx="200" cy="196" r="22" fill="#2F373B"/>' +
  '<circle cx="200" cy="196" r="13" fill="url(#fstand)"/>' +
  /* usb lead */
  '<path fill="none" stroke="#2F373B" stroke-width="9" stroke-linecap="round"' +
    ' d="M244 424c48 6 74-8 84-34"/>' +
  '<rect x="322" y="366" width="30" height="18" rx="4" fill="#8C979D" transform="rotate(-24 337 375)"/>' +
  '</svg>',

/* ---- over-ear headphones ---------------------------------------------- */
headphone: '<svg viewBox="0 0 400 520">' +
  '<defs>' +
    '<linearGradient id="hcup" x1="0" y1="0" x2="1" y2="1">' +
      '<stop offset="0" stop-color="#4A5157"/><stop offset=".45" stop-color="#22282C"/>' +
      '<stop offset="1" stop-color="#0C0F11"/></linearGradient>' +
    '<linearGradient id="hband" x1="0" y1="0" x2="0" y2="1">' +
      '<stop offset="0" stop-color="#3C4348"/><stop offset="1" stop-color="#14181A"/></linearGradient>' +
  '</defs>' +
  /* headband */
  '<path fill="none" stroke="url(#hband)" stroke-width="30" stroke-linecap="round"' +
    ' d="M104 300V214a96 96 0 0 1 192 0v86"/>' +
  '<path fill="none" stroke="#5B646A" stroke-width="9" stroke-linecap="round" opacity=".7"' +
    ' d="M122 236a80 80 0 0 1 156 0"/>' +
  /* sliders */
  '<rect x="94" y="272" width="20" height="58" rx="9" fill="#5B646A"/>' +
  '<rect x="286" y="272" width="20" height="58" rx="9" fill="#5B646A"/>' +
  /* ear cups */
  '<g>' +
    '<ellipse cx="104" cy="366" rx="62" ry="76" fill="url(#hcup)"/>' +
    '<ellipse cx="104" cy="366" rx="46" ry="58" fill="#1A1E21"/>' +
    '<ellipse cx="98" cy="360" rx="34" ry="44" fill="#2C3237"/>' +
    '<ellipse cx="92" cy="344" rx="14" ry="18" fill="#fff" opacity=".08"/>' +
  '</g>' +
  '<g>' +
    '<ellipse cx="296" cy="366" rx="62" ry="76" fill="url(#hcup)"/>' +
    '<ellipse cx="296" cy="366" rx="46" ry="58" fill="#1A1E21"/>' +
    '<ellipse cx="302" cy="360" rx="34" ry="44" fill="#2C3237"/>' +
    '<circle cx="296" cy="366" r="9" fill="#8FD00E" opacity=".9"/>' +
  '</g>' +
  '</svg>',

/* ---- phone + earbuds case --------------------------------------------- */
phone: '<svg viewBox="0 0 400 520">' +
  '<defs>' +
    '<linearGradient id="pbody" x1="0" y1="0" x2="1" y2="1">' +
      '<stop offset="0" stop-color="#7C7A8C"/><stop offset=".35" stop-color="#3E3B4E"/>' +
      '<stop offset=".7" stop-color="#565469"/><stop offset="1" stop-color="#2A2836"/></linearGradient>' +
    '<linearGradient id="pscr" x1="0" y1="0" x2="1" y2="1">' +
      '<stop offset="0" stop-color="#2B2F5E"/><stop offset=".5" stop-color="#0B0D1A"/>' +
      '<stop offset="1" stop-color="#141A33"/></linearGradient>' +
    '<linearGradient id="pcase" x1="0" y1="0" x2="1" y2="1">' +
      '<stop offset="0" stop-color="#FFFFFF"/><stop offset=".6" stop-color="#EDF1F3"/>' +
      '<stop offset="1" stop-color="#C4CCD1"/></linearGradient>' +
  '</defs>' +
  /* handset */
  '<rect x="112" y="40" width="196" height="392" rx="42" fill="url(#pbody)"/>' +
  '<rect x="122" y="50" width="176" height="372" rx="34" fill="url(#pscr)"/>' +
  '<rect x="176" y="58" width="68" height="18" rx="9" fill="#000"/>' +
  '<g opacity=".5">' +
    '<path fill="none" stroke="#8FD00E" stroke-width="3" d="M122 300c46-38 92-26 176 22"/>' +
    '<path fill="none" stroke="#12A165" stroke-width="3" d="M122 340c52-30 104-16 176 34"/>' +
  '</g>' +
  /* camera island */
  '<rect x="132" y="62" width="96" height="96" rx="26" fill="#2B2937" opacity=".92"/>' +
  '<circle cx="158" cy="88" r="17" fill="#0B0C12"/><circle cx="158" cy="88" r="9" fill="#1E2B45"/>' +
  '<circle cx="202" cy="88" r="17" fill="#0B0C12"/><circle cx="202" cy="88" r="9" fill="#1E2B45"/>' +
  '<circle cx="158" cy="132" r="17" fill="#0B0C12"/><circle cx="158" cy="132" r="9" fill="#1E2B45"/>' +
  '<circle cx="202" cy="130" r="8" fill="#D7C89A"/>' +
  /* earbuds case, sat in front of the handset */
  '<rect x="236" y="332" width="126" height="104" rx="26" fill="url(#pcase)"/>' +
  '<path fill="none" stroke="#B6C0C6" stroke-width="3" d="M236 372h126"/>' +
  '<circle cx="299" cy="412" r="6" fill="#C9D2D7"/>' +
  '<g fill="#F7FAFB" stroke="#C2CBD0" stroke-width="2">' +
    '<path d="M272 346a13 13 0 0 1 26 0v10a13 13 0 0 1-26 0z"/>' +
    '<path d="M302 346a13 13 0 0 1 26 0v10a13 13 0 0 1-26 0z"/>' +
  '</g>' +
  '</svg>'
};

/* Exposed so the inline onerror fallback in each product slot can reach it. */
window.PRODUCTS = PRODUCTS;

/* --------------------------------------------------------------------------
   Hydration. Runs at parse time from a <script> placed just before </body>,
   so every slot is filled before Chrome's load event and the screenshot can
   never catch a half-built canvas.
   -------------------------------------------------------------------------- */
(function () {
  var n = 0;
  function fill() {
    var logos = document.querySelectorAll('.lg');
    for (var i = 0; i < logos.length; i++) {
      logos[i].innerHTML = LOGO(logos[i].getAttribute('data-logo') || 'dark', ++n);
    }
    /* Each product slot tries the photograph first and falls back to the
       vector on a 404. The fallback is wired through onerror rather than a
       pre-flight fetch so it resolves before the load event, which is what
       the renderer screenshots on. */
    var slots = document.querySelectorAll('.pslot');
    for (var j = 0; j < slots.length; j++) {
      var key = slots[j].getAttribute('data-p');
      if (!PRODUCTS[key]) { slots[j].innerHTML = ''; continue; }
      slots[j].innerHTML =
        '<img alt="" src="products/' + key + '.png"' +
        ' onerror="this.parentNode.innerHTML=window.PRODUCTS[\'' + key + '\']">';
    }
    var icons = document.querySelectorAll('.ico-slot');
    for (var k = 0; k < icons.length; k++) {
      var ik = icons[k].getAttribute('data-i');
      icons[k].innerHTML = '<svg class="ico" viewBox="0 0 24 24">' + (ICONS[ik] || '') + '</svg>';
    }
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', fill);
  } else {
    fill();
  }
})();
