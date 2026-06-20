# Design System — Inctagram (Copy)

## Color Palette

Все цвета — локальные Paint Styles, переменные Figma Variables не используются.
Шкала интенсивности 100–900: чем выше число, тем темнее оттенок.

### Primary (синий)

| Токен | HEX | Подсказка по использованию |
|---|---|---|
| Primary/100 | `#73A5FF` | Hover-состояния, фоны активных элементов |
| Primary/300 | `#4C8DFF` | Вторичные акценты |
| Primary/500 | `#397DF6` | Основной брендовый цвет, CTA |
| Primary/700 | `#2F68CC` | Pressed/Active состояния |
| Primary/900 | `#234E99` | Очень тёмный акцент, редко используется |

### Danger (красный)

| Токен | HEX | Подсказка по использованию |
|---|---|---|
| Danger/100 | `#FF8099` | Светлый фон ошибки |
| Danger/300 | `#F23D61` | Иконка/текст ошибки |
| Danger/500 | `#CC1439` | Основной цвет ошибки |
| Danger/700 | `#990F2B` | Pressed состояние кнопки-деструктора |
| Danger/900 | `#660A1D` | Очень тёмный красный |

### Warning (жёлтый)

| Токен | HEX | Подсказка по использованию |
|---|---|---|
| Warning/100 | `#FFD073` | Светлый фон предупреждения |
| Warning/300 | `#E6AC39` | Текст/иконка предупреждения |
| Warning/500 | `#D99100` | Основной цвет предупреждения |
| Warning/700 | `#996600` | Pressed состояние |
| Warning/900 | `#664400` | Очень тёмный жёлтый |

### Success (зелёный)

| Токен | HEX | Подсказка по использованию |
|---|---|---|
| Success/100 | `#80FFBF` | Светлый фон успеха |
| Success/300 | `#22E684` | Текст/иконка успеха |
| Success/500 | `#14CC70` | Основной цвет успеха |
| Success/700 | `#0F9954` | Pressed состояние |
| Success/900 | `#0A6638` | Очень тёмный зелёный |

### Light (светлый нейтральный)

| Токен | HEX | Подсказка по использованию |
|---|---|---|
| Light/100 | `#FFFFFF` | Белый, текст на тёмном фоне |
| Light/300 | `#F7FBFF` | Почти белый, светлые фоны |
| Light/500 | `#EDF3FA` | Фон карточек/инпутов |
| Light/700 | `#D5DAE0` | Бордеры, разделители |
| Light/900 | `#8D9094` | Плейсхолдеры, второстепенный текст |

### Dark (тёмный нейтральный)

| Токен | HEX | Подсказка по использованию |
|---|---|---|
| Dark/100 | `#4C4C4C` | Тёмно-серый, выключенный текст |
| Dark/300 | `#333333` | Второстепенный тёмный текст |
| Dark/500 | `#171717` | Основной тёмный фон |
| Dark/700 | `#0D0D0D` | Фон страниц (тёмная тема) |
| Dark/900 | `#000000` | Абсолютный чёрный |

---

## Typography Scale

Единственный шрифт: **Inter** (Regular / Medium / Semi Bold / Bold).

| Стиль | Шрифт | Размер | Начертание | Line Height |
|---|---|---|---|---|
| Large | Inter | 26px | Semi Bold (600) | 36px |
| H1 | Inter | 20px | Bold (700) | 36px |
| H2 | Inter | 18px | Bold (700) | 24px |
| H3 | Inter | 16px | Semi Bold (600) | 24px |
| regular_text 16 | Inter | 16px | Regular (400) | 24px |
| Bold_text 16 | Inter | 16px | Bold (700) | 24px |
| regular_text 14 | Inter | 14px | Regular (400) | 24px |
| Medium_text 14 | Inter | 14px | Medium (500) | 24px |
| bold_text 14 | Inter | 14px | Bold (700) | 24px |
| small_text | Inter | 12px | Regular (400) | 16px |
| Semi-bold small_text | Inter | 12px | Semi Bold (600) | 16px |
| regular_link | Inter | 14px | Regular (400) | 24px |
| small_link | Inter | 12px | Regular (400) | 16px |

> `regular_link` и `small_link` имеют `text-decoration: underline`.  
> Letter-spacing везде 0.

---

## Spacing & Radius

