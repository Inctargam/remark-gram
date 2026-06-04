# Project Instructions

## Next.js

This is NOT the Next.js you may know from older projects.

The project uses Next.js 16. Before changing framework-specific code, read the relevant guide in `node_modules/next/dist/docs/`. APIs, conventions, routing behavior, and file structure may differ from older Next.js versions. Follow deprecation notices.

## Package Manager

Use `pnpm` only.

- Install dependencies with `pnpm install`.
- Run scripts with `pnpm <script>` or `pnpm run <script>`.
- Do not introduce `package-lock.json`, `yarn.lock`, or npm/yarn commands.
- Keep dependency versions pinned when adding or updating packages; do not use `^` or `~` for new dependencies.

## Architecture

Use Feature-Sliced Design (FSD). Do not use the classic "feature folder" structure as the project architecture.

Next.js routing is an exception to the FSD folder layout. The framework-level `app` directory at the project root is required for Next.js routing only.

- Keep route segments, `layout.tsx`, `page.tsx`, `loading.tsx`, `error.tsx`, route handlers, and other Next.js routing files in the root-level `app`.
- Keep route files thin: compose pages/widgets/features from `src`, but do not place business logic there.
- Do not treat the root-level `app` directory as the FSD `app` layer.
- The FSD app layer lives in `src/app` and contains providers, app initialization, global setup, and app-level configuration.

The expected source layers are:

- `src/app` - app initialization, providers, global setup.
- `src/pages` - page-level compositions.
- `src/widgets` - large independent UI blocks assembled from features/entities/shared.
- `src/features` - user actions and business scenarios.
- `src/entities` - business entities and their model/ui/api.
- `src/shared` - reusable infrastructure, UI kit, libs, config, API clients, types.

FSD rules:

- Prefer layer imports from lower layers only.
- Do not import from higher layers into lower layers.
- Use public APIs via `index.ts` where a slice exposes reusable code.
- Keep slice internals private unless they are intentionally exported.
- Place shared utilities in `src/shared`; place local utilities near the slice/component that owns them.

## Naming

- React component files: `PascalCase.tsx`.
- Non-component files: `camelCase.ts`.
- Storybook files: `ComponentName.stories.tsx`.
- Tests: `name.test.ts` or `name.test.tsx`; test folders may be named `__tests__`.
- Variables, objects, arrays, and functions: `camelCase`.
- Constants: `CONSTANT_CASE`.
- Enums: `PascalCase`; do not use `const enum`.
- Types should not end with `Type`.
- Local component props are named `Props`.
- Exported component props use the entity name, for example `ButtonProps`.

Avoid:

- One-letter variable names except simple loop counters.
- Abbreviations that reduce readability.
- Meaningless names such as `foo`, `data1`, `temp`.
- Leading underscores in ordinary variable names.

## React

- Do not use `React.FC` for component typing.
- Destructure props in the function signature.
- Keep one React component per file.
- Prefer `Fragment` (`<>...</>`) over unnecessary wrapper elements.
- If component logic grows beyond roughly 20 lines, move related logic into a custom hook.
- Keep components reasonably small; split components before they become hard to scan.
- Name event handlers with the `Handler` suffix, for example `submitHandler`.
- Extract complex boolean expressions into named variables.
- Prefer positive boolean conditions over negated branching when readability improves.
- Use braces for single-line `if` blocks.

Component file order:

1. Imports.
2. Types.
3. Local constants.
4. Component declaration.
5. Hooks/state/selectors/actions.
6. Effects.
7. Handlers and callbacks.
8. JSX return.

## TypeScript

- Keep TypeScript strict and explicit where it improves readability.
- Prefer type-only imports for types: `import type { Foo } from './foo'`.
- Use `as const` object maps when they are clearer than enums.
- Avoid `any`; use `unknown` and narrow it.
- Do not create broad `utils.ts` dumping grounds. Split utilities by responsibility.

