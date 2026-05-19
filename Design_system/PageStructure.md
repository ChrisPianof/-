# PageStructure.md — AlfaBank
## Overview
Иерархия зон страницы: Sidebar + Header + CorporateContent (TitleView → TabsView → Body). Фиксированные отступы и порядок зон.

## Page Structure

Фон страницы: `base-bg-alt/primary` (токен corp-темы). Применять на корневой обёртке страницы.

Все страницы собираются из трёх зон:

  | Компонент | Позиция | Роль |
  |---|---|---|
  | Sidebar | Левый край, вся высота | Глобальная навигация |
  | Header | Верхний край, правее Sidebar | Аккаунт, глобальные действия |
  | CorporateContent | Правее Sidebar, ниже Header | Основной контент |

## CorporateContent

Паддинги: 40px сверху, 52px по бокам, 64px снизу.

Зоны сверху вниз:

  1. **TitleView** — заголовок страницы (всегда). Детали → `TitleView.md`
  Отступы между зонами: 32px
  2. **TabsView** — переключатель вкладок (опционально) Детали → `TabsView.md`
  Отступы между зонами: 32px
  3. **Body** — контент

## Body
Состоит из Left 8 колонок и Right 4 колонки
Сетка реагирует на брейкпоинты через хук `useBreakpoint` (`src/utils/useBreakpoint.ts`). Брейкпоинты и значения gridTemplateColumns — в `_index.md`.
Паддинги и отступы не меняются.

Right
Опциональная колонка 400px. Может отсутствовать (одноколоночный экран = только Left). Содержит только `IsleBlock` (детали → `IsleBlock.md`).
Отступ между несколькими IsleBlock: 24px.
Виды IsleBlock: навигационный (опционален; если присутствует — всегда первый сверху) + информационные.

Left
Одна или несколько карточек `BackgroundPlate` (детали → `BackgroundPlate.md`).
Отступ между карточками: 24px.

  Компоненты внутри `BackgroundPlate`:
  - `TitleView` block-уровня — `view='small'` (DS Medium 22/26, один на BgPlate) или `view='xsmall'` (DS Small 18/22, можно несколько). Пропы урезаны до `heading` / `leftAddon` / `rightAddon` / `subtitle` / `showSkeleton`. Детали → `TitleView.md` → «BgPlate-контекст»
  - `TagGroup` (детали → `TagGroup.md`)
  - `InputDesktop` (`@alfalab/core-components/input/desktop`) — текстовый ввод
  - `SelectDesktop` (`@alfalab/core-components/select/desktop`) — выпадающий список (детали → `Select.md`)
  - `UniversalDateInputDesktop` (`@alfalab/core-components/universal-date-input/desktop`) — поле даты (детали → `UniversalDateInput.md`)

  Отступы между компонентами внутри `BackgroundPlate`:
  - TagGroup → Input/Select/Date: 20px
  - Input/Select/Date → Input/Select/Date: 24px

  Поведение самих form-инпутов (default `size`, семантика `block`) — в `.md` соответствующих компонентов (`Input.md`, `Select.md`, `UniversalDateInput.md`).

## Адаптивность

Брейкпоинты системы (из `mq.json`):
- mobile: max-width 599px (эталонный пример Alfa Guidelines — **375px**)
- tablet: 600px – 1023px (эталонный пример — **768px**)
- desktop: min-width 1024px (эталонный пример — **1440px**)

Поведение Body grid:
- **desktop, tablet** — `Left` 8 cols + `Right` 4 cols (как описано выше)
- **mobile** — IsleBlock'и (`Right`) уходят ПОД `Left` (вертикальный стек)

Эталонные примеры форм собираются на 3 разрешениях (1440 / 768 / 375). Именование примеров: `🔗 Название формы / Разрешение`.

Применять адаптацию через хук `useBreakpoint` (`src/utils/useBreakpoint.ts`). Хардкодить медиа-запросы запрещено (см. `Tokens.md`).

### Do
- Применять фон `base-bg-alt/primary` на корневой обёртке страницы
- Соблюдать порядок зон: TitleView → TabsView (опц.) → Body
- Right-колонку Body зарезервировать только для IsleBlock

### Don't
- Don't менять отступы между зонами (32px фиксированные)
- Don't помещать IsleBlock в Left-колонку — только Right
- Don't создавать страницы без TitleView
- Don't ставить навигационный IsleBlock не первым в стеке Right
- Don't размещать несколько навигационных IsleBlock в Right — максимум один

