# Changelog

Все значимые изменения проекта документируются в этом файле.

## Unreleased

### 2026-08-12

#### Profile SSR

- Переходы к просмотру публикации унифицированы: посты на главной ведут на `/profile/{ownerId}?postId={postId}&returnTo=/`, а профильная модалка использует общий helper для закрытия.
- На главной просмотр поста открывается поверх текущего списка публикаций без визуального перехода на профильный список автора; прямой вход по URL всё ещё открывает профиль с выбранным постом.
- Закрытие post modal теперь возвращает на `/` только при безопасном `returnTo=/`; внешние и небезопасные значения игнорируются, а обычное закрытие остаётся на профиле автора без `postId`.
- Storybook-сценарии главной и профиля проверяют URL открытия поста с главной, прямой вход с `postId` и возврат через `returnTo`.

#### Verification

- `pnpm exec vitest run --project unit src/widgets/profile-posts/lib/profilePostUrl.test.ts` прошёл успешно.
- `pnpm test:unit` прошёл: 44 файла, 257 тестов.
- `pnpm exec vitest run --project storybook src/pages/home/ui/HomePage.stories.tsx src/pages/profile/ui/ProfilePage.stories.tsx` прошёл успешно.
- `pnpm exec tsc --noEmit --pretty false` прошёл успешно.
- `pnpm exec eslint src/pages/home/model/useHomePostModal.ts src/pages/home/ui/HomePostsGrid.tsx src/pages/home/ui/HomePage.tsx src/pages/home/ui/HomePage.stories.tsx src/widgets/profile-posts/lib/profilePostUrl.ts src/widgets/profile-posts/lib/profilePostUrl.test.ts src/widgets/profile-posts/ui/ProfilePostsGrid.tsx src/widgets/profile-posts/index.ts src/pages/profile/ui/ProfilePage.stories.tsx` прошёл успешно.

### 2026-08-11

#### Profile SSR

- Первая SSR-страница постов профиля теперь передается в `useProfilePostsQuery()` как `initialData` React Query infinite query.
- Для SSR-seed данных задан короткий `staleTime`, чтобы после гидрации клиент не отправлял дублирующий запрос за той же первой страницей.
- Добавлена unit-проверка формы `pages/pageParams`, которую ожидает TanStack Query для infinite query.
- Выбранный пост на странице профиля теперь синхронизирован с URL `?postId=...`: открытие публикации делает client navigation, закрытие удаляет параметр, а прямой SSR-вход использует `initialSelectedPost`.
- Добавлен внутренний helper сборки URL профиля с unit-проверками сохранения сторонних query params и удаления `postId`.

#### Shared UI

- Кнопка закрытия `Modal` теперь получает `disabled` при `dismissDisabled`, чтобы pending-состояния блокировали все способы закрытия и Storybook-сценарий соответствовал поведению компонента.

#### Verification

- `pnpm exec vitest run --project unit src/entities/post/api/profilePostsQueryData.test.ts` прошёл успешно.
- `pnpm exec vitest run --project unit src/widgets/profile-posts/lib/profilePostUrl.test.ts src/entities/post/api/profilePostsQueryData.test.ts` прошёл успешно.
- `pnpm test:unit` прошёл: 44 файла, 253 теста.
- `pnpm exec vitest run --project storybook src/pages/profile/ui/ProfilePage.stories.tsx` прошёл успешно.
- `pnpm exec vitest run --project storybook src/pages/profile/ui/ProfilePage.stories.tsx src/shared/ui/modal/Modal.stories.tsx` прошёл успешно.
- `pnpm exec vitest run --project storybook src/shared/ui/modal/Modal.stories.tsx` прошёл успешно.
- `pnpm exec eslint src/entities/post/api/useProfilePostsQuery.ts src/entities/post/api/profilePostsQueryData.ts src/entities/post/api/profilePostsQueryData.test.ts src/widgets/profile-posts/ui/ProfilePostsGrid.tsx` прошёл успешно.
- `pnpm exec eslint src/widgets/profile-posts/ui/ProfilePostsGrid.tsx src/widgets/profile-posts/lib/profilePostUrl.ts src/widgets/profile-posts/lib/profilePostUrl.test.ts src/pages/profile/ui/ProfilePage.stories.tsx src/shared/ui/modal/Modal.tsx` прошёл успешно.
- `pnpm exec tsc --noEmit` прошёл успешно.
- `pnpm exec tsc --noEmit --pretty false` прошёл успешно.
- `pnpm exec prettier --check CHANGELOG.md src/entities/post/api/useProfilePostsQuery.ts src/entities/post/api/profilePostsQueryData.ts src/entities/post/api/profilePostsQueryData.test.ts src/widgets/profile-posts/ui/ProfilePostsGrid.tsx` прошёл успешно.

### 2026-08-10

#### Profile SSR

- Добавлены публичные mock-данные профиля и server-safe reader `getPublicProfile()` для будущего SSR `/profile/{id}`.
- Добавлены server-safe readers постов `getProfilePostsServer()` и `getPostServer()`, которые читают mock store напрямую без HTTP-запроса к route handler.
- Mock store постов получил `countUserPosts()`; счетчик публикаций профиля теперь можно получать из фактического состояния постов.
- Route `/profile/[id]` принимает async `searchParams`, нормализует `postId` из query string и передает его в page-level `ProfilePage`.
- Добавлен route-local unit-тест нормализации `postId`, включая повторяющийся query param.
- `ProfilePage` переведена в server container: на сервере загружает публичный профиль, первую страницу постов и выбранный пост из `postId`, а некорректные profile/post сочетания отправляет в `notFound()`.
- Синхронный `ProfilePageView` получает server data пропсами и рендерит публичный профиль без placeholder-статистики.
- Добавлена unit-проверка, что выбранный пост принадлежит открытому профилю.

#### Verification

- `pnpm exec vitest run --project unit src/pages/profile/api/profile.server.test.ts src/entities/post/api/postsApi.server.test.ts src/shared/api/mock/postsStore.test.ts` прошёл успешно.
- `pnpm exec vitest run --project unit app/'(main)'/profile/'[id]'/normalizePostId.test.ts` прошёл успешно.
- `pnpm exec vitest run --project unit src/pages/profile/model/selectedProfilePost.test.ts src/pages/profile/api/profile.server.test.ts src/entities/post/api/postsApi.server.test.ts src/shared/api/mock/postsStore.test.ts` прошёл успешно.
- `pnpm exec vitest run --project storybook src/pages/profile/ui/ProfilePage.stories.tsx` прошёл успешно.
- `pnpm exec eslint app/'(main)'/profile/'[id]'/page.tsx app/'(main)'/profile/'[id]'/normalizePostId.ts app/'(main)'/profile/'[id]'/normalizePostId.test.ts src/pages/profile/ui/ProfilePage.tsx src/pages/profile/ui/ProfilePage.stories.tsx` прошёл успешно.
- `pnpm exec eslint src/pages/profile/ui/ProfilePage.tsx src/pages/profile/ui/ProfilePageView.tsx src/pages/profile/ui/ProfilePage.stories.tsx src/pages/profile/model/selectedProfilePost.ts src/pages/profile/model/selectedProfilePost.test.ts src/widgets/profile-posts/ui/ProfilePostsGrid.tsx` прошёл успешно.
- `pnpm exec prettier --check CHANGELOG.md app/'(main)'/profile/'[id]'/page.tsx app/'(main)'/profile/'[id]'/normalizePostId.ts app/'(main)'/profile/'[id]'/normalizePostId.test.ts src/pages/profile/ui/ProfilePage.tsx src/pages/profile/ui/ProfilePage.stories.tsx` прошёл успешно.
- `pnpm exec prettier --check src/pages/profile/ui/ProfilePage.tsx src/pages/profile/ui/ProfilePageView.tsx src/pages/profile/ui/ProfilePage.stories.tsx src/pages/profile/model/selectedProfilePost.ts src/pages/profile/model/selectedProfilePost.test.ts src/widgets/profile-posts/ui/ProfilePostsGrid.tsx` прошёл успешно.
- `pnpm exec tsc --noEmit` прошёл успешно.
- `pnpm build` был остановлен вручную после длительного зависания на этапе `Creating an optimized production build ...` без вывода ошибок.
- Storybook MCP `run-story-tests` для `ProfilePage` не завершился за 300 секунд; focused story-тест запущен локально через Vitest.
- Storybook MCP `get-storybook-story-instructions` и `preview-stories` для `ProfilePage` не завершились за 300 секунд.
- `pnpm lint` запускался, но не прошёл из-за прежних предупреждений Prettier в сгенерированном `src/shared/api/openapi/schema.d.ts` и существующего предупреждения React Compiler вне этой правки.

