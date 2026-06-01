import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import { LegalPlaceholderPage } from './LegalPlaceholderPage'

const meta = {
  title: 'pages/LegalPlaceholderPage',
  component: LegalPlaceholderPage,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    nextjs: {
      navigation: {
        pathname: '/terms-of-service',
      },
    },
  },
  args: {
    title: 'Terms of Service',
  },
} satisfies Meta<typeof LegalPlaceholderPage>

export default meta

type Story = StoryObj<typeof meta>

export const TermsOfService: Story = {}

export const PrivacyPolicy: Story = {
  args: {
    title: 'Privacy Policy',
  },
  parameters: {
    nextjs: {
      navigation: {
        pathname: '/privacy-policy',
      },
    },
  },
}
