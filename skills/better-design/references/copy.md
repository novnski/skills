# Words

The words are part of the design. A page with careful type and stock sentences still reads as generated. Read this before writing any text that will appear in the interface, including sample data.

## Contents

- Interface text
- A page that sells
- Tells of generated copy
- Over-correction
- Sample data
- Honesty

## Interface text

- Name things the way the person using the product would, not the way the system is built. A person manages notifications. They do not configure webhooks.
- A button says what happens when it is pressed: a verb and its object. "Save changes", "Send invoice", "Delete 3 files". Never "Submit", "OK" or "Continue" when something more exact is true.
- One action keeps one name through the whole flow. The "Publish" button leads to a "Published" confirmation, not "Your post is live".
- An error says what happened and what to do next, beside the thing that went wrong. It does not apologize, joke or blame.
- An empty state says what belongs here and offers the first action.
- Sentence case for headings, labels and buttons. Capitals only for names and the first word.
- Numbers as numerals with their unit: "8 deliveries", "3 min late". Keep a number and its unit together with a non-breaking space.
- Plurals are real plurals. "1 member", "2 members", through `Intl.PluralRules` when the count varies.
- Dates and times go through `Intl.DateTimeFormat`. A relative time ("3 hours ago") becomes an absolute date after about a week.
- Use the typographic characters: curly quotes, a real ellipsis (…), a multiplication sign for dimensions. A loading label ends in an ellipsis: "Saving…".
- No long dashes in headings, labels or buttons. In running text, one or two on a page is ordinary. A count of 40 well-known sites found at least one on 19 of them and five or more on only 2.
- A note about the content ("sample data", "illustrative figures") is a short plain sentence near the thing it describes. It is not a badge, and it is not needed on every panel.
- A label and a placeholder do different jobs. The label names the field. The placeholder shows an example of what to type.

## A page that sells

- The first screen says what the thing is, who it is for and one hard fact about it. A reader who leaves after that screen should be able to say what was on offer.
- The main headline says what the thing is. On 38 well-known sites measured in November 2026, most main headlines were a plain description of the product and who it is for, 29 had no full stop at the end, and 11 fit on one line. All 9 generated test pages wrote a two-line slogan ending in a full stop.
- Headings name what the section holds. A reader skimming only the headings should get the outline of the offer.
- One primary action on the first screen and at most one secondary. The same action appears at most twice on any one screen.
- A fact is worded the same everywhere. The price, the trial length and the product name do not vary between sections.
- Put a number in the sentence it proves. A row of three or four big figures over one-word labels is a template, and readers skip it.
- Show the thing doing its job in place of adjectives about it: the real interface, a real example, a real result.
- Spend words where there is something to say. One section may run long and another may be two lines.

## Tells of generated copy

Each of these appears on page after page, whatever the subject. Find them in your draft and rewrite the line as a plain statement of fact.

| Tell | Example | Rewrite toward |
|---|---|---|
| A promise of a feeling | "A calmer day at the clinic" | What the product does |
| Two short fragments | "One clinic. One schedule." | A sentence, or a name with a claim under it. At most one such heading per page. |
| A paired count | "Three teams, three ways of working" | What the section holds |
| A contrast frame | "Not a tool, a teammate", "X, not Y", "instead of", "without the" | The positive fact alone |
| A run of refusals | "No forms, no waiting, no fuss" | One refusal, only if the reader can check it |
| Virtue words about itself | simple, honest, calm, thoughtful, seamless, effortless, powerful, intentional | A fact that shows it |
| Abstractions | "Elevate your workflow", "Built for modern teams" | The noun and verb of what happens |
| Invented specifics | "at 5:40 on a Tuesday", "Lot 112", "41% faster" | Only details the brief supplies |
| Invented proof | Three polished testimonials, "10,000+ teams", "99.9% uptime", logo rows | Nothing, unless it was supplied |
| The section template | Label, claim heading, short lede, three cards, in every section | A shape taken from what the section has to say |
| The brand's metaphor in every heading | A product called Harbor that "docks" and "anchors" every feature | Once, or never |
| A quip to close each paragraph | "The rest, as they say, is paperwork." | End on information |
| A sign-off in the footer | "Made with care in Lisbon" | The legal line |
| Talking about the page | "Here's how it works", "Below you'll find", "This section shows" | Say the thing |
| Perfect evenness | Every card the same length, every paragraph the same arc | Uneven lengths that follow the content |
| Stock form text under a careful hero | "Something went wrong", "Thank you for your submission" | Write the small text with the same care |

Visual habits that travel with these: a tracked uppercase label above each heading; details joined by middle dots ("Depot · Wednesday · 14:35"); an arrow on the end of every link and button; step numbers (01, 02, 03) on things that are not steps.

## Over-correction

Forbidding a device brings out its nearest relative. Remove "not X but Y" and "rather than X" appears. Remove long dashes and comma splices appear. Remove the feeling in the headline and a two-fragment headline takes its place. Do not swap one device for the next. Write what is true about the product in a plain sentence, then check whether the line could sit on a competitor's page unchanged.

## Sample data

Sample data is content, and people judge the design by it.

- Use names that fit the place and field of the product, and vary them. Generated pages reach for the same small cast of first names and surnames from one run to the next, and for companies named Acme, Northwind or Apex. If a name is the first that came to mind, it is from that cast. Choose names the way the product's real customers would be named, in its real town.
- Make the numbers add up. Totals equal the sum of their rows, percentages match their counts, and the chart shows the same data as the table.
- Include the awkward cases, because the layout has to survive them: a very long name, a zero, a five-digit number, a missing value, a late item.
- Use real formats for the locale: currency, dates, addresses, phone numbers.
- Sample contact details use reserved forms such as `example.com`, so nothing points at a real person.

## Honesty

- Never present invented testimonials, customers, statistics, awards or press as real.
- Mark placeholder content as a placeholder, and list it at hand-over.
- Label a generated image as generated when it could be mistaken for a photograph of a real place, person or product.
- Do not copy another site's text, images or signature look.
