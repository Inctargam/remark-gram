import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, fn, userEvent, within } from 'storybook/test'

import { Combobox } from './Combobox'

const COUNTRY_OPTIONS = [
  { label: 'Belarus', value: 'BY' },
  { label: 'Poland', value: 'PL' },
  { label: 'United Kingdom', value: 'GB' },
  { label: 'United States', value: 'US' },
]

const CITY_OPTIONS = [
  { label: 'Dzyarzhynsk', value: 'dzyarzhynsk', description: 'Minsk Region' },
  { label: 'Minsk', value: 'minsk', description: 'Minsk City' },
  { label: 'Minsk Mazowiecki', value: 'minsk-mazowiecki', description: 'Masovian' },
]

const meta = {
  title: 'shared/ui/Combobox',
  component: Combobox,
  tags: ['autodocs'],
  args: {
    label: 'Select your country',
    options: COUNTRY_OPTIONS,
    value: null,
    onValueChange: fn(),
  },
  decorators: [
    (Story) => (
      <div style={{ width: 320, minHeight: 320, padding: 24, background: '#171717' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Combobox>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ args, canvas, canvasElement }) => {
    const input = canvas.getByRole('combobox', { name: 'Select your country' })

    await userEvent.type(input, 'bel')
    const body = within(canvasElement.ownerDocument.body)
    await userEvent.click(await body.findByRole('option', { name: 'Belarus' }))

    await expect(args.onValueChange).toHaveBeenCalledWith('BY')
  },
}

export const NoOptions: Story = {
  play: async ({ canvas, canvasElement }) => {
    await userEvent.type(canvas.getByRole('combobox'), 'Mars')

    await expect(
      await within(canvasElement.ownerDocument.body).findByText('No Results')
    ).toBeVisible()
  },
}

export const PrefixSearchIgnoresDescription: Story = {
  args: {
    label: 'Select your city',
    options: CITY_OPTIONS,
  },
  play: async ({ canvas, canvasElement }) => {
    await userEvent.type(canvas.getByRole('combobox'), 'Minsk')
    const body = within(canvasElement.ownerDocument.body)
    const options = await body.findAllByRole('option')

    await expect(options).toHaveLength(2)
    await expect(options[0]).toHaveAccessibleName(/Minsk Minsk City/)
    await expect(body.queryByRole('option', { name: /Dzyarzhynsk/ })).not.toBeInTheDocument()
  },
}

export const OpensAllOptionsFromTrigger: Story = {
  play: async ({ canvas, canvasElement }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Show Select your country options' }))

    await expect(
      await within(canvasElement.ownerDocument.body).findAllByRole('option')
    ).toHaveLength(COUNTRY_OPTIONS.length)
  },
}

export const RestoresSelectedValueOnBlur: Story = {
  args: {
    value: 'BY',
  },
  play: async ({ canvas }) => {
    const input = canvas.getByRole('combobox')

    await userEvent.clear(input)
    await userEvent.type(input, 'Unknown')
    await userEvent.tab()

    await expect(input).toHaveValue('Belarus')
  },
}

export const ClearsUnmatchedValueOnBlur: Story = {
  play: async ({ canvas }) => {
    const input = canvas.getByRole('combobox')

    await userEvent.type(input, 'Unknown')
    await userEvent.tab()

    await expect(input).toHaveValue('')
  },
}

export const Disabled: Story = {
  args: {
    disabled: true,
  },
}
