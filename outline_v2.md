# Why Are We Still Inventing Ships?

> **Now superseded by `index.html`** for slide order and notes. Changes since approval: cities cut; added timeline (after 2), square-cube (before Great Eastern), waves + Froude (7a/b), ratio trio (8a–c), RL loop (after 15), Strouhal (after 17). Cut slide 13 (AI simulation); 8a–c photos are now the opening beat of their graphic slides.
> Scaling section consolidated: towing-tank slide folded into the waves slide (swell vs ripple); Froude slide ends on model/ship photos ("It works!"); sub and centrifuge keep one top headline; Taylor fireball commented out; heartbeats + Tusko folded into one Kleiber slide (mouse/elephant photos → plot → fatal dashed line).
> Acts III–IV reordered: ML scaling → speed³ / slow steaming (bridge) → wind → Kiki → RL loop → unsteady surprises → simulation (seeing unsteady flow: bank effect, flapping, fish) → plesiosaur → Strouhal → flexible → close. Sim-vs-experiment gallery removed.

**Format:** 40–45 min talk + Q&A · English · cinematic (full-bleed images/video, one short headline per slide) · silent videos
**Takeaway:** *There is still so much more to learn.*
**Threads that run through the talk:**
- **Pesse canoe:** opens and closes the talk
- **"Hungry" steam → free wind:** a word planted early and paid off later
- **Scaling:** Brunel's argument → Froude → the rest of science → machines discovering scaling laws
- **Steady vs. unsteady:** introduced at Froude's tank, paid off in Act IV
- **AI:** scaling laws learned from data → faster simulation → a boat that taught itself to sail

Minute marks are cumulative targets.

---

## Act I — We have always been inventing ships (~9 min)

### 1. Why are we still inventing ships? `0:00`
Full-bleed image: Pesse canoe in low, dramatic light. Title only.
> *Note:* Don't explain yet. Ask the question and let it hang.

### 2. The oldest boat in the world was found in the Netherlands `0:30`
1. Pesse canoe photo (Drents Museum)
2. Reconstruction of the landscape at the time. Doggerland: the North Sea was dry land.
> *Note:* Found in 1955 near Hoogeveen, roughly 10,000 years old. Someone here invented this. *[verify dates]*

### 3. Sails made ships bigger and voyages longer `2:30`
1. Tall ship under full sail
2. Trade route map. **Option:** use VOC routes / the *Batavia* replica (Lelystad) for a Dutch audience instead of medieval routes.

### 4. Steam made ships fast, reliable — and hungry `4:30`
1. Paddle steamer
2. Stokers shovelling coal below deck
> *Note:* Say "hungry" deliberately. We return to it in Act III.

### 5. Brunel wanted the biggest ship ever built `6:00`
1. Great Eastern broadside (absurd scale)
2. Brunel in front of the launching chains
3. **Coded graphic:** to-scale silhouettes of the Great Eastern vs. the ships of 1858
> *Note:* Brunel's reasoning was itself a scaling argument. Cargo grows with the cube of size, drag roughly with the square, so a big enough ship could reach Australia without refuelling. It worked: it hit its design speed. It was also a commercial disaster. *[verify speed/dimensions]*

---

## Act II — Scale the physics, not just the ship (~13 min)

### 6. You can't double a ship's size by trial and error `9:00`
1. William Froude portrait
2. Froude's tank at Torquay (1872)
> *Note:* One mistake costs the whole ship. So Froude asked how to test the ship before it exists.

### 7. Froude's insight: don't just scale the ship — scale the physics
1. Model in a towing tank (video)
2. Model wave pattern vs. full-scale ship wave pattern, side by side

### 7a. Wave speed depends only on gravity and length — **coded:** tsunami vs. ripple, animated
### 7b. Scale the physics: balance ship speed and wave speed — **coded:** ship, 25× smaller model, zoomed-in model shows the same waves
Word equation: *Froude number = ship speed ÷ speed of a wave as long as the ship.* **Plant "steady" here.**

