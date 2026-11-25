# Tokens

Tokens are the design decisions written down once. Every component reads from them, so a decision changes in one place and the interface stays consistent. Define them before building components.

In an existing project, use its token system and its names. Everything below is for new work or for filling gaps. Every value here is a starting point to adjust against the brief. The structure is the part to keep.

## Three layers

1. **Primitives.** The raw ramps: `--neutral-0` to `--neutral-950`, the accent steps, the spacing steps. Components never use these directly.
2. **Roles.** What a value is for: `--text-secondary`, `--surface-raised`, `--border-control`, `--accent`. Components use only roles. A theme changes only this layer.
3. **Component tokens.** Optional, for larger systems: `--button-height`, `--input-radius`.

Name roles by purpose. `--text-secondary` still makes sense after a redesign or in a dark theme; `--gray-600` and `--parchment` do not. Evocative names are harmless on primitives, but nobody using the interface sees a variable name, so they are not a measure of quality.

## Color primitives

OKLCH takes lightness, chroma and hue. Equal lightness steps look equal, and hue stays put as lightness changes, which makes ramps predictable.

```css
:root {
  /* Two decisions from the brief's Palette line. Fill both in; there is no default. */
  --hue-neutral: <hue>; /* the lean of the grays: about 70 for warm, about 255 for cool. Never the accent's hue. */
  --hue-accent:  <hue>;

  /* Neutral ramp: gray. Lightness does all the work and chroma stays at 0.01 or less on every step. */
  --neutral-0:   oklch(1     0     0);
  --neutral-50:  oklch(0.985 0.002 var(--hue-neutral));
  --neutral-100: oklch(0.965 0.003 var(--hue-neutral));
  --neutral-200: oklch(0.925 0.004 var(--hue-neutral));
  --neutral-300: oklch(0.87  0.005 var(--hue-neutral));
  --neutral-400: oklch(0.71  0.007 var(--hue-neutral));
  --neutral-450: oklch(0.60  0.008 var(--hue-neutral));
  --neutral-500: oklch(0.53  0.008 var(--hue-neutral));
  --neutral-600: oklch(0.44  0.008 var(--hue-neutral));
  --neutral-700: oklch(0.37  0.007 var(--hue-neutral));
  --neutral-800: oklch(0.27  0.006 var(--hue-neutral));
  --neutral-900: oklch(0.20  0.005 var(--hue-neutral));
  --neutral-950: oklch(0.14  0.004 var(--hue-neutral));

  /* Accent: a pale tint, a light step for dark themes, a fill, a hover, a text shade */
  --accent-100: oklch(0.95 0.04 var(--hue-accent));
  --accent-400: oklch(0.72 0.14 var(--hue-accent));
  --accent-500: oklch(0.54 0.18 var(--hue-accent));
  --accent-600: oklch(0.47 0.17 var(--hue-accent));
  --accent-700: oklch(0.40 0.14 var(--hue-accent));
}
```

Notes:

- The neutral chroma never goes above 0.01. Setting every step to 0 gives plain gray, which is always a safe choice. A neutral that visibly shares the accent's hue is the start of a one-hue wash: the page ends up looking like a template with a color filter over it.
- Chroma limits depend on hue. Yellows and greens only stay vivid at high lightness, so a yellow accent usually needs a lighter fill with dark text on it. Check `--text-on-accent` against the fill for the hue you chose.
- At these lightness values, white text on `--accent-500` clears 4.5:1 across hues. `--accent-400` clears it as text on the dark surfaces below, and as a fill under dark text.
- Charts need their own categorical palette, separate from the accent, with colors that stay distinguishable for color-blind viewers.

## Color roles: light theme

```css
:root {
  color-scheme: light;

  --surface:          var(--neutral-50);   /* page canvas */
  --surface-raised:   var(--neutral-0);    /* cards, panels */
  --surface-sunken:   var(--neutral-100);  /* wells, table headers, code blocks */
  --surface-overlay:  var(--neutral-0);    /* menus, dialogs: paired with a shadow */

  --text:             var(--neutral-900);
  --text-secondary:   var(--neutral-600);
  --text-tertiary:    var(--neutral-500);  /* about the lightest gray that passes 4.5:1 on all three surfaces */
  --text-disabled:    var(--neutral-400);  /* fails contrast on purpose: disabled and decorative only */
  --text-on-accent:   var(--neutral-0);

  --border:           color-mix(in oklab, var(--neutral-950) 10%, transparent); /* dividers, card edges */
  --border-strong:    color-mix(in oklab, var(--neutral-950) 18%, transparent);
  --border-control:   var(--neutral-450);  /* inputs, checkboxes: 3:1 against the surface */

  --accent:           var(--accent-500);
  --accent-hover:     var(--accent-600);
  --accent-text:      var(--accent-700);   /* links and accent-colored text */
  --accent-subtle:    var(--accent-100);   /* selected rows, tinted backgrounds */
  --focus-ring:       var(--accent-500);

  --danger:           oklch(0.55 0.20 27);
  --danger-subtle:    oklch(0.95 0.03 27);
  --success:          oklch(0.52 0.14 150);
  --success-subtle:   oklch(0.95 0.04 150);
  --warning:          oklch(0.80 0.15 80);  /* a fill: put dark text on it */
  --warning-text:     oklch(0.50 0.12 65);
  --warning-subtle:   oklch(0.96 0.05 85);
  --info:             oklch(0.52 0.15 245);
  --info-subtle:      oklch(0.95 0.03 245);
}
```

