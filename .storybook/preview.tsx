import '@/app/styles/globals.css'

import type { Preview } from '@storybook/nextjs-vite'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const preview: Preview = {
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <QueryClientProvider client={new QueryClient()}>
        <Story />
      </QueryClientProvider>
    ),
  ],
  parameters: {
    // Монтирует App Router контекст для всех stories.
    // Без этого useRouter/usePathname бросают "invariant expected app router to be mounted".
    // Отдельные stories переопределяют pathname через parameters.nextjs.navigation.
    nextjs: {
      // Монтирует AppRouterContext — нужен для useRouter из next/navigation.
      // Без этого Storybook использует PageRouterProvider и useRouter бросает
      // "invariant expected app router to be mounted".
      appDirectory: true,
      navigation: {
        pathname: '/',
      },
    },

    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },

    docs: {
      controls: {
        sort: 'requiredFirst',
      },
      toc: true,
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: 'todo',
    },
  },
}

export default preview
