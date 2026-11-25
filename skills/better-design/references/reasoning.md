# Design Reasoning

Why common decisions work. Knowing the reason lets you adapt a value to a new context where copying it would fail. The examples lean toward product UI because these decisions repeat most there. The reasoning applies wherever surfaces, edges and controls appear.

## The goal

A viewer should take in the structure without noticing the styling that produces it: where regions begin and end, what can be pressed, what matters most. If someone notices the borders, the borders are too strong.

This holds in expressive work too. The loud element is loud by decision, and everything supporting it stays out of the way.

## Surfaces

**Why small steps between levels?** A surface only has to be distinguishable from its neighbor. A few percent of lightness is invisible in isolation and clear once surfaces stack. Large jumps make every panel compete with its content.

**Why the same hue at every level?** A change of hue between levels reads as a change of meaning. Shift lightness and hold hue and chroma steady, so the levels read as one material at different heights.

**Why do light and dark differ?** In a light theme the canvas is usually a very light gray and raised surfaces are white. Nothing is lighter than white, so shadows or borders carry elevation. In a dark theme shadows barely show, so higher surfaces get lighter and borders do more of the work.

**What breaks it:** dramatic jumps, a different tint on every panel, white cards on a saturated background with no tonal relationship to it.

## Borders and dividers

**Why low alpha instead of a solid color?** A border made from the text color at low opacity, roughly 6–15%, adapts to whatever is behind it and stays in the same tonal family. A fixed solid gray is right on one surface and wrong on the next.

**The arm's-length test.** Look from a distance. If borders are the first thing you see, lower them. If you cannot tell where a region ends, raise them.

**Why are controls different?** A divider can whisper, because the content on either side already shows the structure. The edge of an input is the only thing that says "you can type here", so it needs real contrast: about 3:1 against the surface behind it.

**Why fewer lines?** Space and alignment separate things as well as lines do. Remove a divider and see whether the grouping still reads. Often it does.

**Why 1px and not a hairline?** A 0.5px border renders differently across displays and can vanish on standard-density screens. A 1px line at low alpha looks finer and behaves predictably.

## Shadows

**What does a shadow mean?** Light comes from above, so a shadow says the object is in front of the page. Use it for things that are: menus, dialogs, toasts, a card being dragged. A shadow on every resting card says nothing, because everything floats.

**Why layered and soft?** A real shadow has a tight dark contact edge and a wide faint spread. Two or three stacked shadows with small offsets and low opacity imitate that. One heavy blurred shadow looks like a smudge.

**What color is a shadow?** Near-black at low opacity on white and gray surfaces, which is nearly every surface. Only on a field of real color does a shadow take a dark shade of that color, because pure black would gray it out.

**Why one light?** Shadows that fall in different directions break the sense of a single space. Every shadow falls the same way, usually straight down, with offset and blur growing together as elevation rises.

## Inputs

**Why should an input look different from its surroundings?** It receives content; it does not present it. A person has to recognize it as a field before reading its label. In a dark theme a slightly darker, inset fill does this well. In a light theme a white field on a light gray surface, or a clear border on white, does the same. In both, the boundary has to be visible.

**Why labels above?** A label above the field stays visible while typing, tolerates long translations, and gives one straight line to scan down the form. Placeholder text disappears on input and usually fails contrast.

**Why validate on blur?** Checking on every keystroke scolds people mid-word. Checking on blur or submit, then rechecking as they correct, tells them at the moment they can act on it.

## Focus

**Why a strong ring?** People who navigate by keyboard have no other way to know where they are. A slightly darker border does not meet that need. A 2px outline with a small offset, in a color that stands out from both the control and the page, does.

**Why `:focus-visible`?** It shows the ring to keyboard users without flashing it on every mouse click. That removes the usual reason for hiding focus altogether.

## Buttons

**Why one primary per view?** The primary style says "this is the next step". Two of them say nothing. Rank the actions: one filled primary, secondary actions outlined or tonal, tertiary actions as text.

**Why more horizontal padding than vertical?** Text is wide and short. Equal padding on all sides makes a button look cramped at the ends and tall in the middle. About twice as much horizontal as vertical looks even.

**Why label with the action?** "Save changes" and "Delete project" can be understood without reading anything else. "OK" and "Submit" cannot.

**Why hold back the danger color?** If every delete link is red, red stops meaning anything. Use it where the destruction is actually confirmed.

## Navigation and sidebars

**Same background as the content, or different?** A sidebar on the same canvas with a quiet divider makes the app read as one calm space. A light gray or darker sidebar separates navigation from content more firmly, which helps when the content area is busy. Both work. Choose by how far the navigation should recede.

**Why mark the current location strongly?** Without it, every page looks like every other. The current item needs a mark that does not rely on color alone: a filled background, a change of weight, an indicator bar.

## Overlays

**Why a level above the parent?** A menu that matches the card it came from blends into it. One step up in elevation puts it in front: a shadow in a light theme, a lighter surface and firmer border in a dark one.

**Why a scrim under dialogs?** Dimming the page says the rest is unavailable for now, and gives the dialog a quiet ground.

**Why not a dialog for everything?** A dialog hides the page the person may need to look at. Long forms, and anything that needs reference to what is behind it, belong on a page or in a side panel.

## Cards

**When does a card earn its edge?** When it holds one discrete object that is repeated (a product, a file, a message) or that acts as a single target. A section of a page is not an object. Wrapping sections in cards adds edges that compete with the content, and nesting cards multiplies the noise.

## Tables and data

**Why right-align numbers?** Digits line up by place value, so magnitudes compare at a glance. Tabular figures keep the columns steady.

**Why quiet headers?** Column headers are labels. The data is the content, so headers sit smaller and lower in contrast.

**Why row dividers instead of a full grid?** Rows are the unit people scan. A faint horizontal line guides the eye along a row. Vertical lines mostly add clutter.

## Loading, empty and error

**Why treat these as first-class?** They are what a person sees at the most uncertain moments: first use, a slow network, something broken.

- A skeleton shaped like the content keeps the layout stable and makes the wait feel shorter.
- An empty state is often the first screen of the product, so it should say what belongs here and offer the first action.
- An error should say what happened and what to do next, in plain words.

## Adapting values

Every number in this skill is a starting point. Warmer or cooler neutrals, a different lightness progression, sharper or rounder corners, denser or looser spacing: all of these change with the brief. The reasons above do not. When a value looks wrong in context, go back to the reason and choose the value that satisfies it.
