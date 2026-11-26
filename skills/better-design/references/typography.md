# Typography

Type carries most of an interface. When the type is right, a page with no images, no color and no effects still looks designed. When it is wrong, nothing else rescues it.

## Choosing typefaces

Start from the voice the brief calls for, then find a face that has it. Look at the real letterforms at the sizes you will use before committing.

**How many.**

- One family is often enough, especially in product UI. Use its weights and sizes for contrast.
- Two is the usual limit: a display face for headlines and a text face for everything else.
- Monospace is a third voice, for code, IDs and figures that must align. It is not decoration.

**Pairing.**

- Pair on a contrast of structure: serif with sans, condensed with normal width, geometric with humanist.
- Keep something in common: similar x-height and proportions, or the same era and mood.
- Two faces that are nearly alike, such as two geometric sans, look like an error.
- Give each face one job and never swap the jobs between pages.

**Neutral is a choice.** A neutral sans (Inter, Geist, the system UI font, Roboto) is right for dense product UI where the type should disappear. Choose it for that reason, then earn quality through size, weight and spacing. It becomes a tell only as an unconsidered default on work that needed a voice.

**Reflex picks.** The first font that comes to mind is the one everyone else is using. The same is true of the fonts that get picked to look distinctive. The current set: Inter used as a display face, DM Sans, DM Serif Display, Space Grotesk, Space Mono, Playfair Display, Fraunces, Newsreader, Lora, Cormorant, Instrument Serif with one italic word, Instrument Sans, Plus Jakarta Sans, Outfit, Manrope, Poppins, Montserrat, Syne, IBM Plex, Bricolage Grotesque, Sora, Urbanist, and lately a heavy condensed grotesque (Barlow Condensed, Bebas Neue, Anton, Oswald) for anything meant to look bold. Chivo joined the set once the others were ruled out: four of nine test pages in one run used it. Work Sans and Gloock followed: of 31 later test pages, 11 set their text in Work Sans and 5 their headings in Gloock, whatever the subject. `scripts/check.mjs` fails a page that loads one of these, unless the user or an existing brand supplied it. If the brief truly leads to one of these, use it. If it was simply the first that came to mind, look further.

**What real sites do.** Measured in November 2026 on the first screens of 32 well-known product and brand sites:

- They used 30 different headline typefaces between them. Almost every one owns or licenses a face that is recognizably its own. Five used a version of Inter and two used the system font.
- 29 of the 32 used seven or fewer font sizes on the first screen. The median was five.
- The main headline was 56px at the median, between 44px and 64px for the middle half, and never more than 96px.
- The headline weight was regular or medium (500 or lighter) on 17 of 28, and bold (700 or heavier) on 8. Size does the work more often than weight.
- No main headline was set in capitals.
- Half tightened the headline's tracking, typically to about `-0.02em`, and none went past `-0.06em`.
- The longest paragraph on the first screen was 18px at the median.

**System fonts** are a legitimate option when the interface should feel native or load instantly: `system-ui, sans-serif`, `ui-serif, Georgia, serif`, `ui-monospace, Menlo, Consolas, monospace`.

Never name a font at the front of a stack unless the page loads it. An unloaded name renders only where that font happens to be installed and as something else everywhere else, so the design is no longer one design. Load the font, or start the stack with a system font.

### Finding a face

This file names no typefaces to choose from, on purpose. An earlier version listed examples by voice, and the first name in each row turned up on page after page whatever the subject. A list of fonts gets used as a menu. Find the face from the subject instead.

1. **Look at the lettering the subject already lives with.** Its signs, forms, labels, vehicles, packaging, instruments, and the publications people in the field read. Note what you see: serif or sans, wide or narrow, light or heavy, mechanical or drawn by hand, old or recent. Write three of them on the `seen` part of the brief's Type line.
2. **Describe the face you need in those terms**, before thinking of a name: for example "a narrow sans with flat sides, like the stencil on a shipping crate" or "an upright book serif with little contrast, like a printed timetable".
3. **Search a library by those properties, not by memory.** Google Fonts and Fontshare both filter by classification, width, weight range and variable axes, and the project may have licensed fonts of its own. If you can browse, open the library, filter, and set the real headline in at least five candidates. If you cannot, write down five candidates from at least three different designers or foundries, and discard any that is on the reflex list above.
4. **Write three candidates for each role, and let the count choose.** Ruling a face out only moves the habit to the next one, so the last choice is not yours. From the search, write three candidates for the heading face and three for the text face on the Type line. Each matches the letterforms you saw, not the best-known face of its kind. They are different designs from different designers, not three weights or widths of one family, and each is one you would ship. Then take the count from the Chosen line: a remainder of 0 selects the first of each three, 1 the second, 2 the third.
5. **Check it can do the job**: the weights and italics you need, tabular figures if there is data, the languages the product uses, and a licence that allows loading it.

What each class is for, so the Directions in the brief mean something:

