# By Kind of Interface

The method in `SKILL.md` is the same everywhere. This file adds what quality looks like, and what usually goes wrong, for common kinds of interface. Read the section that matches the task. Many projects combine several.

## Marketing and landing pages

Register: expression.

**What to show depends on what is being sold.** Decide this before the layout.

| The subject is | Lead with | Not with |
|---|---|---|
| Software | The real interface doing its job, at a size where it can be read | An abstract illustration, or a tilted screenshot too small to read |
| A physical product | The product itself, large and whole, from more than one angle | A mood image with the product somewhere in it |
| A service where people are hired (a clinic, a firm, a studio, a trade) | The people, the work they have done, how it goes and what it costs | Effects and animation |
| A place people go (a cafe, a shop, a hotel, a gym) | Photographs of the place, what it offers, the hours and the address | Anything that delays the hours and the address |

Shader effects, 3D scenes, dark pages and glowing accents belong to subjects that are themselves technical. A bakery gets photographs and good type.

When no photographs were supplied, do not fill the gap with a drawing for decoration. Software still shows its interface. A product gets one stand-in photograph, named at hand-over. A place or a service shows a drawing that explains, and the facts people came for (prices, hours, the address, who does the work) move up to the first screen.

**How the first screen is arranged.** A generated landing page opens the same way almost every time: a small uppercase label, a two-line headline that ends in a full stop, a button beside a text link, and a picture on the right. Measured in November 2026 on 38 well-known sites and 9 generated test pages:

| First screen | Real sites | Generated pages |
|---|---|---|
| Text on the left, picture on the right | 5 of 38 | 8 of 9 |
| An uppercase or wide-tracked label above the headline | 3 of 38 | 8 of 9 |
| A headline that ends in a full stop | 9 of 38 | 9 of 9 |

What the 38 real first screens did instead varied: no arrangement was on more than 11 of them. An earlier version of this file listed the arrangements with their counts, and every generated page then came out as one of the listed ones. So the arrangement is not chosen from a stock. It is taken from the subject: from how a real thing in its field is laid out, as the brief's First screen line records. Write the choice on the brief's First screen line, and build that. `scripts/look.mjs` fails a first screen that comes out as the split or carries the uppercase label.

- Build the page from what the visitor needs to know, in the order they need it: what is this, is it for me, why should I believe it, what does it cost, what do I do next. A section exists to answer one of those. Cut sections that answer nothing, and do not follow the stock sequence because it is the sequence.
- The first screen says what the product is in plain words, shows it, and offers one next step. After five seconds a visitor should be able to say what it does.
- One primary call to action. A second is fine when it serves a different readiness ("See pricing" beside "Start free").
- Show the product: the real interface built in HTML and CSS, a real screenshot the user supplied, real output, a working demo. An abstract illustration of productivity shows nothing.
- Let each section's layout follow its content. A comparison is a table, a process is a sequence, a single claim is a large statement, a quote is a quote. Sections that all share one construction blur together.
- Explain a few features in depth with a visual each, in place of twelve with an icon each.
- Proof must be real. With none supplied, leave it out: a page without testimonials beats a page with invented ones.
- Pricing: plans comparable at a glance, what the price is per, and one plan highlighted only when there is a reason.
- Few navigation links. Repeat the call to action at the end. The footer is part of the design.
- Section spacing is generous and varies. Text width stays capped however wide the screen.
- On a phone, the headline fits without shrinking to nothing and the primary action is visible early.
- Give the largest first-screen image priority (`fetchpriority="high"`) and lazy-load what is below the fold.

## Product UI: app screens and dashboards

Register: utility.

- Design each screen around the task the person came to do, not around the data that happens to be available. Give that task the space.
- A dashboard opens with whatever needs attention or the primary list. Four stat tiles above a chart belong there only when those figures are what the person checks first.
- The shell is stable: persistent navigation that marks the current location, a page title, the primary action in the same place on every screen.
- Choose density once. Tools used all day: 13–14px UI text, 32–36px controls, 36–44px table rows. Occasional or consumer use: 15–16px, 40–48px controls.
- Quiet chrome, loud content. Navigation, toolbars and borders recede, and the data carries the contrast.
- Color is for status and action. In a mostly neutral interface a red badge means something.
- Nothing jumps: skeletons take the shape of the content, hover does not change an element's size, and validation messages have reserved space.
- Every action is acknowledged: a pressed state, an optimistic update or progress, a confirmation. Offer undo for destructive actions where possible; it interrupts less than a confirmation dialog.
- The first-run empty state is an onboarding moment. Say what belongs here and offer the first action.
- Dialogs are for short, focused tasks. Long forms, and anything needing reference to the page behind, go on a page or in a side panel.
- Settings: grouped, labeled and described, with one saving behavior throughout (auto-save with confirmation, or an explicit Save, never both).
- For frequent actions in professional tools, support the keyboard and show the shortcuts.
- A dashboard is a work screen. It opens on what needs attention or action, with no banner, greeting or illustration above it.
- Small trend charts and progress rings beside a number are information only when the person acts on the trend. Otherwise they are decoration, and the number reads better alone.
- A chart sits on the same surface as the figures beside it. A dark or colored panel behind it separates it from them for no reason.
- Surfaces, bars and panels are white, gray or near-black. Color is for status and for the one thing that is selected or primary.
- Filters, sort order, the current page and the open tab live in the URL, so a view survives a reload and can be sent to a colleague.
- A row action that asks for a choice shows what decides it. Reassigning work shows each person's current load beside their name.

