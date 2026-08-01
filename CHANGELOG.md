# Changelog

Все значимые изменения проекта документируются в этом файле.

## Unreleased

### 2026-08-02

#### App Styles

- Шапка (`Header`, `HeaderMobile`) закреплена `position: sticky; top: 0` и получила `z-index` ниже модалок, поэтому остаётся на экране на длинных страницах.
- Слот сайдбара в `AppShell` стал `sticky` под шапкой с высотой `calc(100vh - var(--layout-header-height))` и `overflow-y: auto`: меню и `Log Out` видны при любом скролле, длинное меню скроллится внутри себя.
- `BottomBar` на мобильной раскладке прижат `position: sticky; bottom: 0` — место в потоке остаётся за ним, контент под панель не уезжает.
- `.main` получил `min-width: 0`: без этого широкая сетка постов растягивала флекс-строку и давала горизонтальный скролл у body.

#### Tooling

- В `src/app/styles/tokens.css` добавлены layout- и z-index-токены: `--layout-header-height`, `--layout-bottom-bar-height`, `--layout-sidebar-width`, `--z-index-header`, `--z-index-sidebar`, `--z-index-bottom-bar`. Высота шапки в 60px больше не дублируется между `Sidebar.module.css` и `.inner` шапки.

#### Tests

- В `AppShellView.stories.tsx` добавлена стори `AuthenticatedLongContent` с длинным контентом: скроллит окно и проверяет, что шапка стоит на `top: 0`, `Log Out` остаётся в пределах вьюпорта и горизонтального скролла у документа нет.

#### Verification

- `pnpm exec stylelint` по затронутым файлам: новых ошибок нет (в репозитории остаётся прежний пул `order/properties-order` и `comment-empty-line-before` — чужие файлы, отдельная ветка).
- `pnpm exec eslint src/widgets` — чисто.
- `pnpm exec vitest run --project=storybook` — 37 файлов, 158 тестов, прошло. Скрипта `pnpm test:storybook` в проекте нет.
- Новая стори проверена на ловлю регрессии: при временном снятии `sticky` с шапки и со слота сайдбара она падает.
- `pnpm build` прошёл успешно.

#### Notes

- Ручная проверка на профиле с 20 постами не проводилась: маршрута `/profile/[id]` и ленты постов в `develop` нет, они живут в ветке `feat/posts-crud`. Проверять после её мержа.
- Страницы (`src/pages/*`) по-прежнему используют литерал `calc(100vh - 60px)`; перевод их на `--layout-header-height` не входил в задачу.

### 2026-08-01

#### Tooling

- Починены накопившиеся ошибки `simple-import-sort/exports` в `shared/ui/alert`, `shared/ui/icon`, `shared/ui/select` и `widgets/navigation`, а также prettier-warnings в `shared/ui/icon/Icon.tsx`, `shared/ui/modal`, `widgets/navigation/ui/BottomBar` и `eslint.config.mjs`. `pnpm lint` по всему проекту снова проходит: 0 ошибок, остаётся один warning `react-hooks/incompatible-library` в `features/sign-up` (правило про `watch()` из react-hook-form, автофиксом не чинится).
- Правки чисто форматирующие, поведение не менялось: результат `pnpm exec eslint --fix`, вручную ничего не переписывалось. Вынесены отдельной веткой, чтобы не тащить чужие файлы в ветки задач и не повторять эту сноску в каждом отчёте.

#### Verification

- `pnpm lint` — 0 ошибок.
- `pnpm exec vitest run --project unit` прошёл успешно: 19 файлов, 84 теста.
- `pnpm exec vitest run --project storybook` прошёл успешно: 37 файлов, 157 тестов.
- `pnpm build` прошёл успешно.
### 2026-07-31

#### Auth

- OAuth-вход и регистрация через Google и GitHub переведены на browser navigation к backend endpoints `/api/v1/auth/google` и `/api/v1/auth/github`, сформированным через `NEXT_PUBLIC_API_BASE_URL`.
- Удалены frontend-обмен `code/state`, callback-страницы и локальный mock OAuth backend; после возврата на `/` сессия восстанавливается существующим `SessionBootstrap` через refresh token cookie.
- OAuth-ошибка из query-параметра главной страницы переносится на `/sign-in` для последующей реализации сообщений и повторного входа.

#### Architecture

