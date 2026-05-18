# 🎁 ПЕРЕДАТОЧНЫЙ ДОКУМЕНТ СЕССИИ — TitleView анализ
**Дата:** 2026-05-16 (reconstruct: 2026-05-17 после overwrite)
**Source:** анализ `~/Library/CloudStorage/GoogleDrive-sweeptrip@gmail.com/My Drive/Claude/✅ Компонент __ TitleView.fig`
**Назначение:** передача контекста в новую сессию Claude Code

> ⚠️ **Reconstruct note:** Файл был перезаписан 2026-05-17 моей ошибкой. Sections I-XXV восстановлены из истории сессии (моих прочтений файла + summary). Sections XXVI-XXVII (артборды Small и Примеры использования) **утрачены** — артборды нужно повторно пройти в новой сессии через Figma MCP на узлах `6848:72400` (Small) и `7172:57222` (Примеры использования).

---

## I. ЗАВЕРШЁННЫЕ ИЗМЕНЕНИЯ В РЕПО

| # | Файл | Изменение |
|---|---|---|
| 1 | `Tools/Hooks/rules_inject.sh` | UserPromptSubmit hook — авто-инжект Rules.md per cwd/file_path |
| 2 | `Tools/Hooks/destructive_bash_guard.sh` | PreToolUse Bash — блок rm -r*/rmdir/mv без FindDeps |
| 3 | `AutoTests/checkers/rules/md_figma_indexed.sh` | Чек: `[Component].md` в Design_system → строка в figma_code_map.md |
| 4 | `AutoTests/checkers/check.sh` | Удалена dead var `matched`, добавлен md_figma_indexed |
| 5 | `memory/feedback_project_docs_first.md` | Принцип: при работе в проекте с docs → читать первым, inquiry только на пробелы, результат → в docs |
| 6 | `memory/MEMORY.md` | +pointer на AlfaBank Design_system + feedback_project_docs_first |
| 7 | `AlfaBank/Rules.md` | Workflow Figma → DS → код + reverse + edge cases + .fig точка контакта |
| 8 | `AlfaBank/Design_system/_index.md` | + раздел «Источники правил» (Alfa Guidelines, ссылки Figma, нейминг) + локальные .fig в Google Drive + «Приём Figma-ссылки» pointer |
| 9 | `AlfaBank/Design_system/TitleView.md` | Trinity (xLarge/Medium/Small) + варианты + правила размещения |
| 10 | `AlfaBank/Design_system/BackgroundPlate.md` | Отступы внутри (12/16/24) + расхождение с PageStructure |
| 11 | `AlfaBank/Design_system/PageStructure.md` | Адаптивность (1440/768/375, islands на mobile→вниз) + IsleBlock доп. spec + правила (Right опционален) |
| 12 | `AlfaBank/Design_system/Tokens.md` | Текстовые стили Paragraph 16/24 + 14/20 |
| 13 | `AlfaBank/Design_system/IsleBlock.md` | Информационный тип + типы контента |
| 14 | `AlfaBank/Design_system/Components.md` | TitleView 3 уровня |
| 15 | `AlfaBank/figma_code_map.md` | Расширен с 1 до 15 строк, группировка по слоям, колонка «Где применён» |

---

## II. ОТКРЫТИЯ ПО TITLEVIEW (5 артбордов .fig)

### Trinity (4 уровня) с маппингом

| TitleView `view` | Title `view` | Guidelines | Размер | Слоты |
|---|---|---|---|---|
| `'xLarge'` | xlarge | xLarge (Основной страничный) | **48/52** | все 8 (Status, Title, FilterCompanySelect, Subtitle, 4× Buttons, 2× Addons, TitleStatus) |
| `'large'` (default) | large | Large (Крупный) | **40/48** | Title + Subtitle + Addons (status/buttons **отдельно**) |
| `'medium'` | medium | Medium (Основной контентный) | **30/36** | **только Title + Subtitle** |
| отсутствует в TitleView | small | Small (Доп. контентный) | **22/26** | Title напрямую, без wrapper |

**Дополнительно есть `Title view='xsmall'`** = 18/22 (5-й уровень, в `IsleBlock` headline).

### Иерархия слотов по уровню

**xLarge (8 слотов):** Status (1), Title (2), FilterCompanySelect (3), Subtitle (4), Button×2 (5,6), Addon×2 (7,8). Maximum 4 кнопки в buttonsGroup, overflow → `pickerbutton`.

**Large:** Title + Subtitle + Addons. Status/Buttons — внешние компоненты рядом.

