import type { Meta, StoryObj } from '@storybook/react'

import { Tabs } from './Tabs'
import storiesStyles from './Tabs.stories.module.css'

const meta = {
  title: 'shared/ui/Tabs',
  component: Tabs.Root,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: [
          'Составной компонент для переключения между связанными панелями.',
          '',
          '## Состав',
          '- **Tabs.Root** — контейнер, задаёт активный таб через `defaultValue` или `value`.',
          '- **Tabs.List** — обёртка для вкладок.',
          '- **Tabs.Tab** — кнопка-вкладка. Принимает `value` (обязательно), `disabled`.',
          '- **Tabs.Indicator** — визуальный индикатор активной вкладки (скрыт по умолчанию).',
          '- **Tabs.Panel** — панель с содержимым. Принимает `value`, `keepMounted`.',
          '',
          '## Состояния таба',
          '- **active** — выбран.',
          '- **inactive** — не выбран.',
          '- **hover** — при наведении.',
          '- **pressed** — нажат.',
          '- **focus** — в фокусе.',
          '- **disabled** — заблокирован.',
        ].join('\n'),
      },
    },
  },
  argTypes: {
    defaultValue: {
      control: 'text',
      description: 'Значение активного таба по умолчанию (неуправляемый режим)',
    },
    value: {
      control: 'text',
      description: 'Значение активного таба (управляемый режим)',
    },
    orientation: {
      control: 'select',
      options: ['horizontal', 'vertical'],
      description: 'Ориентация компонента',
    },
  },
} satisfies Meta<typeof Tabs.Root>

export default meta

type Story = StoryObj<typeof meta>

export const Active: Story = {
  args: {
    defaultValue: 'tab',
  },
  parameters: {
    layout: 'centered',
  },
  render: ({ defaultValue }) => (
    <div className={storiesStyles.storyWrapper}>
      <Tabs.Root defaultValue={defaultValue}>
        <Tabs.List>
          <Tabs.Tab value="tab">Tab</Tabs.Tab>
        </Tabs.List>
      </Tabs.Root>
    </div>
  ),
}

export const ActivePressed: Story = {
  args: {
    defaultValue: 'tab',
  },
  parameters: {
    layout: 'centered',
  },
  render: ({ defaultValue }) => (
    <div className={`${storiesStyles.storyWrapper} ${storiesStyles.simPressed}`}>
      <Tabs.Root defaultValue={defaultValue}>
        <Tabs.List>
          <Tabs.Tab value="tab">Tab</Tabs.Tab>
        </Tabs.List>
      </Tabs.Root>
    </div>
  ),
}

export const ActiveHovered: Story = {
  args: {
    defaultValue: 'tab',
  },
  parameters: {
    layout: 'centered',
  },
  render: ({ defaultValue }) => (
    <div className={`${storiesStyles.storyWrapper} ${storiesStyles.simHovered}`}>
      <Tabs.Root defaultValue={defaultValue}>
        <Tabs.List>
          <Tabs.Tab value="tab">Tab</Tabs.Tab>
        </Tabs.List>
      </Tabs.Root>
    </div>
  ),
}

export const ActiveFocused: Story = {
  args: {
    defaultValue: 'tab',
  },
  parameters: {
    layout: 'centered',
  },
  render: ({ defaultValue }) => (
    <div className={`${storiesStyles.storyWrapper} ${storiesStyles.simFocused}`}>
      <Tabs.Root defaultValue={defaultValue}>
        <Tabs.List>
          <Tabs.Tab value="tab">Tab</Tabs.Tab>
        </Tabs.List>
      </Tabs.Root>
    </div>
  ),
}

export const Inactive: Story = {
  parameters: {
    layout: 'centered',
  },
  render: () => (
    <div className={storiesStyles.storyWrapper}>
      <Tabs.Root defaultValue="selected">
        <Tabs.List>
          <Tabs.Tab value="selected" style={{ display: 'none' }} />
          <Tabs.Tab value="tab">Tab</Tabs.Tab>
        </Tabs.List>
      </Tabs.Root>
    </div>
  ),
}

export const InactivePressed: Story = {
  parameters: {
    layout: 'centered',
  },
  render: () => (
    <div className={`${storiesStyles.storyWrapper} ${storiesStyles.simPressed}`}>
      <Tabs.Root defaultValue="selected">
        <Tabs.List>
          <Tabs.Tab value="selected" style={{ display: 'none' }} />
          <Tabs.Tab value="tab">Tab</Tabs.Tab>
        </Tabs.List>
      </Tabs.Root>
    </div>
  ),
}

export const InactiveHovered: Story = {
  parameters: {
    layout: 'centered',
  },
  render: () => (
    <div className={`${storiesStyles.storyWrapper} ${storiesStyles.simHovered}`}>
      <Tabs.Root defaultValue="selected">
        <Tabs.List>
          <Tabs.Tab value="selected" style={{ display: 'none' }} />
          <Tabs.Tab value="tab">Tab</Tabs.Tab>
        </Tabs.List>
      </Tabs.Root>
    </div>
  ),
}

