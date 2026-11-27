---
name: better-design
description: "Use for any work that changes what a person sees in an interface: building, restyling, redesigning or reviewing a website, landing page, web or mobile app screen, dashboard, form, component or design system. Also use when asked to make something look better, more professional, more polished, more original, or less generic and AI-made, or to fix hierarchy, spacing, typography, color, responsiveness or dark mode. Provides a method for choosing a direction that fits the subject, a craft floor for type, color, layout, states, content and accessibility, and a visual review to run before handing over."
license: MIT
metadata:
  author: novnski
  version: "1.6.0"
---

# Better Design

Machine-made interfaces fail in one recognizable way. Nobody decided anything, so every choice fell to the most common answer: the usual centered hero, the usual three cards, the usual gradient, the usual font. Each choice is harmless alone. Together they tell a viewer within a second that nobody was paying attention, and that judgment transfers to the product.

Good interface work needs three things, in this order:

1. **A decision.** Know what this is, who is looking at it, and what single idea organizes it, before writing code.
2. **A craft floor.** Hierarchy, type, color, space, states, content and accessibility, executed precisely. The floor is the same for every kind of interface.
3. **A look.** Render the result, look at it, and fix what you see. Code that reads well can still look wrong.

The method is general. A settings page and a launch page need very different amounts of expression and exactly the same care.

## 1. Size the process to the task

| The task | What to do |
|---|---|
| A change inside an existing interface: a fix, a restyled component, a new field | The existing design is the brief. Read its tokens, components and spacing, and match them. Introduce no new font, color, radius or shadow. Then apply the craft floor (section 5) and the review (section 7). |
| A new screen or feature in an existing product | Read the system first (section 2) and extend it. Invent only where the system has no answer, and make the invention look like it belongs. |
| A new site, product or redesign with open direction | Run the whole method, sections 2 to 8. |
| A review or critique of existing UI | Run the review checks (section 7) and the pattern list (`references/patterns.md`) against it. Report findings in order of impact. Change code only if asked. |

## 2. Read what exists

Before deciding anything, find out what is already decided:

- Theme and tokens: CSS custom properties, a Tailwind theme, a theme file, a component library and whether its theme has been customized.
- Fonts already loaded, the logo, brand colors, existing pages and components.
- A design record: `.interface-design/system.md`, `DESIGN.md`, a style guide.
- Real material from the user: copy, product data, screenshots, images, a mockup or reference site.

Existing brand and system constraints outrank every preference in this skill. A supplied mockup or reference is the brief: match its spacing, sizes and colors closely before adding ideas of your own. Use the project's stack and conventions. For a standalone page with no stack given, plain HTML and CSS is enough.

## 3. Write the brief

For new work, write the brief before any code, and save it as a file: the project's design record, `.interface-design/system.md` unless the project already keeps one elsewhere. In an interactive session, show it to the user as well. Writing it down is what makes it binding. A brief kept in your head gets replaced by the default without anyone noticing, including you. Keep the Register line and the Accent line each as one line with one word on it (`Register: showpiece`, `Accent: blue`). The scripts read them: `look.mjs` to decide which checks apply, and `check.mjs` to compare the accent on the page with the one the brief selected.

Use this form:

```
Subject:    what this is, in one plain sentence
Audience:   who is looking, on what device, in what state
Job:        the one thing the person must be able to do or understand here, as a verb
Given:      what the request fixes, in its own words: content, look, behavior. These bind.
Look:       open, or supplied: "<the request's own words for the look>"
Filled in:  what the request left open and what you decided: the name, the place, the
            people, the real facts and figures on the page
Register:   one word: utility, between, expression, showpiece or piece (section 4)
Default:    the version you would build with no further thought: background, accent hue,
            typefaces, first-screen layout, headline wording
Directions: three alternatives, one line each, described by what is on the screen:
            palette structure, typeface class and first-screen composition
Chosen:     the first sentence of the request in quotation marks, its number of words, the
            direction that number selects (see Choosing), and why it serves this audience
Differs:    palette structure: <default> -> <chosen>
            typeface class: <default> -> <chosen>
            first-screen composition: <default> -> <chosen>
Palette:    seen: the three best-known products or businesses in this field, in the order
                they came to mind, each with the one color it is known for
            neutrals: plain gray, warm gray or cool gray
            spent on: where the color goes: one flat field, or the few things that carry it
Accent:     one word: the hue the count selected (red, orange, yellow, green,
            teal, blue, purple, pink), none, or supplied
Type:       seen: the lettering on three real things in this field
            letters: the five that `scripts/check.mjs --letters "<that sentence>"` prints
            face: one for headings and one for text, both loaded, like what you saw, each name starting with one of the five
First screen: seen: how three real things in this field are laid out
            from: the one the count selects; what the visitor sees first, and where the words sit
Headline:   the main headline, word for word: what this is and who or where it is for
Action:     the one main action on the first screen: its wording, and the single control
            that carries it
Concept:    (showpiece only) the one idea the page is built around, in a sentence the
            visitor could repeat to a friend
Scenes:     (showpiece only) the page as a numbered run of screens: what each one shows
            and what changes from one to the next
Moment:     (showpiece and piece) the one authored thing nobody expects from this kind
            of site: what the visitor does and what happens
Object:     (piece only) the one thing the person acts on, what it shows before they
            touch it, and what each action changes on it
Picture:    what the first screen shows of the subject (the interface, a photograph, a drawing
            that explains; none only on a utility page) and what it shows that the words cannot
Shape:      the corner character (sharp, balanced or soft), why it suits this audience,
            and the one button shape
Rules:      three to five concrete rules the chosen direction imposes on layout, type and color
```

**Read the request first.** The Given, Look and Filled in lines decide how good the page can be, whatever the length of the request. `Given` holds everything the request fixes, in its own words, and nothing on it is softened or replaced. `Look` says whether the request names a look: a period, a material, a way of printing or drawing, a named style. If it does, the look is supplied: carry it out at full strength across the whole first screen, and this skill's limits on color, ornament and drawn pictures give way to it. `Filled in` is for a short request. Decide the particulars a detailed one would have brought (a name, a place, the people, real prices and hours), so the page is about this one and not about its category, and list them at hand-over as made up. A one-line request gets the whole method, not a smaller page. Read `references/requests.md` before writing these three lines.