### 2026-08-05

#### Create Post

- Хуки создания поста приведены к более чистой модели для React 19: побочные эффекты `URL.createObjectURL`/`URL.revokeObjectURL` и синхронизация выбранного фото больше не выполняются внутри updater-функций `setState`.
- Ручные `useCallback` убраны из create-post hooks там, где они не дают полезного стабильного контракта и дублируют работу React Compiler.
- Скрытый file input на шаге `Cropping` получил доступное имя `Add photos`, поэтому новый критичный Storybook a11y label-issue закрыт.
- Storybook-проверка удаления фото теперь проверяет количество оставшихся thumbnail-кнопок, а не нестабильную подпись после переиндексации.

#### Verification

- `pnpm lint` прошёл без ошибок; остаются существующие предупреждения проекта в `src/shared/api/openapi/schema.d.ts` и `src/features/sign-up/model/useSignUpForm.ts`.
- `pnpm exec tsc --noEmit` прошёл без ошибок.
- `pnpm test:unit` прошёл: 28 файлов, 151 тест.
- Storybook MCP focused tests для `CreatePostModal` (`crop`, `filters`, `publication`) прошли с `a11y: false`.
- Storybook a11y для тех же сценариев больше не показывает label-ошибку file input; остаются существующие contrast-нарушения общей цветовой системы `Button`/`TextArea`, визуальные цвета в этой правке не менялись.
- `pnpm build` был запущен, но остановлен вручную: Next.js/Turbopack завис на этапе `Creating an optimized production build ...` без дальнейшего вывода.

### 2026-08-04

#### Create Post

- В шагах `Filters` и `Publication` добавлена стрелка назад в заголовке модального wizard-а создания поста; на `Cropping` стрелки назад нет, потому что управление выбранными фото доступно прямо на этом шаге.
- Нижние текстовые кнопки `Back` в editor-шагах убраны, чтобы не дублировать действие.
- В `Cropping` рядом с выбранными миниатюрами появилась icon-кнопка добавления фото, а на самих миниатюрах — крестик удаления отдельного фото.
- Ошибки дозагрузки фото на `Cropping` теперь показываются рядом с миниатюрами, включая лимит 10 фото и неверный формат/размер файла.
- `shared/ui/Modal` получил необязательный левый слот заголовка `headerStart`; без него существующие модалки сохраняют прежнюю раскладку.
- Storybook-сценарии `Crop With One Photo` и `Crop With Several Photos` проверяют отсутствие header back-кнопки на crop и удаление выбранного фото из миниатюр.

#### Verification

- `pnpm lint` прошёл без ошибок; остаются существующие предупреждения проекта в `src/shared/api/openapi/schema.d.ts` и `src/features/sign-up/model/useSignUpForm.ts`.
- `pnpm exec vitest run --project storybook src/features/create-post/ui/stories/CreatePostFlow.stories.tsx` прошёл: 6 story-тестов.
- Storybook MCP focused tests для `CreatePostModal` (`crop`, `filters`, `publication`) прошли с `a11y: false`.
- Storybook a11y для `crop` не проходит из-за существующего contrast у primary-кнопки `Next`; цветовую систему кнопок в этом фиксе не меняли.
- `pnpm exec stylelint src/shared/ui/modal/Modal.module.css src/features/create-post/ui/createPost.module.css` не прошёл из-за существующих нарушений в `createPost.module.css` (`clip`, порядок старых свойств, `:global`).
- `pnpm exec tsc --noEmit` не прошёл из-за stale `.next/types/validator.ts`, который ссылается на отсутствующие route-файлы.

### 2026-08-10

#### Profile Avatar

- Состояние `manage-profile-avatar` разделено по операциям: `useProfileAvatar` отвечает только за чтение текущего аватара, `useUploadProfileAvatar` — за выбор файла, crop и загрузку, `useDeleteProfileAvatar` — за подтверждение и удаление.
- Общая нормализация ошибок upload/delete вынесена в `getProfileAvatarErrorMessage`; компонент `ProfileAvatar` теперь только объединяет независимые hooks.
- Локальный helper ошибок помечен `TODO(api-errors)` для замены общим API error handler и последующего удаления файла после появления глобальной обработки ошибок.
- Подпись кнопки управления аватаром теперь отражает состояние профиля: без фотографии показывается `Add Profile Photo`, после загрузки — `Select Profile Photo`, после удаления снова — `Add Profile Photo`.

#### Verification

- Локальные `tsc --noEmit` и ESLint для `manage-profile-avatar` прошли.
- Unit-тест `profileAvatarFile.test.ts` прошёл: 4 теста.
- Все 10 Storybook-сценариев `ProfileAvatar` функционально прошли; a11y-аудит повторно зафиксировал существующие нарушения контраста общих вариантов `Button`.
- Широкий функциональный Storybook-прогон прошёл для затронутых сценариев и выявил два несвязанных существующих падения `HomePage` (`default` и `no-posts`).

### 2026-08-09

#### Profile Photo

- Feature управления аватаром переименована из `manage-profile-photo` в `manage-profile-avatar`; технические имена компонентов, hooks, API-функций, helpers и тестов приведены к единой терминологии `Avatar`, пользовательские тексты `Profile Photo` сохранены.
- Ручные типы профиля, выбор размера аватара и клиентские запросы к временному мок-API помечены единым `TODO(profile-api)` для пересмотра по контракту backend, перехода на сгенерированные OpenAPI-типы и типизированный клиент после появления профильных endpoints в схеме.
- В настройках профиля добавлены загрузка JPEG/PNG до 10 МБ, круглое позиционирование изображения через `react-easy-crop`, сохранение аватара и подтверждаемое удаление фотографии.
- Загрузка и удаление используют `POST/DELETE /api/v1/profile/avatar`; из массива размеров выбирается самый большой аватар. Мок-API поддерживает размеры 192×192 и 45×45 и отдаёт загруженное изображение отдельным route handler.
- Клиентская ошибка формата и размера, а также серверные ошибки отображаются через общий `Alert` над содержимым модального окна. Во время запроса закрытие и действия модалки заблокированы.
- Закрытие, сохранение и удаление фотографии больше не запускают повторную навигацию на уже открытую вкладку `info`, поэтому отмена не вызывает лишний запрос профиля; mutations обновляют профиль непосредственно в query-кеше без сброса несохранённых полей формы.
- Общая JPEG/PNG-валидация вынесена в `shared`, профиль и его query-контракт перенесены в FSD-сущность `profile`; `Modal` и `ConfirmDialog` расширены поддержкой недоступного закрытия и серверной ошибки.
- Добавлены unit-тесты валидации, выбора размера аватара и мок-обработчиков, а также Storybook-сценарии загрузки, ошибки, кадрирования, удаления, ожидания запроса и сохранения черновика формы.

#### Protected Routes

- Маршруты `/settings`, `/create` и `/profile` объединены route group `(protected)` и используют единый клиентский `ProtectedRoute` вместо локальных проверок сессии в страницах.
- Гости перенаправляются с `/settings` и `/create` на `/sign-in`, а с `/profile` — на `/`; авторизованный переход на `/profile` заменяется адресом собственного мок-профиля. Публичный `/profile/[id]` остаётся без guard.
- Для общего guard добавлены Storybook-сценарии состояний `loading`, `guest` и `authenticated`; прежняя проверка редиректа удалена из `SettingsPage`, которая теперь отвечает только за вкладки настроек.

#### Settings Navigation

- Страница настроек использует query-параметр `part` для вкладок `info`, `devices`, `subscriptions` и `payments`; активная вкладка синхронизирована с URL, а переключения сохраняются в истории браузера.
- Отсутствующее, повторяющееся или неизвестное значение `part` перенаправляется на `/settings?part=info`. Для будущих разделов добавлены пустые панели без реализации чужой бизнес-логики.

#### Profile Settings

