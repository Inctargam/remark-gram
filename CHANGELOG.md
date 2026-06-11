# Changelog

Все значимые изменения проекта документируются в этом файле.

## Unreleased

### 2026-06-11

#### Auth

- Корневой layout теперь оборачивает приложение в явный `QueryProvider` для TanStack Query, чтобы подключение совпадало с выбранным layout-паттерном.
- Frontend Google OAuth-flow переведен на redirect через mock backend: кнопка Google запускает `/api/mock/auth/oauth/google/authorize`, а новый route `/auth/google/callback` обменивает `code` и `state` через TanStack Query mutation на `/api/mock/auth/oauth/google/exchange`.
- Для callback-flow добавлена страница `GoogleOAuthCallbackPage`, которая показывает состояние завершения Google авторизации, обрабатывает ошибки callback URL и после успешного exchange редиректит пользователя на главную страницу.
- В mock Google OAuth backend добавлен endpoint `GET /api/mock/auth/oauth/google/authorize`, который редиректит браузер на Google OAuth consent screen с зарегистрированным redirect URI `https://dev.remarkgram.com:3000/auth/google/callback`.
- Добавлен endpoint `POST /api/mock/auth/oauth/google/exchange` для гибридного OAuth-flow: frontend может вернуть backend реальный Google authorization code, а backend обменяет его на Google access token, запросит userinfo и вернет профиль пользователя.
- Старый endpoint `POST /api/mock/auth/oauth/google` удален, чтобы mock backend-контракт был явным: `/authorize` запускает OAuth-flow, `/exchange` обменивает authorization code.
- Для нового redirect-flow добавлен временный `state` cookie: новый frontend callback сможет отправлять `state` вместе с `code`, при этом старый mock exchange без `state` остается совместимым.
- Google authorize URL в mock backend упрощен до базовых параметров без `access_type=offline` и принудительного `prompt=consent`, так как mock-flow не хранит Google refresh token.
- Google OAuth client id и secret для mock backend теперь читаются из `GOOGLE_OAUTH_CLIENT_ID` и `GOOGLE_OAUTH_CLIENT_SECRET`, чтобы секреты не хранились в репозитории.
- Из Google OAuth response удалено поле `registrationEmailSent`, так как OAuth-регистрация считается завершенной после успешного Google exchange и не требует registration email confirmation.
- Внутренняя логика mock Google OAuth backend разнесена по приватным модулям `_mock`: конфиг, state-cookie, Google client, mock-сценарии и orchestration exchange теперь читаются отдельно без изменения API-контракта.
- OAuth-flow вынесен из `features/sign-in` в отдельный feature-слайс `features/oauth-sign-in` на уровне model/API, при этом кнопки Google и GitHub остались внутри `SignInForm` и продолжают отображаться в общей card формы входа.

#### Verification

- `pnpm exec eslint app/api/mock/auth/oauth/google` прошел успешно.
- `pnpm exec eslint src/features/sign-in src/pages/google-oauth-callback "app/(auth)/auth/google/callback" src/shared/config app/layout.tsx src/app/providers` прошел успешно.
- `pnpm exec eslint src/features/oauth-sign-in src/features/sign-in src/pages/sign-in src/pages/google-oauth-callback` прошел успешно.
- `pnpm build` прошел успешно.
- Storybook MCP-тесты `features-signinform--default` и `pages-signinpage--default` отрендерились; a11y-проверка нашла существующую визуальную проблему контраста у primary-кнопки `Sign In`.

### 2026-06-10

#### Auth

- Google OAuth-flow переведен на реальный Google Identity Services popup при наличии `NEXT_PUBLIC_GOOGLE_OAUTH_CLIENT_ID` с fallback на mock authorization code.
- Временный exchange вынесен в отдельный Next.js mock backend endpoint `POST /api/mock/auth/oauth/google`, чтобы frontend отправлял authorization code через HTTP как при будущей интеграции с backend.
- Mock backend для Google OAuth изолирован в приватной `_mock` зоне внутри `app/api/mock/auth/oauth/google`, включая request/response types, сценарии и exchange-логику.
- OAuth sign-in упрощен до TanStack Query mutation: frontend получает Google code, отправляет его в mock backend и после успеха редиректит на домашнюю страницу.
- Mock backend сохраняет сценарии `new-user`, `existing-user` и `error`, выбранные через localStorage-ключ `inctagram.oauthMockScenario`, выставляет mock `accessToken`/`refreshToken` cookies и возвращает только user/status payload.
- Удалены localStorage session entity и лишние промежуточные OAuth-слои `startOAuthSignIn`, `handleOAuthCode` и frontend-only exchange.
- OAuth config вынесен в `src/shared/config/oauth.ts`, чтобы endpoint, Google scope, client id и mock scenario key были централизованы.
- В корневой layout добавлен `AppProviders` с `QueryClientProvider` для TanStack Query.

#### Verification

- `pnpm exec eslint src/features/sign-in src/entities/session src/shared/config app/api/mock/auth/oauth/google/route.ts` прошел успешно.
- `pnpm exec eslint app/api/mock/auth/oauth/google src/features/sign-in src/entities/session src/shared/config` прошел успешно.
- `pnpm exec eslint --fix app/api/mock/auth/oauth/google src/app/providers src/features/sign-in src/shared/config app/layout.tsx` прошел успешно.
- `pnpm exec eslint app/api/mock/auth/oauth/google src/app/providers src/features/sign-in src/shared/config app/layout.tsx` прошел успешно.
- `pnpm build` прошел успешно.
- Storybook MCP-тест `features-signinform--default` не прошел из-за ошибки динамического импорта Storybook cache module `@storybook_react-dom-shim.js`.

### 2026-06-09

#### Auth

- В `SignInForm` подключен mock OAuth-flow для Google через popup: кнопка получает mock authorization code, выполняет общий exchange и сохраняет mock-сессию.
- Для Google OAuth mock добавлены переключаемые сценарии `new-user`, `existing-user` и `error` через localStorage, чтобы проверить основной и альтернативный flow из ТЗ без backend.
- Добавлены session-entity с localStorage-хранилищем access/refresh tokens и пользовательских данных, а также общий `handleOAuthCode` для будущего перехода на redirect callback.
- GitHub OAuth-кнопка временно отключена до появления отдельного mock или backend-контракта.

#### Verification

- `pnpm exec eslint src/entities/session src/features/sign-in` прошел успешно.
- `pnpm build` прошел успешно после очистки устаревшего generated-кэша `.next`.
- Storybook MCP-тест `features-signinform--default` не запускался: MCP endpoint `http://localhost:6006/mcp` был недоступен, а Storybook поднялся только на порту `6007`.

#### Documentation

- В правилах `AGENTS.md` для командного changelog явно указано, что новые проектные файлы тоже должны оцениваться для записи в `CHANGELOG.md`.

#### Verification

- Не запускались; изменение только документационное.

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
