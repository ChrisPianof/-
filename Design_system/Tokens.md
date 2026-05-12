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

Использовать ТОЛЬКО CSS-переменные `--color-*`. Хардкодить hex/rgba ЗАПРЕЩЕНО.
Переменные доступны через corp.css — дополнительно импортировать не нужно.

Если нужна переменная по названию из Figma — запросить файл через Figma MCP (`get_variable_defs`).

Текст:
--color-light-text-primary      — основной текст (rgba 3,3,6 / 0.88)
--color-light-text-secondary    — вторичный (rgba 4,4,19 / 0.55)
--color-light-text-tertiary     — третичный (rgba 5,8,29 / 0.38)
--color-light-text-positive     — успех (#0d9336)
--color-light-text-negative     — ошибка (#ec2d20)
--color-light-text-attention    — предупреждение (#ea8313)
--color-light-text-info         — информация (#2a77ef)

Фон:
--color-light-base-bg-primary   — основной фон (#fff)
--color-light-base-bg-secondary — альтернативный (#f2f3f5, sidebar/header)

Акцент:
--color-light-accent-primary    — Alfa red (#ef3124)
--color-light-accent-secondary  — тёмный (#212124)

Тени: --shadow-xs/s/m/l/xl (из vars/shadows-bluetint.css)

Состояния hover/press: добавлять суффикс -hover / -press к любому токену.

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
