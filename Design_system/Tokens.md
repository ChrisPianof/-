# Tokens.md — AlfaBank
## Overview
Обязательные токены и правила стилизации: брейкпоинты, скругления, тени, цвета, отступы, типографика. Хардкодить значения запрещено — только через CSS-переменные пакета.

## Брейкпоинты — ОБЯЗАТЕЛЬНО

Для адаптации layout — ТОЛЬКО через хук `useBreakpoint` из `src/utils/useBreakpoint.ts`.
Хардкодить медиа-запросы или window.innerWidth ЗАПРЕЩЕНО.

```tsx
import { useBreakpoint } from '../utils/useBreakpoint';

const { device } = useBreakpoint();
// device: 'mobile' | 'tablet' | 'desktop'
```

Устройства и breakpoints (из mq.json пакета):
mobile  — max-width: 599px
tablet  — 600px–1023px
desktop — min-width: 1024px

Применять в каждом экране для gridTemplateColumns и любых layout-зависимых стилей.

---

## Скругления — ОБЯЗАТЕЛЬНО

Использовать ТОЛЬКО `--border-radius-*`. Хардкодить px ЗАПРЕЩЕНО.
Все переменные доступны через corp.css — импортировать отдельно не нужно.

Актуальные токены (числовые):
--border-radius-0/2/4/6/8/10/12/14/16/20/24/32/36/64

Спец: --border-radius-pill (99px) | --border-radius-circle (50%)

Deprecated — не использовать: --border-radius-xs/s/m/l/xl/xxl/3xl

---

## Тени

Использовать `--shadow-*`. Хардкодить box-shadow ЗАПРЕЩЕНО.

--shadow-xs/s/m/l/xl       — мягкие, направлены вниз
--shadow-*-hard            — жёсткие (более контрастные)
--shadow-*-up              — направлены вверх

---

## Цвета — ОБЯЗАТЕЛЬНО

Использовать ТОЛЬКО CSS-переменные `--color-light-*`. Хардкодить hex/rgba ЗАПРЕЩЕНО.
Переменные доступны через corp.css — дополнительно импортировать не нужно.

### Как выбирать токен (по семантике)

