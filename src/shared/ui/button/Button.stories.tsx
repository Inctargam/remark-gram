import type { Meta, StoryObj } from '@storybook/react'

import { Button } from './Button'

// `satisfies Meta<typeof Button>` is preferred over `: Meta<typeof Button>`.
// `satisfies` validates the object against the type but preserves literal types,
// which gives better TypeScript inference for args in stories below.
const meta = {
  // Path shown in the Storybook sidebar.
  title: 'shared/ui/Button',
  component: Button,
  // Enables the auto-generated Docs tab for this component.
  // Without this tag the Docs page does not appear.
  tags: ['autodocs'],
  parameters: {
    // Centers the component in the canvas — suitable for small, self-contained UI elements.
    layout: 'centered',
  },
  // argTypes describes how each prop appears in the Controls panel.
  // Storybook can infer basic controls from TypeScript, but explicit argTypes
  // give us descriptions and let us choose the control widget.
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'outline', 'text'],
      description: 'Визуальный вариант кнопки',
    },
    disabled: {
      control: 'boolean',
      description: 'Отключает кнопку',
    },
    children: {
      control: 'text',
      description: 'Текст или содержимое кнопки',
    },
  },
} satisfies Meta<typeof Button>

export default meta

// `typeof meta` — not `typeof Button` — so Story inherits args already narrowed
// by the meta object (e.g. `variant` is typed as the union, not a plain string).
type Story = StoryObj<typeof meta>

export const Primary: Story = {
  args: { children: 'Primary Button', variant: 'primary' },
}

export const Secondary: Story = {
  args: { children: 'Secondary Button', variant: 'secondary' },
}

export const Outline: Story = {
  args: { children: 'Outline Button', variant: 'outline' },
}

export const Text: Story = {
  args: { children: 'Text Button', variant: 'text' },
}

export const Disabled: Story = {
  args: {
    children: 'Disabled Button',
    variant: 'primary',
    disabled: true,
  },
}

// `render` replaces the default single-instance render.
// Use it when you need multiple component instances or a custom layout —
// args only controls one instance at a time.
export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="text">Text</Button>
    </div>
  ),
}
