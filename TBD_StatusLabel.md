# TBD_StatusLabel.md — AlfaBank

## Контекст

Рабочий документ под открытое решение по цветовым вариантам пилюли `statusLabel` в `TitleView` и связанным компонентам (StatusBadge, Tag). После закрытия решения — вольётся в `TitleView.md` / `Components.md` или удалится.

## 1. Что нашли в Figma (TitleView pill)

Узел: `Web__Corp Components` node `35325:33191`. У статусной плашки в свойстве `Type` 5 цветовых вариантов:

| Variant | Цвет | Семантика |
|---|---|---|
| Approved | зелёный | положительное («Одобрено») |
| Attention | оранжевый | внимание |
| Error / Risk | красный | ошибка / отказ |
| Neutral | серый | нейтрально |
| Processing | info / синий | в обработке |

(В `Type` ещё лежат Action / Button / Link / Icon / IconButton / Neurohelper / StatusBadge — это варианты правого слота, не пилюли.)

## 2. Компоненты `@alfalab/core-components`

**StatusBadge** (`/status-badge`) — иконка состояния:
- `view`: `positive-checkmark` · `negative-cross` · `negative-alert` · `negative-block` · `attention-alert` · `neutral-information` · `neutral-operation` · `neutral-cross`
- `size`: 16 | 20 | 24 | 32 | 40
- `colors`: `default` | `inverted`

**Tag** (`/tag/desktop` → `TagDesktop`) — текстовая пилюля:
- `view`: `outlined` | `filled` | `transparent`
- `shape`: `rounded` | `rectangular`
- `size`: 32 | 40 | 48 | 56 | 64 | 72
- Цвет — от темы, не семантический

**Badge** (`/badge`) — счётчик уведомлений, не статус (мимо темы).

## 3. Токены цветов (corp.css)

Из `node_modules/@alfalab/core-components-vars/colors-bluetint.css`:

```
--color-light-status-positive      (+ -hover, -press, -inverted, -muted, -muted-alpha-*)
--color-light-status-negative
--color-light-status-attention
--color-light-status-info
```

Все с suffix-семействами `-hover` / `-press` / `-inverted` / `-alpha-N`. Для текста на пилюле — `--color-light-static-text-primary-inverted` (есть в TitleView.md → «Цвета текста»).

## 4. Текущее состояние в коде

[src/components/TitleView.tsx:80-92](src/components/TitleView.tsx) — `statusLabel` рендерится как пилюля с **хардкодом** `background: '#0cc44d'`, `color: 'rgba(255,255,255,0.94)'`.

Цветовые варианты в коде есть только для `titleStatusProps` (вертикальная полоска) в `STATUS_COLORS`:

```ts
positive: '#0cc44d', negative: '#ef3124', attention: '#f6a821'
```

Тоже хардкод, нет `neutral` и `processing` / `info`.

API `statusLabel: string` — без типа.

## 5. Открытые решения (TBD)

- **API для типа пилюли.** Варианты:
  - `statusLabel: { type, text }` — ломающее, чище
  - `statusLabel: string` + `statusLabelType?: 'approved' | ...` — мягко, два пропа
- **Реализация:** свой `<span>` на токенах `--color-light-status-*` или замена на `TagDesktop` (`view='filled'` + кастомные стили на токены).
- **Имена типов:** Figma-нейминг (Approved / Attention / Error / Neutral / Processing) vs семантический (positive / attention / negative / neutral / info). Лучше второй — совпадает с токенами.
- **`STATUS_COLORS` для `titleStatusProps`** — добавить `neutral` / `info`, перевести с hex на токены `var(--color-light-status-*)`.
- **`StatusBadge` (core-components)** не описан в `Components.md` / `Design_system` — отдельный пробел: добавить страницу со списком 8 view и размерами.

## 6. Файлы

- [Design_system/TitleView.md](Design_system/TitleView.md) — описание `statusLabel` (строки 42, 46), пометка про 5 типов уже добавлена
- [Design_system/Components.md](Design_system/Components.md) — каталог компонентов (StatusBadge отсутствует)
- [Design_system/Tokens.md](Design_system/Tokens.md) — категория `status-*` (строки 65–66)
- [src/components/TitleView.tsx](src/components/TitleView.tsx) — реализация пилюли (строки 80–92) и `STATUS_COLORS` (строки 26–30)
- Figma node TitleView: `35325:33191` (Web__Corp Components)