| Class | What it brings | Where it struggles |
|---|---|---|
| Neutral sans | Disappears behind the content. Right for dense tools. | Gives a brand page no voice |
| Sans with character (grotesque, humanist) | A recognizable tone without ornament | Long reading at small sizes, in the quirkier ones |
| Condensed | Fits long words large. Suits timetables, labels, posters. | Body text. Heavy condensed capitals have become a costume for "bold". |
| Text serif | Long reading. Suits editorial and documents. | Small interface labels on low-density screens |
| Display serif | High contrast and personality at large sizes | Anything under about 24px |
| Slab | Sturdy and plain. Suits catalogs, receipts, signage. | Refinement |
| Monospace | Code, identifiers and figures that must line up | Everything else. It is not a signal for "technical". |
| Rounded | Friendly and soft | Authority |

A class is not a font. "A sans with character" does not mean the first such sans that comes to mind.

## Scale

A type scale is a short list of sizes with visible jumps between them. Five to seven sizes cover almost any interface.

| Kind of work | Ratio | Example scale (px) |
|---|---|---|
| Dense product UI | about 1.2 | 12, 13, 14, 16, 20, 24, 32 |
| General app or content site | about 1.25 | 13, 16, 20, 25, 31, 39 |
| Expressive page | 1.33 to 1.5 | 14, 16, 21, 28, 40, 56, 80 and up |

- Sizes one or two pixels apart look like mistakes. If two roles need to differ, make the difference obvious, or use weight or color instead.
- On expressive pages the headline should be several times the body size. A 36px headline over 16px body is timid.
- Set sizes in `rem` so user font-size settings apply.
- Fluid display type: combine `rem` and `vw` inside `clamp()` so it scales with the viewport and still responds to zoom, for example `font-size: clamp(2.5rem, 1.5rem + 4.5vw, 5.5rem)`.

## Line height, tracking and measure

| Role | Size | Line height | Tracking |
|---|---|---|---|
| Display | 48px and up | 0.95–1.1 | `-0.02em` to `-0.04em` |
| Heading | 24–40px | 1.1–1.25 | `-0.01em` to `-0.02em` |
| Large text, lead paragraphs | 18–22px | 1.35–1.5 | 0 |
| Body | 16–18px | 1.5–1.7 | 0 |
| UI text | 13–15px | 1.3–1.45 | 0 |
| Caption | 12–13px | 1.4–1.5 | 0 to 0.01em |
| All-caps label | 12–13px | 1.2–1.4 | 0.04–0.1em |

- Line height is unitless and falls as size rises. The browser default of about 1.5 on a 64px headline leaves gaps between lines you could park a car in.
- Longer lines need more line height. Narrow columns need less.
- Tracking depends on the face. Some display faces are already tight, so judge by eye.
- Measure: 45–75 characters per line for running text (`max-width: 65ch`). Captions and side columns can run 30–45.
- Space between paragraphs is about one line. A heading has more space above it than below, so it attaches to what it introduces.

## Weight and emphasis

- Regular (400) for text, 500–600 for UI emphasis, 600–800 for headings depending on the face.
- Two or three weights in total. Emphasis needs a visible jump: 400 against 600 or 700 reads clearly, while 400 against 500 only suits compact UI labels.
- Load the real bold and italic. Browser-synthesized ones are distorted; `font-synthesis: none` prevents them.
- Light weights below 400 need large sizes and strong contrast. They fall apart in small text.
- Emphasize one way at a time: weight, or italic, or color.

## Details

- `text-wrap: balance` on headings and short centered text; `text-wrap: pretty` on paragraphs.
- Break headlines deliberately so no line ends with a stranded word.
- `font-variant-numeric: tabular-nums` for tables, timers and prices in columns. Add `slashed-zero` for IDs and codes.
- Real punctuation: “curly quotes”, the ’ apostrophe, an en dash in ranges (9–5), × for dimensions, … as one character, and a non-breaking space between a number and its unit.
- Links inside text are underlined, with `text-underline-offset: 0.15em`. Color alone does not mark a link.
- Left-align anything longer than three lines. Never justify text on the web.
- All caps is for short labels only, always with added tracking.
- Plan for long strings: `text-overflow: ellipsis` for single lines, `line-clamp` for several, and a way to read the full text.
- `hyphens: auto` only in narrow columns of long-form text, with the `lang` attribute set.

## Loading fonts

Self-hosting is fastest and avoids third-party requests. Use a Fontsource package, or `next/font` in Next.js, which self-hosts and adjusts fallback metrics automatically.

```css
@font-face {
  font-family: "Text";
  src: url("/fonts/text-variable.woff2") format("woff2");
  font-weight: 100 900;
  font-display: swap;
}

:root {
  --font-text: "Text", system-ui, sans-serif;
}
```

From a hosted service, connect early and request only what is used:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=FAMILY:wght@400;600&display=swap">
```

- Every weight and style is a separate file. A variable font pays for itself from about three weights.
- Always give a fallback stack of the same class (sans, serif, mono).
- To stop the layout shifting when the web font arrives, match the fallback's metrics with `size-adjust` and `ascent-override` on a fallback `@font-face`.
- Preload only the one or two files used on the first screen.

## Common faults

- Sizes one or two pixels apart.
- Body text in mid-gray on white, below 4.5:1.
- Lines running the full width of a wide container.
- Default line height on large headings.
- Light weights at small sizes.
- Centered paragraphs.
- A single word alone on the last line of a headline.
- Synthesized bold or italic.
- More than two families, or more than three weights.
- Paragraphs in all caps.
- Letter-spacing added to lowercase body text.
- An uppercase, letter-spaced label above every heading.