- Режим валидации формы изменён на `onTouched`: первая проверка поля по-прежнему выполняется после потери фокуса, а исправление уже затронутого поля сразу обновляет ошибку и доступность кнопки сохранения.
- Storybook-сценарий фиксирует переход username из ошибочного в валидное состояние без дополнительного blur.

#### Verification

- `node_modules/.bin/vitest.cmd run --project storybook src/features/manage-profile-avatar/ui/ProfileAvatar.stories.tsx src/pages/settings/ui/SettingsPage.stories.tsx` прошёл: 2 файла, 13 тестов; Storybook MCP был недоступен.
- `pnpm exec tsc --noEmit` прошёл.
- `pnpm lint` прошёл без ошибок с 1204 существующими предупреждениями репозитория.
- Полный `pnpm test:unit` прошёл: 38 файлов, 234 теста.
- `pnpm run build` и `pnpm build-storybook --quiet` прошли.
- Все затронутые Storybook-сценарии прошли; широкий прогон также выявил несвязанное падение существующего `pages-home-homepage--default` и ранее существующие a11y-замечания по контрасту общих цветовых токенов.

- `pnpm exec tsc --noEmit --pretty false` прошёл.
- ESLint для изменённых файлов формы и Storybook прошёл без ошибок и предупреждений.
- Полный `pnpm test:unit` прошёл: 33 файла, 212 тестов.
- Целевые Storybook-тесты не запущены через MCP, потому что его runner занят другим прогоном; прямой fallback-прогон не подключился к browser session из-за уже занятого порта `63315`.
- TypeScript и ESLint для навигации настроек прошли через локальные исполняемые файлы проекта.
- Полный unit-набор после добавления проверки `part` прошёл: 34 файла, 219 тестов.
- Целевой Storybook-прогон `SettingsPage` прошёл: 1 файл, 2 теста; после успешного завершения Vitest сообщил о тайм-ауте закрытия фонового процесса.
- Production-сборка Next.js 16 прошла через локальный исполняемый файл проекта; `/settings` определён как динамический серверный маршрут.
- Все 7 Storybook-сценариев `ProtectedRoute` и поведенческий сценарий `SettingsPage` прошли; a11y-прогон Settings зафиксировал принятое исключение по контрасту дизайнерской палитры.
- Полный поведенческий Storybook-прогон без a11y завершился с двумя не связанными с guard падениями существующих сценариев `HomePage`, которые ищут функцию-мок как текстовое содержимое.
- `pnpm lint` завершился без ошибок с существующими предупреждениями репозитория; `pnpm test:unit` прошёл: 34 файла, 219 тестов.
- `pnpm build` прошёл; Next.js сохранил адреса `/create`, `/profile`, `/profile/[id]` и `/settings` после переноса route-файлов в `(protected)`.

#### Notes

- Storybook выявил недостаточный контраст неактивных вкладок Settings (`2.26:1` при требовании `4.5:1`); палитра сохранена без изменений по решению владельца проекта как утверждённая дизайнером.
- Проверки навигации запускались через установленные локальные исполняемые файлы, потому что shim `pnpm` не смог проверить подпись закреплённой версии без доступа к registry.

### 2026-08-08

#### Location Data

- Runtime-зависимость от внешнего CDN заменена на версионированные статические справочники `public/locations/v1`: 250 стран и 156 025 городов генерируются вручную командой `pnpm locations:generate` из закреплённой dev-зависимости `@countrystatecity/countries`.
- Для выбранной страны браузер загружает один компактный JSON-файл и кеширует его вместе со списком стран как immutable-ресурс; генерация справочников не выполняется во время сборки или запуска приложения.
- Профиль сохраняет канонические английские `country`, `city` и `region`, выбранные на фронте. Бэкенд рассматривается как хранилище этих значений и не дополняет справочник локаций.

#### Shared UI

- `Combobox` упрощён до встроенной prefix-фильтрации Base UI по названию без отдельного поискового хука, debounce и поиска по региону; несовпавший ввод сбрасывается при blur, а пустая выдача обозначается текстом `No Results`.
- Управление вводом `Combobox` сведено к одному локальному `query`: дублирующий сброс при закрытии popup и неиспользуемое преобразование значения для скрытого form-input удалены без изменения публичного контракта.
- Страны открываются полным алфавитным списком, города ограничены первыми 50 релевантными результатами. Поле города остаётся доступным во время загрузки, сохраняет введённый запрос и блокируется с ошибкой `Failed to load cities` только при неуспешной загрузке.
- В `Combobox`, `Modal` и подтверждении закрытия создания публикации исправлены обращения к отсутствовавшим типографическим токенам.

#### Tooling

- Stylelint использует `src/app/styles/tokens.css` как reference file и правилом `no-unknown-custom-properties` запрещает неизвестные CSS custom properties без fallback; правило использования токенов задокументировано в `STYLES.md`.

#### Tests

- Локальные DTO профиля помечены для замены на сгенерированные OpenAPI-типы после появления profile endpoints в backend-схеме; ручной разбор календарной даты задокументирован как защита от timezone-сдвига.
- Ограничения длины полей профиля получили переиспользуемые именованные константы, а одинаковая валидация имени и фамилии сведена к общей фабрике с сохранением прежних текстов ошибок.
- Инициализация формы документирует двухэтапный `reset` и отложенную валидацию восстановленного черновика; лишняя мемоизация обработчика Privacy Policy удалена без изменения поведения.
- Unit-покрытие модели редактирования профиля дополнено граничными значениями username, имени, фамилии и About Me, включая обязательность, допустимые символы и ограничения длины.
- Проверки возраста фиксируют поведение для дня рождения 29 февраля и перехода года; преобразователи дат покрывают `null`, високосные и некорректные календарные даты без изменения текущего fallback.
- Черновик профиля проверяется для отсутствующей даты, повреждённого JSON, неверной структуры, некорректной даты, одноразового удаления и безопасного использования без `window` при серверном рендеринге.

#### Verification

- Целевые unit-тесты модели редактирования профиля прошли: 3 файла, 53 теста.
- Полный `pnpm test:unit` прошёл: 33 файла, 212 тестов.
- `pnpm exec tsc --noEmit --pretty false` прошёл.
- ESLint для изменённых файлов модели прошёл без ошибок; полный `pnpm lint` завершился без ошибок с 1211 ранее существующими предупреждениями.
- `node scripts/generateLocations.mjs` прошёл: создан 251 JSON-файл общим размером 8 968 545 байт.
- TypeScript, ESLint и Stylelint по затронутым файлам прошли без ошибок.
- Целевые unit-тесты прошли: 4 файла, 11 тестов.
- Браузерные Storybook-тесты `Combobox` и формы редактирования профиля прошли: 2 файла, 17 тестов.
- Проверка `no-unknown-custom-properties` по всем CSS-файлам прошла; целевой стандартный Stylelint для `Combobox` и `Modal` прошёл.
- Браузерные Storybook-тесты затронутых `Combobox`, `Modal` и `CloseCreationConfirm` прошли: 3 файла, 11 тестов.
- `pnpm dlx pnpm@10.24.0 run build` прошёл; Next.js 16 собрал 20 маршрутов.

### 2026-08-07

#### Profile Settings

- Редактирование общей информации вынесено из страницы настроек в FSD-фичу `edit-profile`; форма переведена на React Hook Form с единым для проекта режимом валидации `onBlur` и повторной проверкой `onChange`.
- Имя пользователя, имя и фамилия сделаны обязательными; дата рождения использует единую подпись `Date of birth` и передаёт выбранное значение напрямую в React Hook Form.
- Страна и город выбираются через связанные поисковые списки: смена страны очищает город и регион, поиск города начинается с двух символов и ограничен 50 результатами, а выбранный город автоматически заполняет `region` для API-контракта.
- Списки локаций загружаются на клиенте через закреплённую версию `@countrystatecity/countries-browser` с кешированием, состояниями загрузки и сообщением `Failed to load cities`; сохранённые backend-значения не теряются при ошибке CDN.
- Ссылка `Privacy Policy` отображается в ошибке возраста. Только при переходе по ней текущие значения сохраняются в `sessionStorage`, восстанавливаются и повторно валидируются после возврата; draft удаляется после чтения или успешного сохранения.
- Сохранение блокируется для неизменённой, неполной, невалидной или отправляемой формы. Успешный и ошибочный результат PUT отображается через `Alert` в позиции из макета без автоматического таймера.