- Разметка и стили главной страницы перенесены из Next.js route в FSD-слайс `src/pages/home`; `app/(main)/page.tsx` оставлен тонкой композицией маршрута.
- Формирование пути для переноса OAuth-ошибки хранится в переименованном слайсе `features/oauth-authentication` и покрыто изолированными unit-тестами.
- Статичные backend OAuth URL объединены в карте `OAUTH_AUTHORIZE_URLS` внутри feature; избыточные provider helper, тип и `shared/config/oauth.ts` удалены.
- `NEXT_PUBLIC_API_BASE_URL` теперь читается в единой точке `shared/config/api.ts`; OpenAPI-клиент, OAuth feature и legacy `baseApi` используют общий `API_BASE_URL`, а дублирующий `shared/api/openapi/config.ts` удалён.

#### Verification

- `pnpm exec next typegen` прошёл успешно.
- `pnpm exec tsc --noEmit --pretty false` прошёл успешно.
- Focused ESLint для изменённых OAuth, auth UI, config, home route и FSD page-слайса прошёл успешно без предупреждений.
- Focused Stylelint для стилей `src/pages/home` прошёл успешно.
- `pnpm exec vitest run --project unit` прошёл успешно: 7 файлов, 31 тест.
- `pnpm exec vitest run --project storybook` прошёл успешно: 35 файлов, 150 тестов.
- `pnpm run build` прошёл успешно.

#### Notes

- Отображение OAuth-ошибок и очистка `error` из URL отложены в отдельную ветку; текущая реализация сохраняет код ошибки в query страницы `/sign-in`.
- `.env.local` не изменялся; устаревшие локальные OAuth client secrets можно удалить отдельно после проверки окружения.

### 2026-07-28

#### Create Post

- Create-post wizard перенесён из page slice в `features/create-post`, потому что сценарий будет запускаться не только route `/create`, но и действием `Create` в sidebar.
- Page slice `pages/create-post` оставлен тонкой композицией route-entry: он задаёт поведение закрытия через `router.replace`, а сам flow опубликован через public API feature.
- UI create-post feature сгруппирован по шагам wizard: `add-photo`, `crop-photo`, `filter-photo`, `publication`, `close-creation` и `stories`; корневой `ui` оставлен для orchestration-компонентов.
- Storybook stories create-post перенесены в feature slice, а CSS module переименован с page-specific имени на `createPost.module.css`.
- В carousel controls create-post заменена ручная склейка CSS module classes на `clsx`, чтобы соответствовать принятому паттерну условных className.
- В Storybook story create-post flow исправлен cleanup object URL: preview URL больше не отзываются при каждом изменении состояния story и очищаются при unmount.

#### Verification

- `pnpm exec eslint 'app/(main)/create/page.tsx' src/pages/create-post src/features/create-post` прошёл успешно.
- `pnpm exec tsc --noEmit` прошёл успешно.
- `pnpm exec vitest run src/features/create-post` прошёл успешно: 7 файлов, 22 теста.
- `pnpm exec vitest run --project storybook src/features/create-post/ui/stories/CreatePostFlow.stories.tsx src/features/create-post/ui/close-creation/CloseCreationConfirm.stories.tsx` прошёл успешно: 2 файла, 7 тестов.

### 2026-06-29

#### Create Post

- Добавлены Storybook stories для ключевых состояний create-post wizard: пустая загрузка, ошибка валидации, crop для одного и нескольких фото, filters, publication и отдельная story для confirm закрытия.
- Для create-post modal stories отключён inline-render в Storybook Docs, чтобы открытые fixed-модалки рендерились в iframe и не накладывались друг на друга на странице документации.
- Добавлены unit-тесты in-memory draft model: сохранение, восстановление редактируемого состояния без object URL и очистка черновика.

#### Verification

