import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { storybookTest } from '@storybook/addon-vitest/vitest-plugin'
import { playwright } from '@vitest/browser-playwright'
import { defineConfig } from 'vitest/config'

const dirname =
  typeof __dirname !== 'undefined' ? __dirname : path.dirname(fileURLToPath(import.meta.url))

// More info at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon
export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(dirname, 'src'),
    },
  },
  test: {
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      // Thresholds are scoped to the posts CRUD code and the payments/subscriptions code —
      // the rest of the project predates the test setup and would drag the numbers below
      // any useful gate.
      // Listed slice by slice on purpose: a 'src/features/*-post/**' glob would also
      // pull in features/create-post, which belongs to another task and is not covered here.
      include: [
        'src/entities/post/**',
        'src/features/edit-post/**',
        'src/features/delete-post/**',
        'src/features/post-actions/**',
        'src/widgets/profile-posts/**',
        'app/api/mock/posts/**',
        'src/entities/subscription/**',
        'src/entities/payment/**',
        'src/shared/api/mock/subscriptionsStore.ts',
        'app/api/mock/subscriptions/**',
        'app/api/mock/payments/**',
        'app/api/mock/_mock/**',
        'src/widgets/account-management/**',
        'src/widgets/my-payments/**',
        'src/shared/lib/date/**',
      ],
      // Only what the `unit` project can actually execute is measured. The project runs in
      // `node` and the repo has no jsdom/RTL, so components and React hooks cannot be
      // rendered here — they are covered by `play` tests in the `storybook` project, whose
      // coverage is not collected. Leaving them in would make the number track the amount
      // of UI files instead of the amount of testing.
      exclude: [
        '**/*.stories.tsx',
        '**/index.ts',
        '**/*.module.css',
        // Components: covered by story `play` tests.
        '**/*.tsx',
        // React hooks: need a DOM and a QueryClient, so their logic is extracted into
        // pure functions (`shouldFetchNextPage`, `flattenPostsPages`) which are covered.
        '**/use*.ts',
        // Route files are thin re-exports; the handlers behind them are tested directly.
        '**/route.ts',
      ],
      thresholds: {
        lines: 80,
        branches: 80,
      },
    },
    projects: [
      {
        extends: true,
        test: {
          name: 'unit',
          environment: 'node',
          include: ['app/**/*.test.ts', 'src/**/*.test.ts', 'src/**/*.test.tsx'],
        },
      },
      {
        extends: true,
        plugins: [
          // The plugin will run tests for the stories defined in your Storybook config
          // See options at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon#storybooktest
          storybookTest({ configDir: path.join(dirname, '.storybook') }),
        ],
        test: {
          name: 'storybook',
          browser: {
            enabled: true,
            headless: true,
            provider: playwright({}),
            instances: [{ browser: 'chromium' }],
          },
        },
      },
    ],
  },
})