## Forms and flows

Register: utility.

- One column. Labels above fields. Field width hints at the expected length of the answer.
- Ask for less. Mark the optional fields when most are required.
- Group related fields under headings with space between groups. Split long forms into steps and show progress.
- Use the right `type`, `inputmode` and `autocomplete`, and let pasting work.
- Validate on blur or on submit, never on each keystroke. Put the message beside the field, say how to fix it, keep what was typed, and move focus to the first error on submit.
- State requirements, such as password rules, before the person types, and offer a show-password toggle.
- The primary button names the outcome and sits at the end of the form, aligned with the fields. A disabled button with no explanation is a dead end, so prefer an enabled one that validates on press.
- On submit the button shows progress and prevents a second submission. Success is confirmed clearly, with the next step.
- Checkout and sign-up: remove distracting navigation and show a summary of what is being agreed to.
- On mobile: 16px inputs, large targets, the right keyboard, and a sticky primary action when the form is long.

## Long-form content: articles, documentation, blogs

Register: utility, or expression for editorial pieces.

- The text column is the design: 60–75 characters wide, 17–20px body, line height 1.6–1.7, generous space between paragraphs.
- A clear heading hierarchy, with more space above each heading than below it.
- Links are underlined.
- Code blocks: monospace, slightly smaller than body, horizontal scroll in place of wrapping, a copy button, a syntax theme drawn from the palette.
- Figures have captions, and some may break out wider than the text column.
- Documentation: a persistent sidebar, an on-page table of contents, search, previous and next links, and anchors on headings.
- Wide tables scroll inside their own container on small screens.
- Pull quotes, drop caps and side notes belong to the editorial register only.
- Readers expect a dark theme on documentation. Check code blocks in both themes.

## Tables and charts

**Tables**

- Text left-aligned, numbers right-aligned with tabular figures and a consistent number of decimals. Headers align with their columns and are quieter than the data.
- Faint row dividers or generous row spacing. No heavy grid. Zebra striping only for wide, dense tables.
- Units go in the header, not in every cell. One date format throughout.
- Status is text with a color mark, never color alone.
- Sticky header on long tables, a hover state when rows are clickable, row actions at the end, visible sort indicators.
- Long values truncate, with the full value available.
- Loading and empty states exist.
- On small screens: keep the priority columns, scroll horizontally with the first column pinned, or turn simple rows into stacked items.

**Charts**

- The chart type follows the question: bars for comparison, a line for a trend, a stacked bar for parts of a whole. Avoid pies beyond three or four slices.
- Bar axes start at zero.
- Label series directly where possible, in place of a legend.
- Mute gridlines and axes so the data is the darkest thing on the chart.
- One highlight color against neutrals, unless categories truly need telling apart. A categorical palette must stay distinguishable for color-blind viewers.
- Format numbers with separators and units.
- No 3D, no decorative gradient fills, no dual axes unless unavoidable.
- A tooltip on hover, and a text or table alternative.
- A single large number with its context (period, comparison, direction) often says more than a chart.

## Commerce

Register: between.

- The product image is the design: large, consistent in aspect ratio and background, with a gallery and zoom.
- Product card: image, name, price, one cue for variants. Equal heights, few badges.
- Product page: price, variant choice and the add-to-cart action high on the page on mobile, with delivery and returns facts near the button.
- Filtering and sorting work on a phone, usually in a sheet. Show result counts and make applied filters visible and removable.
- The cart is editable and shows the full cost early, including delivery and tax.
- Never invent urgency or proof: no fake countdowns, stock warnings or ratings.
- Checkout follows the forms section.

## Portfolio, personal and brand sites

Register: the most expressive.

- The work or the voice is the content. Lead with it, at scale.
- One strong idea in type and layout. Avoid the template structure of hero, about, skill bars, project cards and contact form.
- A project page says what it was, what you did and what came of it, with large images and a layout that can vary by project.
- Skip skill percentage bars, the waving-hand greeting, and walls of technology logos.
- Navigation is minimal, pages are fast, and contact is obvious.

## Mobile screens

- Primary actions sit within thumb reach, in the lower half of the screen. A bottom bar suits three to five top-level destinations.
- Respect safe areas with `env(safe-area-inset-*)`, and use `dvh` for full-height layouts.
- Targets are 44px or more with space between them. Inputs are 16px or more.
- One column, one primary action per screen, and progressive disclosure for the rest.
- Follow the platform's conventions for navigation, sheets and going back when the result should feel native.
- Hover does not exist. No affordance may depend on it, and hover styles belong inside `@media (hover: hover)`.
- Every gesture has a visible alternative.
- Bottom sheets in place of centered dialogs, and sticky action bars padded for the safe area.
- Keep effects light. Large blurs and stacked shadows are slow on modest phones.

## A single component

- Inside a project, build from the host system's tokens. As a standalone piece, expose its own tokens as custom properties.
- Cover every state and size it needs, and both short and very long content.
- Use logical properties (`padding-inline`, `margin-block`) so it works in right-to-left layouts.
- For composite widgets (tabs, menus, comboboxes), follow the keyboard and ARIA pattern in the WAI-ARIA Authoring Practices.
- Demonstrate it in a realistic container, with its states shown side by side.