- `pnpm exec eslint src/pages/create-post/ui/CreatePostFlow.stories.tsx src/pages/create-post/ui/CloseCreationConfirm.stories.tsx src/pages/create-post/model/createPostDraft.test.ts` прошёл успешно.
- `pnpm exec vitest run --project unit src/pages/create-post/model/createPostDraft.test.ts` прошёл успешно: 1 файл, 3 теста.
- `pnpm exec vitest run --project storybook src/pages/create-post/ui/CreatePostFlow.stories.tsx src/pages/create-post/ui/CloseCreationConfirm.stories.tsx` прошёл успешно: 2 файла, 7 тестов.
- Storybook Docs для `pages/CreatePostFlow` визуально проверен на `http://localhost:6006/?path=/docs/pages-createpostflow--docs`: stories рендерятся через iframe, наложений fixed-модалок в основном docs DOM не найдено.
- `pnpm exec vitest run --project unit` прошёл успешно: 16 файлов, 78 тестов.
- `pnpm build` прошёл успешно.
- `pnpm lint` не прошёл из-за существующих несвязанных ошибок сортировки export в `src/shared/ui/alert/index.ts`, `src/shared/ui/icon/index.ts`, `src/shared/ui/select/index.ts`, `src/widgets/navigation/index.ts` и существующих prettier warnings вне изменённых файлов.
- Storybook MCP tools не были доступны в текущем наборе инструментов Codex; затронутые Storybook tests запущены через `pnpm exec vitest run --project storybook`.

### 2026-06-25

#### Create Post

- В модальный сценарий `Add Photo` добавлен скрытый file input для выбора JPEG/PNG-фотографий с поддержкой multiple upload.
- Добавлена page-local модель валидации файлов публикации: до 10 фото, JPEG/PNG, размер каждого файла не больше 20 MB.
- После успешного выбора создаются object URL preview, показывается первое выбранное фото и количество выбранных фото; object URL освобождаются при размонтировании сценария.
- Для ошибок выбора файла добавлен alert в модалке, включая отдельное сообщение для превышения лимита количества фото.
- Добавлена pinned-зависимость `react-easy-crop@6.0.2` для настройки обрезки фотографий.
- После успешной загрузки wizard переходит на шаг `Cropping`, где для каждой фотографии отдельно сохраняются crop position, zoom, aspect ratio и crop area в пикселях.
- Реализованы cropper, переключатели `1:1`, `4:5`, `16:9`, zoom slider и thumbnail strip для переключения между выбранными фотографиями без потери настроек.
- В cropper добавлен формат `Original`, который выбран по умолчанию и сохраняет исходное соотношение сторон фотографии без принудительной обрезки.
- Управление выбранными фотографиями, текущей фотографией, crop-настройками и cleanup object URL вынесено из общего flow-hook в отдельный `useCreatePostPhotos`.
- Добавлен шаг `Filters`: выбор фильтра сохраняется отдельно для каждой фотографии, preview применяет CSS-filter, а `Back` возвращает пользователя на crop-step.
- Добавлен шаг `Publication` с preview выбранной фотографии, полем `Description`, ограничением описания до 500 символов и счётчиком символов; `Publish` оставлен неактивным до этапа mock publish.
- Кнопка `Publish` подключена к TanStack Query mock mutation: перед отправкой фотографии экспортируются через Canvas с учётом crop area и CSS-фильтра, после успешного mock publish форма закрывается с переходом на профиль.
- Preview на шагах `Filters` и `Publication` строится через тот же Canvas export, что и publish payload, поэтому crop и filter совпадают с итоговым файлом.
- На шагах `Filters` и `Publication` добавлено переключение между несколькими фотографиями через overlay-стрелки и pagination dots; при одном фото лишняя навигация не отображается.
- При переходе на шаги `Filters` и `Publication` активная фотография сбрасывается на первую, чтобы каждый этап начинался с начала набора.
- При закрытии начатого создания публикации показывается confirm: можно сохранить in-memory draft на текущую сессию, восстановить его через `Open Draft` или удалить через `Discard`.
- Исправлено растягивание фотографии в cropped preview: изображение позиционируется внутри crop area без искажения исходных пропорций.
- На шагах `Filters` и `Publication` убрана тёмная подложка итогового preview, чтобы область соответствовала размеру обработанной фотографии.
- На шаге `Cropping` убраны тёмная подложка рабочей области и затемняющий overlay cropper.

#### Verification

- `pnpm exec eslint 'app/(main)/create/page.tsx' src/pages/create-post` прошёл успешно.
- `pnpm exec vitest run --project unit src/pages/create-post/model/createPostFile.test.ts` прошёл успешно: 1 файл, 7 тестов.
- `pnpm exec eslint src/pages/create-post` прошёл успешно.
- `pnpm exec vitest run --project unit src/pages/create-post` прошёл успешно: 4 файла, 12 тестов.
- `pnpm exec tsc --noEmit` прошёл успешно.
- `pnpm build` не запускался повторно: на предыдущем этапе команда зависала на `Creating an optimized production build ...` без вывода ошибок.
- Storybook tests не запускались, потому что stories не изменялись и Storybook MCP tools недоступны в текущей сессии.

