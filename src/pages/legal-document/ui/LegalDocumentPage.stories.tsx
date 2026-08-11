import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import { LegalDocumentPage } from './LegalDocumentPage'
import { PrivacyPolicyPage } from './PrivacyPolicyPage'

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
  render: () => <PrivacyPolicyPage />,
  parameters: {
    nextjs: {
      navigation: {
        pathname: '/privacy-policy',
      },
    },
  },
}
