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
Фиксированная колонка 400px. Всегда присутствует, содержит только `IsleBlock`.
Детали → `IsleBlock.md`.

Left
Одна или несколько карточек `BackgroundPlate` (детали → `BackgroundPlate.md`).
Отступ между карточками: 24px.

  Компоненты внутри `BackgroundPlate`:
  - `TabsSecondary` (детали → `TabsSecondary.md`)
  - `InputDesktop` (`@alfalab/core-components/input/desktop`) — текстовый ввод
  - `SelectDesktop` (`@alfalab/core-components/select/desktop`) — выпадающий список (детали → `Select.md`)

  Отступы между компонентами внутри `BackgroundPlate`:
  - TabsSecondary → Input/Select: 20px
  - Input/Select → Input/Select: 24px

### Do
- Применять фон `base-bg-alt/primary` на корневой обёртке страницы
- Соблюдать порядок зон: TitleView → TabsView (опц.) → Body
- Right-колонку Body зарезервировать только для IsleBlock

### Don't
- Don't менять отступы между зонами (32px фиксированные)
- Don't помещать IsleBlock в Left-колонку — только Right
- Don't создавать страницы без TitleView