### 2026-06-24

#### Create Post

- Добавлен route `/create` с тонким Next.js route-файлом и page-slice `pages/create-post`.
- Реализован первый экран модального сценария `Add Photo` на существующих shared `Modal`, `Button` и `Icon`: placeholder, кнопка `Select from Computer` и кнопка `Open Draft`.

#### Verification

- `pnpm exec eslint 'app/(main)/create/page.tsx' src/pages/create-post` прошёл успешно.
- `pnpm exec tsc --noEmit` прошёл успешно.
- `pnpm build` был остановлен вручную после длительного зависания на этапе `Creating an optimized production build ...` без вывода ошибок.
- Storybook tests не запускались, потому что stories не изменялись и Storybook MCP tools недоступны в текущей сессии.
### 2026-07-14

#### Auth

- Управление восстановлением сессии перенесено из `shared/api/auth` в целевой сегмент `shared/auth` и переименовано в `refreshSession`; OpenAPI-клиент теперь отвечает только за транспорт.
- Устаревший каталог `src/shared/api/auth` удалён, а app bootstrap получает store и операцию восстановления сессии через единый публичный API `shared/auth`.

#### Verification

- `pnpm exec vitest run --project unit` прошёл успешно: 14 файлов, 69 тестов.
- `pnpm exec tsc --noEmit` прошёл успешно.
- Focused ESLint для изменённых auth/API/app файлов прошёл успешно.
- Storybook tests не запускались, потому что UI и stories не изменялись.

### 2026-07-13

#### Auth

- Автоматическое добавление Bearer token и повтор запросов после `401` отложены до интеграции первого защищённого endpoint, чтобы не поддерживать невостребованный replay-flow заранее.
- OpenAPI-клиент пока отвечает только за типизированные запросы и отправку credential cookie; стартовый refresh сохраняет защиту от параллельных вызовов через общий promise.

#### Verification

- `pnpm exec vitest run --project unit` прошёл успешно: 14 файлов, 69 тестов.
- `pnpm exec tsc --noEmit` прошёл успешно.
- Focused ESLint для изменённых auth/API файлов прошёл успешно.
- Storybook tests не запускались, потому что UI и stories не изменялись.

### 2026-07-12

#### Auth

- Самописное memory-хранилище access token и React Context заменены на единый vanilla Zustand store в `shared/auth`; стартовый refresh и очистка TanStack Query cache вынесены в `SessionBootstrap` уровня `app`.
- Добавлена зафиксированная зависимость `zustand` версии `5.0.14` без persist и devtools middleware; access token по-прежнему хранится только в памяти вкладки.
- Авторизация переведена с layout-мока на клиентскую сессию: при загрузке выполняется `POST /api/v1/auth/refresh-token`, access token хранится только в памяти, а shell переключается между loading, authenticated и guest состояниями.
- OpenAPI-клиент отправляет credential cookie, добавляет Bearer token и после `401` выполняет один общий refresh для параллельных запросов с однократным повтором исходного запроса; auth-ручки исключены из retry-цикла.
- Login сохраняет выданный access token, а logout вызывает backend, очищает локальную сессию и весь React Query cache даже при ошибке запроса.
- Добавлены unit-тесты refresh/retry flow и Storybook-состояния `AppShellView`; trigger `Select` получил доступное имя без визуального изменения.
- Login mutation переведена на типизированный `POST /api/v1/auth/login` через OpenAPI-клиент: payload использует `SchemaLoginDto`, успешный результат возвращает `SchemaAccessTokenResponseDto`, а HTTP-ошибки отклоняются до внедрения общего API middleware.
- Состояние истёкшей ссылки подтверждения email приведено к desktop- и mobile-макетам Figma; на мобильном экране сохранено поле email и разрешён вертикальный скролл без перекрытия элементов.
- После успешной повторной отправки expired-экран остаётся открытым, а результат показывается общей `EmailSentModal` с введённым адресом, кнопкой `OK` и закрытием по крестику или backdrop.
- Дублирующая `SignUpSuccessModal` удалена: регистрация использует `entities/auth/EmailSentModal` через публичный API, сохраняя запрет закрытия по backdrop с помощью `disablePointerDismissal`.
- Общая иллюстрация `timeManagementRafiki.png` перенесена из feature-слайса восстановления пароля в `src/shared/assets` для корректного переиспользования независимыми FSD-слайсами.

