# Rules.md — AlfaBank
## Overview
Правила двусторонней синхронизации Figma ↔ код. Маппинг компонентов, ведение figma_code_map.md, обновление при смене версии пакета.

## Термины и уточнения

«Положи в Left» — уточнить: внутрь `BackgroundPlate` или в колонку Left рядом с ней?

## Figma → Код

При получении Figma-ссылки:
1. Прочитать `AlfaBank/figma_code_map.md` — использовать как базу уже решённых маппингов
2. Получить данные через `get_design_context` и/или `get_variable_defs`
2. Проанализировать семантику — назначение, структуру, пропсы (НЕ совпадение имён)
3. Найти аналог в `@alfalab/core-components` по смыслу
4. Если найден — записать в `figma_code_map.md` со статусом ✓ или ~
5. Если не найден — спросить дизайнера, записать со статусом ✗
6. Div-вёрстку из Figma не тащить — только компоненты из пакета

## Код → Figma

При обратной синхронизации:
1. Открыть `figma_code_map.md` — взять как основу маппинга
2. Предложить дизайнеру обновить Figma-компоненты по текущему коду

## figma_code_map.md

`AlfaBank/figma_code_map.md` — источник истины для двусторонней синхронизации.
Обновлять при каждой новой Figma-ссылке.

Статусы: ✓ найден · ~ частичный · ✗ отсутствует

## Уведомление об обновлении

При чтении `figma_code_map.md` — если в строке версии есть `⚠`, сообщить дизайнеру:
«@alfalab обновился до X.X.X. Нужно проверить маппинги — открываю changelog.»
Затем открыть releases, найти изменения между версиями, обновить затронутые строки в map.

## Components.md

Не дублировать пропы и примеры если у компонента есть отдельный `.md`-файл.
В `Components.md` — только ссылка на `.md` + минимальный импорт.
Полная документация (пропы, примеры, gotchas) — в файле компонента.

## Corp-тема (CSS-каскад)

Corp-тему компонента импортировать в том же файле где используется компонент, **после импорта компонента**:

```tsx
import { ButtonDesktop } from '@alfalab/core-components/button/desktop';
import '@alfalab/core-components-themes/button/corp.css';
```

**Why:** в Vite компонентный `default.desktop.css` грузится через JS позже чем `index.css` и перезаписывает `:root` (чёрный цвет вместо красного). Импорт рядом с компонентом гарантирует правильный порядок каскада.

**Перед добавлением:** проверить наличие corp.css — `ls node_modules/@alfalab/core-components-themes/<component>/`. Для некоторых компонентов (например `input`) есть только `site.css`.

### Финальный фикс через !important

Если corp-тема всё равно не применяется (Vite инжектирует ESM-путь компонентного CSS последним, после corp.css) — `!important` на переменные в `src/corp-overrides.css`:

```css
:root {
  --button-primary-base-bg-color: var(--color-light-accent-primary) !important;
  --button-primary-hover-bg-color: var(--color-light-accent-primary-hover) !important;
  --button-primary-active-bg-color: var(--color-light-accent-primary-press) !important;
  --button-primary-color: var(--color-static-text-primary-inverted) !important;
}
```

Файл импортируется последним в `main.tsx`. CSS custom properties поддерживают `!important` — декларация побеждает любой non-important override независимо от порядка загрузки.

## Changelog @alfalab/core-components

https://github.com/core-ds/core-components/releases

Открывать когда версия в figma_code_map.md изменилась — проверить deprecated и breaking changes, обновить маппинги.

### Do
- Читать перед работой с любой Figma-ссылкой
- Обновлять figma_code_map.md при каждом новом маппинге
- Искать аналог в @alfalab/core-components по семантике, а не по совпадению имён

### Don't
- Don't тащить div-вёрстку из Figma в код
- Don't игнорировать ⚠ в строке версии figma_code_map.md
- Don't маппить по имени — только по назначению и структуре
