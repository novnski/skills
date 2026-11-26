# Pieces: one object the person acts on

For a game, a toy, an instrument, a kiosk, a configurator, a fitting room, a visualizer, a scoreboard, a studio for making one thing. The person came for one object and for what happens when they touch it. Read this before writing the brief for one.

## Contents

- What a piece is, and what it is not
- What the measurements say
- The object
- The furniture
- The first frame
- Response
- The look
- Pictures that change
- What still holds
- What the script checks

## What a piece is, and what it is not

A piece has one object on the screen, and everything the person does is done to it: they build it, tune it, play it, dress it, read it off from across the room. Take the object away and nothing is left.

It is not a product screen, which someone works in every day among other screens: an editor, a dashboard, a timetable, a settings page. That is utility, and there the design recedes. It is not a page that is read from top to bottom: that is a site.

The test: does the request describe one thing that changes as the person acts on it, and is that thing the reason to be there? Then it is a piece, even when it also takes an order or a booking.

## What the measurements say

Ten builds of this kind were made with an earlier version of this skill, which had no register for them. It filed them under product screens and commerce, where the design is meant to recede, and the builds obeyed: a header, a page title, the object in a panel, a column of controls beside it.

- All ten fit on one screen. Nothing below the first screen was doing any work, so a rule about scrolling scenes has nothing to say here.
- In the six whose object was a picture or a drawing, it covered 30% to 69% of the first screen, with a median of 42%. On 33 expressive real sites the largest picture covers a median of 80%, and 60% or more on two thirds of them (`references/showpiece.md`).
- In the two builds where the object covered more than 60%, it ran to the edges of the screen and the controls sat on it or under it. In the four where it covered less than half, it sat inside a panel, with the controls in a separate column.

So the failure of a piece is not ugliness. It is furniture: a header, a title, a box and a side column, with the object as one tile among them. The floor below is the one a showpiece has, for the same reason.

## The object

- Name it on the Object line of the brief: what it is, what it shows before anyone touches it, and what each action changes on it.
- It fills the first screen. It covers 60% of the screen or more, and it runs from one edge of the screen to the opposite edge, with no margin, border or rounded corner around it.
- Mark its element with the attribute `data-stage`. One element only. `look.mjs` measures that element. Mark the object, not the page around it: the script fails a stage that holds running text.
- It keeps its position and its scale when a choice changes. What changes is the object, never where it sits.
- On a phone it still comes first and still takes most of the screen. The controls dock under it, within reach of a thumb.

## The furniture

- No band across the top with a logo and navigation, unless there really is somewhere else to go. The name of the piece sits small, on the object or at an edge.
- No page title above the object. The object is the title.
- Controls sit on the object, where the thing they change is, or dock along one edge: the bottom, or one side. One group, not two.
- No card around the controls. A dock is part of the screen's edge. It has no shadow, no rounded box and no heading of its own that repeats what the controls say.
- A price, a score or a total sits with the action it belongs to.
- Help is one line, or it is not there. A piece that needs a paragraph of instructions before it can be used is not finished.

## The first frame

- It opens finished: a made thing, a set scene, a game already inviting a move. Never an empty canvas, a blank form or a start button in the middle of nothing.
- The first frame is the best frame. It is what someone would photograph.
- If the request gives an opening state, that state is the first frame, exactly.

## Response

- Every choice changes the object visibly and at once: within a tenth of a second, in the place the person is looking.
- The state is read off the object. A list of the choices made is a second copy.
- One authored response belongs to this subject and no other. Write it on the Moment line: what the person does and what happens. It serves the object, and the piece works without it.
- Motion follows `references/interaction.md`. Under `prefers-reduced-motion: reduce` every change is immediate. No sound until the person asks, and then a visible way to stop it.

## The look

- The object carries the look at full strength: color, material, light, drawing, lettering. This is where the extravagance goes.
- The dock is quiet. It takes its few colors from the object, and its type from the same family.
- A supplied look (`Look: supplied` in the brief) covers the whole screen, the dock included.
- The background behind the object is part of the object: a room, a surface, a field of its color. It is not the gray page of a product screen.

## Pictures that change

A piece usually needs a picture that responds: a dessert that takes on the chosen flavor, a figure that wears the chosen length, a poster whose plates move. One flat picture with controls beside it that do not change it is the commonest failure.

- Build the object from layers, one for each thing a choice can change. Generate or draw every layer in the same view, at the same scale and under the same light, with a transparent ground, so they register when stacked.
- Or draw it in SVG or on a canvas, when its parts are simple enough to draw well. Geometry, type, pattern and flat color draw well. Faces, hands, animals and food do not: generate those.
- Check every combination a person can reach, not only the opening one. A layer that floats, clips or changes scale is a broken piece.
- Say at hand-over which pictures were generated.

## What still holds

- Every control works by keyboard, has a visible focus and a name, and is large enough to touch.
- The controls come from UI SDK, and the agent bridge is connected (`references/ui-sdk.md`). A hotspot on the object is a control too.
- Two font families at most. Text contrast holds over the object: check it on the capture.
- No part of the screen is dressed as a sheet of paper, a ticket or a tag, unless that thing is the object.
- Facts are looked up or listed as made up. An unofficial piece about a real thing says so.

## What the script checks

When the design record says `Register: piece`, `scripts/look.mjs`:

- fails a page with no element marked `data-stage`, or with more than one;
- fails a stage that covers less than 60% of the first screen at desktop width;
- fails a stage that does not run from one edge of the screen to the opposite edge;
- fails a stage that holds more than 80 words of text: that is a page, not an object;
- lifts the limit on headline size, the checks on a block beside the headline and on the split first screen, the drawing check for pictures inside the stage, and the check on a band of facts under the first screen (a score or a total docks there).

Every other check still runs. The limits are floors. A stage at exactly 60% beside a full-height dock passes, and a stage that takes the whole screen with the controls on it is usually better.