**Text levels.** Four are enough: primary for content, secondary for supporting text, tertiary for metadata and timestamps, disabled for what cannot be used. Use all four consistently; do not improvise a fifth with opacity.

**Borders.** A divider or card edge is made from the text color at low alpha, so it adapts to whatever sits behind it and stays quiet. A control boundary is a different job: it is what tells a person a field can be typed in, so it needs about 3:1 contrast.

**Semantic colors.** Each needs a strong value for text, icons and fills, and a subtle value for backgrounds. Keep them apart from the accent, and never use them decoratively, so that red keeps meaning "danger".

## Color roles: dark theme

A dark theme is a second design, not an inversion. Decide each role again.

```css
[data-theme="dark"] {
  color-scheme: dark;

  --surface:          var(--neutral-950);
  --surface-raised:   var(--neutral-900);  /* higher means lighter */
  --surface-sunken:   oklch(0.11 0.006 var(--hue-neutral));
  --surface-overlay:  var(--neutral-800);

  --text:             oklch(0.95 0.004 var(--hue-neutral));
  --text-secondary:   oklch(0.75 0.012 var(--hue-neutral));
  --text-tertiary:    oklch(0.65 0.012 var(--hue-neutral));
  --text-disabled:    oklch(0.45 0.012 var(--hue-neutral));
  --text-on-accent:   var(--neutral-950);  /* the fill is light here, so its text is dark */

  --border:           color-mix(in oklab, var(--neutral-0) 10%, transparent);
  --border-strong:    color-mix(in oklab, var(--neutral-0) 18%, transparent);
  --border-control:   oklch(0.60 0.014 var(--hue-neutral));

  --accent:           var(--accent-400);
  --accent-hover:     oklch(0.78 0.13 var(--hue-accent));
  --accent-text:      var(--accent-400);
  --accent-subtle:    color-mix(in oklab, var(--accent-500) 22%, transparent);
  --focus-ring:       var(--accent-400);

  --danger:           oklch(0.72 0.16 27);
  --danger-subtle:    color-mix(in oklab, var(--danger) 18%, transparent);
  --success:          oklch(0.75 0.14 150);
  --success-subtle:   color-mix(in oklab, var(--success) 18%, transparent);
  --warning:          oklch(0.82 0.14 80);
  --warning-text:     oklch(0.82 0.14 80);
  --warning-subtle:   color-mix(in oklab, var(--warning) 18%, transparent);
  --info:             oklch(0.74 0.12 245);
  --info-subtle:      color-mix(in oklab, var(--info) 18%, transparent);
}
```

- The canvas is a very dark gray, not a dark shade of the accent. Pure black is a deliberate choice for high drama, not a default.
- Elevation comes from lighter surfaces and firmer borders, because shadows barely show on dark.
- Body text is slightly off-white. Pure white on near-black glares in long reading.
- Accent and semantic colors get lighter and lower in chroma, because saturated color vibrates on dark. A filled accent button becomes a light fill with dark text.
- Recheck every contrast pair. Passing in light says nothing about dark.
- `color-scheme` makes native controls and scrollbars follow the theme.

To follow the system setting when the user has not chosen, repeat the dark roles under `@media (prefers-color-scheme: dark) { :root:not([data-theme]) { … } }`. Where browser support allows, `light-dark()` states both values in one declaration: `--surface: light-dark(var(--neutral-50), var(--neutral-950));` with `color-scheme: light dark` on the root.

## Spacing

```css
:root {
  --space-1:  0.25rem;  /*   4px */
  --space-2:  0.5rem;   /*   8px */
  --space-3:  0.75rem;  /*  12px */
  --space-4:  1rem;     /*  16px */
  --space-5:  1.5rem;   /*  24px */
  --space-6:  2rem;     /*  32px */
  --space-7:  3rem;     /*  48px */
  --space-8:  4rem;     /*  64px */
  --space-9:  6rem;     /*  96px */
  --space-10: 8rem;     /* 128px */
}
```

Steps grow as they get larger, because the eye judges space by ratio. Rough uses:

| Where | Steps |
|---|---|
| Inside a component: icon to label, label to field | 4–8px |
| Component padding | 12–16px |
| Between components in a group | 16–24px |
| Between groups | 32–48px |
| Between sections in an app | 48–64px |
| Between sections on a marketing page | 96–160px, fluid: `clamp(4rem, 10vw, 10rem)` |

Layout widths belong here too: `--container-page: 75rem`, `--container-prose: 65ch`, `--gutter: clamp(1rem, 4vw, 2.5rem)`.

## Radius

