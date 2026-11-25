# Color

Read this before choosing any color. It expands "The Palette line" in section 3 of the skill and the Color rules in section 5.

## Contents

- The two faults
- The order of work
- Where an accent hue comes from
- How much color
- Palette structures
- Status colors
- Chart colors
- Dark themes
- Checks

## The two faults

**The reflex hue.** With nothing decided, the accent comes out purple, indigo or a default blue. With that ruled out, it comes out as the next in line: deep green with cream or lime, sage, or terracotta on warm paper, and after those, yellow with black. Whichever it is, it is the same for every subject, and a person who has seen a few generated pages recognizes it at once.

**The wash.** One hue spread across everything: a tinted background, tinted text, tinted borders, a dark bar in a deep shade of the hue, an accent in a bright shade of it, and status chips that nearly match. Each choice looks harmonious on its own. Together the page looks like a gray template seen through a colored filter.

Using one color is not the fault. Black, white and gray with a single color is how a large share of well-made interfaces work. The fault is color that nobody chose, placed where it marks nothing.

## The order of work

1. **Build it in gray first.** Background, surfaces, text, borders and dark panels in black, white and gray. If the hierarchy does not work in gray, color will not fix it.
2. **Look.** Find out what color already means around this subject (next section). Write what you found on the `seen` line of the brief.
3. **Choose one hue**, with a source you can name.
4. **Test it.** Would this hue have come out the same for a different subject? Then look again.
5. **Spend it.** List the few things that carry the accent. Add it to those and nothing else.
6. **Add status colors** only where the screen reports a status.

## Where an accent hue comes from

In order of authority:

1. **An existing brand.** A logo, a product, packaging or a style guide settles it. Use the exact color and do not adjust it to taste.
2. **The field, by count.** The three best-known products or businesses in this field, each with the one color it is known for, written down in the order they came to mind. The letter count from the brief's Chosen line selects one of the three, and the accent takes that one's hue in a shade of your own. If that one is black, white or gray, the page has no accent hue. The count is there because a free choice among the three always goes to the same hue.
3. **A function.** If the screen exists to raise one kind of alert, the alert color may be the only color needed, and there is no separate accent at all.

Things that are not sources:

- A mood. Calm, trustworthy, modern, friendly, premium and technical have each been argued for every hue.
- A stereotype of the category taken without looking: green for anything with animals, plants or money; blue for anything that must be trusted; brown for coffee.
- The avoidance of another color. "Not purple" is not a reason for green.
- An object. Every subject has a yellow sign, a green plant, a red stamp or a brown box somewhere in it, so an object can be found to justify any hue. Eight test pages that took their accent from an object in the subject's world came out yellow and black on four of them.
- A picture you generated or a thing you drew. Its colors were your choice, so taking the accent from it is choosing the accent. Four test pages in a row took orange from their own pictures.
- The product's name. A name that sounds like a plant, an animal, a place or the weather points straight at the reflex hue, and the same hue would have come out for any other name of that kind.

The reflex hues so far, in the order they appeared: purple or indigo; deep green, sage or lime; terracotta and cream; yellow with black; orange, coral or rust. Each came in when the one before was ruled out, which is why the accent is now selected by count and not chosen.

Within one field, the established products usually own different hues from one another and surround them with a great deal of black, white and gray. That is the pattern to learn from. The field rarely dictates a hue. It dictates that the hue be owned and used sparingly.

When you can look, look at the field's leading products and businesses. Note the hue each uses, how much of the screen it covers, and what it is used for. When you cannot look, write what you know, and say at hand-over that the palette was chosen without looking.

## How much color

- **Work screens** (dashboards, tables, forms, settings): gray covers almost everything. The accent appears on the primary action, the current selection and the focus ring, and perhaps one key number or series. Status colors appear only where there is a status. A work screen can be finished with no accent at all.
- **Marketing and brand pages**: still mostly neutral. Color concentrates in one place per screen: a button, a headline word, an illustration, or one flooded section.
- **Text is neutral** on every kind of page. Headings and body text are black, white or gray. When the headlines, the buttons, the logo, a panel and the pictures all take the accent, the page is washed in it even though its grays are gray.
- **Pictures keep their own colors** or are black and white. An illustration printed in the accent's ink puts that hue across a third of the screen.
- **A flood** is one flat field of color: a whole section or the first screen. Text and lines on it are black or white, never a deeper shade of the same hue. Use it once or twice on a page. Everything outside it returns to neutral.

