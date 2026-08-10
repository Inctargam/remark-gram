import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect } from 'storybook/test'

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

export const TermsOfService: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('heading', { name: 'Terms of Service' })).toBeVisible()
    await expect(canvas.getByRole('link', { name: 'Back to Sign Up' })).toHaveAttribute(
      'href',
      '/sign-up'
    )
    await expect(canvas.getByText(/Lorem ipsum dolor sit amet/)).toBeVisible()
  },
}

export const PrivacyPolicy: Story = {
  render: () => <PrivacyPolicyPage />,
  parameters: {
    nextjs: {
      navigation: {
        pathname: '/privacy-policy',
      },
    },
  },
  play: async ({ canvas }) => {
    const databaseLink = canvas.getByRole('link', {
      name: 'Countries States Cities Database',
    })
    const licenseLink = canvas.getByRole('link', { name: 'Open Database License 1.0' })

    await expect(databaseLink).toHaveAttribute('target', '_blank')
    await expect(licenseLink).toHaveAttribute('target', '_blank')
    await expect(canvas.getByText(/Location data is provided by/)).toBeVisible()
    await expect(canvas.getByText(/Lorem ipsum dolor sit amet/)).toBeVisible()
  },
}