**The Default line matters most.** Your first complete picture of the page is the most common answer for this kind of product. It will feel like a considered choice, because each part has a reason: the subject is calm, so the palette is soft; the audience must trust it, so the type is a serif. Everyone else's page has the same reasons and the same result. Write yours down honestly and specifically, so there is something concrete to depart from. Section 6 lists the handful of looks that generated pages gather around; your Default is probably one of them.

**Directions must really differ.** Each one differs from the Default, and from the other two, on all three of these:

- Palette structure: light neutral with one accent; a page flooded with one color; dark; black and white with a single spot color; two strong colors in tension; a multi-color system.
- Typeface class: neutral sans; grotesque with character; condensed; text serif; display serif; slab; monospace; rounded.
- First-screen composition: taken from the subject, never from a list. An earlier version of this line named five arrangements, and every page came out as one of the five. On the First screen line, write how three real things in this field are laid out: whatever this subject has that people look at or use. Each direction takes its arrangement from one of them, in the order written there. Borrow how the thing is arranged, never what it is made of: no paper, wood or chalk. Text on the left with a picture, a paragraph or a panel on the right is the usual split. It is the Default for every landing page, whatever you wrote on the Default line, so it never counts as a different composition.

A showpiece adds a fourth axis, and its three directions differ on that too. How the page is moved through: a column of sections; full-screen scenes one after another; one pinned scene that changes as the visitor scrolls; a sideways journey; an index the visitor picks from. A column of sections is the Default. In a piece the composition axis is where the controls sit, and the order is: (a) on the object, (b) docked along the bottom, (c) docked along one side.

A new hue, or one serif swapped for another, is not a different direction. Every palette structure keeps its neutrals gray: a page where the background, text and borders are all shades of the accent is not on this list.

The Differs lines are the proof. For each axis, name the Default's option and the chosen direction's option from the lists above. In expressive work all three must change. In between work at least two must. If a line would read the same on both sides of the arrow, the chosen direction is still the Default; pick another.

**Where directions come from.** From the subject, so look there first:

- How the field already organizes its information: what it lists, what it compares, what it puts first, how it labels a value. Borrow that logic. Do not borrow the look of the things themselves. A direction is described by what is on the screen, never as a likeness: a page is not "a ledger", "a ticket", "a manual" or "a folder", and it is not drawn to resemble one.
- Its content: mostly numbers, long text, photographs, a single action? Let the dominant material set the layout.
- A structural device that can apply everywhere: a strict column system, one type treatment, a color rule, a recurring shape or line.

**Choosing.** Left to choose, a model picks the same direction every time, and that is how an accountant, a bike shop and a clinic come out with one layout between them. So the choice is taken out of your hands, by a number you did not choose. Write the three directions first: three different ideas for this subject, each described by what is on the screen, and each arranged like one of the three things on the First screen line, in the order written there. In every one the first screen shows the subject and carries its one action. Make sure you would ship any of them for this audience and this job: replace one you would not. Then count the words in the first sentence of the request, exactly as it was written: a word is whatever stands between spaces (a lone symbol such as & may be counted or left out). Divide by three. A remainder of 0 selects (a), 1 selects (b), 2 selects (c). Quote the sentence and write the count and the result on the Chosen line, and build that direction even if another was your favorite. The name is not counted: a name you made up can be made to fit, and six one-line requests in a row came out with one first screen that way. `check.mjs` checks the count against the quoted sentence. If the user or an existing brand has already fixed the direction, there is nothing to choose and this step is skipped.

**Rules make it real.** Each rule is something the Default would break: "color appears only on appointment gaps", "every figure is set in the condensed face at three times body size", "nothing is centered", "the schedule grid is the page grid". A direction that produces no such rules is only a label, and the page will come out as the Default wearing it. Carry the rules through the whole piece and keep everything else quiet. One device applied consistently reads as design; five devices read as noise.

**The Palette line.** Color is where a generated page is easiest to recognize, in two ways. One is the reflex hue. Left to choose, a model gives every subject the same accent: purple or indigo first, then deep green, then yellow with black, and on eight of this skill's last fourteen test pages, orange, coral or rust. Ruling one out only moves it to the next. The other is the wash: one hue spread over everything, so the background, the text, the borders, the dark panels and the accent are all shades of it. Either one makes a courier, a clinic and a bank look like the same template with different words. So the accent is not chosen. Build the palette in this order:

1. Start with black, white and gray. That is a complete base, and most good interfaces are little more than it.
2. Look. If you can search or browse, find the three best-known products or businesses in this field. Write them on the `seen` line in the order they came to mind, each with the one color it is known for. If you cannot look, write what you know of them. Do this before step 3, and do not swap a name afterwards.
3. Take the count from the Chosen line. A remainder of 0 selects the first name on the `seen` line, 1 the second, 2 the third. The accent is that one's color, and its hue word goes on the Accent line. If its color is black, white or gray, the Accent line says `none`: black does the accent's work (white on a dark page), and color appears only for status and in pictures. If the user or an existing brand supplies a color, the line says `supplied` and the count is skipped.
4. Mix the color so that it is plainly that hue. Asked for red, a model mixes rust; asked for pink, salmon; asked for yellow, lime. Ten test accents in a row, whatever they were called, sat between red and orange. `check.mjs` measures the accent the stylesheet uses most and fails it when its hue is outside the range for the word on the Accent line (in OKLCH: red 350 to 30, orange 45 to 72, yellow 80 to 108, green 125 to 170, teal 170 to 210, blue 210 to 270, purple 270 to 320, pink 320 to 350). The bands between red and orange and between yellow and green belong to no word.
5. Nothing else is a source. Not a mood: calm, trustworthy, modern and friendly can be argued for any hue. Not the product's name. Not an object: every subject has a yellow sign, a green plant or a red stamp somewhere in it. Not a picture you generated or a thing you drew: its colors were your own choice. Settle the palette first and make any picture in it.
6. Say where the accent is spent. Everything else stays neutral.

A direction may call for more than an accent: a page flooded with one color, or two colors in tension. That is a palette structure like any other, and yours to choose. A flood is one flat field of color in one or two places, with black or white on top. It is not a tint on everything.

