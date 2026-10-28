# Claude project setup

`CLAUDE.md` contains the website brief and development workflow. `rules/design.md` records the no-emoji, bespoke-design requirements. `rules/security.md` requires inspection before executing repository code.

Two project agents are defined under `.claude/agents/`:

- `frontend` implements and reviews website changes, with the three reviewed skills preloaded.
- `project-manager` organizes scope, plans, handoffs, and acceptance review. It can delegate application work to `frontend`; it has no shell access.

Start coordinated work with `claude --agent project-manager`, or focused implementation with `claude --agent frontend`, from the repository root. You can also ask the current Claude session to use either agent. Both inherit the session model. No hooks, MCP servers, or permission overrides are added. Restart Claude Code after this first creation of the project's `agents` directory, then check `/agents` for the definitions.

Agent format and delegation behavior follow the [Claude Code subagent documentation](https://code.claude.com/docs/en/sub-agents). Creating the definitions does not start an agent or authorize a redesign.

Three project skills are installed and discoverable under `.claude/skills/`:

- `design-review`: visual hierarchy, typography, spacing, responsive behavior, and interactions, from Jezweb.
- `react-patterns`: React performance and component composition, from Jezweb.
- `nextjs-developer`: frontend App Router and static rendering, adapted from Jeffallan.

Each skill includes its upstream MIT license. `skill-sources.json` records the exact source commits and adaptations; `security/reviewed-files.json` records local file hashes and source tree inventories. Restart Claude Code or open a new session in this directory to discover the skills. They are project-local, not global installations.

Whole upstream plugins remain explicitly disabled in `settings.json`. The selected skills work independently of those plugins. No upstream hooks, permissions, commands, agents, MCP configuration, or deployment automation were installed. In particular, Jezweb's root prompt hook was excluded. Do not register or enable the complete bundles as a shortcut to using these skills.

Read `SECURITY-REVIEW.md` for findings, review boundaries, and what must be checked before execution. The original HTML/CSS website is checked out at the project root; no framework migration, package installation, site execution, or deployment has occurred. Keep `.repo-review/` as ignored source-review material, not application content.
