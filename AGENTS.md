# Working in this repository

This repository holds agent skills in the [Agent Skills](https://agentskills.io/) format. People install them with `npx skills@latest add novnski/skills --skill <name>`.

## Layout

- `skills/<name>/SKILL.md`: one folder per skill. The folder name is the skill's name.
- `skills/<name>/references/`: documents the agent reads when it needs them. Keep them one level deep and name each one in `SKILL.md` with a line on when to read it.
- `skills/<name>/scripts/`: tools the agent runs. They must work with nothing to install.
- `scripts/validate.mjs`: checks every skill. It runs on every push and pull request.
- `.github/assets/`: pictures for the README. Nothing in here is installed with a skill.

## Rules for a skill

- `SKILL.md` starts with frontmatter. `name` and `description` are required. `license`, `compatibility`, `allowed-tools` and `metadata` are the only other keys.
- `name` is lowercase letters, digits and hyphens, 64 characters at most, and the same as the folder name.
- `description` says what the skill does and when to use it, in 1024 characters at most. An agent decides from this line alone whether to load the skill.
- Keep `SKILL.md` to about 500 lines. Move detail into `references/`.
- A skill holds only what an agent needs to do the work: no README, changelog or notes about how the skill was made.
- Nothing private and no secrets: no local paths, names, tokens or `.env` files.

## Adding or changing a skill

1. Create or edit `skills/<name>/`.
2. Add the skill to the table in `README.md`, with a section that says what it is for and what it needs.
3. Run `node scripts/validate.mjs` and fix what it fails.
4. Check that the CLI finds it: `npx skills@latest add . --list`.
5. Raise `metadata.version` in the skill's frontmatter when its behavior changes.