Figma Variables (коллекции токенов) в этом файле **не определены** — коллекция пустая.  
Значения spacing и border-radius получены из инспекции компонентов:

- **Border-radius инпута** — `2px` (в состоянии Focus), `0px` (остальные состояния)
- **Padding внутри компонентного сета (canvas padding)** — `24px` по всем сторонам (из COMPONENT_SET Input)
- **Размер базового инпута** — `279 × 60px`
- **Высота кнопки** — по умолчанию ~`36–42px` (точнее определяется в конкретных вариантах)

> Поскольку переменных нет, все отступы нужно брать непосредственно из инспектора каждого компонента.  
> Рекомендуется ввести токены spacing на основе шага **8pt** при переводе в код.

---

## Shadows & Effects

Локальные Effect Styles в файле **отсутствуют** (`"effects": []`).  
Grid Styles также **отсутствуют** (`"grids": []`).

> Тени (если используются) встроены прямо в конкретные компоненты как raw-свойства, а не как переиспользуемые стили.

---

## Component Inventory

Все компоненты находятся на странице **⚙️ Components**.

| Компонент | Тип | Варианты | Описание |
|---|---|---|---|
| **Input** | COMPONENT_SET | 12 | Текстовое поле `279×60px`. Состояния: Default, Hover, Focus, Active, Disable, Error — в двух вариациях: без иконки и с иконкой справа |
| **Input search** | COMPONENT_SET | 6 | Поисковый инпут. Состояния: Default, Hover, Focus, Active, Disable, Error |
| **Button Web** | COMPONENT_SET | 21 | Кнопка для веба. 4 типа: **Primary**, **Secondary**, **Outline**, **Text Button** — каждый в 5 состояниях (Default, Active, Hover, Focus, Disabled). Есть незаконченный `Variant21` |
| **Tabs** | COMPONENT_SET × 2 | 5 каждый | Табы навигации. Состояния: Default, Active, Hover, Focus, Disabled. Два набора отличаются высотой: `84px` и `76px` |
| **Header** | COMPONENT_SET | 2 | Шапка сайта `1320px`. Варианты: Default и Not autorealized |
| **Sidebars** | COMPONENT_SET | 5 | Боковая панель `1244×708px`. Состояния: Default, Active, Hover, Focus, Disabled |
| **Pagination** | COMPONENT_SET | 5 | Пагинация. Варианты именованы непоследовательно: Dark, Variant2–5 |
| **Text-area with title** | COMPONENT_SET | 6 | Текстовая область с подписью сверху. Состояния: Default, Active, Hover, Focus, Error, Disabled |
| **DatePicker** | COMPONENT_SET | 12 | Выбор даты. Варианты: Light, Active, Hover, Focus, Error и другие. Дополнительно — отдельный компонент `DatePicker/Popup` |
| **Date range days** | COMPONENT_SET | 32 | Ячейки диапазона дат. Многомерные варианты: Day of a week (Today/...) × Range (Start/Middle/End/None) × State (Focus/Active/Hover/Selected) |
| **Select-box** | COMPONENT_SET | 9 | Выпадающий список. Варианты: Default title, Default, Language, Hover, Focus и другие |
| **Horizontal Scroll** | COMPONENT_SET | 2 | Горизонтальный скроллбар. Default, Hover |
| **Scroll Bar** | COMPONENT_SET | 2 | Вертикальный скроллбар. Default, Hover |
| **Menu** | COMPONENT_SET | 5 | Боковое меню навигации. Пункты: Home, Search, Publication, My Profile, Messenger |
| **Check-box** | COMPONENT_SET × 2 | 10 каждый | Чекбоксы в двух наборах: Selected (отмечен) и Unselected (с текстом). Каждый в 5 состояниях |
| **RadioGroup** | COMPONENT_SET | 10 | Радиогруппа. Checked/Off × Default/Active/Hover/Focus/Disabled |
| **Alerts** | COMPONENT_SET | 2 | Уведомление `427px`. Варианты: Error (красный) и Accepted (зелёный) |
| **Tooltip** | FRAME | — | Tooltip с Auto Layout. Встречается в трёх местах на странице — вероятно копии одного мастер-компонента |
| **Recaptcha** | COMPONENT × 6 | 6 | Google reCAPTCHA. Состояния: Default, Checked, Error, Loading, Expired, Hover |
| **Header Mobile / Header Mobile Auth** | COMPONENT × 2 | 2 | Мобильная шапка в двух вариантах: авторизованный и неавторизованный |
| **Cards** | FRAME | — | Секция карточек, содержит один прямоугольный компонент — вероятно незавершённый |

