# UI SDK: behavior for every web front-end

A web front-end built with this skill uses UI SDK (`https://github.com/vercel-labs/ui`, docs at `https://ui-sdk.dev/docs`) for the behavior of its controls. This file says when it applies, how to load it, and how it divides the work with this skill. UI SDK's own documentation says how to use each component: read that, not your memory of other libraries.

## What it is

A library of interface behaviors: keyboard navigation, focus, selection, dismissal, popups, drag and drop, and the ARIA they need. Its components render no styles of their own. It also lets an agent read the page's controls by name and call their actions directly, so the same page works for a person and for an AI acting for them.

Packages: `@ui-sdk/core`, and one adapter: `@ui-sdk/react`, `@ui-sdk/vue`, `@ui-sdk/svelte`, `@ui-sdk/solid`, or `@ui-sdk/web` (web components, for plain HTML).

It is in beta. Its API may change, so read the docs for the version you install and say at hand-over which version the page uses.

## When it applies

- Any new website, web app or web page: yes, by default.
- A project that already uses UI SDK: yes.
- A project that already has another component or primitives library (Radix, React Aria, Base UI, Headless UI, shadcn/ui, MUI): keep what is there. Offer UI SDK at hand-over; do not migrate unasked.
- The user names another component library, says not to use UI SDK, says no external libraries, or says the page must work offline: follow the user.
- The user asks for plain HTML, CSS and JavaScript, a static page, a single file or no build step: yes, use it. That is not another stack. UI SDK's web components are HTML tags, loaded by one script tag.
- Anything that is not a web front-end (a native app, an email, a PDF, a slide, a picture): no.

## How to load it

- **A project with a framework and a package manager.** Install `@ui-sdk/core` and the adapter for the framework, at the same version, with the project's package manager.
- **A page with no build step.** Bundle the library into one local file and load that file with a plain `<script defer>` tag:
  1. In a temporary folder outside the project, install `@ui-sdk/web` and `@ui-sdk/core` at the same version.
  2. Write an entry file that imports each component the page uses (`import "@ui-sdk/web/button"`) and creates the agent bridge (see "The agent bridge").
  3. Bundle the entry into one browser file with the bundler on the machine.
  4. Put that file beside the page, with the library's LICENSE file, and keep the entry file next to it so the bundle can be made again.

  The page then opens from disk, works offline and stays on one version.

`ui-sdk.dev` also serves the components for two tags in the `<head>` (`web@0.js` and `web@0.css`). Use that to try a component, not to ship a page: the page would need the network, and that copy carries no agent bridge.

## What to read before writing a control

1. If the `ui-sdk` skill is installed, follow it. (It is added with `npx skills@latest add vercel-labs/ui --skill ui-sdk`.)
2. Otherwise read the docs that ship with the package: `node_modules/@ui-sdk/<framework>/docs/llms.txt` first, then only the component pages you need. On a page with no build step, read `https://ui-sdk.dev/web.md`.

Do not guess tag names, props or events. They are in those docs.

## The division of work

**UI SDK decides how a control behaves.** Every control comes from it: tabs, menus, dialogs, popovers, selects, comboboxes, accordions, carousels, tooltips, toasts, and also plain buttons, inputs and checkboxes, because an agent can only see and use controls that are UI SDK parts. Never hand-roll a widget with a `role=` attribute when the library ships it, and do not hand-wire a native `<dialog>`.

Loading the library changes nothing by itself. A control becomes a part when it is wrapped in, or replaced by, the library's element or component: `<ui-button><button>Save</button></ui-button>` on a plain page, `<Button>` in React. Each component's page shows its markup. A tag name that is guessed is silent in the browser: the element stays undefined and does nothing.

A plain Button part still needs its action. Wrapping a button that does nothing does not make it work.

Links stay links. A native `<details>` may stay as it is.

**This skill decides how it looks.** The brief, the tokens and every rule in this skill apply unchanged.

- `web.css` is the library's optional default look. A stock library look is recognizable at a glance, so it is never left as it comes. Either map its `--ui-*` tokens to this project's tokens and restyle every part that still shows the default, or leave `web.css` out and style each part yourself.
- Style parts from their `data-slot` and state attributes (such as `data-open`), with this project's tokens. No inline styles for state.
- Put `@layer ui-sdk;` at the top of the global stylesheet, so your own rules win.
- The corner character, the one button shape, the accent and the type come from the brief, not from the library.

**Both agree on names.** Every control has a visible label or an `aria-label`. People using screen readers and agents both find a control by its name.

## The agent bridge

The bridge is what lets an agent read the page's controls and call their actions. It is half the reason this library is the default, so every page with UI SDK parts has one. Two calls, made once, in browser code:

```js
import { createAgent, registerTools } from "@ui-sdk/web/agent"; // or the agent entry of the adapter in use

// askThePerson is yours to write: it shows step.confirm in the page's confirmation dialog and resolves to true or false
const agent = createAgent({ allow: (step) => (step.confirm ? askThePerson(step.confirm) : true) });
registerTools(agent, { allow: () => true });
```

- `createAgent` builds the bridge. `registerTools` offers it to a browser's own agent (WebMCP), and does nothing in a browser without one.
- The bridge must come from the same copy of the library as the components: the same bundle, or the same installed packages. A bridge loaded from anywhere else sees no components (measured on 0.1.0-beta.17).
- `allow` decides each step. A step that carries `confirm` needs a person: ask them with the page's own confirmation dialog and return their answer. Ask in one place, so the second `allow` returns `true`.
- Mark what needs a person: `data-agent-confirm="<what it does, said to the person>"` on anything that deletes, pays, sends or books; `data-agent-secret` on a field an agent may fill and never read; `data-agent-hidden` on a region an agent must not see.
- Every control has a name of its own, because a step finds a control by its label. Two controls in one row get different verbs.
- Read the library's Agents documentation before writing this (`docs/agents.md` in the package).

Check it before hand-over: the bridge's `snapshot()` lists every control the task names, by its label, and an `act` step on one of them changes the page.

## What the scripts check

`look.mjs`, on the rendered page (check "controls from UI SDK"):

- fails a page that has a button, field, select, dialog or role widget and no UI SDK;
- fails any such control that is not a UI SDK part, and names it;
- fails a `ui-*` tag that is not a UI SDK element;
- fails when the library's elements did not start (a wrong address, or no network);
- passes a page with no controls, and a project whose `package.json` already lists another component library;
- still fails a plain Button part that has no action of its own ("controls that do nothing").

Only the user's own words lift this check. Quote them: `--ui-sdk-ruled-out "<their words>"`. The words must name another component library, say no UI SDK, say no external libraries, say the page must work offline, or show that the work restyles a front-end that already exists. The check then reports and does not fail, and the words are repeated at hand-over. Words about plain HTML, a static page or no build step leave it a FAIL.

`look.mjs`, on the running page (check "agent bridge"):

- fails a page whose controls are UI SDK parts and which registers nothing for an agent;
- passes when the page registers the library's tools (`snapshot`, `query`, `act`).

It counts registrations only. It does not check the names, or what `allow` lets through. The user's own words lift it: `--no-agent-bridge "<their words>"`, when they say the page must not be operable by an AI agent.

## Before hand-over

- Run this skill's `check.mjs` and `look.mjs` as usual. They read the rendered page, whatever built it.
- Say at hand-over: the UI SDK version and that it is in beta, where the bundle and its entry file are, that an agent bridge is connected and which controls ask a person first, and anything in the library's docs that turned out wrong.