## Imports And Exports

- In Next.js code, use the project alias `@/*` for source imports when appropriate.
- Prefer named exports.
- Avoid `export default` except where required by Next.js, Storybook/config tooling, dynamic imports, or third-party conventions.
- Use `index.ts` as a public API for FSD slices and shared modules.
- Do not import through deep private paths when a public API exists.

## Comments

- Comments should explain non-obvious decisions, not restate the code.
- Write comments in English.
- Prefer JSDoc for exported utilities or APIs that need explanation.
- Do not leave commented-out code in the repository.

## Commands

Common commands:

- `pnpm dev` - start Next.js dev server.
- `pnpm build` - build the app.
- `pnpm lint` - run ESLint.
- `pnpm storybook` - start Storybook on port 6006.
- `pnpm build-storybook` - build Storybook into `storybook-static`.

## Storybook MCP

The project Storybook MCP server is configured for Codex as `inctagram-storybook` and expects Storybook to run at `http://localhost:6006/mcp`.

When working on UI components, always use the `inctagram-storybook` MCP tools to access Storybook component documentation before answering, changing, or composing shared UI:

- Never guess component props, supported variants, or styling options. Check Storybook documentation first, including common-sounding props such as `shadow`, `size`, `variant`, and `color`.
- Query `list-all-documentation` to get the documented component index.
- Query `get-documentation` for the component before using it, and `get-documentation-for-story` when the component docs do not provide enough detail.
- Only use properties and examples that are documented or shown in stories. If a needed property is not documented, ask the user instead of inferring it from naming conventions or other libraries.
- Use `get-storybook-story-instructions` before creating or updating stories.
- Use documented stories as examples for component states and composition.
- Run `run-story-tests` when changing stories or UI behavior.

## Team Changelog

Maintain the root-level `CHANGELOG.md` as the team-visible history of meaningful project changes.
Write and maintain all `CHANGELOG.md` entries in Russian.

Rules:

- Update `CHANGELOG.md` after meaningful code, UI, configuration, architecture, dependency, documentation, or test changes.
- When finishing a task that changes tracked project files, Codex must consider whether `CHANGELOG.md` needs an entry and update it in the same turn unless the user explicitly asks not to.
- Do not update it for purely exploratory work, failed attempts, temporary debugging, formatting-only churn, or personal local activity.
- Do not copy raw command logs, personal local notes, local activity files, or temporary debugging traces into `CHANGELOG.md`.
- Write entries as concise team-facing summaries: more detailed than a commit title, shorter than a PR description.
- Group changes by domain, for example `Auth`, `Shared UI`, `Storybook`, `App Styles`, `Tooling`, `Tests`, `Documentation`.
- Prefer describing the final project state, not every implementation step.
- Include verification commands that were actually run. If important checks were not run, say so explicitly.
- Keep entries under `## Unreleased` until the project introduces versioned releases.
- When reconstructing an entry from an existing commit or merge, mention the commit hash in `Notes` or `Verification`.

Use this format:

```md
## Unreleased

### YYYY-MM-DD

#### Area Name

- Describe completed, user-visible or team-relevant changes.
- Mention important architectural or behavioral decisions when they affect future work.

#### Verification

- `pnpm lint` passed.
- `pnpm build` passed.
- Storybook tests were not run because Storybook was not available.

#### Notes

- Mention migrations, API changes, unresolved follow-ups, or reconstruction from commits when relevant.
```

## Generated Files

- `storybook-static` is generated by Storybook and can be deleted/recreated.
- Do not commit generated build output unless the task explicitly requires it.

## Commit Messages

Use the project/task prefix when available, then a lowercase conventional type:

```text
ST-1057 feat: add sign in form
```

Allowed types:

- `init`
- `feat`
- `fix`
- `refactor`
- `test`
- `docs`
- `chore`
- `build`
- `ci`

Use present tense and imperative mood.