---

## Icon Library

**90 иконок**, все `24×24px`, формат SVG.

- Исходники: `public/icons/*.svg`
- Спрайт: `public/icons/icon-sprite.svg`
- React-компонент: `src/shared/ui/icon` → `<Icon iconId="icon-{name}" />`

```tsx
import { Icon } from "@/shared/ui/icon";

<Icon iconId="icon-home" />
<Icon iconId="icon-heart-outline" fill="#397DF6" />
<Icon iconId="icon-bell-fill" width={20} height={20} />
```

Большинство иконок существует в двух вариантах: **outline** (контурный) и **filled** (залитый).  
Суффикс `-outline` = контур; без суффикса = залитая форма.  
Исключения: `bell-outline` / `bell-fill` и `radio-button-checked` / `radio-button-unchecked`.

### Навигация

| ID в спрайте | Файл |
|---|---|
| `icon-home` | home.svg |
| `icon-home-outline` | home-outline.svg |
| `icon-search` | search.svg |
| `icon-search-outline` | search-outline.svg |
| `icon-menu-outline` | menu-outline.svg |
| `icon-arrow-back-outline` | arrow-back-outline.svg |
| `icon-arrow-forward-outline` | arrow-forward-outline.svg |
| `icon-arrow-ios-back` | arrow-ios-back.svg |
| `icon-arrow-ios-back-outline` | arrow-ios-back-outline.svg |
| `icon-arrow-ios-forward` | arrow-ios-forward.svg |
| `icon-arrow-ios-forward-outline` | arrow-ios-forward-outline.svg |
| `icon-arrow-ios-up` | arrow-ios-up.svg |
| `icon-arrow-ios-down-outline` | arrow-ios-down-outline.svg |

### Пользователь

| ID в спрайте | Файл |
|---|---|
| `icon-person` | person.svg |
| `icon-person-outline` | person-outline.svg |
| `icon-person-add` | person-add.svg |
| `icon-person-add-outline` | person-add-outline.svg |
| `icon-person-remove` | person-remove.svg |
| `icon-person-remove-outline` | person-remove-outline.svg |

### Контент и действия

| ID в спрайте | Файл |
|---|---|
| `icon-image` | image.svg |
| `icon-image-outline` | image-outline.svg |
| `icon-bookmark` | bookmark.svg |
| `icon-bookmark-outline` | bookmark-outline.svg |
| `icon-heart` | heart.svg |
| `icon-heart-outline` | heart-outline.svg |
| `icon-paper-plane` | paper-plane.svg |
| `icon-paper-plane-outline` | paper-plane-outline.svg |
| `icon-message-circle` | message-circle.svg |
| `icon-message-circle-outline` | message-circle-outline.svg |
| `icon-plus-circle` | plus-circle.svg |
| `icon-plus-circle-outline` | plus-circle-outline.svg |
| `icon-plus-square` | plus-square.svg |
| `icon-plus-square-outline` | plus-square-outline.svg |
| `icon-copy` | copy.svg |
| `icon-copy-outline` | copy-outline.svg |
| `icon-edit-2` | edit-2.svg |
| `icon-edit-2-outline` | edit-2-outline.svg |
| `icon-trash` | trash.svg |
| `icon-trash-outline` | trash-outline.svg |
| `icon-pin` | pin.svg |
| `icon-pin-outline` | pin-outline.svg |
| `icon-maximize` | maximize.svg |
| `icon-maximize-outline` | maximize-outline.svg |
| `icon-expand` | expand.svg |
| `icon-expand-outline` | expand-outline.svg |
| `icon-close` | close.svg |
| `icon-close-outline` | close-outline.svg |
| `icon-more-horizontal` | more-horizontal.svg |
| `icon-more-horizontal-outline` | more-horizontal-outline.svg |
| `icon-trending-up` | trending-up.svg |
| `icon-trending-up-outline` | trending-up-outline.svg |
| `icon-layers` | layers.svg |
| `icon-layers-outline` | layers-outline.svg |

### UI-контролы