| Если красишь… | Категория | Примеры |
|---|---|---|
| Текст / типографику | `text-*` | `text-primary`, `text-secondary`, `text-link`, `text-disabled`, `text-positive` |
| Иконку / svg / dot / штрих | `graphic-*` | `graphic-primary`, `graphic-accent`, `graphic-negative`, `graphic-tertiary` |
| Фон страницы / sidebar / header (плоский базовый) | `base-bg-*` | `base-bg-primary` (#fff), `base-bg-secondary` (#f2f3f5) |
| Семантический фон компонента (кнопка, бейдж, плашка) | `bg-*` | `bg-accent`, `bg-positive-muted`, `bg-attention-muted`, `bg-neutral` |
| Фон модалки / drawer / bottom-sheet | `modal-bg-*` | `modal-bg-primary`, `modal-bg-alt-secondary` |
| Полупрозрачный/композитный фон (overlay, glass) | `specialbg-*` | `specialbg-component`, `specialbg-overlay`, `specialbg-nulled` |
| Границу / разделитель | `border-*` | `border-primary`, `border-secondary`, `border-key`, `border-underline` |
| Статусный индикатор (точка, иконка статуса) | `status-*` / `status-muted-*` | `status-positive`, `status-muted-negative` |
| Бренд-акцент (Alfa red, тёмный) | `accent-*` | `accent-primary` (#ef3124), `accent-secondary` (#212124) |
| Серая палитра по шкале | `neutral-{0..1500}` | `neutral-100`, `neutral-700`, `neutral-translucent-300` |
| Подложка-затемнение | `overlay-*` | `overlay-default` |
| Прозрачный hit-area | `transparent-*` | `transparent-default`, `transparent-default-hover` |

**Разведение близких категорий:**
- `base-bg-*` — глобальные плоские фоны зон страницы (страница, sidebar). `bg-*` — фоны компонентов с семантикой. `specialbg-*` — полупрозрачный слой поверх контента.
- `text-*` — только для текстовых нод. Для иконки рядом с текстом — `graphic-*` соответствующей семантики (`text-negative` + `graphic-negative`).
- `status-*` — насыщенная заливка статуса. `status-muted-*` — приглушённый фон-плашка под текстом статуса.
- `neutral-{N}` — когда дизайнер указал конкретный шейд палитры (числовой), а не семантику. По возможности предпочитать семантический токен.

### Универсальные суффиксы

К большинству токенов можно добавить:

- `-hover` / `-press` — состояния интеракции
- `-inverted` — для тёмного контейнера (свет на тёмном)
- `-alpha-{N}` — прозрачность (N ∈ 3, 4, 7, 8, 10, 12, 15, 16, 20, 24, 30, 32, 37, 40, 50)
- `-shade-{N}` — затемнение (N ∈ 7, 10, 15, 20, 24, 30, 40, 50)
- `-tint-{N}` — осветление (N ∈ 15, 20, 24, 30, 40, 50)

Комбинируются: `--color-light-text-primary-inverted-shade-30`, `--color-light-bg-primary-inverted-alpha-12`.

### Поиск конкретного токена

Имя из Figma — через Figma MCP (`get_variable_defs`).
Поиск по фрагменту — в источнике пакета:

```bash
grep -oE -- "--color-light-[a-z0-9-]*<fragment>[a-z0-9-]*" \
  node_modules/@alfalab/core-components-vars/colors-bluetint.css | sort -u
```

Источник истины: `node_modules/@alfalab/core-components-vars/colors-bluetint.css` (497 light-токенов).
Полный перечень имён в md не дублируется — в пакете всегда актуально.

---

## Отступы — ОБЯЗАТЕЛЬНО

Все отступы (gap, margin, padding) — ТОЛЬКО через токены `--gap-*` из `@alfalab/core-components/vars/gaps.css`.
Хардкодить числа (px, rem) ЗАПРЕЩЕНО.

Подключение (уже в проекте через corp.css, дополнительно импортировать не нужно):
```css
@import '@alfalab/core-components/vars/gaps.css';
```

Токены:
--gap-0 = 0 | --gap-2 = 2px | --gap-4 = 4px | --gap-8 = 8px | --gap-12 = 12px | --gap-16 = 16px
--gap-20 = 20px | --gap-24 = 24px | --gap-32 = 32px | --gap-40 = 40px | --gap-48 = 48px
--gap-56 = 56px | --gap-64 = 64px | --gap-72 = 72px | --gap-80 = 80px | --gap-96 = 96px | --gap-128 = 128px

Отрицательные: --gap-16-neg = -16px (добавить суффикс -neg)

Примеры:
```tsx
gap: 'var(--gap-24)'
marginBottom: 'var(--gap-16)'
padding: 'var(--gap-32) var(--gap-40)'
```

---

## Типографика — ОБЯЗАТЕЛЬНО

Использовать ТОЛЬКО компоненты `Title` и `Text`. Хардкодить fontSize / fontFamily / fontWeight ЗАПРЕЩЕНО.
CSS-миксины (`@mixin headline_small`) — только когда компонент не применим (li, label, input, textarea).

Шрифт: всегда `font='system'`. Styrene и Alfa Interface Sans — не наш кейс.

```tsx
import { Title } from '@alfalab/core-components/typography/title';
import { Text } from '@alfalab/core-components/typography/text';

// Заголовки — ручное управление размером:
<Title tag='h1' view='xlarge' font='system'>Заголовок</Title>
// views: xlarge | large | medium | small | xsmall

// Адаптивный заголовок (авто desktop↔mobile):
import { TitleResponsive } from '@alfalab/core-components/typography/title-responsive';
<TitleResponsive view='large' font='system'>Заголовок</TitleResponsive>

// Текст:
<Text view='primary-medium' color='secondary'>Подпись</Text>
// weight: bold (700) | medium (500) | regular (400, по умолчанию)
// color: primary | secondary | tertiary | disabled | accent | ...
```

## Текстовые стили (Alfa Guidelines)

| Назначение | Стиль | Размер / Line-height |
|------------|-------|----------------------|
| Наборный текст | `Text view='primary-medium'` | 16 / 24 |
| Лейблы / саблайны | `Text view='primary-small'` (TBD — подтвердить view) | 14 / 20 |

Маппинг view ↔ конкретный размер из Guidelines уточнить при первом использовании.

```tsx
### Do
- Адаптировать layout через useBreakpoint из src/utils/useBreakpoint.ts
- Использовать только --border-radius-* для скруглений
- Использовать только --color-* CSS-переменные для цветов
- Использовать только --gap-* токены для всех отступов

### Don't
- Don't хардкодить px в border-radius
- Don't хардкодить hex/rgba — только через CSS-переменные
- Don't хардкодить медиа-запросы или window.innerWidth
- Don't использовать deprecated: --border-radius-xs/s/m/l/xl/xxl/3xl
```