Radius sets character. Pick a row and keep its proportions; do not mix rows.

| Character | Small (badges, checkboxes) | Medium (buttons, inputs) | Large (cards, dialogs) |
|---|---|---|---|
| Sharp, technical, formal | 0–2px | 2–4px | 4–6px |
| Balanced | 4px | 6–8px | 10–12px |
| Soft, friendly | 6–8px | 10–12px | 16–24px |

- Nested corners: inner radius equals outer radius minus the padding between them, floored at zero. Equal radii on nested corners look pinched.
- Scale radius with element size. A 16px radius on a 24px-tall badge turns it into a blob.
- Full pills (`9999px`) suit tags, avatars and toggles. Used on every button and card they become the look of the whole product, so use them that way only as a decision.
- Full-bleed sections have no radius.

## Elevation

Choose how resting surfaces separate, and keep to it:

- **Borders only.** Flat and precise. Suits dense, technical interfaces.
- **Tonal.** Surfaces differ by a small lightness step with no lines. Calm, and the natural choice for dark themes.
- **Shadows.** Soft lift. Suits lighter, friendlier or more dimensional work.

Floating layers always need lift, whatever the resting strategy.

```css
:root {
  --shadow-color: oklch(0.2 0.005 var(--hue-neutral));

  /* raised: a card that needs to sit off the page */
  --shadow-1: 0 1px 1px color-mix(in oklab, var(--shadow-color) 4%, transparent),
              0 1px 2px color-mix(in oklab, var(--shadow-color) 6%, transparent);

  /* floating: menus, popovers */
  --shadow-2: 0 1px 2px  color-mix(in oklab, var(--shadow-color) 5%, transparent),
              0 4px 8px  color-mix(in oklab, var(--shadow-color) 6%, transparent),
              0 12px 24px color-mix(in oklab, var(--shadow-color) 6%, transparent);

  /* modal: dialogs, sheets */
  --shadow-3: 0 2px 4px  color-mix(in oklab, var(--shadow-color) 4%, transparent),
              0 12px 24px color-mix(in oklab, var(--shadow-color) 8%, transparent),
              0 32px 64px color-mix(in oklab, var(--shadow-color) 10%, transparent);
}
```

Each level stacks a tight contact shadow with wider, fainter ones, all falling straight down. In dark themes, replace most of this with a lighter surface and `--border-strong`.

A stacking order keeps layers from fighting: `--z-sticky: 100; --z-dropdown: 200; --z-overlay: 300; --z-modal: 400; --z-toast: 500; --z-tooltip: 600;`.

## Type

The type scale is a token set like any other, and it is the one most often skipped. Define at most seven steps and use nothing else:

```css
:root {
  --text-xs:      0.75rem;   /* 12px: captions, labels */
  --text-sm:      0.875rem;  /* 14px: secondary and UI text */
  --text-base:    1rem;      /* 16px: body */
  --text-lg:      1.25rem;   /* 20px: lead paragraphs, small headings */
  --text-xl:      1.75rem;   /* 28px: section headings */
  --text-2xl:     clamp(2.25rem, 1.6rem + 2.8vw, 3.5rem);  /* 36 to 56px */
  --text-display: clamp(3rem, 1.5rem + 6.5vw, 6rem);       /* 48 to 96px */

  --leading-tight: 1.05;  --leading-snug: 1.25;  --leading-body: 1.6;
  --tracking-display: -0.03em;  --tracking-caps: 0.06em;
}
```

Every `font-size` in a component is one of these variables. When an element seems to need a size between two steps, use one of the steps and adjust weight or color instead. The ratio and the top sizes change with the brief: a dense tool stops near 32px, a poster-like page may go far above 96px. Reasoning and ranges are in `typography.md`.

## Motion

```css
:root {
  --duration-fast: 120ms;  /* hover, press, toggles */
  --duration-base: 200ms;  /* menus, small panels */
  --duration-slow: 320ms;  /* dialogs, large panels, page elements */

  --ease-out:    cubic-bezier(0.2, 0, 0, 1);    /* arriving */
  --ease-in:     cubic-bezier(0.4, 0, 1, 1);    /* leaving */
  --ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);  /* moving across the screen */
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

The reduced-motion reset is the floor. Better is to keep short opacity fades and remove only the movement.

## Focus

```css
:focus-visible {
  outline: 2px solid var(--focus-ring);
  outline-offset: 2px;
}
```

One ring, used on every interactive element. On an accent-colored surface, switch the ring to the text color so it stays visible.

## Mapping to a framework

- **Tailwind v4:** declare tokens in CSS under `@theme` (`--color-*`, `--font-*`, `--radius-*`, `--shadow-*`), which generates the matching utilities.
- **Tailwind v3:** extend `theme` in `tailwind.config`, pointing colors at the CSS custom properties so themes can switch.
- **shadcn/ui:** it already reads `--background`, `--foreground`, `--primary`, `--muted`, `--border`, `--ring` and `--radius`. Set those variables instead of restyling each component.
- Follow the version and conventions already in the project.