**Medium:** только Title + Subtitle. Status/Buttons/**Accordion** — отдельно. **«Один Medium на смысловой блок»**.

### Размеры (визуально)

- TitleView без кнопок: **48px**
- TitleView с кнопками: **80px**
- TitleView внутри Plate (Medium): **54px**
- TitleView большой (xLarge full с TitleStatus + buttons): **128/232px**
- Right колонка IsleBlock: 348 (Figma demo) vs **400** (наш PageStructure — официальное)

### Spacing'и (подтверждены Measure-bubbles)

| Между | px |
|---|---|
| Header → TitleView | **40** |
| TitleView → Content / TabsView / FiltersBlock / Plate | **32** |
| TabsView → FiltersBlock | **20** |
| TitleView → TopBar | **12** (TopBar имеет внутренний 24px) |
| Над Large (в теле страницы) | 32 |
| Под Large (в теле страницы) | 24 «оптический» |

### Контексты применения Medium (7 типов)

1. Базовая карточка / форма
2. С ссылкой-действием («Очистить»)
3. **Внутри Accordion** (Core Wrappers wrapper)
4. С IconButton (1 outline) — стандартное интуитивное действие
5. С 2× IconButton — два стандартных
6. С 3+ действиями → fallback (text buttons / picker)
7. В просмотровой форме (TableView) — оптическая компенсация

---

## III. НОВЫЕ КОМПОНЕНТЫ (для figma_code_map.md)

### Слоты TitleView (разные visual для уровней)

- `[D] TitleStatus` — статус-блок внутри Title (цвет полоски + Title + Caption)
- `[D] TitleAddon` / `[D] TitleAddonXL` — addon под Title (Medium vs xLarge)
- `[D] RightAddon` / `[D] RightAddonXL` — правый addon
- `[D] CompactTag` — внутри Title компонент
- `[D] Addon` (`type: Link | IconButton`)
- `IconView` (size 24/128)
- `Holding` — режим холдинга (LogoGroup + название)

### Связанные структурные компоненты

- `[D] FiltersBlock` (h=137) — composite c DatePicker + Search + GeneralFilterTag + 4× FilterTag
- `[D] DatePicker` (h=56) — picker даты
- `[D] GeneralFilterTag` (40×40) — icon-only sliders
- `[D][Corporate] FilterTag` (h=40) — Label + chevron-down (size 40/48)
- `[D] TabsView` = TabsPrimary + TabsSecondary (gap 24, h=104 двойной ряд)

### Таблица — composite

- `[D](1600) TableBasic` (1092 ширина) — TopBar + Table + StickyPagination + BackgroundPlate
- `[D] TopBar` (h=72) — Counter + selectAll + Settings (gear) + ExtraButton
- `[D] HeadRow :: Universal` (h=73) — HeadControlCell + HeadCell × N + HeadActionCell
- `[D] HeadCell` — TitleBlock (Title + Sorting + ColumnControl) + HeadDivider
- `[D] BodyRow :: Basic` (h=93) — BodyControlCell + BodyCell × N + BodyActionCell («Detach me and create local»)
- `[D] BodyCellBasic` (presets `Text` / `Status`) — Graphics + Text 1/2 или DStatusPreset
- `[D] StickyPagination` (h=76) — OptionSelect + Pagination
- `🔒 [D] StatusPreset` (Figma-only, в коде = `Status` core-components, view `Contrast`/`Muted`)
- `HeaderAddon` — info-StatusBadge (16×16 NeutralInformation)
- `Sorting` — Not selected / ListAsc / ListDesc / ListDefault

### Plates (важно: 3 разных компонента!)

- **`[D] Plate`** = база-карточка (≈ наш `BackgroundPlate.tsx`) → в нашей DS = `Plate.md` (без `[D]` префикса)
- **`Plate`** (без D) = info-плашка (Warning 🟠 / Info 🔵). По правилу юзера (вариант B): то же что `[D] Plate`, просто generic-имя группы → одно и то же → один `Plate.md`
- **`[D] BackgroundPlate`** — фон-слой (Style Level 1, rounded 16, base-bg-alt/secondary). **Разный** компонент от `[D] Plate` → наш `BackgroundPlate.md`
- **`[D][Corporate] Plate`** (h=80) — расширенная info-плашка с border + Title 18/22 + Caption 14/20

### IsleBlock (compound)

- `🔒 [D] IsleBlock :: 1024+` — composite:
  - `[D] IsleHeader :: 1024+` (DTopAddon IconView + SpacingVertical 20 + Title 18/22 xsmall)
  - body (IsleContent — Text Paragraph 14/20)
  - `[D] IsleFooter :: 1024+` (Link с pseudo-underline)
  - `[D] BackgroundPlate` (фон z-1)
  - Padding sides 24, TopPadding 24, BottomPadding 24

### Header (page-level)

- `[D] Header` (h=56)
- Right: IconButton `Menu`/`Search`/`Mail`/`Notifications`/`Exit` + DividerVertical между группами
- `HoldingAccount` (LogoGroup 4 tiles + название холдинга) — **другой state** чем SingleAccount
- IconButton использует `logo-corp_*-sign-box-line_20` set (НЕ glyph)

### SideMenu

- `[D] SideMenu` 248px фикс vh
- Inside: LogoCell (Альфа-Бизнес) + AllServices + ProductCell × N + Footer (Настроить меню)
- Component `AlfaBankSignBoxMWhite` для брендового лого

### Blueprint-компоненты (Figma-only, не переносить в код)

- `📕 Connection` — banner-ссылка на родительский паттерн (cyan «Связанная база»)
- `📕 Plate` — wrapper для info-плашек в blueprint
- `📕 Text` — H1/H2/H3/Paragraph/Caption presets для документации
- `📕 ImageWrapper` — контейнер demo-изображений
- `📕 ToDoOrNotToDo` — 🟢 do / 🟠 избегай / 🔴 нельзя
- `📕 Footer` — нижний колонтитул
- `Measure` — bubble с px-числом (Inter Medium 11/16, accent/primary bg)
- `↕ SpacingVertical` — управляемый spacing с size variants (1/8/12/16/20/24/32)
- `[D] Body` — SwapMe placeholder для контента

---

## IV. НОВЫЕ DESIGN TOKENS

### Typography

| Token | Размер | Назначение |
|---|---|---|
| Headline-System/48-52 xLarge (`Title view='xlarge'`) | 48/52 SF Pro Display Bold | xLarge заголовки |
| Headline-System/40-48 Large (`Title view='large'`) | 40/48 SF Pro Display Bold | Large заголовки |
| Headline-System/30-36 Medium (`Title view='medium'`) | 30/36 SF Pro Display Bold | Medium заголовки |
| Headline-System/22-26 Small (`Title view='small'`) | 22/26 SF Pro Display Bold | Small / H3 в blueprint |
| Headline-System/18-22 xsmall (`Title view='xsmall'`) | 18/22 SF Pro Display Bold | IsleHeader, мелкие headlines |
| Paragraph 16/24 (`Text view='primary-medium'`) | 16/24 SF Pro Display Regular | Основной текст |
| Paragraph 14/20 (`Text view='primary-small'`) | 14/20 SF Pro Display Regular | IsleContent, мелкий текст |
| Caption 12/16 | 12/16 SF Pro Display Regular | Подписи под Title |
| Action 13/16 medium | 13/16 SF Pro Display Medium | Tag-уровень текста, FilterTag |
| Accent caps 11/16 | 11/16 SF Pro Display Medium UPPERCASE | StatusLabel («НА ПОДПИСЬ») |
| Caveat Bold 32 | 32 Caveat Bold | Blueprint handwritten подписи (`--decorative/indigo #897eff`) |
| Inter Medium 11/16 | 11/16 Inter Medium | Measure-bubbles в blueprint |

### Цвета текста TitleView (подтверждено `get_variable_defs` на `35325:33191` Web__Corp Components, 2026-05-17)

| Слот | Token Figma | Hex | Альфа | Назначение |
|---|---|---|---|---|
| Title (все 4 уровня) | `text/primary` | `#030306e0` | 88% | Основной заголовок |
| Subtitle | `text/secondary` | `#0404138c` | 55% | Подзаголовок |
| TitleStatus.title | `text/primary` | `#030306e0` | 88% | Bold title в блоке с полоской |
| TitleStatus.caption | `text/secondary` | `#0404138c` | 55% | Caption под title |
| StatusLabel (на цветной tag) | `static_text_inverted/primary` | `#fffffff0` | 94% | Белый текст на solid tag |

**Ключевое:** все 4 уровня TitleView используют **одни и те же** color tokens — меняется только typography (размер/leading). Цвета — translucent darks с alpha, адаптируются к фону.

**CSS mapping** (предполагаемый, ещё валидировать в коде):
- `text/primary` → `--color-light-text-primary`
- `text/secondary` → `--color-light-text-secondary`
- `static_text_inverted/primary` → `--color-light-static-text-primary-inverted`

### Цвета (статусы / decorative)

- `--status/positive` = `#0cc44d` — зелёный (success, auto-avatar fallback)
- `--status/attention` = `#fa9313` — оранжевый (warning)
- `--status/negative` = `#ff4837` — красный (error, primary CTA в corp-теме)
- `--status/info` = `#2288fa` — синий
- `--decorative/green` = `#0cc44d` — TitleStatus вертикальная полоска
- `--decorative/blue` = `#3193fc`
- `--decorative/indigo` = `#897eff` — blueprint stroke
- `Button/Desktop/Primary/bg` = `#ef3124` — primary CTA фон (corp)
- `Button/Desktop/Primary/text` = `#fffffff0` — текст на primary
- `neutral-translucent/300` = `#0f19371a` — translucent overlay
- Sidebar item active: `#e7e8eb` (серый фон, demo) — расхождение с Sidebar.md (`#ef3124`) — TBD

### Effects

- `ControlBlur` — backdrop blur у некоторых controls (нужно уточнить значение в .fig)
- Skeleton state — большинство data-driven компонентов имеют `showSkeleton?: boolean`

---

## V. СВЯЗАННЫЕ ПАТТЕРНЫ И FIGMA URL

### Локальные .fig (Google Drive)

`~/Library/CloudStorage/GoogleDrive-sweeptrip@gmail.com/My Drive/Claude/`
- ✅ `Компонент __ TitleView.fig` → `Design_system/TitleView.md`
- ✅ `Раздел __ Правила построения форм.fig` → Figma-ссылки на правила
- `Web __ Corp Components.fig` (113 МБ) → библиотека Web/Corp компонентов

⚠️ Имя папки может меняться (`Сlaude` кириллица ↔ `Claude` латиница). Перед обращением:
```bash
ls "$HOME/Library/CloudStorage/GoogleDrive-sweeptrip@gmail.com/My Drive/"
```

### Figma URL (для traceability, не источник истины)

- Правила построения форм 1: `https://www.figma.com/design/yHQ6H38fKXlYNRykd4MAHF`
- Правила построения форм 2: `https://www.figma.com/design/cw4hAR0AebQmUkc4DHUiYm`

### Связанные паттерны Guidelines (нейминг)

- `Паттерн :: TitleView` (АБ · MobileWeb) → `TitleView.md`
- `Паттерн :: Островки в Альфа-Бизнес` → `IsleBlock.md`
- `Паттерн :: Кнопки и группы кнопок` → `Buttons.md`
- `Паттерн :: ContentCardWrapper` → связанный (обёртка контента внутри BackgroundPlate)
- `Сценарий :: Выбор компании (Холдинг)` → relevant для xLarge FilterCompanySelect слота

### Нейминг-конвенции

- `ЭтоБаза :: <Name>` — базовый паттерн в иерархии
- `Паттерн :: <Name>` — производный
- `Сценарий :: <Name>` — пользовательский сценарий
- `Компонент :: <Name>` — отдельный компонент
- `❌ LocalComponents :: <Name>` — только Figma, не реализуется
- `🔒 <Name>` — залочен, не detach
- `📕 <Name>` — blueprint utility, не в production
- `[D] <Name>` — Desktop (1024+)
- `:: 1024+` — explicit desktop breakpoint suffix

---

## VI. КЛЮЧЕВЫЕ ПРАВИЛА (от меньшего к большему)

### Текст
- Если стиль Headline-System — **обязательно** использовать TitleView, даже без аддонов (🟠 attention)
- Подчёркивание ссылки: открывается отдельная страница → `Line: None`; открывается модалка → `Line: Pseudo`
- 🔴 Не скрывать продуктовый заголовок через эллипсис
- 🟠 Избегать длинных продуктовых заголовков
- 🟢 Редактируемый заголовок: эллипсис после первой строки

### Small
- Используется как `Title view='small'` напрямую, без TitleView wrapper
- 22/26 SF Pro Display Bold
- (Детали правил утрачены — см. примечание выше про артборд Small)

### Medium
- **Только один Medium на смысловой блок**
- Статус/кнопки/Accordion — отдельные компоненты, не часть TitleView
- 🔴 Не показывать кнопку очистки на пустых полях
- 🔴 Не использовать ссылки для 2+ действий
- 🟢 Использовать tooltips для action подсказок
- 🔴 Не использовать разные аддоны для пары действий
- Iconography action hierarchy:
  - 1 интуитивное действие → 1× IconButton outline
  - 2 интуитивных → 2× IconButton outline
  - 3+ или неинтуитивное → text buttons / picker
  - Очистить → Link

### Large
- Статус/кнопки **отдельно**, не часть TitleView
- Composition rule: отступы между блоками карточки не должны быть крупнее верхних и боковых отступов самой карточки

### xLarge
- **🔴 Не более одного xLarge на странице**
- Buttons — внутри TitleView (не вне)
- Кнопки и навигация — под TitleView, НЕ под табами
- Maximum 4 кнопки в buttonsGroup → overflow в pickerbutton
- TitleView → TopBar = **12px** (TopBar внутри имеет 24px) — табличный сценарий
- TopBar обязателен сверху любой таблицы

### Сценарий :: Холдинг
- `FilterCompanySelect` — слот в xLarge для выбора компании в холдинге
- HoldingAccount в Header — другой state vs SingleAccount

---

## VII. ОТКРЫТЫЕ TBD / ВОПРОСЫ

1. **TableView vs TitleView** — реальный компонент с компенсацией оптических отступов или опечатка в Plate?
2. **Lock-иконка** в TitleView Medium/Small — есть ли проп или отдельный компонент?
3. **Информационный IsleBlock padding** — отложено пользователем, нужно подтверждение
4. **Sidebar active state цвет** — demo показывает `#e7e8eb` (серый), Sidebar.md записан `#ef3124` (красный) — расхождение
5. **FormFooter / LinkedContent** — отложено, не разобрано
6. **TitleView высота 80** — артефакт demo, не правило (юзер: «не фиксируй»)
7. **Внутренние spacings BgPlate**: 12 (Guidelines) vs 20-24 (PageStructure для form-полей) — какое правило для какого типа контента?
8. **`[D](1600) TableBasic` префикс `(1600)`** — ultrawide breakpoint? Не подтверждено
9. **Style Level 2/3** у `[D] BackgroundPlate` — видели только Level 1
10. **`LogoGroup.companies`** — видели variant `4`, есть ли `2`/`3`/`5+`?

---

## VIII. ЧТО НЕ ПРОЙДЕНО В .fig

### Артборды (требуют прохода в новой сессии)

- **Small** — node `6848:72400`, 1560×2786 — 5-й уровень иерархии, blueprint правила Small Title
- **Примеры использования** — node `7172:57222`, 1560×3404 — типовые экраны полностью

⚠️ Эти артборды были проанализированы в предыдущей итерации (XXVI, XXVII), но **контент утрачен при overwrite**. Нужен повторный проход в новой сессии.

### Внешние библиотеки (для cross-reference)

- `Web__Corp Components` — production компоненты, файл `NrzEFUSTXgzOUmsfYym0xD`
- `Web__Core Wrappers` — wrappers (Accordion и др.), файл `xsWJdFDoAyA8VkbuMxP4yR`
- `ЭтоБаза :: Кнопки и группы кнопок` — `JzeK5OjfUevjNSP3bm7I19`
- `Сценарий :: Выбор компании` — `5n2GGKZdHa0Vv4BQVmC55W`

---

## IX. ПРАВИЛА БУДУЩЕГО ПОВЕДЕНИЯ (зафиксированы)

1. **При упоминании AlfaBank** → читать `AlfaBank/Design_system/_index.md` первым
2. **Inquiry только на пробелы docs**, результат — в docs, не в memory
3. **Найденная информация про компонент** → в его .md (создать если нет), без `[D]` префикса в имени
4. **`[D] Plate` = `Plate.md`** (D-префикс — platform marker, не тянем)
5. **`[D] Plate` и `[D] BackgroundPlate`** — два разных компонента
6. **Workflow Figma → DS → Код** — в Rules.md AlfaBank (полный)
7. **.fig в Google Drive** = точка контакта; путь в `## Источник Figma` секции каждого `.md`
8. **«Связанная база» в Figma** = родительский паттерн на который опирается текущий
9. **«SwapMe / DetachMe / 🔒 / 🛠️»** — Figma meta-команды для разработчика
10. **Не плодить файлы** — обогащать существующие; новый .md только если **новый компонент**

---

## X. ДАЛЬНЕЙШИЕ ШАГИ (если продолжать)

### Опция А: завершить .fig анализ
1. Пройти артборд **Small** (`6848:72400`, h=2786) — последний уровневый
2. Пройти артборд **Примеры использования** (`7172:57222`, h=3404) — типовые экраны

### Опция Б: разнесение накопленного в .md

1. **Обновить TitleView.md** — точные правила слотов, контексты Medium, правила status/buttons вне
2. **Создать Plate.md** — info-плашка (Warning/Info/Corporate), severity, структура
3. **Обновить IsleBlock.md** — compound structure (Header/Body/Footer + IsleHeader/IsleFooter + z-index)
4. **Создать Table.md** — `TableBasic` composite (TopBar + Table + StickyPagination)
5. **Создать Accordion.md** — wrapper для Medium контекста
6. **Обновить figma_code_map.md** — добавить 30+ новых строк
7. **Обновить Tokens.md** — все новые typography, цвета, ControlBlur, Caveat
8. **Обновить Header.md** — HoldingAccount state, IconButton presets, logo-corp иконки

### Опция В: новый паттерн из Figma
Workflow в `AlfaBank/Rules.md` → «Workflow: Figma → Design_system → Код».

---

## XI. ДОПОЛНИТЕЛЬНЫЕ ДЕТАЛИ (то что не попало в основные разделы)

### Из Passport артборда

**Оглавление паттерна — 8 разделов** (в этом порядке):
1. Виды и строение
2. TitleView :: Текст заголовка и подзаголовка
3. xLarge :: Основной заголовок
4. xLarge :: Рекомендации
5. Large :: Крупный заголовок
6. Medium :: Средний заголовок
7. Small :: Маленький заголовок
8. Примеры использования

**Статус паттерна:** «Можно использовать» (approved)
**Subtitle паттерна:** «Базовые правила применения компонента»

**История версий:**
- **v1.1** (20.11.2025, @dedanu): «Обновление примеров в паттерне; Дополнение описания размера Medium»
- **v1.0** (20.05.2024, @dusharts): «Создание паттерна»

### Из Виды и строение

**8 markers в xLarge blueprint с координатами:**

| # | Marker | y | x |
|---|---|---|---|
| 1 | Status | 13 | 0 |
| 2 | Title | 9 | 0 |
| 3 | FilterCompanySelect / Single-Select | 53 | 0 |
| 4 | Subtitle | 85 | 0 |
| 5 | Button (1-я группа) | 144 | 0 |
| 6 | Button (2-я группа) | 283 | 0 |
| 7 | Addon | -22 | 473 |
| 8 | Addon | -22 | 638 |

**Описания слотов по уровню применения:**
- Addon в **xLarge**: часто **кнопка/ссылка «О продукте»**
- Addon в **Medium/Small**: часто **StatusBadge**
- RightAddon: «тот же слот, **чаще для действий со смысловым блоком**»
- FilterCompanySelect: «Нужен при выборе компании определённо для этого продукта»

### Из xLarge1 (Основной заголовок)

**H1 subtitle:** «Единственный и неповторимый, главный заголовок страницы»

**5 секций структуры (H2/H3) с правилами:**
1. **Базовый пример** — Header → TitleView = 40px (TopMargin), TitleView → Content = 32px. Caption: «Content подразумевает любой контент на странице»
2. **H3 TabsView и FiltersBlock** — TitleView → TabsView = 32px
3. **H3 FiltersBlock** — TitleView → FiltersBlock = 32px
4. **H3 Plate** — TitleView → Plate = 32px
5. **H3 TopBar и Table** — TitleView → TopBar = 12px (TopBar имеет внутренний 24px). **Сверху любой таблицы всегда должен быть TopBar**.

### Из xLarge2 (Рекомендации)

**H2 секции в порядке:**
1. **Кнопки целевых действий**
   - H3 Одиночные кнопки (1 primary под Title, size 56)
   - H3 Группы кнопок (внутри TitleView, не вне)
   - H3 Кнопки и навигация (под TitleView, НЕ под табами)
   - H3 Цвет кнопок (3 bullet правила — **тексты утрачены, требуют повторного get_design_context на frame `7038:73837`**)
2. **Статус** (Contrast vs Muted)
3. **Ссылки** (Right Addon, чёрные, инфо-иконка, None/Pseudo подчёркивание)

### Из Large

**Composition rule:** «Отступы между блоками карточки **не должны быть крупнее** верхних и боковых отступов самой карточки» — общий принцип hierarchy spacing.

**Caption над H3 «В теле страницы»:** «Уникальная карточка в продукте»

### Из Medium

**H1 subtitle (2 строки):**
- «Основной контентный заголовок»
- «Используем только один заголовок в одном смысловом блоке»

**H2/H3 структура (полная):**
- H2 «Базовый пример» (Plate про статус/аккордеон отдельно)
- H2 «Заголовок и ссылка» + H3 для clear-кнопки (динамика по filled)
- H2 «Заголовок и аккордеон» (Plate с URL на Accordion компонент)
- H2 «Заголовок и кнопка с иконкой»:
  - H3 «Одно действие» (1× IconButton outline)
  - H3 «Два действия» (2× IconButton outline)
  - H3 «Много действий» (fallback подход для 3+)
  - Plate про TableView edge case (просмотровые формы)

**4 ToDo правила Medium:**
- 🔴 «Не показываем кнопку очистки, когда поля пустые»
- 🔴 «Не используем ссылки для двух и более действий»
- 🟢 «Используем подсказки для действий» (tooltip)
- 🔴 «Не используем два разных аддона для пары действий»

### Из Текст

**Subtitle H1:** «Компонент отображает основной заголовок на странице или внутри блока BackgroundPlate, в десктопе, адаптиве или отдельно стоящей версии MW. Текстовый блок собран на Typography.TitleResponsive»

**3 ToDo правила (severity 3 уровня):**
- 🟠 attention (избегай) — «Избегай длинных продуктовых заголовков»
- 🔴 negative (нельзя) — «Не скрываем продуктовый заголовок через эллипсис»
- 🟢 positive (правильно) — «Если редактируемый заголовок, скрываем его в эллипсис после первой строки»

**Внешние ссылки:**
- Confluence «синтаксис интерфейса»: `confluence.moscow.alfaintra.net/pages/viewpage.action?pageId=2051456994` (internal AB)

### Visual demo из screenshot xLarge2 «Группы кнопок» (🟢 правильный пример)

Полная композиция TitleView со всеми слотами:
- **statusLabel** = solid blue/cyan tag «НА ПОДПИСЬ» UPPERCASE (slot 1 «Status»)
- **Title** = «Заявление № 503» xLarge 48/52
- **titleStatusProps** = блок с вертикальной зелёной полоской + bold title «Требуется подпись уполномоченного лица» + описание
- **buttonsGroup** = 4 кнопки в ряд: 1 primary (Подписать, красная) + 3 secondary (Редактировать / Скачать / Удалить), все size 56

**Иерархия в demo:** statusLabel → Title → TitleStatus → buttonsGroup (сверху вниз)

**SingleAccount в Header (demo):** «ООО Город Нагатино» / «Набоков И.Д.» с **зелёной auto-color avatar** (буква «N» — initial company name, фон `--status/positive #0cc44d`)

**Sidebar active state в demo:** «Ваш продукт» highlighted — серый фон `#e7e8eb` + тёмная вертикальная полоска слева (потенциальное расхождение с Sidebar.md где записан `#ef3124` red — TBD проверить)

### Demo-данные (можно использовать в BasePage.tsx)

**Sidebar items (типовой список Альфа-Бизнес):**
- Все сервисы (top action)
- Платежи в работе
- Лента операций
- Счета на оплату
- Выписка
- Счета
- Карты
- Контрагенты
- Импорт реестров
- Госзакупки
- Справки
- Альфа-Выгодно
- (Footer) Настроить меню

**Action button:** «Новый платёж» (в Sidebar top)

**Company / User mockup:**
- Company: «ООО Город Нагатино», «АО Тайрелл Технологии», «Филиалы северо-запад»
- User: «Набоков И.Д.», «Ленин Владимир Ильич»

**Заявление demo:**
- Title: «Заявление № 503»
- Status: «НА ПОДПИСЬ»
- TitleStatus: «Требуется подпись уполномоченного лица»
- Buttons: Подписать / Редактировать / Скачать / Удалить
- Карточка «Общая информация»: Автор / Создано / Дата исполнения
- Wrong-example текст: «Очень длинный текст заголовка для маленьких экранов»

**Table demo headers:** Название компании · Дата · Номер счёта · Статус · Сумма
**BodyRow demo:** «АО Тайрелл Технологии» / «Сервис поддержки Нексус 6» / «28.12.2024» / «40802 810 0 0000 000 1234» / «Расчётный счёт» / «1 234 567,00 ₽»

### Дополнительные правила из Plates по уровням (consolidated)

| Уровень | Plate-правило |
|---|---|
| xLarge | «На странице **не может быть нескольких xLarge** заголовков» (🔴 negative) |
| xLarge | «Отступ TitleView → TopBar = **12px**, потому что в TopBar заложен верхний отступ **24px**. Сверху любой таблицы всегда должен быть TopBar» (🟠 attention) |
| Large | «Если вместе с заголовком нужен **статус или кнопки**, подставляем их отдельно, они не являются частью этого размера компонента TitleView» |
| Medium | «Если вместе с заголовком нужен **статус или аккордеон**, подставляем их отдельно, они не являются частью этого размера компонента TitleView» |
| Medium (clear) | «Когда в блоке формы все поля пустые, не показываем кнопку очистки. При заполнении хотя бы одного поля, появляется кнопка очистки. При клике все поля очищаются и кнопка очистки исчезает» |
| Medium (accordion) | «Собирается на основе **Accordion** (из Web - Core Wrappers), внутри которого вставляем TitleView» |
| Medium (TableView) | «При работе с просмотровыми формами оступы могут отличаться, из-за оптической компенсации отступов внутри компонента **TableView**» |
| Текст | «Если блок текста должен быть на стилях **Headline-System** или **Headline-System-Mobile**, используй компонент **TitleView** в своей сборке, даже если это заголовок без аддонов и дополнительных контролов» (🟠 attention) |
| Текст | «Подчеркивание ссылки: открывается отдельная страница → **Line: None**; открывается модалка → **Line: Pseudo**» |

### Семантика ToDoOrNotToDo (3 уровня severity)

| Цвет | CSS var | Семантика | Иконка |
|---|---|---|---|
| 🟢 positive | `--status/positive #0cc44d` | DO (правильно) | checkmark-compact |
| 🟠 attention | `--status/attention #fa9313` | избегай (мягкое предупреждение) | exclamation-compact |
| 🔴 negative | `--status/negative #ff4837` | НЕЛЬЗЯ (категорично) | cross-compact |

Каждый ToDo пара с соседним ImageWrapper (визуальный пример).

### Iconography hierarchy в Medium (action buttons)

| Кол-во действий | Подход |
|---|---|
| 1 интуитивное стандартное | 1× IconButton outline |
| 2 интуитивных стандартных | 2× IconButton outline |
| 3+ действий | другой подход (text buttons / picker) |
| 1+ неинтуитивное | другой подход (text buttons) |
| Очистить (clear, 1 action) | Link (ссылка-кнопка) |

### Дизайнерская терминология (Alfa)

- **«Связанная база»** = родительский паттерн на который опирается текущий
- **«Связанный компонент»** = production-имплементация в Web Corp Components
- **«Связанный паттерн»** = смежный паттерн в Guidelines
- **«Оптический отступ»** = визуально воспринимаемый размер (учитывает space внутри line-height)
- **«ЭтоБаза ::»** = базовый паттерн в иерархии Guidelines
- **«Паттерн ::»** = производный паттерн
- **«Сценарий ::»** = пользовательский сценарий

### Figma meta-инструкции для разработчика (как читать)

- **«SwapMe or DetachMe»** — placeholder для замены
- **«🛠️ Detach me and create local»** — компонент-шаблон для detach
- **«🛠️ Сконфигурируй компонент перед использованием согласно инструкции»** — нужна конфигурация перед use
- **«Всегда первый столбец» / «Всегда последний столбец»** — позиционные правила в Table
- **«Вспомогательный компонент Figma, в коде существует только X в core-components»** — Figma-only, не реализовывать напрямую
- **🔒** в начале имени — компонент залочен (не detach в Figma)
- **`:: 1024+`** в имени — компонент применяется только на desktop breakpoint ≥1024px

### Стрелки-указатели в blueprint

Используются с двойной семантикой:
- **Vector с подписью** = указатель на конкретный элемент схемы
- Шрифт подписи: **Caveat Bold 32px**, цвет `--decorative/indigo #897eff`
- Подпись может иметь несколько vector-стрелок (например, «Заголовки внутри блока» с двумя стрелками на разные TitleView)

---

## XII. ВНУТРЕННИЕ SPACINGS КОМПОНЕНТОВ (детально)

### Внутри BackgroundPlate (уже в нашем BackgroundPlate.md)

| Отступ | Значение |
|---|---|
| Title → Content (первый элемент) | 12 px |
| Element → Element (внутри блока) | 12 px (фиксированный) |
| Content → выносной элемент (кнопка / файл / карта) | 16 px |
| Title → следующий Title (в одном BgPlate) | 24 px |
| Вложенная секция → вложенная секция (2-й уровень) | 32 px |
| BgPlate padding (от края контейнера) | 24 px равномерно |

**Расхождение для form-полей (TBD):**
- PageStructure.md: TabsSecondary → Input/Select **20px**, Input → Input **24px**
- Guidelines: 12px между элементами
- Какое правило для какого типа контента — открытый вопрос

### Внутри IsleBlock (compound)

| Slot | Внутренние отступы |
|---|---|
| Padding sides (всего IsleBlock) | 24 px |
| TopPadding (верх) | 24 px |
| BottomPadding (низ) | 24 px |
| IsleHeader: DTopAddon → SpacingVertical → Title | (DTopAddon h=48) + SpacingVertical 20 + Title 22 |
| body → IsleContent | SpacingVertical 8 px перед |
| IsleContent → footer | SpacingVertical 12 px |
| footer → BottomPadding | SpacingVertical 8 px |
| z-index слои | BackgroundPlate(1) → BottomPadding(2) → body(3) → Top(4) → TopPadding(5) |

### Внутри TopBar (h=72)

- Padding: top 24 + content + bottom 16
- Counter: gap 12, h=32
- Button group: gap 8

### Внутри Cell (Table)

- HeadCell padding: `pt-32 pb-16 pl-12 pr-6`
- BodyCell padding: `pl-10 pr-12 py-24` (отличается от Head!)
- Row heights: Head=72/73, Body=93, StickyPagination=76

### CorporateContent padding (страничный)

- Top: 40 px
- Sides: 52 px
- Bottom: 64 px
- Между зонами TitleView → TabsView → Body: 32 px
- TabsView → Content (внутри Body): **24 px** (новое, зафиксировано после уточнения юзера)

---

## XIII. WORKFLOW: FIGMA → DESIGN_SYSTEM → КОД (саммари из Rules.md)

Полный текст в `AlfaBank/Rules.md`. Краткое summary 9 шагов:

### Pre-flight
- Проверить актуальное имя GDrive папки (`Сlaude` ⇄ `Claude`): `ls "$HOME/Library/CloudStorage/GoogleDrive-sweeptrip@gmail.com/My Drive/"`
- Если Figma MCP недоступен → работать через `open <.fig>` + текстовые описания

### Шаги
1. **Изучить** через `get_design_context`, `get_variable_defs`. Опц. `get_metadata`. `get_screenshot` — только по явному approve.
2. **Извлечь имя** компонента из Figma (`ЭтоБаза ::`, `Паттерн ::`, `Компонент ::`, `❌ LocalComponents ::`).
3. **Match check в `figma_code_map.md`** по имени + алиасам.
4. **Branch:**
   - **Match найден** → дополнить связанный `.md`. Не дублировать.
   - **Match не найден** → создать новый `[Component].md`. ОБЯЗАТЕЛЬНО:
     - Секция в `Components.md` (правило _index.md:10)
     - Строка в `figma_code_map.md` (AutoTest `md_figma_indexed`)
5. **Раздел `## Источник Figma`** в `.md`:
   ```
   ## Источник Figma
   `~/Library/CloudStorage/GoogleDrive-sweeptrip@gmail.com/My Drive/Claude/<Имя>.fig`
   ```
6. **Алиасы** в `figma_code_map.md`: короткое имя из .fig + Figma-имя из node + жаргон. Разделять `/`.
7. **Обновить `_index.md` Design_system → «Локальные .fig»**: ✅ если уже лежит, без ✅ если planned.
8. **AutoTests прогоняются автоматически** (PostToolUse). Должны пройти: md_command_indexed, md_index_freshness, md_figma_indexed, md_hierarchy, md_links_only, md_long_line, md_dup_lines.
9. **Отчёт юзеру**: какие `.md` изменены/созданы, что добавлено, TBD, путь к `.fig`.

### Edge cases (полностью в Rules.md)
- LocalComponents (`❌ Figma Only`) → только в figma_code_map со статусом ✗, без .md
- Кросс-компонентный паттерн (FormFooter = Button + Checkbox) → раздел в .md главного компонента; если >100 строк — отдельный .md
- Конфликт значений (.fig обновился) → .fig побеждает для дизайн-значений
- Имя .fig меняется → обновить алиасы в figma_code_map + список в _index.md
- Версия @alfalab меняется → alfalab_version_wrapper.sh hook сработает; пройти строки ~ и ✗ по changelog
- Granularity: new size/view → в существующий .md; новая variant с спецификой → подраздел; принципиально новый компонент → новый .md

---

## XIV. SETUP NOTES (для Figma MCP)

### One-time setup в Figma desktop app
1. Открыть Figma desktop (не web)
2. Меню Figma (верх-лево) → Preferences → **«Enable Dev Mode MCP Server»** — toggle on
3. Перезапустить Claude Code (нужно для подцепления MCP server)

**Требования:** Figma Professional / Organization / Enterprise plan (на Starter / Free toggle не появится). У юзера — Professional plan ✓.

### Permissions в settings.json
- `mcp__figma__get_screenshot` — в `permissions.ask` (требует approve каждый раз)
- `mcp__figma-mcp__get_screenshot` — то же

### Activation Figma desktop
- Чтобы MCP `get_metadata` / `get_design_context` без nodeId сработал — файл должен быть **активной tab** в Figma desktop
- Если ошибка «MCP server is only available if your active tab is a design file» → юзер нажимает на нужную вкладку
- Если ошибка «This resource couldn't be accessed» → проверить что .fig открыт + активен + Dev Mode toggle ON

### MCP-нюансы из практики этой сессии
- **Sparse mode**: на frame >50K chars `get_design_context` возвращает sparse metadata + сохраняет полный в файл (рекомендует sub-frames запросы)
- **ImageWrapper-frames** в Guidelines содержат **pre-rendered изображения**, не nested Figma frames. Поэтому design_context на их Col 1 возвращает пустые children — visual content только через `get_screenshot`
- **get_metadata без nodeId**: возвращает список pages, если ничего не выделено в Figma; иначе — XML текущего выделения
- **3 разных MCP namespace** были замечены за сессию: `mcp__figma__*`, `mcp__Figma__*`, `mcp__figma-mcp__*` — все с разным набором tools, периодически переподключаются

---

## XV. ТЕКУЩАЯ СТРУКТУРА figma_code_map.md (15 строк, сгруппированы по слоям)

### Layout / Структура (7 строк)
1. Sidebar / «Левая навигация» → `Sidebar.md` → `src/components/Sidebar.tsx`
2. Header (страничный) → `Header.md` → `src/components/Header.tsx`
3. Паттерн :: TitleView / Header-System / xLarge → `TitleView.md` → `src/components/TitleView.tsx` (xLarge)
4. TitleView :: Medium → `TitleView.md` (Medium) → `view='large'` (гипотеза, TBD)
5. TitleView :: Small → `TitleView.md` (Small) → `view='medium'` (гипотеза, TBD)
6. «Подложка» (TBD имя) → `BackgroundPlate.md` → `src/components/BackgroundPlate.tsx`
7. Паттерн :: Островки / «Островок» → `IsleBlock.md` → `@alfalab/core-components/steps` + custom div

### Form-элементы (4 строки)
8. Tabs (primary) → `TabsView.md` → `@alfalab/core-components/tabs`
9. TabsSecondary (теги) → `TabsSecondary.md` → `@alfalab/.../tabs/SecondaryTabListDesktop`
10. «Поле ввода» / Input → `Input.md` → `@alfalab/.../input/desktop → InputDesktop`
11. «Выпадающий список» / Select → `Select.md` → `@alfalab/.../select/desktop → SelectDesktop`

### Действия (2 строки)
12. Паттерн :: Кнопки... / Button → `Buttons.md` → `@alfalab/.../button/desktop → ButtonDesktop`
13. IconButton → `Buttons.md` → `@alfalab/.../icon-button/desktop → IconButtonDesktop`

### Паттерны (составные / отложенные) — 3 строки со статусом ✗
14. Паттерн :: ContentCardWrapper → TBD
15. Switch / TagGroup → Linked Content → TBD
16. Footer формы (Buttons & Controls) → TBD

### Кандидаты на добавление (из накопленного — пока НЕ в figma_code_map.md)

Существенный gap — мы накопили **30+ новых компонентов** при анализе .fig, но в figma_code_map.md они **ещё не разнесены**:
- Plate (info-плашка), Plate :: Corporate
- TableBasic + TopBar + HeadRow + BodyRow + StickyPagination
- FiltersBlock + DatePicker + GeneralFilterTag + FilterTag
- IsleBlock compound (IsleHeader, IsleFooter)
- Accordion (Core Wrappers)
- TitleStatus + TitleAddon/XL + RightAddon/XL + CompactTag
- StatusPreset, StatusBadge variants
- DTopAddon, IconView (24/128)
- Holding, LogoGroup, HoldingAccount
- AlfaBankSignBoxMWhite
- (и др.)

Все они **зафиксированы в этом handoff** (раздел III), но **не в figma_code_map.md**.

---

## XVI. ЧТО ТОЧНО ОСТАЛОСЬ ДЛЯ СЛЕДУЮЩЕЙ СЕССИИ

### Артборды в .fig
- **Small** (артборд `6848:72400`, h=2786) — был пройден, контент утрачен → **повторить**
- **Примеры использования** (артборд `7172:57222`, h=3404) — был пройден, контент утрачен → **повторить**

### Разнесение накопленного (mass updates)
Создать новые `.md`:
- `Plate.md` (info-плашка)
- `Accordion.md` (Core Wrappers wrapper)
- `Table.md` (TableBasic composite)
- `IsleHeader.md` / `IsleFooter.md` (compound parts)
- `FiltersBlock.md`

Расширить существующие:
- `TitleView.md` — все 4 уровня детально, slots-структура per view, контексты применения, ToDo правила, статус/buttons как отдельные
- `BackgroundPlate.md` — выбор spacing для form vs текст (12 vs 24)
- `IsleBlock.md` — compound с header/body/footer
- `Header.md` — IconButton presets, HoldingAccount state
- `Sidebar.md` — проверить active state цвет
- `Tokens.md` — все новые typography (13 view), цвета, ControlBlur effect, Caveat font для blueprint
- `Buttons.md` — Iconography hierarchy для action buttons
- `figma_code_map.md` — расширить с 15 до 50+ строк (все накопленные компоненты)

### TBD требующие уточнения у юзера
- TableView — реальный компонент или опечатка TitleView?
- Lock-иконка как проп в TitleView Medium / Small (не разрешено)
- Padding информационного IsleBlock (отложено пользователем)
- Sidebar active state расхождение
- FormFooter / LinkedContent (отложено)

---

## XVII. NODE IDs В .fig — точки входа для следующих сессий

Файл: `~/Library/CloudStorage/GoogleDrive-sweeptrip@gmail.com/My Drive/Claude/✅ Компонент __ TitleView.fig`

### Top-level pages

| Page | ID |
|---|---|
| Actual (пустая в demo) | `6027:111829` |
| ✅ АБ (10.08.2025) Базовое применение | `1:211` ← **основная**, все артборды тут |
| ✅ АБ (14.04.2025) Редактируемый заголовок | `6027:18232` |
| cover | `0:1` |

### Top-level frames внутри page «Базовое применение»

| Frame | ID | Размер |
|---|---|---|
| 📕 Passport | `7172:63088` | 1000×1586 |
| Виды и строение | `7172:51730` | 1778×2335 |
| Текст | `6703:56546` | 1560×4540 |
| xLarge :: Основной заголовок | `6725:349663` | 1560×4200 |
| xLarge :: Рекомендации | `7038:73837` | 1560×9152 |
| Large :: Крупный заголовок | `6741:48514` | 1560×1818 |
| Medium :: Средний заголовок | `6765:67814` | 1560×11462 |
| Small :: Маленький заголовок | `6848:72400` | **1560×2786** ← повторить |
| Примеры использования | `7172:57222` | **1560×3404** ← повторить |

### Ключевые sub-frames (быстрый доступ)

| ID | Что | Где |
|---|---|---|
| `6725:349675` | TitleView 232 (full slots) | xLarge 1 IW1 |
| `7038:73843` | IW «Группы кнопок» 🟢 (есть screenshot) | xLarge 2 |
| `6725:349664` | H1 «xLarge :: Основной заголовок» + subtitle | xLarge 1 |
| `7038:73838` | H1 «xLarge :: Рекомендации» | xLarge 2 |
| `6741:48515` | H1 «Large :: Крупный заголовок» | Large |
| `6765:67815` | H1 «Medium :: Средний заголовок» | Medium |
| `7038:73858` | Connection «Кнопки и группы кнопок» (📕 Connection) | xLarge 2 |
| `6741:56787` | Connection «Широкая сетка» | xLarge 1 |

### Связанные паттерны (для cross-reference)

- `Web__Corp Components`: `NrzEFUSTXgzOUmsfYym0xD` (TitleView prod: node `35325-33191`)
- `Web__Core Wrappers`: `xsWJdFDoAyA8VkbuMxP4yR` (Accordion: node `2480-657`)
- `ЭтоБаза :: Широкая сетка`: `NrzEFUSTXgzOUmsfYym0xD/node-id=57470-17492`
- `ЭтоБаза :: Кнопки и группы кнопок`: `JzeK5OjfUevjNSP3bm7I19`
- `Сценарий :: Выбор компании (Холдинг)`: `5n2GGKZdHa0Vv4BQVmC55W/node-id=1-210`

---

## XVIII. КОДОВАЯ БАЗА ALFABANK (текущее состояние)

### Существующие компоненты в `AlfaBank/src/`

```
src/components/
├── BackgroundPlate.tsx      ← 5 view вариантов (Primary/Secondary/Colored/Dropzone/Border)
├── Header.tsx               ← Default + showBack вариант
├── Sidebar.tsx              ← 248px фикс, vh
└── TitleView.tsx            ← view: medium/large/xLarge (3 уровня, Small отсутствует)

src/screens/
└── BasePage.tsx             ← шаблон страницы, использует:
                                  Steps, InputDesktop, SelectDesktop, TitleView,
                                  BackgroundPlate, Tabs, TabsSecondary,
                                  ButtonDesktop, StatusBadge, Link, DiamondsSIcon

src/utils/
└── useBreakpoint.ts         ← mobile/tablet/desktop через @alfalab/core-components/mq
```

### Маршруты приложения
- `/` → App.tsx → Index (список экранов)
- `/base` → BasePage.tsx

### Dev-сервер
```bash
cd /Users/vadimpianof/Desktop/Claude/AlfaBank && npm run dev
```
- URL: **http://localhost:5173/base** (Vite default; 5174 если 5173 занят)
- Запускается через **PageLayout** обёртку (Sidebar + Header + main)
- Hot reload на изменения src/

### @alfalab/core-components версия
**50.12.0** (в `figma_code_map.md` overview). Hook `alfalab_version_wrapper.sh` (Tools/Hooks) проверяет соответствие при `npm install` и обновляет `figma_code_map.md` при смене.

---

## XIX. РАСПРЕДЕЛЕНИЕ ЗНАНИЙ ПО ИСТОЧНИКАМ

Куда какое знание относится:

| Тип знания | Источник истины |
|---|---|
| **Универсальные правила Claude** | `~/CLAUDE.md` |
| **Project-level правила AlfaBank** | `AlfaBank/Rules.md` |
| **DS overview + источники** | `AlfaBank/Design_system/_index.md` |
| **Layout/zones/padding страницы** | `AlfaBank/Design_system/PageStructure.md` |
| **Design tokens (colors, gaps, radius, typography)** | `AlfaBank/Design_system/Tokens.md` |
| **Каталог компонентов** | `AlfaBank/Design_system/Components.md` |
| **Per-component правила** | `AlfaBank/Design_system/[Component].md` |
| **Маппинг Figma ↔ DS ↔ npm** | `AlfaBank/figma_code_map.md` |
| **Source-of-truth Figma .fig** | `~/Library/CloudStorage/.../My Drive/Claude/*.fig` |
| **Memory pointers + feedback** | `~/.claude/projects/.../memory/*.md` |
| **Реализация в коде** | `AlfaBank/src/components/*.tsx`, `src/screens/*.tsx` |
| **Текущий handoff (transient)** | `/tmp/titleview_handoff_2026-05-16.md` ← этот файл |

**Правило поиска:** при работе с компонентом AlfaBank → начинать с `AlfaBank/Design_system/[Component].md`. При неуверенности — `figma_code_map.md`. При полном отсутствии — открыть .fig из GDrive.

---

## XX. ЧТО НЕ В HANDOFF (намеренно, для прозрачности)

Эти темы были в сессии, но не вошли — потому что либо tangential, либо уже зафиксированы в проектных файлах:

- **Концептуальные дискуссии про обучение** (6 сдвигов модели «от accumulation к compression», differential vs socratic inquiry) → методологический фон, не actionable для следующей сессии
- **Knowledge nodes vs flat memory** → принципы зафиксированы в `feedback_project_docs_first.md` (memory_pointer есть)
- **Tools/ инфраструктура** (ConfirmDialog, Notifier, AutoTests, TrustGate) → есть свои _index.md и Rules.md
- **Memory hygiene infrastructure** (memory_touch.sh, monthly review) → в Tools/Hooks
- **6 шагов плана разнесения накопленного в .md** → в разделе XVI этого файла
- **Workflow setup MCP (`/sb`, sock authentication)** → не требовалось для текущего проекта

---

## XXI. ХОЛДИНГ-РЕЖИМ (consolidated)

Информация про холдинг-сценарий разбросана — собрана здесь:

| Где | Что |
|---|---|
| **xLarge TitleView slot 3** | `FilterCompanySelect / Single-Select` — выбор компании в холдинге |
| **Описание slot 3** | «Нужен при выборе компании определённо для этого продукта» |
| **Header** | `HoldingAccount` state (vs `SingleAccount`) — другой state |
| **`LogoGroup`** (внутри HoldingAccount) | 4 цветных tile (16×16) представляющих 4 разные компании в холдинге |
| **Имя в Figma** | `Сценарий :: Выбор компании (Холдинг)` |
| **Файл паттерна** | `5n2GGKZdHa0Vv4BQVmC55W/node-id=1-210` |
| **Variant `LogoGroup.companies`** | видели только `4`, есть ли другие — TBD |

Каждая компания в холдинге получает свой цвет в LogoGroup tile (логика auto-color).

**Где зафиксировать в .md (будущее):**
- `Header.md` — раздел про `HoldingAccount` state
- `TitleView.md` — slot 3 `FilterCompanySelect` для xLarge
- Возможно `Holding.md` отдельно если разрастётся

**Demo-данные:**
- HoldingAccount: «Филиалы северо-запад» + LogoGroup 4 tiles
- SingleAccount: «ООО Город Нагатино» / «Набоков И.Д.» + green auto-avatar (буква «N»)

---

## XXII. REVERSE WORKFLOW: КОД → FIGMA

Применяется когда `.md` уже актуален, а `.fig` отстал и нужно сказать дизайнеру обновить Figma. Полный текст в `AlfaBank/Rules.md`.

### Шаги
1. **Сформулировать diff:** что есть в `.md`, чего нет / устарело в `.fig`
2. **Уведомить юзера:** путь к `.fig`, что обновить, какие значения / variants
3. **Юзер обновляет Figma** → экспортирует `.fig` обратно в Google Drive
4. **Перепроверить** (опц.): через `get_design_context` после обновления

### Концепция two-way sync

- **`.fig`** = источник истины для **дизайна** (значения, варианты, визуал)
- **`.md`** = источник истины для **правил применения в коде** (когда что использовать, gotchas, импорты)

Дизайн меняется → `.fig` (юзер) → `.md` (Claude через Figma → Код workflow)
Код меняется → `.md` (Claude/юзер) → `.fig` (юзер вручную через Код → Figma)

---

## XXIII. PROPERTY VARIANTS QUICK REFERENCE (для будущей разноски в .md)

> ⚠️ Эта таблица — **snapshot гипотез** из анализа .fig, не finite source. При разноске в figma_code_map.md / per-component .md — валидировать каждое значение через свежий `get_design_context` на узле компонента в `Web__Corp Components` (`NrzEFUSTXgzOUmsfYym0xD`).

### Кнопки и контролы

| Компонент | Свойство | Значения |
|---|---|---|
| `DCorporateButton` | `size` | `32` / `72` |
| `DCorporateButton` | `view` | `Accent` / `Secondary` / `Primary` |
| `DCorporateButton` | `shape` | `Rectangular` (нашли только этот) |
| `CorporateIconButton` | `size` | `24` / `56` |

### Статусы

| Компонент | Свойство | Значения |
|---|---|---|
| `StatusBadge` | `size` | `16` / `20` / `24` / `40` |
| `StatusBadge` | `view` | `PositiveCheckmark` / `NeutralInformation` / `NegativeCross` |
| `DStatusPreset` | `size` | `20` / `24` |
| `DStatusPreset` | `style` | `Contrast` / `Muted` |
| `DStatusPreset` | `type` | `Approved` (нашли только этот) |

### TitleView и связанные

| Компонент | Свойство | Значения |
|---|---|---|
| `DTitleView` (Figma) | `view` | `xLarge` / `Large` / `Medium` / `Small` |
| `TitleView.tsx` (наш код) | `view` | `medium` / `large` / `xLarge` (Small отсутствует) |
| `Title` (typography) | `view` | `xsmall` / `small` / `medium` / `large` / `xlarge` |
| `Text` (typography) | `view` | `primary-medium` / `primary-small` / `primary-large` / `secondary-medium` / `component` / `caps` |
| `Text` | `weight` | `regular` (default) / `medium` / `bold` |
| `DFilterCompanySelectSingle` | `view` | `Select` / `Compact` |

### Tabs

| Компонент | Свойство | Значения |
|---|---|---|
| `DCorporateFilterTag` | `size` | `40` / `48` |
| `TagsPrimary` font weight | — | Medium (always) |
| `[D][Corporate] Tag` (TabsSecondary) | active/inactive | dark `#212124` / translucent |

### Icons / shapes

| Компонент | Свойство | Значения |
|---|---|---|
| `IconView` | `size` | `24` / `128` |
| `Sliders` | `size` | `s` / `m` |
| `ChevronDown` | `size` | `s` / `m` |
| `ChevronRight/Left` | `size` | `m` |
| `Diamonds` | `size` | `s` / `m` |
| `Shape` | `form` | `Superellipse` |
| `Template` | `size` | `m` / `xxl` |

### Layout

| Компонент | Свойство | Значения |
|---|---|---|
| `SpacingVertical` (Figma utility) | `size` | `1` / `8` / `12` / `16` / `20` / `24` / `32` |
| `SpacingHorizontal` | `size` | `1` / `4` / `6` |
| `BackgroundPlate.tsx` | `view` | `Primary` / `Secondary` / `Colored` / `Dropzone` / `Border` |
| `[D] BackgroundPlate` (Figma) | `[D] Style Level` | `1` (Level 2/3 — TBD проверить) |
| `Pagination` | `Page` state | active (dark bg) / inactive |

### Other

| Компонент | Свойство | Значения |
|---|---|---|
| `Text` (📕 Text blueprint) | `presets` | `H1` / `H2` / `H3` / `Paragraph` / `Caption` |
| `Sorting` (Table) | `presets` | `Not selected` / `ListAsc` / `ListDesc` / `ListDefault` |
| `Checkbox` | states | default / disabledState / indeterminateState / selectedState |
| `IconButton` (Header) | `presets` | `Menu` / `Search` / `Mail` / `Notifications` / `Exit` |
| `Plate` (info-box) | severity | warning 🟠 / info 🔵 / negative 🔴 |
| `[D][Corporate] Plate` | (h=80 с border) | один variant |
| `DTopBar` | flags | `count` / `extraButton` / `filtered` / `selectAll` / `settings` / `skeleton` |
| `DBodyCellBasic` | `presets` | `Text` / `Status` |
| `DStickyPagination` | `scrollbar` | true / false |
| `LogoGroup` | `companies` | `4` (только видели; вероятно есть `2`/`3`/`5+`) |
| `Counter` | `totalNum` | string number |

### Skeleton state

Многие компоненты имеют **skeleton-вариант** для loading state:
- `BackgroundPlate.tsx` — проп `showSkeleton?: boolean`
- `TitleView.tsx` — проп `showSkeleton?: boolean`
- `DBodyCellBasic` / `DBodyRowBasic` / `DBodyControlCellBasic` — skeleton props
- `DStickyPagination` — skeleton
- `DTopBar` — skeleton
- `SkeletonText` (utility) — length `Fill`, textStyle `14_20` / `16_24`

**Правило системы:** все компоненты на data-driven контенте имеют skeleton state.

---

## XXIV. ОТКРЫТЫЕ ВОПРОСЫ КОТОРЫЕ Я НЕ ЗАДАЛ ЮЗЕРУ

При повторной проверке нашёл TBD которые ни разу не уточнял:

1. **`[D](1600) TableBasic` префикс `(1600)`** — что значит 1600? Скорее всего ultrawide breakpoint (>1440), но не подтверждено.
2. **`Style Level 2 / Level 3`** у `[D] BackgroundPlate` — видели только Level 1. Существуют ли другие, в чём отличия?
3. **`LogoGroup.companies`** — видели variant `"4"`, есть ли `"2"`/`"3"`/`"5+"` для разного числа компаний в холдинге?
4. **`DCorporateFilterTag.size = 48`** — видели в variants, но в IW visualization только 40. В каком контексте используется 48?
5. **`StatusBadge.size = 40`** — большой размер, видели только 16/20/24. Где 40?
6. **`StatusBadge.view: NegativeCross`** — есть как variant, но не видели в demo. Когда применяется?
7. **`Sorting.active`** boolean — видели prop, не видели в визуальной demo как выглядит active sort.
8. **`Checkbox` states (disabled/indeterminate)** — только default+selected видели на screenshot.
9. **`📕 ToDoOrNotToDo` сам прop** — есть variants, но мы видели только текст. Есть ли additional state?

Это **возможные follow-up вопросы** к юзеру / дизайнеру при необходимости.

---

## XXV. ИЗВЕСТНЫЕ ДЫРЫ HANDOFF (для прозрачности)

**Точечные:**
- **H3 «Цвет кнопок» из xLarge 2 (3 bullet правила)** — упомянут факт существования (раздел XI), сами тексты не зафиксированы. Frame `7038:73837` → запросить `get_design_context` на sub-frame с H3 «Цвет кнопок» в новой сессии.
- ~~**Цветовые токены текста TitleView**~~ — **ЗАКРЫТО 2026-05-17**: запросили `get_variable_defs` на `35325:33191` (Web__Corp Components TitleView prod). Все 4 уровня используют `text/primary` `#030306e0` (88% alpha) для Title и `text/secondary` `#0404138c` (55% alpha) для Subtitle. Подробности — раздел IV.

**Системные:**
- **Раздел XXIII (property variants)** собран по памяти после анализа .fig, **не по систематическому проходу каждого variant узла**. При разноске в figma_code_map.md / per-component .md — валидировать каждое значение свежим `get_design_context` на компонент в `Web__Corp Components` library (`NrzEFUSTXgzOUmsfYym0xD`).
- **Раздел III (новые компоненты)** аналогично — имена и существование зафиксированы, но точные variants/sizes/props **требуют повторной проверки** на узле компонента в Corp Components.

**Не пройдено в .fig** (повтор раздела VIII):
- Артборд **Small** (`6848:72400`, 1560×2786) — 5-й уровень иерархии
- Артборд **Примеры использования** (`7172:57222`, 1560×3404) — типовые экраны полностью

---

## XXVI. УТРАЧЕННЫЕ СЕКЦИИ (для прозрачности reconstruct)

Эти секции существовали до overwrite 2026-05-17, контент **не восстановлен**:

### XXVI. Обновление 2026-05-16: проход артборда Small (XXVI.1-XXVI.10)
**Что было:** Полный текст артборда Small — H1/H2/H3 секции, правила Small Title, контексты применения, ToDo правила. Артборд node `6848:72400`, размер 1560×2786.

**Как восстановить:** В новой сессии:
1. Открыть `.fig` в Figma desktop
2. `mcp__figma__get_design_context` на `6848:72400`
3. По необходимости — `get_screenshot` на ключевые frames
4. Зафиксировать в этом разделе или в `TitleView.md` напрямую

### XXVII. Обновление 2026-05-16: проход артборда Примеры использования (XXVII.1-XXVII.10g)
**Что было:** Типовые экраны применения TitleView со всеми уровнями вместе. Артборд node `7172:57222`, размер 1560×3404. Подразделы XXVII.1-10g — вероятно 10 группировок по сценариям использования.

**Как восстановить:** В новой сессии:
1. Открыть `.fig` в Figma desktop
2. `mcp__figma__get_design_context` на `7172:57222`
3. По необходимости — `get_screenshot` на ключевые композиции
4. Зафиксировать в `TitleView.md` как раздел «Примеры применения»

---

**FILE LOCATION:** `/tmp/titleview_handoff_2026-05-16.md`
**NOTE:** /tmp очищается при перезагрузке системы. Если нужно permanent — скопируй:
```bash
cp /tmp/titleview_handoff_2026-05-16.md ~/Desktop/Claude/AlfaBank/_session_handoff_titleview_2026-05-16.md
```

**КАК ИСПОЛЬЗОВАТЬ В НОВОЙ СЕССИИ:**

Первое сообщение в новой сессии:
```
Прочитай /tmp/titleview_handoff_2026-05-16.md и продолжаем по AlfaBank.
```
Или (если скопировал в permanent):
```
Прочитай ~/Desktop/Claude/AlfaBank/_session_handoff_titleview_2026-05-16.md и продолжаем.
```
