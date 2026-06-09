# Changelog

Все значимые изменения проекта документируются в этом файле.

## Unreleased

### 2026-06-09

#### Auth

- Форма `ForgotPasswordForm` переведена на `react-hook-form` для управления email-полем и submit pipeline; mock-состояние reCAPTCHA, модалка подтверждения и `submittedEmail` остались локальными в feature hook.
- Поведение восстановления пароля сохранено: кнопка активируется после заполнения email и подтверждения mock reCAPTCHA, а повторная отправка использует отправленный email.
- Страница `/password-recovery` теперь читает email из query-параметра `email` и прокидывает его в форму восстановления; для UI-заготовки при прямом заходе сохраняется mock email `epam@epam.com`, чтобы можно было проверить resend-модалку.
- Форма `CreateNewPasswordForm` переведена на `react-hook-form`: поля нового пароля и подтверждения теперь валидируются через RHF, mismatch показывается сразу, а submit остается заблокированным до валидных совпадающих паролей.
- Экран истекшей recovery-ссылки переименован с `PasswordRecoveryForm` в `PasswordRecoveryExpiredLink`, потому что компонент не является формой и отвечает за сценарий resend expired link.

#### Verification

- `pnpm exec eslint src/features/forgot-password/model/useForgotPasswordForm.ts src/features/forgot-password/ui/ForgotPasswordForm.tsx src/features/forgot-password/ui/ForgotPasswordForm.stories.tsx` прошел успешно.
- `pnpm exec eslint 'app/(auth)/password-recovery/page.tsx' src/pages/password-recovery/ui/PasswordRecoveryPage.tsx src/pages/password-recovery/ui/PasswordRecoveryPage.stories.tsx src/features/password-recovery/ui/PasswordRecoveryExpiredLink.tsx src/features/password-recovery/ui/PasswordRecoveryExpiredLink.stories.tsx src/features/password-recovery/index.ts` прошел успешно.
- `pnpm exec eslint src/features/create-new-password/model/useCreateNewPasswordForm.ts src/features/create-new-password/ui/CreateNewPasswordForm.tsx src/features/create-new-password/ui/CreateNewPasswordForm.stories.tsx` прошел успешно.
- `pnpm exec tsc --noEmit` прошел успешно.
- `pnpm exec vitest run --project storybook src/features/forgot-password/ui/ForgotPasswordForm.stories.tsx` прошел успешно вне песочницы; обычный запуск был заблокирован sandbox-ошибкой `listen EPERM`.
- `pnpm exec vitest run --project storybook src/features/password-recovery/ui/PasswordRecoveryExpiredLink.stories.tsx` прошел успешно.
- `pnpm exec vitest run --project storybook src/features/create-new-password/ui/CreateNewPasswordForm.stories.tsx` прошел успешно.

#### Notes

- Storybook MCP-документация shared UI не проверялась, потому что соответствующие MCP-инструменты не доступны в текущей сессии.

#### Tooling

- Установлен агентский skill `grill-me` из `mattpocock/skills`; lock-файл фиксирует источник, путь `skills/productivity/grill-me/SKILL.md` и hash установленной версии.

#### Verification

- `npx skills add https://github.com/mattpocock/skills --skill grill-me` прошел успешно.
- `git status --short` показал новые файлы `.agents/skills/grill-me/SKILL.md` и `skills-lock.json`.

### 2026-06-08

#### Shared UI

- Из базового `Card` удалена принудительная ширина `100%`; теперь размер карточки контролирует родитель или конкретный компонент формы.
- Исправлен CSS-конфликт, из-за которого auth-карточки могли растягиваться на всю ширину после client-side переходов между страницами.

#### Auth

