# Changelog

Все значимые изменения проекта документируются в этом файле.

## Unreleased

### 2026-06-10

#### Auth — Registration (UC-1)

- Реализован полный флоу регистрации: форма с валидацией `onBlur`, отправка на `POST /v1/auth/registration`, модалка успеха с email пользователя.
- Валидация не показывает ошибки на пустых полях при blur — кнопка заблокирована через `hasAllValues`, а не через `required`.
- Серверные ошибки (email/username уже заняты) выводятся под соответствующим полем через `setError`.
- Страница подтверждения email: три состояния — загрузка, успех, истёкшая ссылка с формой повторной отправки.
- Разделение `ConfirmEmailPage` (данные) / `ConfirmEmailView` (UI) для изолированного тестирования.
- Mock route handlers для трёх эндпоинтов (`registration`, `registration-confirmation`, `resend-registration-email`) — удалить при подключении реального бэкенда.
- Добавлены Storybook stories: `SignUpForm` (Default, WithValidationErrors), `SignUpSuccessModal` (Open, CloseByOk, CloseByX), `ConfirmEmailView` (Loading, Success, Expired, ExpiredWithError, ResendSuccess).

#### Verification

- `pnpm tsc --noEmit` — 0 ошибок в исходниках.
- `pnpm lint` — 0 ошибок в наших файлах; 4 pre-existing ошибки в `icon/select/navigation/alert` не затрагивались.

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