export const InactiveFocused: Story = {
  parameters: {
    layout: 'centered',
  },
  render: () => (
    <div className={`${storiesStyles.storyWrapper} ${storiesStyles.simFocused}`}>
      <Tabs.Root defaultValue="selected">
        <Tabs.List>
          <Tabs.Tab value="selected" style={{ display: 'none' }} />
          <Tabs.Tab value="tab">Tab</Tabs.Tab>
        </Tabs.List>
      </Tabs.Root>
    </div>
  ),
}

export const InactiveDisabled: Story = {
  parameters: {
    layout: 'centered',
  },
  render: () => (
    <div className={storiesStyles.storyWrapper}>
      <Tabs.Root defaultValue="selected">
        <Tabs.List>
          <Tabs.Tab value="selected" style={{ display: 'none' }} />
          <Tabs.Tab value="tab" disabled>
            Tab
          </Tabs.Tab>
        </Tabs.List>
      </Tabs.Root>
    </div>
  ),
}

export const AllVariants: Story = {
  render: () => (
    <div className={storiesStyles.allVariants}>
      <div className={storiesStyles.headerRow}>
        <span className={storiesStyles.stateLabel} />
        <span className={storiesStyles.headerCell}>Default</span>
        <span className={storiesStyles.headerCell}>Hover</span>
        <span className={storiesStyles.headerCell}>Active</span>
        <span className={storiesStyles.headerCell}>Focus</span>
        <span className={storiesStyles.headerCell}>Disabled</span>
      </div>

      <div className={storiesStyles.variantsRow}>
        <span className={storiesStyles.stateLabel}>Active</span>
        <span className={storiesStyles.cell}>
          <Tabs.Root defaultValue="default">
            <Tabs.List>
              <Tabs.Tab value="default">Tab</Tabs.Tab>
            </Tabs.List>
          </Tabs.Root>
        </span>
        <span className={`${storiesStyles.cell} ${storiesStyles.simHovered}`}>
          <Tabs.Root defaultValue="hover">
            <Tabs.List>
              <Tabs.Tab value="hover">Tab</Tabs.Tab>
            </Tabs.List>
          </Tabs.Root>
        </span>
        <span className={`${storiesStyles.cell} ${storiesStyles.simPressed}`}>
          <Tabs.Root defaultValue="active">
            <Tabs.List>
              <Tabs.Tab value="active">Tab</Tabs.Tab>
            </Tabs.List>
          </Tabs.Root>
        </span>
        <span className={`${storiesStyles.cell} ${storiesStyles.simFocused}`}>
          <Tabs.Root defaultValue="focus">
            <Tabs.List>
              <Tabs.Tab value="focus">Tab</Tabs.Tab>
            </Tabs.List>
          </Tabs.Root>
        </span>
        <span className={storiesStyles.cell}>
          <Tabs.Root defaultValue="disabled">
            <Tabs.List>
              <Tabs.Tab value="disabled" disabled>
                Tab
              </Tabs.Tab>
            </Tabs.List>
          </Tabs.Root>
        </span>
      </div>

      <div className={storiesStyles.variantsRow}>
        <span className={storiesStyles.stateLabel}>Inactive</span>
        <span className={storiesStyles.cell}>
          <Tabs.Root defaultValue="selected">
            <Tabs.List>
              <Tabs.Tab value="selected" style={{ display: 'none' }} />
              <Tabs.Tab value="default">Tab</Tabs.Tab>
            </Tabs.List>
          </Tabs.Root>
        </span>
        <span className={`${storiesStyles.cell} ${storiesStyles.simHovered}`}>
          <Tabs.Root defaultValue="selected">
            <Tabs.List>
              <Tabs.Tab value="selected" style={{ display: 'none' }} />
              <Tabs.Tab value="hover">Tab</Tabs.Tab>
            </Tabs.List>
          </Tabs.Root>
        </span>
        <span className={`${storiesStyles.cell} ${storiesStyles.simPressed}`}>
          <Tabs.Root defaultValue="selected">
            <Tabs.List>
              <Tabs.Tab value="selected" style={{ display: 'none' }} />
              <Tabs.Tab value="active">Tab</Tabs.Tab>
            </Tabs.List>
          </Tabs.Root>
        </span>
        <span className={`${storiesStyles.cell} ${storiesStyles.simFocused}`}>
          <Tabs.Root defaultValue="selected">
            <Tabs.List>
              <Tabs.Tab value="selected" style={{ display: 'none' }} />
              <Tabs.Tab value="focus">Tab</Tabs.Tab>
            </Tabs.List>
          </Tabs.Root>
        </span>
        <span className={storiesStyles.cell}>
          <Tabs.Root defaultValue="selected">
            <Tabs.List>
              <Tabs.Tab value="selected" style={{ display: 'none' }} />
              <Tabs.Tab value="disabled" disabled>
                Tab
              </Tabs.Tab>
            </Tabs.List>
          </Tabs.Root>
        </span>
      </div>
    </div>
  ),
}