**The Type line.** Typefaces repeat from one generated page to the next as surely as colors do: the same few sans faces, the same few serifs, and a heavy condensed face whenever the page is meant to look bold. A typeface class in the Directions is not a font, and "a sans with character" does not mean the first one that comes to mind. Find the face the way `references/typography.md` describes: look at the lettering the subject already lives with, describe the face you need in plain terms, search a font library by those properties, and compare several candidates set in the real headline. The faces on the reflex list in that file are off the table unless the user or an existing brand supplies them. And the search does not start from a shortlist of your own: three candidates of the builder's choosing were the same three on site after site, listed in whatever order put the favorite where the count landed. The request deals five letters instead. Run `scripts/check.mjs --letters` with the sentence quoted on the Chosen line, copy the five letters it prints to the Type line, and take every typeface the page loads from the names that start with one of them. Inside those letters the choice is yours, and you make it for the subject. Outside a utility page both faces are loaded ones: a system font such as Arial can meet the letters, and it makes the page plainer. `check.mjs` deals the letters again and fails a face outside them.

**The First screen line.** A generated landing page opens the same way almost every time: a small uppercase label above a two-line headline that ends in a full stop, a button beside a text link, and a picture on the right, often with a small interface card pinned to its corner. Eight of nine test pages built with earlier versions of this skill opened that way. Five of 38 well-known sites do. So:

- Decide what the visitor sees first from what is being offered, using the table in `references/page-types.md`: software shows its interface at a readable size, a product shows itself large and whole, a service shows its people and work, a place shows its photograph, hours and address.
- Take the arrangement from the thing the count selects on the First screen line, and compose the first screen as one field: the ground, the words, what shows the subject and the action belong to one picture. A white page with a headline and a box under it is the arrangement every build falls back to. An interface wants the full width.
- No uppercase or wide-tracked label and no badge above the main headline. If it says something the reader needs, put it in the headline or the line under it.
- The main headline says what the thing is and who or where it is for: the kind of product, service or place, in the customer's words. Cover the logo and read it alone. If it would fit a different kind of business, it is a slogan, and a business nobody has heard of cannot afford one. It does not need to be two lines, and it does not need a full stop. It is set in one style, with no italic fragment.
- Where the headline sits, and what sits beside it, under it or behind it, is yours to decide from the thing the arrangement was taken from. One arrangement stays out: text on the left with a picture or a panel on the right. In one test run 8 of 17 pages opened that way whatever the subject, and `look.mjs` fails it.
- One main action, carried by one control, and it sits with the headline. The navigation then carries links only: a filled button at the end of the top bar is on every generated page. A section linked from the navigation is not linked again a few lines lower.
- No band of facts under the first screen. A row of three or four short facts in a strip (figures, a label over each value, capitals with ornaments between) sat under the first screen of 10 of this skill's 16 test pages and of none of 32 well-known sites. It is a stats bar, and with the words moving it would be a marquee. A fact goes where it is used: the one or two that decide a visit (when, where, how much) as a plain line in the first screen, the price beside the buy button, the hours beside the address. The rest is cut.

**The Picture line.** With no photograph to hand, a model generates a picture, and most often a drawing in an old print style: an engraved dog, an etched shopfront, a woodcut tool. It appeared on about two thirds of this skill's test pages, whatever the subject, usually as decoration beside the headline. So decide what the picture is for:

- Software shows its interface, built in HTML at a size that can be read. No mascot, animal or scene beside it.
- A product has to be seen. With no photograph supplied, one plain generated photograph stands in, and hand-over says it must be replaced.
- A place or a service uses real photographs when they are supplied. With none, the first screen shows what it works on or how to find it, as a drawing that explains something a visitor needs and words cannot give. It does not invent photographs of the premises or the staff, and hand-over says which real photographs would help and where they would go.
- A drawing explains something: a diagram, a map, a labeled part. It is never decoration, and never an engraving, etching, woodcut or pen-and-ink scene unless the Look line is supplied and asks for it, or the brand already uses that style.
- "None" is the answer on a utility page, and for any section after the first screen. Outside utility the first screen shows the subject, not only names it, and `check.mjs` fails a Picture line that says none there. An empty space is still never filled with a prop built from HTML.
- Nothing on the page is dressed as a physical object. No part of the interface is made to look like a sheet of paper, a folder, a ticket, a tag, a receipt or a note, and none of the trimmings that go with them appear: a block set at an angle, a paperclip, tape, a pin, a stamp, a perforation, a torn or notched edge, squared or dotted paper behind the content. Content sits upright in plain rectangles. The first eight pages built after the old-print drawing was ruled out replaced it with exactly these props on five of them.

**The Shape line.** The stock shape of a generated page is soft: a rounded card around the first screen and around every block, 12 to 22 pixels at the corners, with pill buttons. Half of well-known real sites round their containers and half use some pill buttons, so roundness is not the fault. The fault is that nobody chose it, and that it is the same on a bank, a clinic and a toy shop. So choose it:

Take the corner character from the subject, pick one row of the radius table in `references/tokens.md` (it says which subjects take which row), and stay in it for controls, cards and dialogs alike. A section sits on the page without a box, and the first screen is never wrapped in a rounded card. One button shape for the whole product: all pills, or none.

**In utility work** the conventions for navigation, forms and tables are usually right and should stay. Apply the Default line to what the screen contains and emphasizes (the default dashboard, the default row of tiles) and depart from that.

**Test the brief** line by line against `references/briefs.md` before writing any code. It gives one question per line and holds no example brief, because an example gets copied.

**When to ask.** Infer what you can from the request, the codebase and the content. Ask only when the answer would change the result and cannot be inferred: brand constraints for a whole new site, light or dark, an audience you cannot guess. When the user wants it built without discussion, or the session is non-interactive, write the brief, state any assumptions, and proceed. For a large open-ended build in an interactive session, show the brief and wait for a go-ahead. It costs a minute and can save a rebuild.

## 4. Set the register

Every interface sits somewhere between utility and expression. Place it before designing, because the right answer at one end is a mistake at the other. Go by the screen being built, not by the product: a developer tool's landing page is expression, and a fashion brand's order history is utility. And go by what the person does there: works through tasks among other screens (utility), reads and scrolls (between, expression, showpiece), or acts on one object that is the reason to be there (piece).

