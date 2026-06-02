import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import { LegalDocumentPage } from './LegalDocumentPage'

const meta = {
  title: 'pages/LegalDocumentPage',
  component: LegalDocumentPage,
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
} satisfies Meta<typeof LegalDocumentPage>

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
