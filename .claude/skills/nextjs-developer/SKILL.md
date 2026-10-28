---
name: nextjs-developer
description: Build frontend Next.js App Router websites with TypeScript, static rendering, metadata, and small interactive client components. Use for Next.js pages, layouts, routing, and static export in this portfolio project.
license: MIT
metadata:
  author: https://github.com/Jeffallan
  adapted-for: z00mj frontend portfolio
  source-commit: 28bbf8954db78669f1cdb07f96693b5ee7664fee
---

# Next.js Developer

Adapted from Jeffallan's Next.js developer skill for this frontend-only project. Preserve the App Router, metadata, component-boundary, and production-validation guidance. Backend, Server Action, runtime caching, and deployment recipes are intentionally excluded.

## Project boundaries

Read the root `CLAUDE.md` and `.claude/rules/security.md` before execution. Security inspection must cover the exact code and dependency execution paths before install, build, test, or preview commands. This skill does not authorize deployment or new external services.

- Prefer App Router layouts and pages with TypeScript. Keep non-interactive content in build-time components and push client boundaries down to interactive controls.
- Store portfolio content locally. Do not add databases, API routes, Server Actions, authentication, runtime SSR, or ISR.
- Use the metadata API for titles, descriptions, canonical URLs, and social previews. Use truthful project content and actual asset paths.
- Follow the no-emoji design brief. Establish typography, layout, palette, and imagery deliberately rather than copying a framework template.
- Verify version-sensitive APIs against the installed version and official documentation. Upstream examples target older Next.js versions; examples in retained references are illustrative, not ready-made project code.

## Implementation workflow

1. Inspect existing routes, assets, package scripts, and hosting. Preserve working URLs and content during a migration.
2. Define route layouts, semantic sections, and the required interactive components. Use client components for state, effects, events, and browser APIs only where needed.
3. Render trusted local content as JSX text. Do not introduce `dangerouslySetInnerHTML` for arbitrary content. Avoid browser globals during build-time rendering.
4. Add accessible navigation, focus states, meaningful alt text, and error/loading states where the actual interaction needs them. Respect reduced motion.
5. Optimize images and reserve their dimensions. For static hosting, use a reviewed static-compatible loader or unoptimized local images instead of requiring an image server.
6. After security review, run relevant existing type, lint, and production build commands. Inspect local pages at mobile, tablet, and desktop sizes and verify keyboard interactions. Report checks unavailable in the environment.

## Static hosting

For GitHub Pages, configure `output: 'export'` and confirm the exported `out/` directory contains working pages and assets. Generate all dynamic route parameters at build time. Keep the root base path for this user-site repository unless the actual hosting URL requires otherwise. Static export does not support runtime server features.

Do not install a global deployment CLI or publish automatically. Confirm the project's actual hosting configuration before changing it.

## References

- [App Router frontend excerpts](references/app-router.md): layouts, metadata, and route structure. The directory illustration also shows routes outside this project's scope; do not create those backend routes.
- [Client component excerpts](references/server-components.md): event/state boundaries and provider composition.

Source: [Jeffallan/claude-skills](https://github.com/Jeffallan/claude-skills/tree/28bbf8954db78669f1cdb07f96693b5ee7664fee/skills/nextjs-developer). Original license is included alongside this file.

[Documentation](https://jeffallan.github.io/claude-skills/skills/frontend/nextjs-developer/)
