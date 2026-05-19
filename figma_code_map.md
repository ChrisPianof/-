# figma_code_map.md — AlfaBank
## Overview
Маппинг Figma-имён ↔ Design_system .md ↔ реализация в коде. Источник истины для двусторонней синхронизации. При получении Figma-ссылки — найти строку, прочитать связанный `.md`, использовать указанный npm-пакет.

@alfalab/core-components: 50.12.0

**Статусы:** ✓ найден · ~ частичный · ✗ отсутствует / отложен

---

## Layout / Структура

| Figma | Наш .md | Код (npm / путь) | Где применён | Статус | Заметка |
|-------|---------|------------------|--------------|--------|---------|
| «Sidebar» / «Левая навигация» | `Sidebar.md` | `src/components/Sidebar.tsx` | `src/App.tsx` → `PageLayout` | ✓ | 248px фикс, vh |
| «Header» (страничный) | `Header.md` | `src/components/Header.tsx` | `src/App.tsx` → `PageLayout` | ✓ | Default + showBack варианты |
| `Паттерн :: TitleView` (АБ · MobileWeb) / «Header-System» / xLarge | `TitleView.md` | `src/components/TitleView.tsx` (xLarge mode) | `src/screens/BasePage.tsx` | ✓ | Page-level, первый в CorporateContent |
| `TitleView :: Medium` / «Title 22-26» | `TitleView.md` (Medium) | `src/components/TitleView.tsx` (`view='small'`) | `src/screens/BasePage.tsx` (внутри BgPlate, picker «TitleView (Medium)») | ✓ | Block-level в BgPlate. Один на смысловой блок. Пропы урезаны до 4 (см. TitleView.md → «BgPlate-контекст») |
| `TitleView :: Small` / «Title 18-22» | `TitleView.md` (Small) | `src/components/TitleView.tsx` (`view='xsmall'`) | `src/screens/BasePage.tsx` (внутри BgPlate, picker «TitleView (Small)») | ✓ | Subsection-level. В BgPlate — сколько угодно, в IsleBlock — один |
| «Подложка» (TBD: точное Figma-имя) | `BackgroundPlate.md` | `src/components/BackgroundPlate.tsx` | `src/screens/BasePage.tsx` | ~ | 5 view вариантов (Primary/Secondary/Colored/Dropzone/Border) |
| `Паттерн :: Островки в Альфа-Бизнес` / «Островок» | `IsleBlock.md` | `@alfalab/core-components/steps` → `Steps` (нав.); custom div-обёртка (инфо) | `src/screens/BasePage.tsx` | ✓ | Карточка-обёртка вручную. Corp: `@alfalab/.../steps/corp.css` |

---

## Form-элементы

| Figma | Наш .md | Код (npm / путь) | Где применён | Статус | Заметка |
|-------|---------|------------------|--------------|--------|---------|
| Tabs (primary) | `TabsView.md` | `@alfalab/core-components/tabs` → `Tabs`, `Tab` | `src/screens/BasePage.tsx` | ✓ | Между TitleView и Body. Требует `resolve.dedupe` в vite.config |
| TabsSecondary / TagGroup (теги) | `TagGroup.md` | `@alfalab/core-components/tabs` + `SecondaryTabListDesktop` | `src/screens/BasePage.tsx` | ✓ | Внутри BgPlate. Дефолт: `size='xs'`, `tagView='filled'`. В коде = TagGroup, в Figma — TabsSecondary |
| «Поле ввода» / Input | `Input.md` | `@alfalab/core-components/input/desktop` → `InputDesktop` | `src/screens/BasePage.tsx` | ✓ | Нестандартная `onChange` сигнатура |
| «Выпадающий список» / Select | `Select.md` | `@alfalab/core-components/select/desktop` → `SelectDesktop` | `src/screens/BasePage.tsx` | ✓ | OptionShape. Corp.css отдельно |
| `[D] UniversalDateInput` / «calendar» / «Календарь» / «Дата» / «date» | `UniversalDateInput.md` | `@alfalab/core-components/universal-date-input/desktop` → `UniversalDateInputDesktop` (+ `Calendar` из `/calendar`) | TBD — не применён в src/ | ✓ | 5 view (date/date-time/date-range/time/month). picker=true требует Calendar. Corp.css × 2. Owner: @vbarkalov. Паспорт Web::Core node `507:25760` |

---

## Действия

| Figma | Наш .md | Код (npm / путь) | Где применён | Статус | Заметка |
|-------|---------|------------------|--------------|--------|---------|
| `Паттерн :: Кнопки и группы кнопок` / Button | `Buttons.md` | `@alfalab/core-components/button/desktop` → `ButtonDesktop` | `src/screens/BasePage.tsx` | ✓ | 6 view × 6 sizes. Corp gotcha с `!important` |
| IconButton | `Buttons.md` → IconButton | `@alfalab/core-components/icon-button/desktop` → `IconButtonDesktop` | TBD — не применён в src/ | ✓ | Только иконка, отдельный компонент |

---

## Display / Маркеры состояния

| Figma | Наш .md | Код (npm / путь) | Где применён | Статус | Заметка |
|-------|---------|------------------|--------------|--------|---------|
| `ЭтоБаза :: Статусная модель` / `🔒 [D] StatusPreset` / `🔒 [M] StatusPreset` / «Статус» / «Пилюля статуса» | `Status.md` | `@alfalab/core-components/status` → `Status` | TBD — слот `statusLabel` в `TitleView` (хардкод зелёного) | ~ | Палитра 6 цветов (teal не использовать). Лексикон 23 канонических лейбла. Owner: @vbarkalov. v5.0.2 |

---

## Паттерны (составные / отложенные)

| Figma | Наш .md | Код (npm / путь) | Где применён | Статус | Заметка |
|-------|---------|------------------|--------------|--------|---------|
| `Паттерн :: ContentCardWrapper` | TBD — связанный паттерн, не отдельный наш компонент | TBD | — | ✗ | Упомянут в Guidelines как обёртка контента внутри BgPlate. Уточнить: отдельный компонент или часть BackgroundPlate |
| Switch / TagGroup → Linked Content | TBD (паттерн `LinkedContent` отложен) | `@alfalab/core-components/switch`, `@alfalab/core-components/tag-group` (предположительно) | — | ✗ | Паттерн «связанный контент при выборе». Реализация отложена |
| Footer формы (Buttons & Controls) | TBD (паттерн отложен) | composition: `ButtonDesktop` × N + checkbox | — | ✗ | 64px зона, 32px от контента, 16px между, чекбокс 24px |

---

### Do
- Обновлять при каждой новой Figma-ссылке
- Указывать статус: ✓ найден · ~ частичный · ✗ отсутствует / отложен
- Заполнять колонку «Где применён» — путь к живому примеру в `src/`
- Проверять changelog при смене версии @alfalab

### Don't
- Don't игнорировать строки со статусом ✗ — спросить дизайнера
- Don't удалять строки со статусом ~ без финального решения
- Don't создавать новый `[Component].md` в Design_system без строки здесь — `figma_map_freshness` чек упадёт