- На странице восстановления ссылки кнопка `Resend link` теперь открывает переиспользуемую модалку `Email sent` с сообщением `We have sent a link to confirm your email to epam@epam.com`.
- Модалка отправки email перенесена из приватного `forgot-password` в `entities/auth`, чтобы ее можно было использовать в нескольких auth-сценариях без feature-to-feature импортов.
- Форма создания нового пароля приведена ближе к Figma: добавлен текст требования длины пароля, локальная проверка диапазона 6-20 символов, текст ошибки `The passwords must match` и отступы карточки под состояние ошибки.
- Storybook-сценарий `PasswordRecoveryForm` теперь использует fullscreen-контекст страницы восстановления пароля, чтобы иллюстрация и отступы отображались как на реальном экране.
- Форма восстановления пароля теперь блокирует `Send Link`, пока email пустой или reCAPTCHA не подтверждена.
- После отправки формы внутри карточки показывается текст из макета `The link has been sent by email. If you don’t receive an email send link again`, а кнопка переходит в состояние `Send Link Again`.
- Текст требования `We have sent a link to confirm your email to ...` вынесен в модальное окно с кнопкой `OK` и закрытием по крестику.
- Модальное окно отправки email вынесено в отдельный приватный компонент `features/forgot-password/ui/EmailSentModal`, потому что оно относится к сценарию forgot-password.
- Логика состояния формы вынесена в `features/forgot-password/model/useForgotPasswordForm`, чтобы UI-компонент оставался тонким.
- Добавлены заготовки страниц `/password-recovery` и `/create-new-password` с FSD page compositions и thin Next.js routes.
- Страница восстановления ссылки повторяет состояние истекшей ссылки из Figma: заголовок `Email verification link expired`, текст про expired verification link, кнопка `Resend link` и иллюстрация `time-management/rafiki`, без зависимости на модалку forgot-password.
- Форма создания нового пароля содержит `New password`, `Password confirmation`, кнопку `Create new password` и локальную проверку `Passwords must match`.
- API и mock API не добавлялись; текущие формы работают как UI-заготовки с локальным состоянием.
- В stories форм добавлены play-сценарии для disabled-состояний, отдельной проверки modal-сообщения, экрана password-recovery и ошибки несовпадающих паролей.

#### Verification

