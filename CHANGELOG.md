# Changelog

Все значимые изменения проекта документируются в этом файле.

## Unreleased

### 2026-06-06

#### Navigation

- В сайдбаре увеличен отступ между пунктами `Search` и `Statistics` до значения из Figma: общий разрыв теперь составляет `60px`.
- Состояния пунктов навигации сверены с Figma: hover использует `primary-100`, focus показывает только рамку без active-состояния, disabled остаётся темным неактивным цветом.
- В stories полного `Sidebar` добавлены отдельные состояния `Hover`, `Focus` и `Disabled`, соответствующие колонкам Figma.

#### Verification

- `pnpm exec eslint src/widgets/navigation/ui/Sidebar/Sidebar.tsx src/widgets/navigation/ui/Sidebar/Sidebar.stories.tsx src/widgets/navigation/ui/NavLink/NavLink.stories.tsx` прошел успешно.
- `pnpm exec stylelint src/widgets/navigation/ui/NavLink/NavLink.module.css src/widgets/navigation/ui/Sidebar/Sidebar.module.css` прошел успешно.
- `pnpm exec vitest run --project storybook src/widgets/navigation/ui/NavLink/NavLink.stories.tsx src/widgets/navigation/ui/Sidebar/Sidebar.stories.tsx` прошел успешно вне песочницы; обычный запуск был заблокирован sandbox-ошибкой `listen EPERM`.

### 2026-06-05

#### Header

- Гостевые действия в хедере переведены с callback-кнопок на навигационные ссылки, отрисованные через общий компонент `Button` и Base UI `render`.
- Из `Header` удалены гостевые props `onLoginClick` и `onSignupClick`; `Log in` и `Sign up` теперь ведут на настроенные auth routes напрямую.
- Из story хедера удалена неиспользуемая связка callback-обработчиков для гостевых кнопок.

#### Documentation

- В `AGENTS.md` добавлено правило вести `CHANGELOG.md` на русском языке.
- Текущие записи `CHANGELOG.md` переведены на русский язык.

#### Verification

- `pnpm exec eslint src/widgets/header/Header.tsx src/widgets/header/Header.stories.tsx app/layout.tsx` прошел успешно.
- `pnpm build` упал на TypeScript-проверке из-за ранее существующей проблемы: в `src/shared/ui/pagination/Pagination.stories.tsx` не переданы обязательные callback-пропсы.
- Проверки после документационного изменения не запускались.

### 2026-06-04

#### App Layout

- Общий хедер перенесен в корневой Next.js layout, чтобы гостевые и авторизованные страницы использовали одну layout-точку входа.
- В корневой layout добавлен локальный временный auth mock, который переключает гостевые controls хедера и авторизованные header/sidebar/bottom navigation.
- Удалены дублирующиеся гостевые хедеры на уровне страниц и ставший пустым layout route group `(main)`.

#### Verification

- `pnpm lint` упал на ранее существующих ошибках порядка exports в `src/shared/ui/*/index.ts` и `src/widgets/navigation/index.ts`; эти reusable modules не изменялись.
- `pnpm build` упал на TypeScript-проверке из-за ранее существующей проблемы: в `src/shared/ui/pagination/Pagination.stories.tsx` не переданы обязательные callback-пропсы.

#### Documentation

- Добавлен root-level `CHANGELOG.md` для командной истории изменений проекта.
- В `AGENTS.md` добавлены правила `Team Changelog`, чтобы значимые изменения проекта фиксировались в `CHANGELOG.md` в следующих задачах.
- Определен формат командного changelog с датированными записями, секциями по областям, результатами проверок и опциональными заметками.

#### Verification

- Не запускались; изменение только документационное.
