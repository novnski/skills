# Showpiece pages

For the site of a game, a film, a record, a festival, an exhibition, a fashion collection or a launch, and for any page the user asks to be bold, creative or experimental. The page is part of the thing it presents. Read this before writing the brief.

A showpiece is a site about a thing, and it unfolds over several screens. A game that is played, a kiosk, a configurator or any single object the person acts on is a piece: one screen, and `references/piece.md`.

## Contents

- What the measurements say
- The concept
- The first screen
- Scenes
- The moment
- Motion
- What still holds
- What the script checks

## What the measurements say

Thirty-three showpiece sites were measured: games, studios, product launches, festivals, museums and film companies.

- The largest picture or film covers a median of 80% of the first screen. On two thirds of them it covers 60% or more.
- The first screen carries a median of 80 words with menus and cookie notices counted, and far fewer without them.
- Something moves on two thirds of them: an animation, a film, a scroll scene.
- The median page is 7 screens long. Four in five run to 4 screens or more.
- The largest words are a median of 48px. Only 4 of the 33 set anything above 96px.

Against 14 of this skill's own marketing pages, built before this file existed:

| On the first screen and the page | Showpiece sites | This skill's pages before |
|---|---|---|
| Share of the first screen covered by its largest picture or film | median 80% | 7% (the game page: 56%) |
| Words on the first screen, menus and notices included | median 80 | about 70 |
| Something moves (an animation, a film, a scroll scene) | 21 of 33 | 0 of 14 |
| Length of the page | median 7 screens | 2 screens |
| Largest words above 96px | 4 of 33 | never |

The last line matters most. A showpiece is not a landing page with bigger type. The thing fills the screen, the page says little, it unfolds, and it moves. Only 6 of the 33 do all four of these at once, and 21 do three, so meeting all four is a high bar and the checks below hold you to it.

The limits get used as quotas: a page built to pass comes out at exactly 4 screens with exactly one thing moving. Treat them as floors. The Scenes line decides how long the page is, and the subject decides how much moves.

## The concept

A showpiece is built around one idea that can be said in a sentence, and a visitor could repeat that sentence to a friend. Write it on the Concept line and test it:

1. Could the same sentence be said about a rival's page? Then it describes the category. Look again at this one subject.
2. Does it change what the visitor does, the order of the page, or what the first screen is? If it only changes how the page looks, it is a costume.
3. Would the page be the same with the sentence deleted? Then it is a label.

Look for the idea in what the thing is like from the inside: where it happens, what happens first and what follows, what it sounds like, what its rules are, whose eyes it is seen through, what its audience already says about it. The product category has no ideas in it.

The concept decides three things, and the brief names all three:

- what the first screen is;
- what one scene is (the unit the page is made of) and why the scenes come in the order they do;
- the one thing the visitor can do that belongs to this subject.

The concept never dresses the page as an object. No part of it is drawn as a ticket, a poster on a wall, a map pinned to a board or a screen inside a screen.

## The first screen

- The thing itself fills it: the art, the film, the object, edge to edge. The largest picture covers 60% of the screen or more, or the title runs across 70% of the width or more.
- The words are the title of the work, one line, and one action. A date or a place that decides whether the visitor stays can sit small at an edge. Everything else waits for the next screen.
- What waits does not wait in a strip. No band of facts under the first screen: the dates, the price and the numbers go to the scene they belong to.
- The title is the name of the thing. It is not a slogan about it.
- Navigation does not compete with the picture.
- Words over a picture sit on its quiet part, with a scrim under them if they need one. Check the contrast on the capture, not in the CSS.
- With no art supplied, use one generated picture at full bleed, in a manner that suits the subject and copies nobody's artwork, logo or characters, and say at hand-over that it stands in. Name the palette from the brief when you ask for the picture, so the picture arrives in it. Or make the title the picture.

## Scenes

- The page is a run of scenes. One scene is one screen tall or more and shows one thing: a place, a person, a day, a room, a part, a track. The unit comes from the concept.
- The order has a reason that the visitor can feel: a route, a timetable, a build-up, a way through a building.
- Scenes differ from one another in kind: a picture at full bleed, words alone, a list set large, a detail close up. Change between dense and sparse and between light and dark.
- Number them on the Scenes line and say what each shows that the one before did not. A scene that shows nothing new is cut. Four good scenes are better than seven thin ones.
- The practical facts (price, dates, how to get there, how to buy) get a plain and complete scene of their own near the end. A showpiece still answers them, and the craft rules for forms, tables and controls apply inside it.

## The moment

One authored thing that nobody expects from this kind of site. It answers the question "what would a visitor show someone else?"

- Find it in what the subject does. It plays, moves, opens, lights up, counts down, travels, is put together. Let the page do a small version of that when the visitor acts.
- It is one thing. Three small effects are not a moment.
- It serves the concept. If it could be moved to another site unchanged, it is decoration.
- The page works without it: by keyboard, with motion reduced, and with scripts switched off.
- Never take over the scroll wheel. A scene may stay pinned while the page scrolls under it, but the page always moves at the visitor's speed.
- No sound until the visitor asks for it, and then a visible way to stop it.

The browser gives you what you need without a library: scroll-driven animations (`animation-timeline`), pinned scenes (`position: sticky`), view transitions, a `<canvas>`, an observer that starts something when a scene arrives. `look.mjs` counts an animation, a playing film, a canvas or a scroll scene. A color change on hover is not counted.

## Motion

- One load sequence on the first screen: the picture and the title arriving, done within about a second.
- At most one kind of reveal for the scenes that follow, and not on every element.
- Move `transform` and `opacity` only. Durations and easing follow `references/interaction.md`.
- Under `prefers-reduced-motion: reduce` every movement becomes a quick fade or nothing, and nothing stays hidden.
- Anything that loops for more than five seconds can be paused.

## What still holds

- One main action, carried by one control.
- No paper props, no tilted blocks of words, no italic word inside a heading.
- The palette is settled on the Palette line before any picture is made, and a generated picture is made in that palette. Art the user supplies brings its own color. The controls and the text stay neutral with the one accent.
- Two font families at most.
- Every scene picture has dimensions, alt text and a sensible file size. The first picture loads first; the rest load as they are reached.
- Facts are looked up, not invented. An unofficial page says so in one plain sentence.

## What the script checks

When the design record says `Register: showpiece`, `scripts/look.mjs`:

- lifts the 96px limit on the main headline, and allows a block beside the headline;
- fails a first screen where nothing dominates (largest picture under 60%, and title under 70% of the width);
- fails more than 80 words on the first screen;
- fails a page shorter than 4 screens;
- fails a page on which nothing moves.

Every other check still runs.