### 8. Find the important ratio — and balance it
- **8a. Submarine** (photo) → **coded:** stickiness ÷ heaviness vs. air pressure; 15 bar ≈ water. Word eq: *Reynolds number*.
- **8b. Centrifuge** (photo) → **coded:** gravity felt vs. spin rate; 10 years of settling in 9 hours. Word eq: *soil pressure = heaviness × gravity × depth*.
- **8c. G.I. Taylor** (Trinity photo) → **coded:** animated fireball, time/radius/energy readout. Word eq: *energy ≈ air heaviness × radius⁵ ÷ time²*.

### 9. Life follows scaling laws too — Kleiber plot, heartbeats, Tusko

### 11. Now computers are learning to find these rules themselves `20:30`
1. PhD student's work: ML discovering scaling laws from data (visual TBD)
> *Note:* Froude found his rule by insight. Can a machine find the next one? Short slide, about 1.5 min.

---

## Act III — New tools, and an old friend (~10 min)

### 12. Today we can simulate ships on supercomputers `22:00`
1. MARIN dam-break with cube: simulation vs. experiment
2. Ship wave pattern: prediction vs. measurement
3. Propeller simulation vs. cavitation experiment
> *Note:* Froude's tank, rebuilt inside a computer.

### 13. AI is making simulation faster *(cut if short on time)* `24:30`
1. ML-accelerated flow prediction (visual TBD)

### 14. Wind is back: free, clean — and never hungry `26:00`
1. Cargo ship with Flettner rotors
2. Suction wings from a Dutch company (eConowind / VentiFoil *[verify name]*)
3. Kite-towed ship (Airseas / similar)
> *Note:* Call back to "hungry." We've come full circle to sails, with 150 years of science behind them.

### 15. Can we teach a ship to sail itself? `28:30`
1. Kiki Bink's robot sailboat
2. Video: sailing autonomously
> *Note:* Nobody programmed it to sail. It learned by trial and error, which is exactly what Froude said you couldn't do with a real ship. A simulator and AI make trial and error cheap again.

---

## Act IV — The ocean is not steady (~10 min)

### 16. Unsteady things can still surprise us `31:00`
1. Kiki's boat stuck mid-tack
2. Ever Given grounded in the Suez Canal after over-correcting a turn
3. Cargo ship broken in half by waves (e.g. MOL Comfort, 2013 *[verify]*)
> *Note:* Pay off "steady." Every one of these happened when things changed faster than the ship could respond. That's exactly where our best tools are weakest. *(Dropped the Baltimore bridge: it was a power failure, not a hydrodynamics problem. Keep it if you disagree.)*

### 17. Nature has been solving unsteady swimming for 500 million years `34:00`
1. Plesiosaur fossil / reconstruction
2. Your flapping-flipper "plesiosaur" robot
> *Note:* Animals don't avoid unsteady flow. They use it.

### 18. Being flexible improves efficiency and manoeuvring `36:30`
1. Your robot in the water (video)
2. Octopus / squid-inspired underwater vehicle
3. *TBD:* fish turning in its own body length vs. a ship's turning circle? (a striking comparison)

---

## Close (~3 min)

### 19. After ten thousand years, there's still so much more to learn `39:00`
1. Pesse canoe and your robot, side by side
> *Note:* Answer the title question. We keep inventing ships because we still don't fully understand the water they move through, and that's the exciting part.

### 20. Thank you / questions `41:00`
Name, TU Delft, QR code to the online slides.

---

## Build plan
- Plain **reveal.js**, vendored into the repo (no Quarto, no build step). Opens offline; deployable to GitHub Pages as is.
- `index.html` + `theme.css` + `assets/{img,vid}/`. Reuse Libertinus Serif from Bernat's deck.
- Every image slot shows a visible placeholder naming the expected file (e.g. `assets/img/pesse_canoe.jpg`) until you drop the file in.
- Coded graphics (SVG): Great Eastern scale comparison, Kleiber plot, city scaling.
- PDF backup via reveal's `?print-pdf`.

## Facts to verify before they go on a slide
Pesse date and find · Great Eastern dimensions, design vs. achieved speed · Torquay tank year · G.I. Taylor 1950 · Kleiber exponent and heartbeat number · Tusko 1962 · West city exponents · Dutch wind-assist company name · MOL Comfort