A useful picture: if the page were printed in black and white, with the accent as a single spot ink, where would the printer need that ink? Those places are where the accent goes.

## What real products do

Measured in November 2026 on the first screens of 32 well-known product and brand sites, pixel by pixel, with `scripts/palette.mjs`:

- The median first screen was 75% plain neutral (white, black, gray), 1.5% gray that leans toward a hue, and 6% color.
- 20 of the 32 had under 5% tinted gray. Their grays are gray.
- The sites with a large non-neutral share got it from photographs, from illustration, or from one flat field of brand color such as a fully green first screen or a blue masthead. It was plain color in one place, not a tint over everything.
- Generated pages built before this rule measured 12% to 31% tinted gray on the first screen, nearly all of it in one hue. That number is the wash.
- Where the main button's fill could be read, it was black, white or gray on 12 sites and a brand hue on 14. A neutral primary button is normal.
- Fields did not share a hue. Three delivery and routing products used purple with orange, blue, and purple. Two veterinary software products used blue with teal, and purple with orange. Finance products used near-black blue, and white with a yellow-green button. None of the veterinary products was green.

So: look at the field before assuming its color, expect to find several different answers, and keep the grays gray whatever the hue.

## Palette structures

Each of these keeps its neutrals gray.

| Structure | What it is | Suits |
|---|---|---|
| Gray with one accent | Light gray and white surfaces, near-black text, one hue for actions and selection | Most product interfaces, most sites |
| Black and white with a spot color | Pure white, pure black, one saturated color used very rarely | Editorial, portfolios, tools that want to feel exact |
| Dark gray with one accent | Near-black gray surfaces, off-white text, one hue lightened for dark | Media, tools used in dim rooms, a brand that is dark already |
| One flooded field | A single section or screen in flat color, the rest neutral | Campaigns, launches, brand statements |
| Two colors in tension | Two unrelated hues, each with its own job, on neutral | Brands built on a pair; before-and-after or two-sided products |
| A color system | Several hues, each standing for a category the reader must tell apart | Transit maps, calendars, multi-product suites, data-heavy tools |

Not on the list: analogous shades of one hue for background, text, borders and accent. That is the wash.

## Status colors

- Success is green, warning is amber, danger is red, information is blue. People read these without thinking, so do not reassign them.
- They report status. They are not decoration and not the brand.
- Each needs a text label or icon as well, because many people cannot tell red from green.
- When the accent is close to a status hue (a green brand beside success, a red brand beside danger), make the status visibly different in form: an icon, a filled chip against the accent's plain text, a different lightness. Never rely on two near-identical greens meaning two different things.
- Tinted status backgrounds stay pale and small: a chip or a single row, not a panel.

## Chart colors

- The series the reader is meant to follow takes the accent or near-black. Comparison series (last week, the average, the target) take gray.
- With several categories, use a separate categorical set chosen to stay distinguishable for color-blind readers and in gray. Do not reuse status colors for categories, or a red line will look like a problem.
- A chart sits on the same surface as everything else. Putting it on a dark or colored panel to make it look impressive separates it from the numbers beside it.
- Gridlines and axes are light gray and thinner than the data.

## Dark themes

- Surfaces are dark grays, stepping lighter with elevation. They are not dark shades of the accent.
- The accent is lightened and lowered in chroma, and a filled accent button usually takes dark text.
- Check every pair for contrast again.

## Checks

1. **Gray test.** Replace every neutral with plain gray in your head, or in the stylesheet. If the page loses its character, the neutrals were carrying the hue. Move the color back into the accent.
2. **Chroma.** Every neutral token is written in OKLCH with a chroma of 0.01 or less. That includes text, borders, dark panels and shadow colors.
3. **Spend.** `scripts/check.mjs` counts how many color declarations use a hue. Above 30% the accent is on too many things. It also fails any heading or body text set in a color.
4. **Hue count.** List every hue on the page apart from status colors. Each one is named on the Palette line, with its job.
5. **Point test.** Point at each colored thing and say what it marks. Color that marks nothing returns to neutral.
6. **Subject test.** Would this hue have come out the same for a different subject? Could you tell from the colors alone what field this is, or at least that someone chose them?
7. **Source.** The Palette line names a real thing the hue comes from. A mood does not count.