#### Mock API

- Добавлен временный Next.js Route Handler `GET/PUT /api/v1/profile` с in-memory-хранилищем и валидацией входных данных; серверные поля профиля сохраняются при обновлении.
- Клиентский API профиля и TanStack Query находятся внутри `features/edit-profile`; отдельная сущность `profile` не создавалась до появления второго потребителя данных.

#### Shared UI

- `DatePicker` поддерживает составные label/error, контролируемое пустое значение и `onBlur`; пустое поле больше не подставляет текущую дату, а календарь открывается на месяце выбранной даты.
- Добавлен общий `Combobox` на Base UI: поиск по предопределённым значениям, корректный `onBlur`, восстановление выбранного значения при несовпавшем вводе и сообщения для пустой выдачи.
- В общий API-клиент добавлен JSON-метод `PUT`.

#### Privacy Policy

- Добавлена атрибуция Countries States Cities Database и лицензии ODbL 1.0 для используемых данных о локациях.

#### Verification

- `pnpm exec tsc --noEmit --incremental false` прошёл.
- `pnpm exec eslint ...` по затронутым TypeScript-файлам прошёл без ошибок и предупреждений.
- `pnpm exec stylelint ...` по затронутым CSS-файлам прошёл.
- `pnpm exec vitest run --project unit ...` прошёл: 5 файлов, 18 тестов.
- `pnpm exec vitest run --project storybook ...` прошёл: 3 файла, 19 тестов.
- `pnpm run build` прошёл; Next.js собрал 20 маршрутов, включая `/api/v1/profile` и `/settings`.
- `tsc --noEmit`, ESLint, Stylelint и проверка Prettier по затронутым файлам прошли.
- Целевые unit-тесты прошли: 4 файла, 12 тестов.
- Функциональные Storybook-тесты новых сценариев прошли; a11y-прогон сохранил ранее известные предупреждения контраста для красного текста ошибок и primary-кнопки.
- `pnpm dlx pnpm@10.24.0 run build` прошёл; Next.js собрал 20 маршрутов, включая `/privacy-policy`, `/settings` и `/api/v1/profile`.

### 2026-08-06

#### App Shell

- Маршруты без `BottomBar` вынесены во внутреннюю FSD-конфигурацию `app-shell`; нижняя мобильная навигация скрыта для настроек профиля, статистики и избранного.

#### Verification

- `pnpm exec eslint src/widgets/app-shell/ui/AppShell.tsx src/widgets/app-shell/config/appShellRoutes.ts` прошёл без ошибок.
- `pnpm exec tsc --noEmit --pretty false` прошёл без ошибок.

### 2026-08-05

#### Profile Settings

- Статический демонстрационный PNG-аватар удалён; до подключения пользовательских данных отображается нейтральный placeholder без неработающей кнопки удаления фотографии.
- Добавлена адаптивная страница общей информации профиля по макетам Figma для desktop 1280 px и mobile 360 px: аватар, поля пользователя, дата рождения, выбор страны и города, описание и кнопка сохранения.
- На desktop и mobile страна и город отображаются отдельными селектами; остальные вкладки настроек показаны как недоступные.
- Приватный маршрут `/settings` подключён к FSD-композиции `SettingsPage`; идентификатор пользователя удалён из URL, поскольку настройки всегда относятся к текущей сессии.
- Гость при прямом открытии `/settings` перенаправляется на `/sign-in`, форма не отображается во время проверки сессии, а после входа сохраняется существующий переход в `/profile`.
- Добавлены Storybook-сценарии General information и Guest redirect с проверкой активной вкладки, недоступных разделов, начальных значений, кнопки сохранения и защиты маршрута.

#### App Shell

- Для авторизованной mobile-раскладки подключён существующий `HeaderMobile` с компактным переключателем языка.
- `BottomBar` не отображается на маршруте настроек профиля; sticky-поведение общего header сохранено.

#### Verification

- После удаления mock-аватара `eslint` и `stylelint` прошли; Storybook-тест `SettingsPage` прошёл: 2 теста.
- `node_modules/.bin/eslint.CMD` по затронутым TypeScript-файлам прошёл без ошибок.
- Storybook-тесты `Header` и `HeaderMobile` прошли; обе истории `HomePage` падают на существующем locale-зависимом matcher счётчика (`2,150`/`1,000` вместо `2 150`/`1 000`).
- `node node_modules/eslint/bin/eslint.js ...` по затронутым TypeScript-файлам прошёл без ошибок.
- `node node_modules/stylelint/bin/stylelint.mjs src/pages/settings/ui/settingsPage.module.css src/widgets/app-shell/ui/AppShell.module.css` прошёл без ошибок.
- `node_modules/.bin/tsc.cmd --noEmit --pretty false` прошёл без ошибок.
- `node_modules/.bin/vitest.cmd run --project storybook ...` прошёл: 3 story-файла, 11 тестов, включая authenticated- и guest-состояния настроек.
- `pnpm run build` прошёл; Next.js собрал 19 маршрутов, включая приватный `/settings`.
- Верстка вручную сверена в Storybook при размерах 1280×794 и 360×1068.

### 2026-08-03

#### Shared Config

- Удалён мёртвый реэкспорт `OAUTH_CONFIG` из `src/shared/config/index.ts`: файл `./oauth` был удалён в `b92614e`, из-за чего баррель ломал типизацию (`TS2339: Cannot find module './oauth'`). `OAUTH_CONFIG` нигде не использовался, актуальный OAuth-код живёт в `src/features/oauth-authentication`.

- Восстановлен порядок экспортов в барреле по правилу `simple-import-sort/exports`.

#### reCAPTCHA

- Добавлен `src/shared/lib/recaptcha/grecaptcha.d.ts` — ambient-декларация `window.grecaptcha.enterprise` (`ready`, `render`, `execute`, `reset`). Скрипт грузится с CDN и присваивает объект в рантайме, поэтому свойство объявлено опциональным. Закрывает 5 ошибок `TS2339`, из-за которых `pnpm build` падал на стадии type-check. Описано только используемое API вместо установки `@types/grecaptcha`.

#### Tests

- Починены две истории в `src/pages/home/ui/HomePage.stories.tsx`. Счётчик рендерит число внутри `<span>`, а подпись — соседним текстовым узлом, поэтому `getByText` со строкой целиком не находил элемент. Ассерты переведены на матчер по обёртке `<p>`; сам компонент не менялся.

#### Verification

- `pnpm exec tsc --noEmit` — 0 ошибок.
- `pnpm build` — успешная сборка.
- `pnpm vitest run` — 355 тестов, все проходят.
- `pnpm lint` — 0 ошибок.

#### Notes

- Подготовка к релизному PR `develop` → `main` (83 коммита, 272 файла).
- Остаются 1159 предупреждений `prettier/prettier` — почти все в сгенерированном `src/shared/api/openapi/schema.d.ts`; линтер также заходит в папку артефактов `coverage/`. Не блокирует сборку, вынесено за рамки правки.

#### Home Page

- Реализована главная страница с SSG (ISR, `revalidate = 60`): сервер рендерит 4 последних поста и количество зарегистрированных пользователей, клиент проверяет авторизацию через `GET /api/mock/auth/me`.
- Созданы мок-эндпоинты: `GET /api/mock/posts?limit=4` (глобальный список постов без `userId`), `GET /api/mock/registered-users-count` (возвращает `{ totalCount: 2150 }`), `GET /api/mock/auth/me` (проверяет `Authorization: Bearer mock-token`).
- Мок-хранилища `postsStore` и `usersCountStore` вынесены из `app/api/mock/` в `src/shared/api/mock/` для доступа через `@/shared/api/mock/` из серверных компонентов.
- `SessionBootstrap` в mock-режиме (`NEXT_PUBLIC_AUTH_MOCK=true`) вызывает `checkMockAuth()` вместо `refreshSession()`.
- Компонент `HomePage` принимает `posts` и `registeredUsersCount`, рендерит заголовок «Inctagram», счётчик пользователей и сетку из 4 `PostThumbnail`.
- Добавлены Storybook-истории (`Default`, `NoPosts`).
- В `.env.local` добавлены `NEXT_PUBLIC_POSTS_API_MOCK=true` и `NEXT_PUBLIC_AUTH_MOCK=true`.