#### Verification

- `pnpm exec vitest run --project unit` прошёл успешно: 15 файлов, 73 теста.
- `pnpm exec tsc --noEmit` и `pnpm build` прошли успешно.
- Focused ESLint и Stylelint для изменённых auth/session/app-shell файлов прошли; общий `pnpm lint` не прошёл из-за существующей сортировки экспортов в public API `alert`, `icon`, `select` и `navigation`.
- Все Storybook stories прошли функциональные тесты; focused a11y-проверка нового shell сохраняет существующее нарушение контраста primary-кнопки `Sign up`, визуальные стили не изменялись.
- `pnpm exec eslint src/features/sign-in/api/useLoginMutation.ts` прошёл успешно.
- ESLint прошёл для обновлённых auth, sign-up, confirm-email и password-recovery компонентов и stories.
- `pnpm exec stylelint src/pages/confirm-email/ui/ConfirmEmailView.module.css src/entities/auth/ui/EmailSentModal.module.css` прошёл успешно.
- Focused Storybook-проверка `EmailSentModal`, `SignUpForm`, `ConfirmEmailView` и `PasswordRecoveryExpiredLink` прошла успешно: 4 файла, 9 тестов.
- `pnpm exec next typegen` успешно обновил типы маршрутов после удаления устаревших route-файлов.
- `pnpm exec tsc --noEmit` прошёл успешно.

### 2026-07-11

#### Auth

- Успешное состояние подтверждения email приведено к desktop- и mobile-макетам Figma: добавлены адаптивная композиция, точные размеры и интервалы, полноширинная мобильная кнопка и центрирование на широких экранах.
- Иллюстрация успешного подтверждения экспортирована из Figma в SVG и хранится локально в `assets` page-slice `confirm-email`; для изображения задано доступное текстовое описание.
- Подтверждение регистрации переведено на типизированный `POST /api/v1/auth/registration/confirmation` через OpenAPI-клиент и TanStack Query mutation.
- API-сценарий подтверждения хранится в локальном `api` page-slice `confirm-email`; страница автоматически отправляет полученный из URL код один раз и сохраняет прежние состояния интерфейса.
- В mutation временно добавлено отклонение неуспешных HTTP-ответов до внедрения централизованной обработки ошибок в OpenAPI-клиенте.
- Повторная отправка письма подтверждения хранится рядом с подтверждением в `src/pages/confirm-email/api` и использует типизированный `POST /api/v1/auth/registration/resend-confirmation` без устаревшего `baseUrl`.
- Временная нормализация OpenAPI-ошибок регистрации, подтверждения и повторной отправки помечена единым `TODO(api-error-middleware)` для удаления после внедрения middleware.
- Frontend-маршрут подтверждения регистрации приведён к backend-контракту `/auth/registration/confirmation`; старый моковый маршрут `/confirm-email` удалён без redirect.

#### Verification

- `pnpm exec eslint src/pages/confirm-email/ui/ConfirmEmailView.tsx` прошёл успешно.
- `pnpm exec stylelint src/pages/confirm-email/ui/ConfirmEmailView.module.css` прошёл успешно.
- `pnpm exec vitest run --project storybook src/pages/confirm-email/ui/ConfirmEmailView.stories.tsx` прошёл успешно: 1 файл, 5 тестов.
- `pnpm exec tsc --noEmit` не прошёл из-за устаревших `.next/types`, которые ссылаются на уже удалённые route-файлы `registration-confirmation` и `resend-registration-email`; изменённый UI новых TypeScript-ошибок не добавил.
- `pnpm exec next typegen` успешно обновил типы маршрутов.
- `pnpm exec eslint src/pages/confirm-email` прошёл успешно после переноса API-хуков в page-slice.
- Проверка ESLint для затронутой регистрации завершилась без ошибок; сохранено существующее предупреждение React Compiler о `watch()` из React Hook Form.
- `pnpm exec tsc --noEmit` прошёл успешно.
- Storybook tests не запускались, потому что UI-компоненты и stories не изменялись, а замена API transport ими не покрывается.

### 2026-07-09

#### Shared API