**Utility:** product screens, dashboards, admin, settings, forms, documentation. People come to do something, often every day. The design should recede. Quality shows as density tuned to the task, strict alignment, quiet surfaces, components that behave identically everywhere, instant feedback and complete states. Personality lives in small places: the typeface, one accent color, the spacing rhythm, the wording of an empty state. Surprising layouts cost these users time.

**Expression:** landing pages, brand and portfolio sites, campaigns, editorial pieces, launch pages. People arrive once and decide in seconds whether to stay. The design needs a point of view. The tools:

- Scale contrast: something very large beside something small. Generic pages make everything medium.
- One dominant element per screen: a headline set large, a full-bleed image, a working demonstration of the product.
- Color spent in one decisive place: strict black and white with a single color, or one section flooded with it. Committing to a color does not mean tinting everything with it. The page around the color stays neutral, which is what makes the color read.
- Type as the image: display type with tight leading and deliberately placed line breaks can carry a page that has no pictures.
- A grid with deliberate breaks: establish columns, then let one element cross them.
- Rhythm between sections: alternate dense and sparse, light and dark, contained and full-bleed, text-led and image-led.
- The thing itself: the real product interface, real work, real numbers, in place of descriptions of them.

Spend the extravagance in one place and keep the rest disciplined.

**Showpiece:** the site for a game, a film, a record, a festival, an exhibition, a fashion collection or a launch, and any page the user asks to be bold, creative or experimental. Here the page is part of the thing it presents, and a tidy landing page with a picture at the top is the failure. A business that sells a service, a tool or everyday goods is expression at most, however proud its owner is. Thirty-three such sites were measured against this skill's own pages (the table is in `references/showpiece.md`): on theirs the largest picture covers a median of 80% of the first screen, on ours 7%; something moves on 21 of theirs and on none of ours; theirs run to 7 screens and ours to 2; and only 4 of theirs set any words above 96px.

So a showpiece is not made by setting the type larger. It is made by letting the thing fill the screen, saying little, unfolding over several screens, and moving. Few real sites do all four at once (6 of the 33; 21 do three), so the four checks together are a target and not a description of the average. Read `references/showpiece.md` before writing a showpiece brief. In a showpiece `look.mjs` lifts the limits on headline size and on a block beside the headline, and adds four checks of its own. Everything else in this skill still holds: one main action, no slogan, no paper props, no decoration that carries nothing.

**Piece:** a game, a toy, an instrument, a kiosk, a configurator, a fitting room, a visualizer, a scoreboard, a studio for making one thing. There is one object, and everything the person does is done to it. Filing it as a product screen is the failure: a header, a page title, the object in a panel, a column of controls beside it. The object fills the first screen from one edge to the opposite edge and carries the look at full strength. The controls sit on it or dock along one edge. It opens finished, and every choice changes it at once. Mark the object's element `data-stage`: `look.mjs` measures it. A showpiece is a site about a thing; a piece is the thing. Read `references/piece.md` before writing a piece brief.

**Between:** commerce, content sites, onboarding, pricing, a docs home page. A clear system with a few expressive moments.

Quiet and loud both work when they are precise. The failure is the undecided middle: a little gradient, a little shadow, everything slightly rounded.

## 5. The craft floor

These hold for every register. Details for specific kinds of interface are in `references/page-types.md`.

### System first

- Write the decisions down once as tokens before building components: color roles, type scale, spacing scale, radius, shadows, motion. Name tokens by role (`--text-secondary`, `--surface-raised`, `--border-control`) so they survive a theme change.
- Build only from the tokens. In component styles, every font size and every color is a token, and every spacing and radius value is a step on its scale. A stylesheet with twenty slightly different font sizes has no type scale, whatever the token block says. The review in section 7 counts these.
- With Tailwind, put the fonts, colors and radius in the theme and build from theme utilities. Default-palette classes and arbitrary values scattered through the markup mean the system was skipped.
- With a component library (shadcn/ui, MUI, Bootstrap), restyle through its theme variables. The stock theme is recognizable at a glance, so for new work change at least type, color and radius to fit the brief.
- Structure and example CSS: `references/tokens.md`.

### Hierarchy

- Every view has one primary thing. Decide what it is, then make everything else visibly secondary. When three things compete, the viewer reads none.
- The tools, strongest first: size, weight, contrast, surrounding space, position. Two at once is usually enough.
- Emphasize by quieting the rest. Making secondary text smaller and lower in contrast works better than making the primary thing louder.
- One primary action per view, and one control for it. On one screen no two controls lead to the same place: not a navigation button and a second button below it, and not three buttons with three wordings that all open the same form. Other actions step down: outline, ghost, text link. A long page may offer the main action once more at its end.
- In data, the value is the content and the label is support. Set labels smaller and quieter than values. That is for tables and work screens: on a page that sells or explains, a fact is a sentence.
- Sections differ from one another. One arrangement repeated down the page (a heading on the left with its content on the right, every time) is a template: never for three sections or more when that is most of the page. Of 29 well-known sites, 22 center at least one section heading and 1 repeats the side-by-side arrangement for most of its sections; this skill's test pages never centered one.
- Small labels in spaced capitals, zero-padded numbers (01, 02, 03) and captions written "FIG. 01" are a technical costume. Six capital labels at most on a page, real steps numbered 1, 2, 3 in plain text, and a caption that says what the picture shows.
- Squint at the result. The structure should survive the blur, and nothing should jump out harshly.
- A heading stands alone. No small label above it and no styled line under it, on the first screen or on any section: no tracked capitals, italics, monospace, short rule or badge. What follows a heading is an ordinary sentence. A heading is set in one style throughout: no word or phrase inside it switches to italics.

### Typography