#### Verification

- `pnpm vitest run` — 151 тест, все проходят.
- `pnpm build` — успешная сборка, 17/17 страниц, главная помечена как ISR (`ƒ /`).
- `pnpm lint` — 0 ошибок в затронутых файлах.

#### Notes

- `react-easy-crop` отсутствовал в `node_modules` — установлен через `pnpm install`.

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

### 2026-08-02 — Причёсывание кода постов перед PR

#### Posts

- Общие для просмотра и редактирования поста куски вынесены в сущность: `PostAuthor` (аватар + имя автора, слот под действия) и `PostDescriptionField` (поле описания со счётчиком и общим лимитом). Разметка и стили больше не дублируются в `PostView`, `EditPostModal` и шаге публикации.
- Ширину колонки фото задаёт сама галерея, экраны только раскладывают сетку — значение перестало повторяться в двух модулях стилей.
- Галерея перезапускается с первого фото при смене поста (`key`), мок-стор получил единый доступ к имени автора и больше не реэкспортирует `MOCK_CURRENT_USER_ID` из `shared/auth`.

#### Profile

- Ошибка догрузки следующей страницы больше не убирает уже загруженные публикации: сетка остаётся на месте, под ней появляется сообщение с кнопкой `Try again`. Сентинел бесконечной прокрутки на ошибке снимается, иначе он повторял упавший запрос по кругу.
- Ручные `useCallback` в `ProfilePostsGrid` убраны: в проекте включён React Compiler (`reactCompiler` в `next.config.ts`), он мемоизирует это сам.

#### Shared UI

- `ConfirmDialog` получил `closeOnConfirm` (по умолчанию `true`). Для асинхронного действия диалог остаётся на экране до ответа сервера, и `DeletePostDialog` больше не обходит принудительное закрытие через ref.
- `baseApi` объявляет `Content-Type` только для запросов с телом.

#### Architecture

- Публичные API слайсов сведены к тому, что действительно используется снаружи: `features/edit-post` и `features/delete-post` отдают по одному компоненту, `widgets/profile-posts` — только подключённую сетку, `entities/post` больше не выставляет внутренние утилиты. Внутри слайса импорты идут по относительным путям — `EditPostModal` импортировал сам себя через `@/features/edit-post`, что замыкало цикл с `index.ts`.

#### Verification

- `pnpm lint` по файлам ветки — без замечаний, `pnpm exec tsc --noEmit` — чисто, `pnpm build` — успешно.
- `pnpm test:unit` — 149 тестов, `pnpm test:storybook` — 202 теста, `pnpm test:coverage` — 99.51% строк, 94.73% ветвей при пороге 80%.

#### Notes

- Новые стори: `ConfirmDialog / KeepsOpenOnConfirm` и `ProfilePostsGridView / LoadNextPageFailed`.
- В репозитории остаются четыре чужие ошибки `simple-import-sort/exports` (`shared/ui/icon`, `shared/ui/select`, `widgets/navigation`) — они не из этой ветки и правятся отдельно.

### 2026-08-01 — Настраиваемая задержка мок-API постов

#### Posts

- Мок-хендлеры постов умеют отвечать с задержкой: `POSTS_API_MOCK_DELAY_MS` в `.env.local` (например `500`). По умолчанию выключена — юнит-тесты и стори-прогон ждать не должны.
- Зачем: стор в памяти отвечает мгновенно, поэтому состояния загрузки (скелетоны сетки, догрузка страницы, заблокированные кнопки подтверждения) невозможно посмотреть руками.
- Задержка живёт в `_mock/mockDelay.ts` и навешивается обёрткой `withMockDelay` в `route.ts`, поэтому сами хендлеры остаются без служебного тайминга, а их тесты — без ожиданий. Значение читается на каждый запрос: правка `.env.local` подхватывается перезапуском dev-сервера, битое или отрицательное значение трактуется как отсутствие задержки.

#### Tests

- Новые unit-тесты `mockDelay`: разбор значения переменной окружения, мгновенный возврат без настройки, ожидание заданного интервала на фейковых таймерах, проброс аргументов в обёрнутый хендлер.

### 2026-08-01 — Меню из трёх точек не открывалось внутри модалки

#### Shared UI

- `DropdownMenu` получил `z-index: 200` на позиционер. Меню портируется в конец `body` и своего z-index не имело, поэтому внутри просмотра поста оно раскрывалось под попапом диалога (бэкдроп 100, попап 101) и выглядело неработающей кнопкой. Обнаружено ручным прогоном: стори-тесты кликают по элементу и перекрытие не ловят.

### 2026-08-01 — Мок-API постов отвязан от базового URL бэкенда

#### Posts