- Подключены `openapi-fetch` и `openapi-typescript` для постепенного перехода к типизированному OpenAPI-клиенту без изменения текущего `baseApi`.
- Добавлена базовая OpenAPI-точка входа `src/shared/api/openapi` и команда `pnpm api:generate`, которая генерирует типы из backend OpenAPI-контракта.
- Добавлена временная команда `pnpm api:generate:insecure` для локальной генерации типов при проблемном учебном TLS-сертификате backend; после настройки доверенного сертификата ее можно удалить из `package.json`.
- Удалена временная локальная OpenAPI-заглушка `openapi/schema.yaml`, чтобы единственным источником типов был backend-контракт.

#### Verification

- `pnpm api:generate:insecure` прошел успешно локально после временного отключения проверки TLS-сертификата.
- `pnpm exec tsc --noEmit` прошел успешно.
- `pnpm exec eslint src/shared/api/openapi/client.ts src/shared/api/openapi/index.ts` прошел успешно.
- Storybook tests не запускались, потому что UI и stories не изменялись.

### 2026-06-21

#### Auth

- Общие RHF-правила валидации email и пароля вынесены в модель `entities/auth` и опубликованы через публичный API сущности.
- Регистрация и создание нового пароля используют единый обязательный контракт: длина 6–20, наличие цифры, строчной и заглавной латинских букв и только разрешённые специальные символы.
- Для нарушения границ длины пароля обе формы показывают отдельные сообщения `Minimum number of characters 6` и `Maximum number of characters 20`.
- Подтверждение пароля проверяется общей auth-функцией и при несовпадении показывает `Passwords must match`; обе формы выполняют первичную валидацию после blur, пустые пароль и подтверждение блокируют отправку без отдельных required-сообщений, а заполненное подтверждение повторно проверяется при изменении основного пароля.
- Правила username и подтверждения пароля оставлены локальными в соответствующих features; валидация формы создания нового пароля отделена от управляющего хука.
- Добавлены unit-тесты публичных auth-правил и адаптации проверки совпадения нового пароля; дублирующие проверки внутренней сборки правил исключены.

#### Verification

- `pnpm exec tsc --noEmit` прошёл успешно.
- `pnpm exec eslint src/entities/auth src/features/sign-in src/features/sign-up src/features/create-new-password` завершился без ошибок: 18 существующих предупреждений о форматировании stories и совместимости React Compiler с `watch()` из React Hook Form.
- `pnpm exec vitest run --project unit` прошёл успешно: 11 файлов, 63 теста.
- `pnpm exec vitest run --project unit src/entities/auth/model/validationRules.test.ts src/features/create-new-password/model/validationRules.test.ts` прошёл успешно: 2 файла, 21 тест.
- Storybook MCP-проверки прошли для 6 затронутых stories; найденный контраст текста ошибок 3.18:1 принят как соответствующий дизайну и не считается блокером задачи.
- `pnpm build` прошёл успешно.

### 2026-06-18

#### Tooling

- Docker-сборка закреплена на `pnpm@10.24.0`, чтобы Jenkins не использовал плавающий `pnpm@latest` и не падал на политике approved builds для `esbuild`.
- Storybook stories исключены из production TypeScript-проверки Next.js, потому что они проверяются Storybook toolchain и не должны блокировать Docker build приложения.

#### Verification

- `$env:CI='true'; pnpm install --frozen-lockfile` прошел успешно.
- `pnpm build` прошел успешно.
- `docker version` не запускался: Docker CLI недоступен в локальном окружении.

### 2026-06-15

#### Auth

- Добавлены unit-тесты на OAuth authorize endpoint helper, Google authorize URL builder и real Google OAuth exchange.
- Frontend OAuth API adapter и типы переименованы с sign-in терминологии на exchange терминологию: `exchangeOAuthCode`, `OAuthExchangePayload`, `OAuthExchangeResult`.