- Type does most of the work in any interface. Choose the face for the voice the brief calls for. A neutral sans is a sound choice for dense product UI where the type should disappear; pick it for that reason. Where the work needs a voice, the display face carries it.
- The first font that comes to mind is the one everyone ships. That applies to Inter as an unconsidered default and equally to the reflex "distinctive" picks (Space Grotesk, Playfair Display, Instrument Serif, Poppins, Montserrat).
- One family is often enough. Two is the usual limit: one for display, one for text. Monospace is for code and data, not decoration.
- Use a scale with few steps and visible jumps: five to seven sizes, each clearly different from its neighbor. Sizes one or two pixels apart read as mistakes. Product UI suits a ratio near 1.2. Expressive pages need 1.33 or more, with display type far larger than body.
- Running text is 16px or more on the web. Dense tools can set UI text at 13–14px. Nothing goes below 12px.
- Line height falls as size rises: 1.5–1.7 for body, 1.3–1.45 for UI text, 1.0–1.2 for display. Tighten tracking on large display type by about -0.02em and never past -0.06em, open it on small all-caps labels, and leave body text alone. The main headline stays at or under 96px on a desktop screen.
- Cap running text at 45–75 characters per line (`max-width: 65ch`).
- Left-align anything longer than three lines. Center only short display copy.
- Two or three weights. Emphasis needs a visible jump in weight.
- Finish the details: `text-wrap: balance` on headings, `tabular-nums` on figures in columns, real quotation marks, an en dash in ranges, no single word alone on the last line of a headline.
- Load only the weights used, with `font-display: swap` and a fallback stack.
- Choosing, pairing, scales and loading: `references/typography.md`.

### Color

- A palette is gray neutrals, one accent hue and separate status colors. Black, white and gray with one color is a complete palette, and the neutrals cover nearly all of the surface.
- Neutrals are gray. Background, surfaces, text, borders, dividers, dark panels and shadows keep an OKLCH chroma of 0.01 or less. Write them in OKLCH so the chroma is the visible middle number. A faint warm or cool lean is allowed if it only shows beside pure gray. Never build the neutrals out of the accent's hue.
- Avoid the wash: a tinted background, tinted text, tinted borders, a dark bar in a deep shade of the same hue, and an accent in that hue again. It reads as a color filter laid over a template. The test is to imagine every neutral as plain gray. If the page would lose its identity, the neutrals were carrying the color.
- The accent means something: the primary action, the current selection, the thing that needs attention. It covers a few percent of a screen. If it appears everywhere, it marks nothing.
- Text is neutral. Headings and body text are black, white or gray. The accent can color a link, one phrase or one figure. A page whose headlines, buttons, logo, panels and pictures all share the accent is washed in it, even when its grays are gray.
- The accent's hue comes from the subject, by the steps under "The Palette line" in section 3. A hue that arrived as a framework default (indigo, violet, blue-600), or as the next choice after ruling those out, was not chosen.
- A field of flat color (a flooded first screen, a colored band) is yours to use: in one or two places, flat, with black or white on top, and the page around it neutral. What stays out is the wash: backgrounds, text, borders and panels all leaning toward one hue. A dark bar or panel is near-black gray, not a deep shade of the accent.
- Status colors (success, warning, danger, info) are for status only and stay out of decoration. If the accent's hue sits close to one of them, give that status an icon or shape of its own so the two are never confused.
- Define ramps in OKLCH so lightness steps are even and hue holds steady across a ramp.
- Contrast: 4.5:1 for body text; 3:1 for large text, icons and the boundaries of controls. Light gray text on white is the most common failure, so check secondary and placeholder text specifically. Text over an image or gradient needs a scrim or a solid backing.
- Do not signal with color alone. Pair it with text, an icon or a shape.
- A gradient needs a job: suggesting light, giving depth, carrying a brand device. Keep it between neighboring hues with a short lightness range.
- Light or dark comes from the context of use and the brand. "Technical" does not mean dark. If both themes ship, design the dark one as its own theme, built from dark grays: lighter surfaces for elevation, lower chroma, contrast rechecked.
- Choosing a hue, how much color real products use, and color for charts: `references/color.md`.

### Space and layout

- Take every spacing value from one scale (4px base: 4, 8, 12, 16, 24, 32, 48, 64, 96, 128).
- Space shows what belongs together. The gap inside a group is smaller than the gap between groups, and a heading sits closer to the content it introduces than to what came before.
- Vary rhythm on purpose. Identical padding on every section reads flat. Alternate tight and open, and keep each level internally consistent.
- Align everything to something. Aim for a few shared vertical edges. Near-misses of a few pixels look like bugs.
- Padding follows optics, not symmetry. Buttons and inputs take about twice as much horizontal padding as vertical.
- Do not put everything in a box. A card is for a discrete object that is repeated or interactive. Group with space, alignment and dividers first, and avoid nesting a card inside a card.
- Cap widths: a page container around 1100–1280px, prose around 65ch. Wide screens get more margin, not longer lines.
- Design the narrow layout as its own layout, not a squeezed desktop. It must hold at every width from 360px up, with no horizontal scrolling. Use `clamp()` for fluid type and spacing, and `dvh` in place of `vh` for full-height sections.
- Touch targets are 44px or more. Pointer-only dense tools can use 32–36px controls. Inputs are 16px or more on mobile, or iOS zooms the page on focus.
- Decide density: generous for reading and marketing, compact for tools used all day. Commit to one.
- Put more space above a heading than below it, so the heading belongs to what follows.

### Shape, depth and surfaces

- Radius is a small scale tied to element size, with one character across the product: sharp reads technical and formal, round reads friendly. An inner radius equals the outer radius minus the padding between them. A large radius on a small element looks inflated.
- Choose one way to separate resting surfaces and keep to it: borders, small shifts in surface lightness, or soft shadows. Floating layers (menus, dialogs, toasts) are the exception and always need to lift off what they cover.
- A shadow says "this floats above". Keep shadows soft, layered, low in opacity, neutral in color, and lit from one direction.
- Adjacent surface levels differ by a few percent of lightness in the same hue. Separation should be felt before it is noticed.
- Dividers and container edges stay quiet: a low-alpha tint of the text color. Control boundaries (inputs, checkboxes) are different and must be clearly visible, about 3:1.
- Do not stack effects. Border, shadow, gradient and blur on one element is four answers to one question.
- Declare elevation once per surface: a border or a shadow. A 1px border under a wide soft shadow on the same box is the generic card.
- The reasoning behind these: `references/reasoning.md`.

### Components and states