- Запросы мок-API постов больше не наследуют `NEXT_PUBLIC_API_BASE_URL`. Мок живёт в `app/api/mock/posts` — это роут-хендлер самого приложения, поэтому он запрашивается по текущему origin, а путь стал абсолютным: `/api/mock/posts`. Реальный путь `${API_BASE_URL}/v1/posts` не изменился.
- Причина: после переезда авторизации на бэкенд (PR #18) базовый URL указывает на внешний хост, и общий префикс отправлял бы вызовы моков туда же. Раньше логин и моки постов нельзя было держать рабочими одновременно.

#### Shared UI

- `baseApi` принимает необязательный `baseUrl` в `init` — префикс запроса. По умолчанию берётся `API_BASE_URL`, пустая строка оставляет запрос на текущем origin. Поле снимается перед вызовом `fetch` и в запрос не утекает.

#### Tests

- Новый `baseApi.test.ts`: путь по умолчанию склеивается с базовым URL, пустой `baseUrl` оставляет относительный путь, `baseUrl` не попадает в `RequestInit`.
- Ожидания URL в `postsApi.test.ts` обновлены на абсолютный путь мока.

#### Verification

- `pnpm exec tsc --noEmit` прошёл успешно.
- `pnpm test:unit` прошёл успешно: 27 файлов, 140 тестов.
- `pnpm test:storybook` прошёл успешно: 45 файлов, 200 тестов.
- `pnpm test:coverage` — 99.47 % lines, 93.25 % branches по путям задачи при пороге 80/80.
- `pnpm build` прошёл успешно.

#### Notes

- Ручная проверка на профиле с 20 постами не проводилась: маршрута `/profile/[id]` и ленты постов в `develop` нет, они живут в ветке `feat/posts-crud`. Проверять после её мержа.
- Страницы (`src/pages/*`) по-прежнему используют литерал `calc(100vh - 60px)`; перевод их на `--layout-header-height` не входил в задачу.

- Когда появится бэкенд постов, мок-режим удаляется вместе с флагом `NEXT_PUBLIC_POSTS_API_MOCK`, и `postsApi` возвращается к общему базовому URL.

### 2026-08-01 — Этап 6: UC-3, удаление поста

#### Posts

- Добавлена фича `features/delete-post` — удаление публикации: `DeletePostDialog` на общем `shared/ui/confirm-dialog`, `useDeletePostMutation`, чистая `forgetDeletedPost` для чистки кеша.
- Тексты подтверждения сверены с макетом Figma (фрейм `Delete Post`, node `309:6520`): заголовок `Delete Post`, тело `Are you sure you want to delete this post?`, кнопки `Yes` (outline) / `No` (primary). Обе строки лежат константами в фиче.
- Удаление шлёт `DELETE /posts/{id}`. После успеха деталь поста **удаляется** из кеша, а не инвалидируется: инвалидация перезапросила бы уже несуществующий пост и получила 404. Лента профиля инвалидируется — она остаётся на экране и должна перезагрузиться без удалённого поста.
- Отдельной навигации после удаления нет: подтверждение открывается из просмотра поста поверх `/profile/{id}`, то есть домашняя страница пользователя по ТЗ уже под модалкой. Закрывается просмотр, пользователь остаётся на профиле.
- Подтверждение переживает собственное `Yes` до ответа сервера: иначе упавшее удаление некуда было бы сообщить. При ошибке диалог остаётся открытым с текстом ошибки рядом с вопросом, кнопка `Yes` заблокирована на время запроса.
- Пока открыто подтверждение, просмотр поста под ним не закрывается по клику мимо: `PostViewModal` получил проп `disablePointerDismissal`, который включается только на это время.

#### Shared UI

- `ConfirmDialog` принимает `className` (класс попапа) и `confirmDisabled`. Ширина попапа для UC-3 — 378px по макету против дефолтных 438px у `Modal`; решено классом от вызывающей фичи, а не новым пропом ширины у `Modal`, — так же, как это уже сделано в `EditPostModal`.

#### Tests

- Новые unit-тесты `forgetDeletedPost`: деталь удалённого поста выбрасывается из кеша, лента владельца инвалидируется, ленты других пользователей не трогаются, ожидание перезагрузки ленты не теряется.
- Новые стори с `play`: 5 сценариев `DeletePostDialog` (исходное состояние, подтверждение с проверкой запроса `DELETE`, отмена по `No`, отмена по крестику, ошибка удаления).
- В `ProfilePage.stories` добавлен сквозной сценарий `DeleteOwnPost`: плитка → меню из трёх точек → подтверждение → пост пропал из сетки, пользователь на профиле. Стаб `fetch` в сторис страницы теперь помнит удалённые id, поэтому перезапрошенная лента реально приходит без поста.

#### Verification

- `pnpm test:unit` прошёл успешно: 33 файла, 175 тестов.
- `pnpm test:storybook` прошёл успешно: 45 файлов, 200 тестов.
- `pnpm test:coverage` — 99.47 % lines, 93.1 % branches по путям задачи при пороге 80/80.
- `pnpm build` прошёл успешно. `pnpm lint` по затронутым путям чистый; оставшиеся ошибки сортировки экспортов в `shared/ui/icon`, `shared/ui/select` и `widgets/navigation` — чужие, исправлены в ветке `chore/eslint-export-sorting` (PR #19), ещё не влитой в `develop`.

#### Notes

- Отдельных стори на контейнер `ProfilePostsGrid` нет: он тянет запросы и кеш, поэтому проверяется через сторис страницы (`ProfilePage.stories`), а презентационная часть — через `ProfilePostsGridView.stories`.
- Формулировка ТЗ «уходит на домашнюю страницу» трактована как страница профиля владельца. Если имелась в виду главная `/`, правка локализована в `ProfilePostsGrid`.

### 2026-08-01 — Этап 5: UC-2, редактирование поста

#### Posts

- Добавлена фича `features/edit-post` — редактирование описания публикации: `EditPostModal` на общем `shared/ui/modal`, `useEditPostForm`, `useUpdatePostMutation`, `DiscardChangesDialog`.
- Раскладка сверена с макетом Figma (фрейм `Edit Post`, node `309:6064`): попап 972×564 с шапкой `Edit Post` и крестиком внутри, слева колонка фото 490, справа аватар с username, поле `Add publication descriptions`, счётчик под ним справа и `Save Changes` в правом нижнем углу.
- Сохранение шлёт `PATCH /posts/{id}` только с `description`; `onSuccess` инвалидирует и деталь поста, и ленту профиля, после чего форма закрывается и пользователь остаётся на посте.
- Альтернативный сценарий закрытия по ТЗ: без изменений форма закрывается сразу, с изменениями показывается подтверждение `Do you really want to finish editing? …` — `Yes` уходит без сохранения, `No` и крестик возвращают в форму с сохранённым вводом.
- Все пути закрытия (крестик, `Escape`, клик вне формы) сведены в один обработчик `onOpenChange`, поэтому клик вне формы ведёт себя как крестик. `disablePointerDismissal` у формы включается только на время показа подтверждения — иначе клик мимо подтверждения обрабатывался бы дважды.
- Признак «описание изменено» считает чистая `isPostDescriptionDirty` с обрезкой пробелов по краям: дописанный пробел не изменение и не должен поднимать диалог подтверждения. В API уходит `preparePostDescription` — тот же trim плюс обрез по лимиту.
- Добавлена фича `features/post-actions` — меню из трёх точек с пунктами `Edit Post` / `Delete Post`. Владельца определяет вызывающий: `ProfilePostsGrid` сравнивает `ownerId` открытого поста с текущим пользователем и передаёт меню в слот `actions`, само меню правами не занимается.
- Пока открыта форма редактирования, просмотр поста прячется (`open: false`), а не размонтируется: обе модалки занимают на экране одну и ту же коробку, и после сохранения или отмены пользователь возвращается ровно на тот же пост.

#### Shared UI

- Галерея фото вынесена из `PostView` в `entities/post/ui/PostGallery` — стрелки, точки и состояние текущего фото теперь общие для просмотра и редактирования поста.
- `Modal` снова принимает `bodyClassName` — модалке редактирования нужно снять паддинги тела, чтобы колонка фото доходила до краёв попапа.

#### Tests

- Новые unit-тесты `editPostDescription`: dirty-предикат (правка, пробелы по краям, пробел внутри текста, заполнение и очистка описания) и подготовка значения для API (trim, обрез по лимиту, пустое описание).
- Новые стори с `play`: 5 сценариев `EditPostModal` (исходное состояние с заблокированным `Save Changes`, сохранение с проверкой тела `PATCH`, закрытие без изменений без диалога, диалог отмены с ветками `Yes`/`No`, клик вне формы) и 2 сценария `PostActionsMenu` (выбор `Edit Post` и `Delete Post`).
- В `ProfilePage.stories` добавлен сквозной сценарий `EditOwnPost`: плитка → меню из трёх точек → форма редактирования с описанием поста.

#### Verification

- `pnpm test:unit` прошёл успешно: 32 файла, 171 тест.
- `pnpm test:storybook` прошёл успешно: 44 файла, 194 теста.
- `pnpm test:coverage` — 99.46 % lines, 93.1 % branches по путям задачи при пороге 80/80.
- `pnpm build` прошёл успешно. `pnpm lint` по затронутым путям чистый; оставшиеся ошибки сортировки экспортов в `shared/ui/icon`, `shared/ui/select` и `widgets/navigation` — чужие, исправлены в ветке `chore/eslint-export-sorting` (PR #19), ещё не влитой в `develop`.

#### Notes

- Ветка `Save Changes` заблокирован при превышении 500 символов проверена только unit-тестом `isValidPostDescription`: через интерфейс это состояние недостижимо, поле само режет ввод по `maxLength`. Проверка остаётся защитой от слишком длинного описания, пришедшего из хранилища.
- Заголовок диалога подтверждения (`Close Post`) макетом не подтверждён — отдельного фрейма на него в Figma нет. Текст тела взят из ТЗ дословно.

### 2026-08-01 — Этап 4: просмотр поста

#### Posts

- Добавлен `entities/post/ui/PostView` — просмотр публикации: галерея фото со стрелками и точками, аватар и username автора, описание, дата публикации.
- `PostViewModal` открывает пост поверх профиля. Отдельного роута нет намеренно: по ТЗ после сохранения и после отмены редактирования пользователь остаётся на посте, а после удаления уходит на профиль — модалка даёт все три перехода без навигации.
- Раскладка сверена с макетом Figma (фрейм `My Post`, node `309:4336`): попап 972×564, колонка фото 490, шапка правой колонки 59px, стрелки галереи 48×48, дата публикации в футере под лайками, под описанием — относительное время.
- `PostViewModal` собран на `Dialog` из `@base-ui/react/dialog`, а не на `shared/ui/modal`: в макете у просмотра поста нет полосы заголовка, а крестик вынесен наружу попапа. `Modal` не тронут и остаётся «диалогом с заголовком» — на нём сядет модалка редактирования (макет `Edit Post`, node `309:6064`), где шапка и крестик внутри.
- Плитка в сетке профиля стала кнопкой: клик открывает пост, URL не меняется. Доступное имя кнопки берётся из `alt` картинки, отдельная подпись не нужна.
- Открытый пост хранится в `ProfilePostsGrid` как id, а сам объект ищется в загруженной ленте. Так отредактированный пост перерисуется свежими данными, а удалённый закроет модалку сам — без синхронизации копии в стейте.
- В шапке поста есть слот `actions` для меню из трёх точек. Сущность не решает, кто владелец: слот передаёт вызывающий код. Меню появится в UC-2/UC-3, в `ProfilePostsGrid` стоит `TODO(uc-2/uc-3)`.
- Дата публикации форматируется чистой `lib/formatPostDate` (`July 3, 2026`), жёстко в UTC — иначе один и тот же пост читался бы разными днями на сервере и на клиенте. Непарсящаяся дата даёт пустую строку, а не `Invalid Date`.
- Возраст поста под описанием (`2 hours ago`) считает `lib/formatPostRelativeTime` на `Intl.RelativeTimeFormat`. `now` передаётся параметром — иначе функцию не проверить тестом. Дата из будущего (расхождение часов сервера и клиента) схлопывается в `just now`, а не в обратный отсчёт.
- Навигация по галерее вынесена в чистые `lib/postGallery` (`getGalleryIndex`, `hasGalleryControls`): границы не заворачиваются, у одного фото стрелок и точек нет.

#### Заглушки

- В `entities/post/ui/stubs/` добавлены три презентационных компонента: список комментариев, форма добавления комментария, блок лайков/шаринга/закладки. Ни запросов, ни состояния; все контролы `disabled`, чтобы не выглядели рабочими. Помечены `TODO(comments)` и `TODO(likes)`.
- Заглушки собраны в одну папку намеренно: когда появятся реальные фичи комментариев и лайков, папка удаляется целиком, а `PostView` правится в одном месте.

#### Tests

- Новые unit-тесты: `formatPostDate` (формат, UTC, битая и пустая дата), `formatPostRelativeTime` (часы, минуты, «just now», выбор крупной единицы, дата из будущего, битая дата) и `postGallery` (шаг вперёд/назад, упор в границы, выход индекса за пределы, пустая галерея, показ контролов).
- Новые стори с `play`: 5 состояний `PostView` (пост владельца с меню, чужой пост без меню и с заблокированными заглушками, длинное описание, без описания, переключение трёх фото) и `SelectPost` для сетки (клик по плитке отдаёт нужный пост).
- В `ProfilePage.stories` добавлен сквозной сценарий `OpenPost`: клик по плитке открывает модалку с описанием и датой, `Escape` закрывает.

#### Verification

- `pnpm test:unit` прошёл успешно: 31 файл, 161 тест.
- `pnpm test:storybook` прошёл успешно: 42 файла, 185 тестов.
- `pnpm test:coverage` — 99.45 % lines, 93.1 % branches по путям задачи при пороге 80/80.
- `pnpm build` прошёл успешно. `pnpm lint` по затронутым путям чистый; ошибки сортировки экспортов в `shared/ui/select` и `widgets/navigation` уже исправлены в ветке `chore/eslint-export-sorting` (PR #19), но он ещё не влит в `develop`, поэтому на этой ветке они видны.

#### Notes

- Просмотр поста делается своими силами: отдельного UC на него нет, но шаги 1–2 UC-2 и UC-3 на нём стоят.
- Раскладка сверена с макетом по метаданным и рендеру Figma; вживую в браузере страница не открывалась — поведение закрыто сторис-тестами.
- Макеты: файл Figma `wIrkRSQnSb5kMbFftswpu6`, фреймы `My Post` (`309:4336`) и `Edit Post` (`309:6064`).

### 2026-08-01 — Этапы 3 и 7: сетка постов профиля и стыковка с созданием поста

#### Profile

- Профиль переехал на динамический роут `/profile/[id]`. Старый `/profile` остался точкой входа для навигации и редиректит на профиль текущего пользователя, поэтому ссылки в сайдбаре, нижней панели и переходы после логина и публикации поста менять не потребовалось.
- В `ROUTES` добавлен `profileById(userId)`; `ROUTES.profile` сохранён как адрес «своего» профиля-редиректа.
- Кнопка «Profile Settings» показывается только владельцу профиля. Признак владельца считается в одном месте — `shared/auth/currentUser.ts` (`getCurrentUserId`, `isProfileOwner`) с пометкой `TODO(post-ownership)`; мок-стор постов берёт id владельца оттуда же, так что «текущий пользователь» в приложении и в моках всегда один.
- Заглушки шапки профиля (имя, статистика, описание) собраны в один объект с `TODO(profile-api)`: эндпоинтов профиля ещё нет, замокан только API постов. Захардкоженные плитки публикаций из страницы удалены — их место занял виджет сетки.

#### Posts

- Добавлен виджет `widgets/profile-posts`: сетка публикаций с бесконечной подгрузкой. Разделён на контейнер `ProfilePostsGrid` (запрос) и презентационный `ProfilePostsGridView` (пропсы) — без этого состояния сетки нельзя было бы прогнать сторис-тестами, потому что Storybook не поднимает роут-хендлеры Next.js.
- Состояния сетки: скелетоны на первой загрузке и на догрузке страницы, пустое состояние «No publications yet.», сообщение об ошибке с `role="alert"`.
- Подгрузка идёт по `IntersectionObserver` на сентинеле после последней плитки (`lib/useInfiniteScroll`), запас `rootMargin: 200px`. Решение «пора грузить» вынесено в чистую `shouldFetchNextPage` — unit-проект работает в окружении `node` и наблюдатель там не поднимается.
- `entities/post/api/useProfilePostsQuery` — `useInfiniteQuery` по 8 постов на страницу, курсор берётся из `nextCursor` ответа. Страницы склеиваются чистой `flattenPostsPages` с дедупликацией по id: окно курсора сдвигается, если между запросами страниц пост создан или удалён.
- В `postsApi` добавлен `createPost` — общий вход для публикации.

#### Create Post

- `publishPostMock` больше не возвращает пустой `publicationId`, а создаёт пост в общем мок-сторе через `POST /api/mock/posts`. Созданный пост сразу оказывается первым в сетке профиля.
- Фото на моках никуда не загружаются: каждое отредактированное изображение инлайнится в data-URL (`lib/fileToDataUrl`). `blob:`-ссылка не подошла бы — она живёт только до перезагрузки страницы, а стор серверный.
- `exportEditedImage` теперь отдаёт `{ file, width, height }`: API поста хранит размеры изображения, и брать их с канваса дешевле, чем перечитывать файл.
- После успешной публикации инвалидируются списки постов (`postsQueryKeys.lists()`), иначе на профиле показался бы закешированный список без нового поста.
- Дубликат константы длины описания убран: `features/create-post` использует `POST_DESCRIPTION_MAX_LENGTH` и `normalizePostDescription` из `entities/post`, локальный модуль `model/createPostDescription.ts` удалён.

#### Tests

- Новые unit-тесты: `flattenPostsPages` (порядок страниц, дедупликация, пустые данные), `shouldFetchNextPage` (4 ветки), `fileToDataUrl` (mime, fallback, файл длиннее одного чанка), `createPost` в `postsApi`, переписанный тест `publishPostMock` (уходит POST с описанием и data-URL, возвращается id созданного поста).
- Новые стори с `play`: 5 состояний `ProfilePostsGridView` (8 плиток, первая загрузка, догрузка, пусто, ошибка) и 2 стори `ProfilePage` (свой профиль — кнопка настроек и 8 плиток; чужой — кнопки нет). Запрос ленты в сторис `ProfilePage` подменяется на уровне `fetch`.

#### Verification

- `pnpm test:unit` прошёл успешно: 28 файлов, 143 теста.
- `pnpm test:storybook` прошёл успешно: 41 файл, 178 тестов.
- `pnpm test:coverage` прошёл успешно: 99.34 % lines, 92.30 % branches по путям задачи при порогах 80/80.
- `pnpm build` прошёл успешно, `/profile/[id]` зарегистрирован как динамический роут.
- Ручная проверка на `pnpm start`: `/profile` отдаёт 307 на `/profile/mock-user-1`, первая страница ленты — 8 постов с `nextCursor` на девятый, вторая страница отдаёт следующие 8, созданный через `POST /api/mock/posts` пост становится первым в ленте.
- `pnpm exec eslint` по затронутым путям прошёл успешно.

#### Tooling

- `coverage` в `vitest.config.ts` теперь меряет только то, что проект `unit` способен выполнить. Из подсчёта исключены `*.tsx`, React-хуки (`use*.ts`) и `route.ts`: unit работает в окружении `node`, jsdom и RTL в проекте нет, поэтому компоненты и хуки покрываются `play`-тестами проекта `storybook`, чьё покрытие не собирается. До правки каждый новый UI-файл заходил в знаменатель с нулём, и метрика отражала количество компонентов, а не объём тестирования (упала с 89 % до 71 % при пороге 70).
- Пороги подняты с 70/70 до 80/80 — по оставшимся путям (чистая логика, `api/`, мок-стор и хендлеры) покрытие 99.34 % lines и 92.30 % branches, запас есть.
- Если понадобится цифра по UI, покрытие нужно собирать и с проекта `storybook` (v8 через playwright) — это отдельная задача.

#### Notes

- Ленту профиля пока сортирует мок; клиент порядок не меняет.

### 2026-08-01 — Этап 2: моки постов и слой `entities/post`

#### Posts

- Добавлен мок-API постов: `app/api/mock/posts` (GET списка с курсором, POST создания) и `app/api/mock/posts/[postId]` (GET / PATCH / DELETE). Логика лежит в `_mock/`, `route.ts` — тонкие реэкспорты, как у OAuth-моков; за счёт этого хендлеры тестируются напрямую обычным `Request`, без поднятия сервера.
- Мок-стор держится на `globalThis`, поэтому переживает hot-reload dev-сервера: созданные, отредактированные и удалённые посты не сбрасываются на каждую правку кода. Сид — 20 постов владельца профиля и 4 поста другого пользователя (нужны для проверки фильтра по `userId`), фото — сгенерированные SVG в виде data-URL.
- Пагинация курсорная: `cursor` — id первого поста запрашиваемой страницы, `nextCursor` — id первого поста следующей (`null` на последней). Ответ сразу пригоден как параметр следующего запроса, арифметики на клиенте не требуется. Неизвестный курсор — 400, а не «молча пустая страница».
- `PATCH` меняет только `description`, остальные поля принадлежат серверу. Пустое описание валидно (поле необязательное), длиннее 500 символов — 400. `DELETE` отвечает 204, повторный — 404.
- Добавлен слой `src/entities/post`: типы `Post`/`PostImage`/`PostsPage`, константа и валидация описания, фабрика ключей react-query, функции запросов и плитка `PostThumbnail`.
- Всё общение с API постов идёт через `entities/post/api/postsApi.ts` — единственное место, которое переезжает на реальный бэк. Пути моков повторяют будущие реальные и отличаются только префиксом: `/api/mock/posts` против `/api/v1/posts`. Переключатель — переменная окружения `NEXT_PUBLIC_POSTS_API_MOCK` (`true` в `.env.local`), читается в момент вызова, а не при загрузке модуля.
- Типы поста пока написаны руками: в OpenAPI-схеме постов ещё нет. Замена на `Schema*` помечена `TODO(posts-schema)` в `postsApi.ts`.
- В `Post` заведены `ownerUsername`, `ownerAvatarUrl` и `updatedAt` — они нужны экрану просмотра поста, а мок отдаёт их без дополнительного запроса.
- `PostThumbnail` рендерит обложку через `next/image` с `fill` и `unoptimized`: на моках это data-URL, а `remotePatterns` под реальный хост ещё не настроены. `alt` берётся из первой строки описания (обрезается до 80 символов), а без описания — «Publication by {username}»; логика вынесена в чистую `lib/getPostImageAlt.ts`.

#### Shared API

- В `shared/api/baseApi` добавлены `patch` и `delete` — их не хватало для UC-2/UC-3, а ошибки должны приходить единым `ApiError`.

#### Tests

- 50 новых unit-тестов: мок-стор (страница ровно из 8, `nextCursor` на 9-й пост, последняя страница с `null`, порядок новые→старые, отсутствие дублей между страницами, фильтр по пользователю, неизвестный курсор), оба хендлера (коды 200/201/204/400/404), `postsApi` на подменённом `fetch` (URL, метод, тело, префикс мока и реального бэка, `ApiError` с сообщением сервера), фабрика ключей, валидация описания, alt плитки.
- 3 стори с `play` на `PostThumbnail`: alt из описания, fallback без описания, сетка 4×2.

#### Verification

- `pnpm test:unit` прошёл успешно: 26 файлов, 134 теста.
- `pnpm test:storybook` прошёл успешно: 40 файлов, 172 теста.
- `pnpm test:coverage` прошёл успешно: 89.67 % lines, 89.04 % branches по путям задачи (пороги — 70/70).
- `pnpm build` прошёл успешно, оба мок-роута зарегистрированы как динамические.
- `pnpm exec eslint app/api/mock/posts src/entities/post src/shared/api/baseApi.ts` прошёл успешно. Старые ошибки `pnpm lint` в чужих файлах вынесены в отдельный PR #19 (`chore/eslint-export-sorting`) и здесь больше не оговариваются.

#### Notes

- Флаг `NEXT_PUBLIC_POSTS_API_MOCK=true` добавлен в локальный `.env.local`; файл в `.gitignore`, каждому разработчику нужно прописать его у себя, иначе запросы уйдут на несуществующий `/api/v1/posts`.
- `publishPostMock` из `features/create-post` пока по-прежнему ничего не сохраняет — стыковка с мок-стором запланирована на Этап 7 роадмапа.

### 2026-08-01

#### Shared UI

- Добавлен `shared/ui/dropdown-menu` на `@base-ui/react/menu` — контекстное меню под действия поста (Edit / Delete). Триггер рендерится как `<button>`, по умолчанию с иконкой `icon-more-horizontal`; своё содержимое передаётся пропом `trigger`. Проп `ariaLabel` обязателен, потому что дефолтный триггер иконочный и другого доступного имени у него нет. Клавиатурная навигация и роли (`menu`/`menuitem`) идут от Base UI, руками не дублируются.
- Пункт меню поддерживает флаг `danger` — отдельный цвет для деструктивных действий, чтобы `Delete Post` не пришлось красить на месте вызова.
- Добавлен `shared/ui/confirm-dialog` поверх существующего `Modal` — общий диалог «вопрос + Yes/No» для UC-2 (discard changes) и UC-3 (delete post). Компонент управляемый: `open` держит родитель. Любое закрытие (кнопка отмены, крестик, `Escape`) проходит через один обработчик и вызывает `onCancel` + `onOpenChange(false)`, так что вызывающему коду не нужно ловить пути закрытия по отдельности.
- `disablePointerDismissal` в `ConfirmDialog` включён по умолчанию: на подтверждение нужно ответить, а не закрыть его случайным кликом мимо окна.

#### Storybook

- Stories и `play`-тесты на оба новых компонента: открытие меню кликом и с клавиатуры, перемещение подсветки стрелками, закрытие по `Escape`, выбор пункта, заблокированный пункт; для диалога — подтверждение, отмена, крестик и `Escape`.
- В `play`-тестах порталов используются `findBy*`/`waitFor`: попап Base UI монтируется асинхронно, синхронный `getByRole` успевает раньше и падает.

#### Tooling

- В `package.json` добавлены скрипты `test`, `test:unit`, `test:storybook`, `test:watch`, `test:coverage`.
- В `vitest.config.ts` настроено покрытие (провайдер `v8`, пороги 70% lines / 70% branches). Пороги намеренно ограничены путями задачи CRUD постов: остальной код писался до появления тестового контура и утянул бы цифры вниз. Слайсы перечислены поимённо, а не глобом `features/*-post/**`, чтобы не захватывать чужую `features/create-post`.

#### Verification

- `pnpm exec eslint src/shared/ui/dropdown-menu src/shared/ui/confirm-dialog` прошёл успешно.
- `pnpm exec vitest run --project storybook` прошёл успешно: 39 файлов, 169 тестов (из них 12 новых).
- `pnpm test:unit` прошёл успешно: 19 файлов, 84 теста.
- `pnpm test:coverage` прошёл успешно: под порогами пока нет файлов, отчёт пустой — реальные цифры появятся на этапе моков и `entities/post`.
- `pnpm build` прошёл успешно.
- `pnpm lint` по всему проекту падает на 4 ошибках `simple-import-sort/exports` в файлах, которых задача не касалась (`shared/ui/icon`, `shared/ui/select`, `widgets/navigation`, `shared/ui/input`); в новых файлах ошибок нет.

#### Notes

- Для прогона story-тестов локально понадобилось доустановить браузер: `pnpm exec playwright install chromium`.
- Пропсы существующих компонентов сверялись по исходникам (`Modal.tsx`, `Button.tsx`) и типам `@base-ui/react`, а не через MCP `inctagram-storybook`: этот сервер настроен для Codex и в текущем окружении недоступен.

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