- Social-кнопки Google и GitHub на форме входа переведены на shared `Button` на базе Base UI; временный `aria-busy` для Google OAuth убран, а disabled-состояние синхронизировано с Base UI `data-disabled`.
- Social-кнопки Google и GitHub на форме регистрации также переведены на shared `Button` с тем же локальным поведением hover/active.
- Social-кнопки Google и GitHub на форме регистрации теперь запускают тот же OAuth redirect-flow, что и форма входа.
- OAuth-кнопки на формах входа и регистрации теперь запускают `/authorize` через нативный `href` внутри Base UI `Button`, чтобы возврат через browser Back после внешнего Google/GitHub redirect не зависел от восстановленных React click handlers.
- Добавлен mock GitHub OAuth backend рядом с Google flow: `/api/mock/auth/oauth/github/authorize` создает `state`, ставит HttpOnly cookie и редиректит на GitHub authorize URL, а `/api/mock/auth/oauth/github/exchange` валидирует `code/state`, выставляет mock session cookies и очищает state cookie.
- GitHub OAuth exchange теперь работает в гибридном режиме как Google: mock authorization code возвращает mock-пользователя, а реальный GitHub `code` обменивается на access token, загружает профиль `/user` и при необходимости берет primary verified email через `/user/emails`.
- Общая часть mock OAuth backend вынесена в общий каркас для state cookie и exchange handler, чтобы Google и GitHub использовали один механизм проверки `code/state`, установки session cookies и обработки ошибок.
- Frontend OAuth-flow теперь запускает GitHub через конфигурируемый mock authorize endpoint, а новый route `/auth/github/callback` разбирает callback params и отправляет `code/state` в GitHub mock exchange endpoint.
- Frontend callback-логика Google и GitHub объединена: два callback URL сохранены, но parser, API client, hook и spinner processor теперь общие и выбирают exchange endpoint по provider.
- GitHub OAuth client id и secret добавлены в локальный `.env.local`; исходный код продолжает читать значения через переменные окружения.
- Для GitHub OAuth добавлены unit-тесты API клиента, callback parser, state cookie, exchange handler и реального GitHub OAuth client exchange.

#### Verification

- `pnpm exec eslint app/api/mock/auth/oauth src/features/oauth-sign-in src/features/sign-in src/features/sign-up src/pages/oauth-callback "app/(auth)/auth/google/callback" "app/(auth)/auth/github/callback"` прошел успешно.
- `pnpm exec vitest run --project unit` прошел успешно: 9 файлов, 42 теста.

- `pnpm exec eslint app/api/mock/auth/oauth src/features/oauth-sign-in src/pages/github-oauth-callback "app/(auth)/auth/github/callback" src/shared/config` прошел успешно.
- `pnpm exec eslint src/features/sign-in src/features/oauth-sign-in src/shared/ui/button` прошел успешно.
- `pnpm exec eslint src/features/sign-up src/features/sign-in src/shared/ui/button` прошел успешно.
- `pnpm exec eslint src/features/sign-up src/features/sign-in src/features/oauth-sign-in` прошел успешно.
- `pnpm exec eslint "app/(auth)/auth/google/callback" "app/(auth)/auth/github/callback" src/features/oauth-sign-in src/pages/oauth-callback` прошел успешно.
- `pnpm exec eslint src/features/oauth-sign-in src/features/sign-in` прошел успешно.
- `pnpm exec vitest run --project unit` прошел успешно: 7 файлов, 35 тестов.
- `pnpm exec tsc --noEmit` прошел успешно.
- `pnpm build` прошел успешно.
- Storybook tests не запускались, потому что stories и shared UI-компоненты не изменялись.

### 2026-06-14

#### Auth

- Google OAuth callback parser теперь отклоняет неоднозначный callback, если Google вернул одновременно `code` и OAuth-ошибку.
- Google OAuth callback parser оставлен Google-specific и разбирает только `code`, `state` и `error`; расширение под GitHub OAuth отложено до появления отдельного GitHub flow.
- В `useGoogleOAuthCallback` ошибка callback-flow переименована в `signInError`, чтобы отличать входную OAuth-ошибку из URL от общей ошибки завершения входа.
- Google OAuth callback page упрощена до технического spinner-экрана, а ошибки Google callback и backend exchange теперь редиректят пользователя обратно на страницу входа без отображения alert.
- Технический Google OAuth callback spinner/processor перенесен из FSD page-slice в `features/oauth-sign-in`, потому что он реализует бизнес-сценарий завершения OAuth-входа, а не page-level композицию.
- Для Google OAuth callback parser добавлены unit-тесты на успешный callback, OAuth-ошибку, отсутствие параметров, повторяющиеся query-параметры и конфликт `code` с `error`.
- Для Google OAuth API client добавлены unit-тесты на POST payload, успешный JSON response, backend error message и fallback error при невалидном error response.
- Для mock Google OAuth backend добавлены unit-тесты на state cookie, fail-closed state validation, успешный exchange с session cookies и ошибочный mock scenario.

#### Tests

- В Vitest добавлен отдельный `unit` project для запуска обычных unit-тестов без Storybook browser runner, включая поддержку alias `@/*`.