- Every interactive element has default, hover, pressed, focus and disabled states, plus selected, loading and invalid where they apply.
- Focus is always visible: a 2px outline with a 2px offset on `:focus-visible`, in a color with 3:1 contrast against its surroundings. Never remove an outline without replacing it.
- Every view of data has loading (a skeleton in the shape of the content), empty (what belongs here and the first action to take), error (what happened and how to recover) and overflow (long names, large numbers, zero, one and a thousand items).
- Forms: a visible label above each field (a placeholder is not a label); the right `type`, `inputmode` and `autocomplete`; validation on blur or submit with a message beside the field that says how to fix it; a button that names the action ("Create project", not "Submit").
- A new web front-end takes the behavior of its controls from UI SDK (`@ui-sdk/*`): the adapter for the project's framework, or its web components on a page with no build step. It supplies keyboard, focus, dismissal, popups and ARIA, and its agent bridge lets an agent read and operate the page. A page with no build step bundles the library and the bridge into one local file (see the reference). It does not decide the look: its stock appearance is restyled with this project's tokens. Read `references/ui-sdk.md` before writing the first control. `look.mjs` fails a page with a control that is not one of its parts, and a page whose parts have no agent bridge, so loading the library is not enough. A project that already has a component library keeps it, and nothing that is not a web front-end uses it.
- Never hand-roll a widget with a `role=` attribute when the library ships it.
- A dot beside a label means a state that can change. Use one only where there is such a state and the reader knows what the states are. Never beside a title, a note or any label that is always the same.
- Show a status once: colored text with an icon, or a dot with plain text, or a tinted chip with text. A dot inside a tinted chip beside its own word says one thing three times.
- A chip is a control (a filter, a tag that can be removed) or one of a set of categories. A note such as "sample data" is a plain sentence, not a badge.
- A button carries no arrow. An arrow says one of three things: this link leaves the site, this button moves to the next step of a flow, or this link jumps down the page. At most one control on a screen carries one. An arrow on every button says nothing.
- Every control does something. A link goes somewhere and a button acts. One that cannot work yet is removed, or visibly disabled and listed at hand-over.
- A control that asks for a choice shows what decides the choice. When the options differ in ways that matter (what each one costs, who is free, which is selected now), list them with those facts beside each name and mark the current one. A bare `<select>` is for options whose names say everything.
- The same thing looks the same everywhere: one height scale for buttons and inputs, one icon family, one way of showing selection.
- Forms, overlays, touch, long content, and the parts the browser draws (text selection, caret, scrollbars, native controls): `references/interaction.md`.
- Respond to every action at once: a pressed state, then an optimistic update or progress, then confirmation. State changes must not shift the layout.

### Content

- Before writing any text that will appear on screen, read `references/copy.md`: interface wording, what a first screen has to say, the tells of generated copy, and sample data.
- Write real, specific copy. Say what the thing does in the reader's words.
- A headline says what the product is or does, in words a customer would use. A promise of a feeling (calmer, simpler, smarter, effortless) fits any product, so it describes none. The same goes for the stock slogan shapes: "Your something, on one something", "One something for your whole something", "Something, simplified".
- Cut filler: seamless, powerful, effortless, elevate, unlock, supercharge, next-generation, "built for modern teams", "everything you need to".
- Never invent facts: no made-up testimonials, customer logos, user counts, ratings, awards or press quotes. If the page needs them and none were supplied, leave a clearly marked placeholder and say so at hand-over.
- Sample data in product UI is realistic and uneven: plausible names, varied lengths, real-looking dates and amounts, a few awkward cases. No lorem ipsum, "John Doe" or "Item 1".
- Sentence case for headings and buttons unless the brand does otherwise. One term per concept throughout.
- No long dashes in headings, labels or buttons. In running text one or two on a page is ordinary; more reads as generated. Use commas, colons and full stops.
- Do not describe the design inside the interface ("a clean, modern dashboard").
- No emoji as icons or bullets, unless the brand voice calls for emoji.

### Imagery and icons

- An icon earns its place by marking something the reader will meet again: a navigation item, an action, a status. It does not decorate a heading, a statistic or every row of a list. If taking it away loses nothing, take it away.
- No icon and no number sits in a small box of its own. A tinted or bordered tile around an icon adds nothing to it, and a number in a tile is a number pretending to be an icon. Controls, a person's initials, a count after its words and the steps of a form's progress bar are not marks and keep their shape.
- One icon family at one stroke weight. One icon size for each text size: 16px beside text up to 14px, 20px beside 16 to 18px text, 24px beside anything larger. Center each icon on its line of text, leave a gap of about half its width, and give it the text's own color unless it shows a status. An icon in a tile beside two lines of text is centered on the two lines. Icons support labels and rarely replace them.
- Use the images the user supplied. Never reference an image URL you have not confirmed resolves; invented stock-photo URLs ship as broken images.
- With no pictures supplied, follow the brief's Picture line: the built interface for software; one plain stand-in photograph for a product that has to be seen; for a place or a service, a drawing that explains. Only a utility page goes without. A precise SVG or CSS drawing is for a diagram, chart, map, pattern or mark.
- A generated picture is a stand-in, never decoration. Use one only where the Picture line calls for it, in the plainest truthful medium, and say at hand-over that it was generated and has to be replaced. Do not generate people presented as real customers or staff, logos, or fake screenshots of the product.
- SVG and CSS are for geometry: diagrams, charts, marks, patterns, linework. A scene of people, animals or objects assembled from SVG shapes reads as clip art. Use a real or generated image for a picture, or use no picture.
- A picture keeps its own colors or is black and white. Do not print an illustration or photograph in the accent's ink: it spreads that hue over a large part of the screen.
- Skip filler graphics: abstract blobs, gradient orbs, generic isometric scenes, floating 3D shapes.
- Give every image dimensions or an `aspect-ratio`, `object-fit`, alt text, and lazy loading below the fold.

### Motion

- Motion shows cause and effect, keeps continuity between states, or directs attention once. If removing an animation loses no information, remove it.
- Decide by how often it is seen. Something used hundreds of times a day, or triggered from the keyboard, does not animate. Something seen occasionally gets a short transition. Only what is seen rarely has room for more.
- 100–200ms for hover, press and toggles. 200–350ms for panels, dialogs and page elements. Leaving is faster than entering. Ease out for things arriving and leaving, ease in-out for things moving across the screen, linear only for continuous progress. Never ease in.
- Never `transition: all`. Name the properties. Nothing appears from `scale(0)`.
- Animate `transform` and `opacity`. Animating layout properties stutters.
- In expressive work, one orchestrated moment (a staged entrance for the first screen) beats a fade-up on every section. Do not hide content until an animation runs, and do not take over scrolling.
- No bounce or overshoot unless playfulness is in the brief. Nothing loops beside text someone is reading.
- Honor `prefers-reduced-motion`.
- The full decision order, durations and details: `references/interaction.md`.

