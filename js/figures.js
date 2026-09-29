// Coded graphics. Each <div class="figure" data-figure="name"> is filled with an
// SVG drawn by FIGURES[name]. Coordinates are canvas px: the figure box is
// 1700 × 750 (see .figure in theme.css). Groups with class "fragment" step in
// with the arrow keys like any other reveal.js fragment.

(function () {
  const NS = 'http://www.w3.org/2000/svg';
  const W = 1700, H = 750;

  function el(tag, attrs = {}, parent) {
    const n = document.createElementNS(NS, tag);
    for (const [k, v] of Object.entries(attrs)) n.setAttribute(k, v);
    if (parent) parent.append(n);
    return n;
  }
  function text(parent, x, y, str, attrs = {}) {
    const t = el('text', { x, y, ...attrs }, parent);
    t.textContent = str;
    return t;
  }
  function frag(parent, index) {
    const g = el('g', { class: 'fragment' }, parent);
    if (index !== undefined) g.setAttribute('data-fragment-index', index);
    return g;
  }

  const FIGURES = {};

  // ---------------------------------------------------------------------
  // Brunel's three ships, lengths to scale, plus the Pesse canoe and the
  // Batavia (replica ≈ 56 m overall) [verify]. Batavia's rig height is stylised.
  // Only above-water hulls are drawn: freeboard, funnels and paddle boxes are
  // indicative; masts are left out. Lengths [verify]: Great Western 72 m
  // (1838), Great Britain 98 m (1843), Great Eastern 211 m (1858).
  FIGURES['great-eastern'] = svg => {
    const x0 = 390, px = 1280 / 211;   // px per metre
    const ships = [
      { name: 'Pesse canoe', note: 'c. 8000 BC · 3 m', L: 3, f: 0.5, y: 70 },
      { name: 'Batavia', note: '1628 · 56 m', L: 56, f: 5, y: 225, castle: true },
      { name: 'Great Western', note: '1838 · 72 m', L: 72, f: 5, y: 350, funnels: [0.5], paddle: 0.5 },
      { name: 'Great Britain', note: '1843 · 98 m', L: 98, f: 6, y: 470, funnels: [0.52] },
      { name: 'Great Eastern', note: '1858 · 211 m', L: 211, f: 9, y: 640, funnels: [0.2, 0.33, 0.55, 0.66, 0.79], paddle: 0.45, hero: true },
    ];

    function hull(g, s, cls) {
      const L = s.L * px, f = Math.max(s.f * px, 4), y = s.y;
      const d = `M${x0},${y} L${x0 + 0.97 * L},${y} L${x0 + L},${y - 1.2 * f} ` +
                `L${x0 + 0.02 * L},${y - f} L${x0},${y - 0.85 * f} Z`;
      el('path', { d, class: cls }, g);
      (s.funnels || []).forEach(u => {
        const fw = Math.max(2.2 * px, 6), fh = 9 * px;
        el('rect', { x: x0 + u * L - fw / 2, y: y - f - fh, width: fw, height: fh, class: cls }, g);
      });
      if (s.castle) {   // 17th-century ship: raised stern castle and a three-masted square rig
        el('path', { d: `M${x0},${y - 0.85 * f} L${x0 + 0.02 * L},${y - 2.1 * f} L${x0 + 0.2 * L},${y - 2.1 * f} L${x0 + 0.22 * L},${y - f} Z`, class: cls }, g);
        const deck = y - f;
        el('path', { d: `M${x0 + L},${y - 1.2 * f} l${0.16 * L},${-0.9 * f}`, class: 'rig' }, g);   // bowsprit
        [[0.28, 70, 1], [0.52, 96, 2], [0.76, 84, 2]].forEach(([u, h, n]) => {
          const mx = x0 + u * L;
          el('line', { x1: mx, x2: mx, y1: deck, y2: deck - h, class: 'rig' }, g);
          if (n === 1) {   // mizzen: lateen sail
            el('path', { d: `M${mx - 0.1 * L},${deck - 10} L${mx + 0.06 * L},${deck - h + 6} L${mx + 0.04 * L},${deck - 10} Z`, class: cls }, g);
            return;
          }
          const w1 = 0.2 * L, w2 = 0.15 * L, h1 = 0.42 * h, h2 = 0.34 * h;   // course, then topsail
          el('path', { d: `M${mx - w1 / 2},${deck - 8 - h1} h${w1} q-4,${h1 / 2} 0,${h1} h${-w1} q4,${-h1 / 2} 0,${-h1} Z`, class: cls }, g);
          el('path', { d: `M${mx - w2 / 2},${deck - 14 - h1 - h2} h${w2} q-3,${h2 / 2} 0,${h2} h${-w2} q3,${-h2 / 2} 0,${-h2} Z`, class: cls }, g);
        });
      }
      if (s.paddle !== undefined) {
        const r = (s.hero ? 8.5 : 4.5) * px;   // Great Eastern's wheels were ~17 m across
        el('path', { d: `M${x0 + s.paddle * L - r},${y - f} A${r},${r} 0 0 1 ${x0 + s.paddle * L + r},${y - f} Z`, class: cls }, g);
      }
    }

    ships.forEach(s => {
      const g = s.hero ? frag(svg, 1) : svg;
      el('line', { x1: x0 - 20, x2: W, y1: s.y, y2: s.y, class: 'water' }, g);
      hull(g, s, s.hero ? 'hull hero' : 'hull');
      text(g, 0, s.y - 30, s.name, { 'font-size': 44, class: s.hero ? 'warm' : '' });
      text(g, 0, s.y + 8, s.note, { 'font-size': 30, class: 'dim' });
    });

    // Brunel's previous ship, doubled, laid over the Great Eastern
    const g = frag(svg, 1), gb = ships[3], ge = ships[4];   // appears with the Great Eastern
    const L2 = 2 * gb.L * px, f2 = 2 * gb.f * px;
    el('path', { d: `M${x0},${ge.y + 40} L${x0 + L2},${ge.y + 40}`, class: 'ghost' }, g);
    el('path', { d: `M${x0},${ge.y + 28} v24 M${x0 + L2},${ge.y + 28} v24`, class: 'ghost' }, g);
    text(g, x0 + L2 / 2, ge.y + 90, '2 × Great Britain', { 'font-size': 32, class: 'dim', 'text-anchor': 'middle' });

    text(svg, W, H + 40, 'lengths to scale', { 'font-size': 24, class: 'faint', 'text-anchor': 'end' });
  };

  // ---------------------------------------------------------------------
  // Kleiber's law: resting metabolic rate B ≈ 3.4 W · (M / kg)^¾.
  // Animals are placed ON the law (this is the law, not a dataset). Fragment:
  // the "scale by weight" line from the mouse, which is what killed Tusko
  // [verify: Tusko's dose was scaled from cats].
  FIGURES['kleiber'] = svg => {
    const X0 = 170, X1 = 1650, Y0 = 640, Y1 = 20;
    const lx = [-2, 4], ly = [-1, 5];                 // log10 ranges
    const X = m => X0 + (Math.log10(m) - lx[0]) / (lx[1] - lx[0]) * (X1 - X0);
    const Y = b => Y0 - (Math.log10(b) - ly[0]) / (ly[1] - ly[0]) * (Y0 - Y1);
    const B = m => 3.4 * Math.pow(m, 0.75);

    ['10 g', '100 g', '1 kg', '10 kg', '100 kg', '1 t', '10 t'].forEach((lab, i) => {
      const x = X(Math.pow(10, lx[0] + i));
      el('line', { x1: x, x2: x, y1: Y1, y2: Y0, class: 'grid' }, svg);
      text(svg, x, Y0 + 44, lab, { 'font-size': 30, class: 'dim', 'text-anchor': 'middle' });
    });
    ['0.1 W', '1 W', '10 W', '100 W', '1 kW', '10 kW', '100 kW'].forEach((lab, i) => {
      const y = Y(Math.pow(10, ly[0] + i));
      el('line', { x1: X0, x2: X1, y1: y, y2: y, class: 'grid' }, svg);
      text(svg, X0 - 20, y + 10, lab, { 'font-size': 30, class: 'dim', 'text-anchor': 'end' });
    });
    text(svg, (X0 + X1) / 2, Y0 + 100, 'body mass', { 'font-size': 34, class: 'dim', 'text-anchor': 'middle' });
    text(svg, X0 - 130, (Y0 + Y1) / 2, 'energy burned at rest', { 'font-size': 34, class: 'dim', 'text-anchor': 'middle',
      transform: `rotate(-90 ${X0 - 130} ${(Y0 + Y1) / 2})` });

    const m0 = 0.012, m1 = 9000;
    el('line', { x1: X(m0), y1: Y(B(m0)), x2: X(m1), y2: Y(B(m1)), class: 'trend' }, svg);

    const animals = [['mouse', 0.02], ['rat', 0.3], ['cat', 4], ['dog', 20], ['human', 70], ['horse', 500], ['elephant', 4000]];
    animals.forEach(([name, m]) => {
      el('circle', { cx: X(m), cy: Y(B(m)), r: 13, class: 'dot' }, svg);
      text(svg, X(m) + 4, Y(B(m)) + (name === 'mouse' ? -34 : 58), name, { 'font-size': 32, 'text-anchor': 'middle' });
    });
    text(svg, X(1500), Y(B(1500)) - 40, 'energy ∝ mass', { 'font-size': 40, class: 'warm', 'text-anchor': 'end' });
    text(svg, X(1500) + 2, Y(B(1500)) - 62, '¾', { 'font-size': 30, class: 'warm' });

    // Naive linear scaling from the mouse
    const g = frag(svg, 1), mm = 0.02, me = 4000;
    const naive = m => B(mm) * m / mm;
    el('line', { x1: X(mm), y1: Y(naive(mm)), x2: X(me), y2: Y(naive(me)), class: 'trend naive' }, g);
    el('circle', { cx: X(me), cy: Y(naive(me)), r: 13, fill: 'none', stroke: 'var(--ink-dim)', 'stroke-width': 3 }, g);
    text(g, X(me) - 30, Y(naive(me)) - 56, 'scaled by weight:', { 'font-size': 32, class: 'dim', 'text-anchor': 'end' });
    text(g, X(me) - 30, Y(naive(me)) - 16, `≈ ${Math.round(naive(me) / B(me))}× too much`, { 'font-size': 32, class: 'dim', 'text-anchor': 'end' });
    text(g, X0 + 40, Y1 + 70, 'Get the scaling wrong, and it’s fatal', { 'font-size': 60, class: 'warm' });
  };

  // ---------------------------------------------------------------------
  // Timeline, 8000 BC → today, linear in time. The point: everything from
  // steam onwards is a sliver at the right-hand end. [verify: first sails]
  FIGURES['timeline'] = svg => {
    const Y = 380, x0 = 80, x1 = 1620, t0 = -8000, t1 = 2030;
    const X = yr => x0 + (yr - t0) / (t1 - t0) * (x1 - x0);
    el('line', { x1: x0, x2: x1, y1: Y, y2: Y, class: 'axis', 'stroke-width': 4 }, svg);
    [-8000, -6000, -4000, -2000, 0, 2000].forEach(yr => {
      el('line', { x1: X(yr), x2: X(yr), y1: Y - 10, y2: Y + 10, class: 'axis' }, svg);
      text(svg, X(yr), Y + 56, yr < 0 ? `${-yr} BC` : yr === 0 ? '0' : `AD ${yr}`, { 'font-size': 30, class: 'dim', 'text-anchor': 'middle' });
    });
    function event(g, yr, label, note) {
      el('line', { x1: X(yr), x2: X(yr), y1: Y, y2: Y - 110, class: 'axis' }, g);
      el('circle', { cx: X(yr), cy: Y, r: 12, class: 'dot' }, g);
      text(g, X(yr), Y - 170, label, { 'font-size': 44, 'text-anchor': 'middle' });
      text(g, X(yr), Y - 128, note, { 'font-size': 30, class: 'dim', 'text-anchor': 'middle' });
    }
    event(svg, -8000, 'Pesse canoe', 'c. 8000 BC');
    event(frag(svg, 1), -3000, 'sails', 'c. 3000 BC');
    const g = frag(svg, 2);
    el('rect', { x: X(1800), y: Y - 26, width: X(2026) - X(1800), height: 52, class: 'warm' }, g);
    el('line', { x1: X(1913), x2: X(1913), y1: Y + 32, y2: Y + 110, class: 'axis' }, g);
    text(g, X(2026), Y + 170, 'steam, Brunel, Froude,', { 'font-size': 40, class: 'warm', 'text-anchor': 'end' });
    text(g, X(2026), Y + 220, 'computers, AI: the last 2%', { 'font-size': 40, class: 'warm', 'text-anchor': 'end' });
  };

  // ---------------------------------------------------------------------
  // VOC route, Texel → Batavia, on Natural Earth 110m land (equirectangular).
  // Waypoints are schematic: out via the Channel and the Canaries/Cape Verde,
  // the swing west towards Brazil to find the trade winds, round the Cape,
  // then the Brouwer route (1611): run east in the Roaring Forties before
  // turning north to the Sunda Strait. [verify: ~8 months, ~24,000 km]
  FIGURES['voc-route'] = svg => {
    const lon0 = -42, lon1 = 128, lat0 = 62, lat1 = -46, k = H / (lat0 - lat1);
    const P = ([lon, lat]) => [(lon - lon0) * k, (lat0 - lat) * k];
    const Wm = (lon1 - lon0) * k;
    const clip = el('clipPath', { id: 'voc-clip' }, el('defs', {}, svg));
    el('rect', { x: 0, y: 0, width: Wm, height: H }, clip);
    const land = window.topojson && window.LAND110 ? topojson.feature(LAND110, LAND110.objects.land) : null;
    if (land) {
      let d = '';
      land.features.forEach(f => {
        const polys = f.geometry.type === 'Polygon' ? [f.geometry.coordinates] : f.geometry.coordinates;
        polys.forEach(poly => poly.forEach(ring => {
          if (ring.every(([lon]) => lon < lon0 - 5 || lon > lon1 + 5)) return;
          d += ring.map((c, i) => (i ? 'L' : 'M') + P(c).map(v => v.toFixed(1)).join(',')).join('') + 'Z';
        }));
      });
      el('path', { d, class: 'land', 'clip-path': 'url(#voc-clip)' }, svg);
    }
    // Smooth the waypoints with a Catmull–Rom spline
    const pts = [[4.8, 53.0], [-2, 49.8], [-11, 42], [-17, 28], [-24, 14], [-28, 0], [-26, -16], [-12, -31],
                 [18.5, -38], [45, -40.5], [80, -40], [104, -35], [107, -20], [105.8, -6.8], [106.8, -6.1]].map(P);
    let d = `M${pts[0]}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const [p0, p1, p2, p3] = [pts[i - 1] || pts[i], pts[i], pts[i + 1], pts[i + 2] || pts[i + 1]];
      const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
      const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
      d += `C${c1} ${c2} ${p2}`;
    }
    const g = frag(svg, 1);
    el('path', { d, class: 'route', pathLength: 1 }, g);
    [[[4.8, 53.0], 'Texel', -20, -22, 'end'], [[18.5, -34.4], 'Cape of Good Hope', 22, 8, 'start'], [[106.8, -6.1], 'Batavia', -22, -18, 'end']]
      .forEach(([c, lab, dx, dy, anchor]) => {
        const [x, y] = P(c);
        el('circle', { cx: x, cy: y, r: 9, class: 'dot' }, svg);
        text(svg, x + dx, y + dy, lab, { 'font-size': 32, 'text-anchor': anchor });
      });
    const t = frag(g, 2), x = Wm + 50;
    text(t, x, 250, 'about 8 months', { 'font-size': 52, class: 'warm' });
    text(t, x, 300, 'each way', { 'font-size': 36, class: 'dim' });
    text(t, x, 420, 'the trick: sail south', { 'font-size': 36 });
    text(t, x, 466, 'and let the Roaring Forties', { 'font-size': 36 });
    text(t, x, 512, 'blow you east', { 'font-size': 36 });
  };

  // ---------------------------------------------------------------------
  // Square–cube: double the length → surface (≈ drag) ×4, volume (cargo) ×8.
  FIGURES['square-cube'] = svg => {
    const COOL = ['#00a6d6', '#5ccbeb', '#00789b'], WARM = ['#f0a53c', '#f7c983', '#b8771f'];
    function cube(g, x, y, s, [f, t, sd]) {
      const d = 0.45 * s, e = 0.75 * d;
      el('path', { d: `M${x},${y - s} l${d},${-e} h${s} l${-d},${e} Z`, fill: t }, g);
      el('path', { d: `M${x + s},${y} l${d},${-e} v${-s} l${-d},${e} Z`, fill: sd }, g);
      el('rect', { x, y: y - s, width: s, height: s, fill: f }, g);
    }
    cube(svg, 180, 560, 150, COOL);
    text(svg, 255, 620, 'one length', { 'font-size': 36, class: 'dim', 'text-anchor': 'middle' });
    cube(svg, 620, 560, 300, WARM);
    text(svg, 770, 620, 'twice the length', { 'font-size': 36, class: 'dim', 'text-anchor': 'middle' });

    const g1 = frag(svg, 1);
    text(g1, 1180, 250, 'surface × 4', { 'font-size': 56 });
    text(g1, 1180, 300, '→ drag × 4', { 'font-size': 40, class: 'cool' });
    text(g1, 1180, 420, 'volume × 8', { 'font-size': 56 });
    text(g1, 1180, 470, '→ cargo and coal × 8', { 'font-size': 40, class: 'warm' });
    const g2 = frag(svg, 2);
    text(g2, W / 2, 720, 'bigger ship: more cargo for each unit of drag', { 'font-size': 52, class: 'warm', 'text-anchor': 'middle' });
  };

  // ---------------------------------------------------------------------
  // Deep-water gravity waves: speed = √(g λ / 2π), so 16× longer → 4× faster.
  // Screen lengths 1600 vs 100 px and speeds 400 vs 100 px/s keep that √ law;
  // the real swell/ripple ratio is larger ("not to scale").
  // 200 m swell: √(9.81·200/2π) = 17.7 m/s ≈ 64 km/h. 5 cm ripple: ≈ 0.28 m/s ≈ 1 km/h.
  FIGURES['waves'] = svg => {
    const clip = el('clipPath', { id: 'waves-clip' }, el('defs', {}, svg));
    el('rect', { x: 0, y: 0, width: W, height: H }, clip);
    function wave(y, lambda, amp, speed) {
      const g = el('g', { 'clip-path': 'url(#waves-clip)' }, svg);
      let d = '';
      for (let x = -lambda; x <= W + lambda; x += lambda / 32)
        d += `${d ? 'L' : 'M'}${x.toFixed(1)},${(y - amp * Math.cos(2 * Math.PI * x / lambda)).toFixed(1)}`;
      const p = el('path', { d, class: 'surface drift' }, g);
      p.style.setProperty('--dx', `${lambda}px`);
      p.style.setProperty('--T', `${lambda / speed}s`);
    }
    text(svg, 0, 60, 'ocean swell', { 'font-size': 52 });
    text(svg, 0, 104, '200 m long · 60 km/h, as fast as a car', { 'font-size': 34, class: 'dim' });
    wave(250, 1600, 60, 400);
    text(svg, 0, 400, 'ripple', { 'font-size': 52 });
    text(svg, 0, 444, 'a few cm long · ~1 km/h, a slow crawl', { 'font-size': 34, class: 'dim' });
    wave(530, 100, 10, 100);
    const g = frag(svg, 1);
    text(g, W / 2, 690, 'longer waves travel faster', { 'font-size': 60, class: 'warm', 'text-anchor': 'middle' });
    text(svg, W, H + 40, 'not to scale', { 'font-size': 24, class: 'faint', 'text-anchor': 'end' });
  };

  // ---------------------------------------------------------------------
  // Froude scaling. A ship makes a wave whose length is λ = 2π U²/g; keep
  // Fn = U/√(gL) fixed and λ/L = 2π Fn² is fixed, so the waves are the same picture.
  // The speed of a wave as long as the ship is √(gL/2π), so Fn = U/c / √(2π) ≈ 0.4 U/c.
  // Ship 200 m at 0.35·√(9.81·200) = 15.5 m/s; model 1/100 → 2 m at 1.55 m/s.
  function shipWithWave(parent, x, y, L) {
    const g = el('g', { transform: `translate(${x} ${y}) scale(${L / 100})` }, parent);
    const lam = 2 * Math.PI * 0.35 * 0.35 * 100, A = 3.2;
    el('path', { d: 'M2,4 L97,4 L101.5,-7.5 L1,-6 L0,-4 Z', class: 'hull' }, g);
    el('rect', { x: 4, y: -14, width: 9, height: 8.5, class: 'hull' }, g);
    let d = '';
    for (let u = -25; u <= 112; u += 0.5) {
      const eta = u > 100 ? A * Math.exp(-(u - 100) * 0.5)
                          : A * Math.cos(2 * Math.PI * (100 - u) / lam) * (u < 0 ? Math.exp(u / 30) : 1);
      d += `${d ? 'L' : 'M'}${u},${(-eta).toFixed(2)}`;
    }
    el('path', { d: `${d} L112,14 L-25,14 Z`, class: 'sea' }, g);
    el('path', { d, class: 'surface', 'vector-effect': 'non-scaling-stroke' }, g);
    return g;
  }
  FIGURES['froude'] = svg => {
    shipWithWave(svg, 240, 170, 1100);
    text(svg, 1400, 90, 'Ship', { 'font-size': 48 });
    text(svg, 1400, 136, '200 m · 15.5 m/s', { 'font-size': 34, class: 'dim' });

    const g1 = frag(svg, 1);
    shipWithWave(g1, 240, 440, 11);
    text(g1, 290, 400, 'Model: 100× smaller', { 'font-size': 44 });
    text(g1, 290, 446, '2 m · 1.55 m/s: only 10× slower', { 'font-size': 34, class: 'dim' });

    const gF = frag(svg, 2);   // the link: both have the same Froude number
    text(gF, 1400, 184, 'Froude number 0.35', { 'font-size': 38, class: 'warm' });
    text(gF, 290, 494, 'Froude number 0.35', { 'font-size': 38, class: 'warm' });

    const g2 = frag(svg, 3);
    const clip = el('clipPath', { id: 'froude-inset' }, el('defs', {}, g2));
    el('rect', { x: 900, y: 330, width: 780, height: 230 }, clip);
    el('rect', { x: 900, y: 330, width: 780, height: 230, rx: 12, class: 'ghost' }, g2);
    shipWithWave(el('g', { 'clip-path': 'url(#froude-inset)' }, g2), 1040, 460, 600);
    text(g2, 1660, 376, 'matching waves!', { 'font-size': 40, class: 'warm', 'text-anchor': 'end' });
  };

  // ---------------------------------------------------------------------
  // Dense air. Air's viscosity barely changes with pressure but its density
  // grows ∝ pressure, so ν = μ/ρ ∝ 1/p. ν_air(1 bar, 20 °C) ≈ 15 × ν_water.
  // Ideal-gas approximation.
  FIGURES['dense-air'] = svg => {
    const X0 = 230, X1 = 1600, Y0 = 480, Y1 = 10;
    const X = p => X0 + Math.log10(p) / Math.log10(300) * (X1 - X0);
    const Y = v => Y0 - (Math.log10(v) + 1.5) / 3 * (Y0 - Y1);
    el('rect', { x: X0, y: Y(1), width: X1 - X0, height: Y0 - Y(1), fill: 'var(--cool)', 'fill-opacity': 0.08 }, svg);
    [1, 3, 10, 30, 100, 300].forEach(p => {
      el('line', { x1: X(p), x2: X(p), y1: Y1, y2: Y0, class: 'grid' }, svg);
      text(svg, X(p), Y0 + 44, `${p}`, { 'font-size': 30, class: 'dim', 'text-anchor': 'middle' });
    });
    [[0.1, '0.1×'], [1, '1×'], [10, '10×']].forEach(([v, lab]) => {
      el('line', { x1: X0, x2: X1, y1: Y(v), y2: Y(v), class: 'grid' }, svg);
      text(svg, X0 - 20, Y(v) + 10, lab, { 'font-size': 30, class: 'dim', 'text-anchor': 'end' });
    });
    text(svg, (X0 + X1) / 2, Y0 + 96, 'air pressure (bar)', { 'font-size': 34, class: 'dim', 'text-anchor': 'middle' });
    text(svg, X0 - 110, (Y0 + Y1) / 2, 'friction ÷ mass', { 'font-size': 34, class: 'dim', 'text-anchor': 'middle',
      transform: `rotate(-90 ${X0 - 110} ${(Y0 + Y1) / 2})` });

    el('line', { x1: X0, x2: X1, y1: Y(1), y2: Y(1), class: 'trend naive', style: 'stroke: var(--cool)' }, svg);
    text(svg, X1 - 10, Y(1) - 16, 'water', { 'font-size': 36, class: 'cool', 'text-anchor': 'end' });
    text(svg, X0 + 20, Y0 - 20, 'less friction for its mass than water', { 'font-size': 30, class: 'cool' });
    el('line', { x1: X(1), y1: Y(15), x2: X(300), y2: Y(15 / 300), class: 'trend' }, svg);
    el('circle', { cx: X(1), cy: Y(15), r: 13, class: 'dot' }, svg);
    text(svg, X(1) + 30, Y(15) - 20, 'ordinary air', { 'font-size': 34 });
    const g = frag(svg, 1);
    el('circle', { cx: X(15), cy: Y(1), r: 13, class: 'dot' }, g);
    text(g, X(15) + 26, Y(1) - 22, '15 bar: just like water', { 'font-size': 34 });
    const g2 = frag(svg, 2);
    el('circle', { cx: X(200), cy: Y(15 / 200), r: 13, class: 'dot' }, g2);
    text(g2, X(200) - 26, Y(15 / 200) + 56, '200 bar: 13× less than water', { 'font-size': 34, 'text-anchor': 'end' });
  };

  // ---------------------------------------------------------------------
  // Geotechnical centrifuge. Felt gravity n = ω² r / g; for a 5 m arm,
  // 1 g at 13 rpm, 100 g at 134 rpm. Soil stress ∝ ρ g depth, so a model
  // N× smaller needs N g. Settling (diffusion) time ∝ length², so it runs
  // N² faster: 10 years / 100² ≈ 9 hours.
  FIGURES['centrifuge'] = svg => {
    const X0 = 200, X1 = 1060, Y0 = 480, Y1 = 20, r = 5;
    const X = rpm => X0 + rpm / 250 * (X1 - X0);
    const Y = n => Y0 - n / 350 * (Y0 - Y1);
    const n = rpm => Math.pow(2 * Math.PI * rpm / 60, 2) * r / 9.81;
    [0, 50, 100, 150, 200, 250].forEach(v => {
      el('line', { x1: X(v), x2: X(v), y1: Y1, y2: Y0, class: 'grid' }, svg);
      text(svg, X(v), Y0 + 44, `${v}`, { 'font-size': 30, class: 'dim', 'text-anchor': 'middle' });
    });
    [0, 100, 200, 300].forEach(v => {
      el('line', { x1: X0, x2: X1, y1: Y(v), y2: Y(v), class: 'grid' }, svg);
      text(svg, X0 - 20, Y(v) + 10, `${v} g`, { 'font-size': 30, class: 'dim', 'text-anchor': 'end' });
    });
    text(svg, (X0 + X1) / 2, Y0 + 96, 'spin rate (turns per minute)', { 'font-size': 34, class: 'dim', 'text-anchor': 'middle' });
    text(svg, X0 - 120, (Y0 + Y1) / 2, 'gravity felt', { 'font-size': 34, class: 'dim', 'text-anchor': 'middle',
      transform: `rotate(-90 ${X0 - 120} ${(Y0 + Y1) / 2})` });
    let d = '';
    for (let rpm = 0; rpm <= 250; rpm += 2) if (n(rpm) <= 350) d += `${d ? 'L' : 'M'}${X(rpm)},${Y(n(rpm))}`;
    el('path', { d, class: 'trend' }, svg);
    el('circle', { cx: X(134), cy: Y(100), r: 13, class: 'dot' }, svg);
    text(svg, X(134) + 28, Y(100) + 12, '100 g at 134 rpm', { 'font-size': 34 });
    text(svg, X0 + 20, Y1 + 30, 'for a 5 m arm', { 'font-size': 28, class: 'dim' });

    const g = frag(svg, 1);
    text(g, 1180, 150, 'a model 100× smaller,', { 'font-size': 40 });
    text(g, 1180, 200, 'spun at 100 g:', { 'font-size': 40 });
    text(g, 1180, 310, '10 years', { 'font-size': 72, class: 'dim' });
    text(g, 1180, 380, 'of settling happen in', { 'font-size': 36, class: 'dim' });
    text(g, 1180, 470, '9 hours', { 'font-size': 72, class: 'warm' });
  };

  // ---------------------------------------------------------------------
  // G.I. Taylor's blast wave: R = (E t² / ρ)^(1/5) (constant ≈ 1). Drawn for
  // E = 20 kt TNT = 8.4e13 J, ρ = 1.2 kg/m³: R(16 ms) ≈ 115 m. Real time runs
  // 100× slowed. [verify: Taylor's estimate ≈ 17 kt vs ≈ 20 kt]
  FIGURES['fireball'] = svg => {
    const E = 8.4e13, rho = 1.2, px = 2.2, cx = 1150, gy = 560;
    const defs = el('defs', {}, svg);
    const grad = el('radialGradient', { id: 'fb-grad' }, defs);
    [['0%', '#fff7e0', 1], ['45%', '#f7c26b', 0.95], ['85%', '#f0a53c', 0.75], ['100%', '#c0461c', 0.2]].forEach(([o, c, a]) =>
      el('stop', { offset: o, 'stop-color': c, 'stop-opacity': a }, grad));
    const clip = el('clipPath', { id: 'fb-clip' }, defs);
    el('rect', { x: 0, y: -200, width: W, height: gy + 200 }, clip);
    const ball = el('circle', { cx, cy: gy - 30, r: 0, fill: 'url(#fb-grad)', 'clip-path': 'url(#fb-clip)' }, svg);
    el('line', { x1: 700, x2: W, y1: gy, y2: gy, class: 'axis', 'stroke-width': 3 }, svg);
    el('path', { d: `M${W - 220},${gy + 40} h${100 * px} M${W - 220},${gy + 30} v20 M${W - 220 + 100 * px},${gy + 30} v20`, class: 'axis' }, svg);
    text(svg, W - 220 + 50 * px, gy + 80, '100 m', { 'font-size': 28, class: 'dim', 'text-anchor': 'middle' });

    text(svg, 0, 90, 'time', { 'font-size': 34, class: 'dim' });
    const tT = text(svg, 0, 170, '', { 'font-size': 84, class: 'warm' });
    text(svg, 0, 260, 'radius', { 'font-size': 34, class: 'dim' });
    const tR = text(svg, 0, 340, '', { 'font-size': 84, class: 'warm' });
    const g = frag(svg, 1);
    text(g, 0, 430, 'energy', { 'font-size': 34, class: 'dim' });
    text(g, 0, 500, '≈ 20 kilotons of TNT', { 'font-size': 60 });

    const tMax = 0.06, loop = 8, grow = 6;   // 60 ms of blast over 6 s of screen time
    let raf = null, t0 = 0;
    function draw(s) {
      const t = Math.max(1e-4, Math.min(s, grow) / grow * tMax);
      const R = Math.pow(E * t * t / rho, 0.2);
      ball.setAttribute('r', (R * px).toFixed(1));
      tT.textContent = `${(t * 1000).toFixed(1)} ms`;
      tR.textContent = `${Math.round(R)} m`;
    }
    function frame(now) { draw(((now - t0) / 1000) % loop); raf = requestAnimationFrame(frame); }
    draw(grow);
    return {
      start() { if (!raf) { t0 = performance.now(); raf = requestAnimationFrame(frame); } },
      stop() { if (raf) cancelAnimationFrame(raf); raf = null; draw(grow); },
    };
  };

  // ---------------------------------------------------------------------
  // Speed cubed. Drag ∝ U², power = drag × U ∝ U³ (fuel per hour); a trip of
  // fixed length takes 1/U as long, so fuel per trip ∝ U². Idealised: ignores
  // hotel load and the engine's efficiency changing with load.
  FIGURES['speed-cubed'] = svg => {
    const base = 520, full = 400, bw = 130;
    const cases = [['full speed', 1], ['20% slower', 0.8], ['half speed', 0.5]];
    el('rect', { x: 0, y: 12, width: 34, height: 34, class: 'warm' }, svg);
    text(svg, 50, 42, 'engine power', { 'font-size': 36 });
    el('rect', { x: 330, y: 12, width: 34, height: 34, class: 'cool' }, svg);
    text(svg, 380, 42, 'fuel for the whole trip', { 'font-size': 36 });
    el('line', { x1: 200, x2: 1600, y1: base, y2: base, class: 'axis' }, svg);
    cases.forEach(([lab, u], k) => {
      const g = k === 0 ? svg : frag(svg, k), cx = 450 + 450 * k;
      [[u ** 3, 'warm', cx - bw - 10], [u ** 2, 'cool', cx + 10]].forEach(([v, cls, x]) => {
        el('rect', { x, y: base - full * v, width: bw, height: full * v, class: `bar vert ${cls}` }, g);
        text(g, x + bw / 2, base - full * v - 18, `${Math.round(100 * v)}%`, { 'font-size': 40, class: cls, 'text-anchor': 'middle' });
      });
      text(g, cx, base + 56, lab, { 'font-size': 44, 'text-anchor': 'middle' });
    });
    text(svg, 760, 140, 'engine power ∝ speed × speed × speed', { 'font-size': 44 });
    const g = frag(svg, 4);
    text(g, 1350, 250, 'now the wind can do', { 'font-size': 44, class: 'warm', 'text-anchor': 'middle' });
    text(g, 1350, 304, 'a real share of the work', { 'font-size': 44, class: 'warm', 'text-anchor': 'middle' });
  };

  // ---------------------------------------------------------------------
  // Reinforcement learning loop.
  FIGURES['rl-loop'] = svg => {
    const cx = 850, cy = 320, R = 230;
    const nodes = [['try a move', -90], ['see what happens', 0], ['score it', 90], ['adjust', 180]];
    const mk = el('marker', { id: 'rl-arrow', viewBox: '0 0 10 10', refX: 5, refY: 5, markerWidth: 5, markerHeight: 5, orient: 'auto-start-reverse' }, el('defs', {}, svg));
    el('path', { d: 'M0,0 L10,5 L0,10 Z', fill: 'var(--ink-dim)' }, mk);
    const P = a => [cx + R * Math.cos(a * Math.PI / 180), cy + R * Math.sin(a * Math.PI / 180)];
    nodes.forEach(([, a]) => {
      const [xa, ya] = P(a + 18), [xb, yb] = P(a + 72);
      el('path', { d: `M${xa},${ya} A${R},${R} 0 0 1 ${xb},${yb}`, fill: 'none', stroke: 'var(--ink-dim)', 'stroke-width': 4, 'marker-end': 'url(#rl-arrow)' }, svg);
    });
    nodes.forEach(([lab, a]) => {
      const [x, y] = P(a);
      el('circle', { cx: x, cy: y, r: 14, class: 'dot' }, svg);
      const anchor = a === 0 ? 'start' : a === 180 ? 'end' : 'middle';
      const dx = a === 0 ? 34 : a === 180 ? -34 : 0, dy = a === -90 ? -34 : a === 90 ? 60 : 12;
      text(svg, x + dx, y + dy, lab, { 'font-size': 46, 'text-anchor': anchor });
    });
    const dot = el('circle', { r: 18, class: 'warm' }, svg);
    el('animateMotion', { dur: '4s', repeatCount: 'indefinite',
      path: `M${cx},${cy - R} A${R},${R} 0 1 1 ${cx - 0.01},${cy - R}` }, dot);
    text(svg, cx, cy - 6, 'millions of tries', { 'font-size': 40, class: 'warm', 'text-anchor': 'middle' });
    text(svg, cx, cy + 44, 'in a simulator', { 'font-size': 36, class: 'dim', 'text-anchor': 'middle' });
  };

  // ---------------------------------------------------------------------
  // Strouhal number St = f A / U = A / λ, since the tail travels λ = U/f per
  // flap. Cruising swimmers and flyers sit at 0.2–0.4 (Taylor, Nudds & Thomas
  // 2003, Nature). Drawn at A/λ = 180/520 ≈ 0.35. [verify]
  FIGURES['strouhal'] = svg => {
    const y = 250, A = 90, lam = 520, x0 = 120, x1 = 1680;
    const mk = el('marker', { id: 'st-arrow', viewBox: '0 0 10 10', refX: 9, refY: 5, markerWidth: 6, markerHeight: 6, orient: 'auto-start-reverse' }, el('defs', {}, svg));
    el('path', { d: 'M0,0 L10,5 L0,10 Z', fill: 'var(--ink-dim)' }, mk);
    let d = '';
    for (let x = x0; x <= x1; x += 4) d += `${d ? 'L' : 'M'}${x},${(y - A * Math.sin(2 * Math.PI * (x - x0) / lam)).toFixed(1)}`;
    el('path', { d, class: 'trend' }, svg);
    // A flipper (leading edge forward) that follows the track and pitches with it
    const flip = el('path', { d: 'M34,0 C28,-11 6,-14 -14,-9 C-30,-5 -50,-1 -62,0 C-50,1 -30,5 -14,9 C6,14 28,11 34,0 Z', class: 'hull' }, svg);
    el('animateMotion', { dur: '6s', repeatCount: 'indefinite', path: d, rotate: 'auto' }, flip);
    const xa = x0 + 1.5 * lam;
    el('path', { d: `M${x0 + 1.25 * lam},${y - A} H${xa + 30} M${x0 + 1.75 * lam},${y + A} H${xa - 30}`, class: 'ghost' }, svg);
    el('path', { d: `M${xa},${y - A} v${2 * A}`, class: 'axis', 'stroke-width': 3, 'marker-start': 'url(#st-arrow)', 'marker-end': 'url(#st-arrow)' }, svg);
    text(svg, xa + 24, y + 12, 'flap size', { 'font-size': 38 });
    const yb = y + A + 70;
    el('path', { d: `M${x0 + 0.25 * lam},${yb} h${lam}`, class: 'axis', 'stroke-width': 3, 'marker-start': 'url(#st-arrow)', 'marker-end': 'url(#st-arrow)' }, svg);
    text(svg, x0 + 0.75 * lam, yb + 50, 'distance per flap', { 'font-size': 38, 'text-anchor': 'middle' });
    const g = frag(svg, 1);
    text(g, 1650, yb + 50, 'dolphins · sharks · birds · bats · insects', { 'font-size': 38, class: 'dim', 'text-anchor': 'end' });
    text(g, 1650, yb + 110, 'all cruise at a ratio of 0.2 – 0.4', { 'font-size': 48, class: 'warm', 'text-anchor': 'end' });
  };

  const controls = [];
  document.querySelectorAll('.figure[data-figure]').forEach(div => {
    const draw = FIGURES[div.dataset.figure];
    if (!draw) { div.textContent = `unknown figure: ${div.dataset.figure}`; return; }
    const svg = el('svg', { viewBox: `0 0 ${W} ${H}`, 'aria-hidden': 'true' }, div);
    const ctl = draw(svg);
    if (ctl) controls.push([div, ctl]);
  });

  // Figures with script-driven animation run only while their slide is showing.
  function sync() {
    const cur = Reveal.getCurrentSlide();
    if (cur) cur.querySelectorAll('svg').forEach(s => s.unpauseAnimations && s.unpauseAnimations());
    controls.forEach(([div, ctl]) => (cur && cur.contains(div) ? ctl.start() : ctl.stop()));
  }
  Reveal.on('ready', sync);
  Reveal.on('slidechanged', sync);
  // When a photo cover fades away, restart the animation it was hiding.
  Reveal.on('fragmentshown', e => {
    if (!e.fragment.classList.contains('cover')) return;
    controls.forEach(([div, ctl]) => { if (e.fragment.parentNode.contains(div)) { ctl.stop(); ctl.start(); } });
  });
})();