- `pnpm exec eslint src/entities/auth src/features/password-recovery/ui/PasswordRecoveryForm.tsx src/features/password-recovery/ui/PasswordRecoveryForm.stories.tsx src/features/forgot-password/ui/ForgotPasswordForm.tsx src/features/forgot-password/ui/ForgotPasswordForm.stories.tsx` прошел успешно.
- `pnpm exec stylelint src/entities/auth/ui/EmailSentModal.module.css src/features/password-recovery/ui/PasswordRecoveryForm.module.css` прошел успешно.
- Storybook focused tests для `entities-auth-emailsentmodal--default`, `features-passwordrecoveryform--default` и `features-forgotpasswordform--default` прошли по play-сценариям; a11y-проверка нашла contrast-нарушения в существующем цвете primary button.
- `pnpm exec eslint src/features/create-new-password/model/useCreateNewPasswordForm.ts src/features/create-new-password/ui/CreateNewPasswordForm.tsx src/features/create-new-password/ui/CreateNewPasswordForm.stories.tsx src/pages/create-new-password/ui/CreateNewPasswordPage.tsx` прошел успешно.
- `pnpm exec eslint src/features/password-recovery/ui/PasswordRecoveryForm.stories.tsx` прошел успешно.
- `pnpm exec stylelint src/features/create-new-password/ui/CreateNewPasswordForm.module.css src/pages/create-new-password/ui/createNewPasswordPage.module.css` прошел успешно.
- `pnpm exec tsc --noEmit` прошел успешно.
- Storybook focused test для `features-createnewpasswordform--default` прошел по play-сценарию; a11y-проверка нашла contrast-нарушения в существующих цветах error text и primary button.
- Storybook focused test для `features-passwordrecoveryform--default` прошел по play-сценарию; a11y-проверка нашла contrast-нарушение в существующем цвете primary button.
- `pnpm exec stylelint src/shared/ui/card/card.module.css` прошел успешно.
- `pnpm exec eslint src/shared/ui/card/Card.tsx src/shared/ui/card/Card.stories.tsx src/features/sign-in/ui/SignInForm.tsx src/features/forgot-password/ui/ForgotPasswordForm.tsx src/features/sign-up/ui/SignUpForm.tsx` прошел успешно.
- `pnpm exec stylelint src/features/forgot-password/ui/ForgotPasswordForm.module.css src/features/password-recovery/ui/PasswordRecoveryForm.module.css src/features/create-new-password/ui/CreateNewPasswordForm.module.css src/pages/password-recovery/ui/passwordRecoveryPage.module.css src/pages/create-new-password/ui/createNewPasswordPage.module.css` прошел успешно.
- `pnpm exec eslint 'app/(auth)/password-recovery/page.tsx' 'app/(auth)/create-new-password/page.tsx' src/shared/config/routes.ts src/features/forgot-password/model/useForgotPasswordForm.ts src/features/forgot-password/ui/ForgotPasswordForm.tsx src/features/forgot-password/ui/ForgotPasswordForm.stories.tsx src/features/password-recovery src/features/create-new-password src/pages/password-recovery src/pages/create-new-password` прошел успешно.
- `pnpm exec tsc --noEmit` прошел успешно.
- `pnpm exec eslint src/features/forgot-password src/features/password-recovery src/pages/password-recovery 'app/(auth)/password-recovery/page.tsx'` прошел успешно.
- `pnpm exec stylelint src/features/forgot-password/ui/EmailSentModal.module.css src/features/forgot-password/ui/ForgotPasswordForm.module.css src/features/password-recovery/ui/PasswordRecoveryForm.module.css` прошел успешно.
- `pnpm exec vitest run --project storybook src/features/forgot-password/ui/ForgotPasswordForm.stories.tsx src/features/password-recovery/ui/PasswordRecoveryForm.stories.tsx src/features/create-new-password/ui/CreateNewPasswordForm.stories.tsx` был заблокирован sandbox-ошибкой `listen EPERM`; повторный запуск вне песочницы не завершен, потому что выполнение было прервано пользователем.
- `pnpm exec vitest run --project storybook src/features/forgot-password/ui/EmailSentModal.stories.tsx src/features/password-recovery/ui/PasswordRecoveryForm.stories.tsx` прошел успешно вне песочницы; обычный запуск был заблокирован sandbox-ошибкой `listen EPERM`.
- Storybook MCP focused tests для `features-forgot-password-emailsentmodal--default` и `features-passwordrecoveryform--default` не завершились: MCP tool call timed out after 120 seconds.
- Storybook MCP focused tests для `shared-ui-card`, `features-signinform`, `features-forgotpasswordform` и `features-signupform` не завершились: MCP tool call timed out after 120 seconds.
- Storybook MCP documentation calls для `Button`, `Input`, `Recaptcha`, `Modal`, `Alert` и story instructions не завершились: MCP tool call timed out after 120 seconds.
- `pnpm build` был остановлен после зависания на стадии `Creating an optimized production build ...`.

### 2026-06-06

#### Auth

- Добавлена страница `/forgot-password` для UC-3 восстановления пароля: тонкий Next.js route подключает FSD page composition, а форма вынесена в `features/forgot-password`.
- Форма восстановления пароля собрана из существующих `Card`, `Input`, `Button` и `Recaptcha`, повторяет Figma-макет Forgot Password и оставлена статичной без локального state.
- Добавлены Storybook stories для формы и страницы в default-состоянии.

#### Verification

- `pnpm exec eslint src/features/forgot-password src/pages/forgot-password 'app/(auth)/forgot-password/page.tsx'` прошел успешно.
- `pnpm exec stylelint src/features/forgot-password/ui/ForgotPasswordForm.module.css src/pages/forgot-password/ui/forgotPasswordPage.module.css` прошел успешно.
- Storybook focused tests для `features-forgotpasswordform--default` и `pages-forgotpasswordpage--default` прошли по сценариям, но a11y-проверка нашла существующее contrast-нарушение в primary button token.
- `pnpm run build` упал с Turbopack panic из-за sandbox-ограничения `binding to a port / Operation not permitted`.

#### Notes

- Внешняя ссылка с техническими требованиями UC-3 не открылась: `curl` с разрешенной сетью завершился таймаутом после 20 секунд, поэтому реализация сверена по Figma и существующим Storybook-докам компонентов.

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