### Accessibility and robustness

- Semantic HTML: landmarks, one `h1`, headings in order, lists as lists. A button performs an action; a link goes somewhere.
- Everything works by keyboard, in a logical order, with visible focus. Escape closes overlays. Focus stays inside a dialog while it is open and returns to the trigger afterward.
- Inputs have labels, icon-only buttons have an `aria-label`, images have alt text.
- The page survives 200% zoom, long translated strings and missing images.
- Performance is part of the design: reserve space so nothing shifts as content loads, and keep large blurs and `backdrop-filter` off big areas.

## 6. Generic patterns

These are the modal answers: what appears when nothing was decided. Any one of them can be right when it follows from the Rules in the brief. Unmotivated and combined, they are how an interface announces that it was generated.

Generated pages currently gather around six looks, whatever the subject. They are listed at the top of `references/patterns.md`, and they share one opening: text on the left, a picture on the right, a small label above a two-line headline. Each look is right when a brief asks for it. Leaving one for the next is not a decision.

Repetition makes a device generic too. Used once it is a decision; used on every section it is a template. That applies to an emphasized phrase inside a headline, an icon in a tile, a card.

The full list, by structure, color, type, components, content and motion, is in `references/patterns.md`. Read it before building, and check finished work against it: remove each pattern that does not follow from the Rules. "It suits the subject" is not a reason: every default suits its subject, which is why it is the default.

The test underneath all of them: could a different product use this design unchanged, with only the logo and the words swapped? Then it was not designed for this one.

## 7. Review: count, then look

Checking that links work and nothing overflows is necessary, and it is not this review. This review asks whether the page was designed.

### Count

Run the check script that ships with this skill. It counts most of these rows from the source and prints PASS or FAIL for each:

```
node <this skill's folder>/scripts/check.mjs <project folder>
```

Fix every FAIL before looking at screenshots. A limit is a ceiling, not a quota: using none of an allowance is normal. In an existing project, count only what you added or changed.

Counted by `check.mjs`, from the source:

| Count | Limit |
|---|---|
| Distinct font sizes (a fluid `clamp()` step counts once) | 7 |
| Smallest font size | 12px or more |
| Font families | 2, plus monospace if code or data needs it |
| Font sizes or colors written outside the token block | 0 |
| Distinct radius values | 4 |
| Neutral tokens (background, surface, text, border, dark panel, shadow) with OKLCH chroma above 0.01 | 0 |
| Headings or body text set in a color (one emphasized phrase aside) | 0 |
| Share of color declarations that use a hue, status colors aside | 30% or less |
| Fonts named first in a stack that the page does not load (system fonts excepted) | 0 |
| Typefaces on the reflex list in `references/typography.md`, or whose name starts with none of the five letters dealt for the request, that the user or a brand did not supply | 0 |
| Headings made of two short fragments ("One thing. Another thing.") | 1 per page |
| The accent the stylesheet uses most, against the word on the brief's Accent line | the same hue |
| The number on the Chosen line, against the words in the sentence it quotes, and the direction against the remainder | the same |

Counted by `look.mjs` in the Look step, from the rendered page:

| Count | Limit |
|---|---|
| Console errors on load | 0 |
| Small styled lines above or under any heading (capitals, italics, monospace, a rule, a badge) | 0 |
| Dots inside tinted chips, and dots or badges on a note about the content | 0 |
| A first screen that is the text-left, picture-right split, or is wrapped in a rounded card | 0 |
| A main headline above 96px at desktop width, or letter spacing tighter than -0.06em | 0 |
| Long dashes in headings, labels and buttons | 0 |
| Links and buttons that do nothing | 0 |
| Pictures on a work screen that are not something the person works with | 0 |
| Pictures on the first screen drawn in hatched, engraved or woodcut linework | 0 |
| Blocks with words on the first screen that are set at an angle | 0 |
| Squared or dotted paper drawn behind the first screen | 0 |
| Dashed or dotted rules (a file drop zone with all four sides dashed is not one) | 0 |
| A back-to-top link on a page shorter than six screens | 0 |
| Controls on the first screen that lead to a place another control there already leads to (two navigations aside; on a work screen, a third) | 0 |
| Controls on the first screen that end in an arrow | 1 at most |
| A main headline in a stock slogan shape | 0 |
| Headings with an italic fragment | 0 |
| Blocks that share the main headline's row | 0 |
| Icons more than 2.5px off the middle of the text beside them, when there are three or more | 0 |
| Icon sizes beside text of one size | 2 at most |
| A band of short facts directly under the first screen | 0 |
| Sections with the heading on the left and the content on the right | fewer than 3, or fewer than half the page's sections |
| Numbers or icons set in a small tinted or bordered box of their own | 0 |
| Small labels in spaced capitals, outside tables and navigation | 6 at most |
| Markers written 01, 02, 03 | 2 at most |
| Captions written as a numbered figure ("FIG. 01") | 0 |
| Buttons, fields, dialogs and widgets that are not UI SDK parts, and `ui-*` tags that are not UI SDK elements (a project that keeps its own component library aside) | 0 |
| Pages with UI SDK parts that register no agent bridge | 0 |
| Piece: share of the first screen covered by the one element marked `data-stage`, which runs from one edge of the screen to the opposite edge and holds 80 words at most | 60% or more |
| Showpiece: share of the first screen covered by its largest picture or film (or the title spanning 70% of the width) | 60% or more |
| Showpiece: words on the first screen | 80 at most |
| Showpiece: length of the page | 4 screens or more |
| Showpiece: things that move (an animation, a film, a canvas, a scroll scene) | 1 or more |
| Gray that leans toward one hue, as a share of the first screen | 10% or less |

Counted by hand. Write the numbers in the design record:

