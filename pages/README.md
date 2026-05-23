# pages/

This folder exists for a technical reason and should remain empty.

## Why is it here?

Next.js App Router is configured in the `app/` folder at the project root.
Without this `pages/` folder at the root, Next.js will treat `src/pages/`
as a Pages Router — even if you are using App Router — which will break the build.

## What is `src/pages/`?

`src/pages/` is part of the Feature-Sliced Design (FSD) architecture.
It contains page-level components (slices) that are imported by the Next.js
`app/` routing layer via re-exports.

```tsx
// app/example/page.tsx
export { ExamplePage as default, metadata } from '@/pages/example'
```

## Rule

Do not add any files or routes here.
All routing lives in `app/`, all page logic lives in `src/pages/`.
