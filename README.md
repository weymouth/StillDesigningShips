# Why Are We Still Inventing Ships?

Public talk, Gabriel Weymouth (TU Delft). A plain [reveal.js](https://revealjs.com) deck: no build step, vendored in `vendor/reveal/` (5.2.x) so it runs offline. It is GitHub Pages ready as is.

## Run it
```
python scripts/serve.py
```
Then open <http://localhost:8000>. Use this rather than `python -m http.server`: the built-in server can't serve part of a file (HTTP Range), so trimmed videos (`data-start`/`data-end`) can't seek and stall at 0 s. GitHub Pages is fine.

| Key | Action |
|---|---|
| Esc / O | overview of all slides |
| number + Enter | jump to that slide |
| → / space | next beat |
| S | speaker view (notes + timer) |
| F | fullscreen |
| H | hide placeholders (rehearse with a partly filled deck) |
| L | toggle the light theme (for rooms that can't be darkened); or open `?light`, e.g. <http://localhost:8000/?light> |
| B / . | black screen |

PDF backup: open `http://localhost:8000/?print-pdf` in Chrome → Print → Save as PDF (landscape, no margins, background graphics on).

## Publishing changes
GitHub Pages lets browsers cache files for about 10 minutes. After changing anything in `css/` or `js/`, bump the `?v=` tag on their links in `index.html` so everyone gets the new files at once.

## Structure
- `index.html` holds every slide, in order, with speaker notes in `<aside class="notes">`.
- `css/theme.css` is the cinematic dark theme (Libertinus Serif, amber and TU Delft cyan accents).
- `js/deck.js` builds full-screen image and video layers from `data-file`. A missing file shows a placeholder that names it.
- `js/figures.js` draws the coded graphics (`great-eastern`, `kleiber`, `heartbeats`, `cities`).
- `assets/img`, `assets/vid` hold the media. Videos should be silent `.mp4` (H.264).

## Adding media
Drop a file at the path its placeholder shows. To see what's still needed:
```
python scripts/assets.py --missing
```
Optional attributes on a `.media` layer:
- `data-credit="Photo: …"` adds a credit line.
- `data-pos="50% 30%"` sets the crop focus.
- `class="media contain"` shows the whole image without cropping; `class="media card"` frames a portrait or white-background clip.
- `data-view="inset(51% 0 0 0)"` crops to part of an image or video (top right bottom left).
- `data-start="4" data-end="10"` loops a video within that window (seconds).

Images from Wikimedia Commons: search with `tools/picker.html`, fetch with `python scripts/commons.py fetch <name> "File:…"`. That records the credit in `assets/credits.json`, which the slides and the closing credits slide read.
