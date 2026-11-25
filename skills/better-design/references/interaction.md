# Interaction, motion and small details

These are the details a person feels without naming. Each is small, and a page that gets most of them right reads as built with care. Read the section that matches what you are building.

## Contents

- Motion
- States and feedback
- Forms
- Overlays
- Touch and small screens
- Content that misbehaves
- The parts the browser draws
- Before it ships

## Motion

Decide in this order.

**1. Should it move at all?** Go by how often the person will see it.

| Seen | Decision |
|---|---|
| Hundreds of times a day (keyboard shortcuts, a command palette, switching tabs) | No animation |
| Tens of times a day (hover, moving through a list) | None, or barely any |
| Occasionally (a dialog, a drawer, a toast) | A short, standard transition |
| Rarely or once (first run, a success moment, a marketing page) | Room for something authored |

Anything triggered from the keyboard does not animate.

**2. What is it for?** Showing where something came from or went, showing that a state changed, confirming a press, or softening a change that would otherwise jump. "It looks good" is not enough for anything seen often.

**3. Which easing?** Something entering or leaving: ease-out, so it responds at once. Something moving across the screen: ease-in-out. A color or opacity change on hover: the plain default. Constant motion such as a progress bar: linear. Never ease-in for interface motion, because it starts slowly and feels late.

**4. How long?**

| What | Duration |
|---|---|
| Press feedback | 100–160ms |
| Tooltip, small popover | 125–200ms |
| Menu, dropdown | 150–250ms |
| Dialog, drawer, sheet | 200–500ms |

Interface motion stays under 300ms apart from dialogs, drawers and sheets.

**Rules that hold everywhere**

- Animate `transform` and `opacity`. Animating width, height, top, left, margin or padding makes the page stutter.
- Never write `transition: all`. Name the properties.
- Nothing appears from `scale(0)`. Start near full size (0.95) with opacity 0.
- A popover or menu grows from the thing that opened it: set `transform-origin` to the trigger. A dialog stays centered.
- A button gives slightly under the finger: `transform: scale(0.97)` on `:active`.
- Motion can be interrupted. Use transitions for interface state so a second click reverses cleanly.
- After the first tooltip in a group has opened, the next ones open at once.
- On a marketing page, one authored moment (a load sequence, a single reveal) is worth more than the same fade-up on every section and a lift on every card.
- Under `prefers-reduced-motion: reduce`, replace movement with a quick fade and make sure nothing stays hidden.
- A loop that runs longer than five seconds can be paused, and stops when it is off screen.

## States and feedback

- Hover, pressed and focus are each more prominent than rest. They gain contrast.
- Every press is answered at once: pressed state, then progress or an optimistic update, then confirmation.
- A button that starts a request stays enabled until the request starts, then shows progress without changing width.
- Loading shows a skeleton in the shape of the content. A spinner is for a short wait with nothing to outline.
- A destructive action asks for confirmation or offers undo. It never happens on a single click.
- State that a person would expect to survive a reload or a shared link lives in the URL: filters, the sort, the page, the open tab.
- Links are real links, so they open in a new tab on request.
- Nothing on screen is a dummy. A link with `href="#"` or a button with no action is a picture of a control. Make it work, remove it, or disable it visibly (`disabled` or `aria-disabled="true"`) and say so at hand-over.
- A status is shown once. Colored text with an icon, a dot with plain text, or a tinted chip with text: choose one way for the whole product. A dot inside a tinted chip beside the word repeats itself.
- A dot means a state that can change. It never sits beside a title, a note or a label that is always the same.

## Forms

- A visible label for every field, and clicking the label focuses the field. A checkbox or radio and its label form one target.
- The right `type`, `inputmode` and `autocomplete`, and a meaningful `name`.
- Never block paste. Never disable zoom.
- Errors appear beside their field and say how to fix it. On submit, focus moves to the first error.
- Turn off spellcheck for codes, usernames and email addresses.
- Warn before leaving with unsaved changes.

## Overlays

- Use a dialog only when the task needs the person's whole attention. A side panel or an inline editor is often better when they need to see the page behind.
- Focus moves into the overlay when it opens and back to the trigger when it closes. Escape closes it.
- `overscroll-behavior: contain` stops the page behind from scrolling.
- A menu or select that offers choices shows what the person needs to choose well, beside each option.

## Touch and small screens

- Targets are at least 44px on touch screens, with space between them, even when the visible mark is smaller.
- Use `100dvh`, not `100vh`, for full-height layouts, and respect `env(safe-area-inset-*)` on fixed bars.
- Nothing depends on hover alone.
- `touch-action: manipulation` on controls removes the double-tap delay.
- Check the layout at 320, 390, 768 and 1440 wide, not only at the two ends.

## Content that misbehaves

- A flex child needs `min-width: 0` before its text can truncate or wrap.
- Decide for each text container what happens when the content is long: wrap, clamp to a number of lines, or truncate with the full text available.
- An avatar or icon next to text needs `flex-shrink: 0` or it will be squashed.
- `text-wrap: balance` on headings and `text-wrap: pretty` on paragraphs avoid a single word on the last line.
- Numbers that change or sit in columns use `font-variant-numeric: tabular-nums`.
- Headings that are link targets need `scroll-margin-top` so a sticky header does not cover them.
- Every image has `width` and `height` or an aspect ratio, so the page does not shift as it loads.
- An empty list renders its empty state, never a blank area or a broken frame.

## The parts the browser draws

The parts you did not draw still belong to the design. Leaving them at their defaults is one of the quickest ways to tell a page was assembled and not finished.

- `color-scheme` on the root, so native controls and scrollbars match the theme.
- `accent-color` for checkboxes, radios and range inputs.
- `::selection` in a color from the palette that keeps the text readable.
- `caret-color` in text fields.
- `scrollbar-color` where a scrolling region is part of the layout.
- `text-underline-offset` and `text-decoration-thickness` on links.
- `<meta name="theme-color">` matching the page background.

## Before it ships

A page that will be published has these, and the project's check script reports any that are missing:

- `lang` on the root element, a real `<title>` and a meta description.
- An icon, and a social preview image (`og:image`, about 1200 by 630).
- A not-found page in the same voice as the rest.
- No console errors on load or while using each control.