| ID в спрайте | Файл |
|---|---|
| `icon-eye` | eye.svg |
| `icon-eye-outline` | eye-outline.svg |
| `icon-eye-off` | eye-off.svg |
| `icon-eye-off-outline` | eye-off-outline.svg |
| `icon-checkmark-outline` | checkmark-outline.svg |
| `icon-done-all-outline` | done-all-outline.svg |
| `icon-radio-button-checked` | radio-button-checked.svg |
| `icon-radio-button-unchecked` | radio-button-unchecked.svg |
| `icon-bell-outline` | bell-outline.svg |
| `icon-bell-fill` | bell-fill.svg |
| `icon-block` | block.svg |

### Система и настройки

| ID в спрайте | Файл |
|---|---|
| `icon-settings` | settings.svg |
| `icon-settings-outline` | settings-outline.svg |
| `icon-log-out` | log-out.svg |
| `icon-log-out-outline` | log-out-outline.svg |
| `icon-email` | email.svg |
| `icon-email-outline` | email-outline.svg |
| `icon-calendar` | calendar.svg |
| `icon-calendar-outline` | calendar-outline.svg |
| `icon-color-palette-outline` | color-palette-outline.svg |
| `icon-mic` | mic.svg |
| `icon-mic-outline` | mic-outline.svg |
| `icon-pause-circle` | pause-circle.svg |
| `icon-pause-circle-outline` | pause-circle-outline.svg |
| `icon-play-circle` | play-circle.svg |
| `icon-play-circle-outline` | play-circle-outline.svg |
| `icon-credit-card` | credit-card.svg |
| `icon-credit-card-outline` | credit-card-outline.svg |
| `icon-paid` | paid.svg |

### Бренды и авторизация

| ID в спрайте | Файл |
|---|---|
| `icon-google` | google.svg |
| `icon-github` | github.svg |
| `icon-facebook` | facebook.svg |

### Платёжные системы

| ID в спрайте | Файл | Размер |
|---|---|---|
| `icon-paypal` | paypal.svg | 24×16px |
| `icon-stripe` | stripe.svg | 24×16px |

> `paypal` и `stripe` имеют нестандартную высоту `16px` — передавай `viewBox="0 0 24 16" height={16}`.

### Флаги и прочее

| ID в спрайте | Файл |
|---|---|
| `icon-flag-uk` | flag-uk.svg |
| `icon-flag-ru` | flag-ru.svg |
| `icon-recaptcha-logo` | recaptcha-logo.svg |

---

## Notes for Developer

- **Тёмная тема по умолчанию.** Основной цвет фона — `Dark/700 (#0D0D0D)`. Все компоненты на странице компонентов расположены на тёмном фоне, что означает, что дизайн ориентирован на dark mode.

- **Нет Figma Variables.** В файле отсутствуют коллекции токенов (Variable Collections). Все значения цвета, отступов, радиусов жёстко вшиты в компоненты или приходят через локальные Paint/Text Styles. При переводе в CSS рекомендуется самостоятельно ввести CSS Custom Properties на основе палитры.

- **Именование вариантов `Property 1=...`** — стандартное автоматическое именование Figma, означает, что дизайнер не кастомизировал имена свойств компонентов. В коде это не влияет на итоговые имена классов, но усложняет ориентацию в Figma.

- **Сетка типографики** — шаги 12 / 14 / 16 / 18 / 20 / 26px. Не кратно строго 8pt, но кратно 2pt. Line-height придерживается значений `16px`, `24px`, `36px`.

- **Состояния компонентов** проработаны последовательно: Default → Hover → Focus → Active → Disabled → Error. Это покрывает все типовые CSS-псевдоклассы (`:hover`, `:focus`, `:active`, `:disabled`).

- **Масштаб цветовой системы** повторяет подход Material UI (100–900). Рабочие акцентные цвета — уровень **500**; светлые фоны — **100–300**; hover/pressed — **700**.

- **Pagination именована непоследовательно** (Dark, Variant2–5) — при реализации стоит уточнить у дизайнера семантику каждого варианта.

- **Tooltip** присутствует в трёх экземплярах без объединения в COMPONENT_SET — не является переиспользуемым компонентом в полном смысле.

- **Страниц 16**, включая отдельные страницы для Web Auth, Web UI, SuperAdmin, Mobile Auth, Mobile UI — дизайн охватывает несколько платформ. При верстке уточните, какой экран реализуется: `WebApp / UI / Auth` или `WebApp / UI`.

- **Только Inter** — подключить один шрифт из Google Fonts, не нужно подгружать несколько семейств.