| Count | Limit |
|---|---|
| Spacing or radius values that are not a step on their scale | 0 |
| Colored phrases inside headlines | 1 per page |
| Icons that mark nothing the reader will meet again (beside a heading, a statistic, every row of a list) | 0 |
| Hues in use, status colors aside, that the Palette line does not name | 0 |
| Colored surfaces larger than a button that the Palette line does not name | 0 |
| Dots beside labels that have no changing state | 0 |
| Pictures that only decorate | 0 |
| Showpiece: scenes that do not show something of the subject, and places where the Concept line does not show | 0 |
| Parts of the page made to look like a physical object (a sheet, a folder, a ticket, a tag, a receipt) | 0 |
| Console errors after using each control | 0 |

### Look

Do not hand over interface work you have not looked at.

1. Run the look script that ships with this skill. It opens the page in a real browser, captures it at 390, 768 and 1440 wide, and prints PASS or FAIL for what can only be checked once the page is rendered: console errors, sideways scrolling, text contrast, unnamed controls, keyboard focus, links and buttons that do nothing, the first-screen arrangement, headline size and letter spacing, pictures, dot labels, badges, lines beside headings, corner shape, long dashes, and the one-hue wash.

   ```
   node <this skill's folder>/scripts/look.mjs <project folder or URL>
   ```

   It needs no packages, only a Chromium-based browser on the machine. If it cannot find one, capture the page with whatever the environment offers and run `scripts/palette.mjs` on the desktop capture.
2. Capture what the script does not: the dark theme and the key states (a dialog open, an empty list, an error), where they exist. Let entrance animations finish before capturing, then open each capture and confirm it shows what you meant it to.
3. Look at each capture as a stranger would, and go through the checks below.
4. Fix what fails, capture again, and repeat until a pass finds nothing. Expect at least one round of fixes. A first render that needs nothing is rare.

If nothing in the environment can render the page, run the checks against the code and say plainly at hand-over that the result has not been seen. Never describe how something looks unless you have looked at it.

The checks:

1. **Default.** Put the first screen beside the Default line of the brief. If the palette, the type and the composition match it, the chosen direction was not carried out. Go back to the Rules and rebuild the first screen from them. Then confirm each Rule is visibly true on the page.
2. **First glance.** What does the eye hit first, second, third? Does that match the intended hierarchy?
3. **Squint.** Blurred, does the structure still read? Does anything jump out harshly?
4. **Swap.** Could another product use this unchanged? If so, the idea is not visible yet.
5. **Remove.** For each decorative element, imagine it gone. If nothing is lost, take it out.
6. **Edges.** Do elements share edges? Any near-misses of a few pixels?
7. **Spacing.** Do groups read as groups? Is there rhythm, or is everything evenly padded?
8. **Text.** Any line too long, any orphaned headline word, any text under contrast, anything truncated or overflowing?
9. **Narrow.** At phone width: nothing overflows, targets are large enough, the order makes sense.
10. **States.** Hover, focus, pressed and disabled exist. Loading, empty and error exist.
11. **Content.** No filler, no invented facts, no placeholder text left unmarked.
12. **Generic patterns.** Anything from `references/patterns.md` present without a reason from the brief?
13. **Memory.** If someone left after the first screen, what would they describe an hour later? If the honest answer is a mood, or nothing, the idea is not on the screen yet.
14. **Color.** Imagine every neutral turned to plain gray. Does the page keep its character? Then point at each colored thing and say what it marks. Anything colored that marks nothing goes back to neutral.

### Record

For new work, finish the design record that holds the brief. Add a `Review` section with the counts and the outcome of check 1, and a `System` section with what later work needs to stay consistent: fonts, color roles, type scale, spacing and radius scales, depth strategy.

## 8. Hand over

Tell the user, briefly:

- The direction in two or three lines: what the Default was and what you chose in its place.
- Where the design record is.
- Assumptions made in place of answers.
- Placeholders that need real material (images, logos, testimonials, figures), and which images were generated.
- What was looked at and at which sizes, and anything not verified.
- What the check and look scripts reported, including any FAIL or NOTE left in place and why.

## References

- `references/requests.md`: reading the request: what it fixes, when it supplies the look, and what to decide when it is short. Read before the first line of the brief.
- `references/briefs.md`: one test question for each line of the brief. Read after writing a brief.
- `references/piece.md`: the object, the furniture to leave out, the first frame and pictures that change, for a game, a kiosk, a configurator or any piece. Read before a piece brief.
- `references/ui-sdk.md`: UI SDK, the default source of behavior for a web front-end: when it applies, how to load it, and what stays with this skill. Read before the first control.
- `references/showpiece.md`: concept, scenes, the authored moment and motion for a game, film, festival, exhibition or launch page. Read before a showpiece brief.
- `references/page-types.md`: what quality and failure look like for landing pages, product UI, forms, long-form content, tables and charts, commerce, portfolios, mobile screens and single components. Read the matching section before designing.
- `references/patterns.md`: the full list of generic patterns, grouped by structure, color and effects, type, components, content and motion. Read before building and again in the review.
- `references/color.md`: choosing an accent hue from the subject, how much color real products use, palette structures, status and chart colors, and the checks for a one-hue wash. Read before choosing any color.
- `references/typography.md`: choosing and pairing typefaces, scales, spacing values, OpenType details and font loading. Read when choosing fonts or setting up a type system.
- `references/copy.md`: interface wording, what a selling page has to say, the tells of generated copy, and sample data. Read before writing any on-screen text.
- `references/interaction.md`: when and how to animate, states, forms, overlays, touch, long content, browser-drawn parts and what a page needs before it ships. Read when building anything interactive.
- `references/tokens.md`: token layers with example CSS for color, light and dark themes, spacing, radius, elevation, motion and focus. Read when setting up or extending a design system.
- `references/reasoning.md`: why the common decisions about surfaces, borders, shadows, inputs, focus, buttons, navigation, overlays, cards and tables work. Read when a value needs adapting or a decision is unclear.
- `scripts/check.mjs`: counts the limits of section 7 in a project's source and prints PASS or FAIL for each. Run it in the Count step. With `--letters` it prints the five letters a request deals for its typefaces.
- `scripts/look.mjs`: opens the page in a browser, captures it at three widths and checks the rendered result, including the first-screen layout and the small habits (it loads `scripts/habits.mjs`). Run it in the Look step.
- `scripts/palette.mjs`: measures from a screenshot how much of a screen is neutral, tinted and colored. `look.mjs` runs it for you; use it directly on captures made another way.