#### Verification

- `pnpm exec eslint src/features/oauth-sign-in src/pages/google-oauth-callback src/pages/sign-in "app/(auth)/auth/google/callback" "app/(auth)/sign-in"` прошел успешно.
- `pnpm exec eslint app/api/mock/auth/oauth/google/_mock src/features/oauth-sign-in/api src/pages/google-oauth-callback/model vitest.config.ts` прошел успешно.
- `pnpm exec vitest run --project unit` прошел успешно: 4 файла, 20 тестов.
- `pnpm exec tsc --noEmit` прошел успешно.
- Storybook MCP `run-story-tests` для удаленной OAuth-error story больше не применим; проверка ранее показывала существующую проблему контраста у primary-кнопки `Sign In`.

### 2026-06-13

#### Auth

- OAuth callback route теперь использует parser из page-slice `google-oauth-callback`, который нормализует query-параметры Google callback и отклоняет повторяющиеся OAuth-параметры вместо выбора первого значения.
- Валидация callback search params вынесена из Next.js route-файла в FSD page-slice, чтобы root `app` оставался тонким routing-слоем.

#### Verification

- `pnpm exec eslint "app/(auth)/auth/google/callback" src/pages/google-oauth-callback src/features/oauth-sign-in src/features/sign-in` прошел успешно.
- `pnpm exec tsc --noEmit` прошел успешно.

### 2026-06-12

#### Auth

- Из `useOAuthSignIn` удалено фиктивное поле `error: null`, так как старт OAuth-flow выполняется через browser redirect, а реальные ошибки обрабатываются на callback-странице.
- Mock Google OAuth exchange теперь отклоняет callback без сохраненного `state` cookie или без `state` в payload, чтобы CSRF-проверка работала по fail-closed модели.

#### Verification

- `pnpm exec eslint app/api/mock/auth/oauth/google src/features/oauth-sign-in src/features/sign-in` прошел успешно.

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
### 2026-06-14

#### Shared UI

- `Recaptcha` переведена на строго контролируемый контракт: компонент больше не хранит внутреннее состояние, не запускает таймер проверки и только сообщает родителю о запросе проверки через `onVerifyRequest`.
- Storybook-сценарии `Recaptcha` обновлены под внешний state, а форма восстановления пароля использует новый callback-контракт без изменения пользовательского поведения.
- Из публичного `RecaptchaState` удалено состояние `hover`; наведение осталось обычным CSS-состоянием, а не частью controlled API.

#### Auth

- В форме восстановления пароля изменение email теперь инвалидирует текущую mock reCAPTCHA и отменяет незавершенный таймер проверки, чтобы старый результат не мог подтвердить новый email.
- Submit-условие формы восстановления пароля выделено в `canSubmit`, а `disabled`-состояние кнопки теперь является производным от этого сценарного условия.
- Добавлен Storybook-сценарий на быстрый ввод нового email во время `loading`-состояния reCAPTCHA.

#### Verification

- `pnpm exec eslint src/shared/ui/recaptcha/Recaptcha.tsx src/shared/ui/recaptcha/Recaptcha.stories.tsx src/features/forgot-password/ui/ForgotPasswordForm.tsx` прошел успешно.
- `pnpm exec eslint src/features/forgot-password/model/useForgotPasswordForm.ts src/features/forgot-password/ui/ForgotPasswordForm.stories.tsx` прошел успешно.
- `pnpm exec eslint src/shared/ui/recaptcha/Recaptcha.tsx src/shared/ui/recaptcha/Recaptcha.stories.tsx src/features/forgot-password/model/useForgotPasswordForm.ts src/features/forgot-password/ui/ForgotPasswordForm.stories.tsx` прошел успешно.
- `pnpm exec tsc --noEmit` прошел успешно.
- `pnpm exec vitest run --project storybook src/shared/ui/recaptcha/Recaptcha.stories.tsx` прошел успешно; первый запуск упал на Vite dependency optimization reload, повторный запуск прошел: 8 тестов.
- `pnpm exec vitest run --project storybook src/features/forgot-password/ui/ForgotPasswordForm.stories.tsx` прошел успешно: 2 теста.
- `pnpm exec vitest run --project storybook src/shared/ui/recaptcha/Recaptcha.stories.tsx src/features/forgot-password/ui/ForgotPasswordForm.stories.tsx` прошел успешно: 9 тестов.

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
