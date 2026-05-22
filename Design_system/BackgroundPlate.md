---
id: cmp-bgplate-001
name: BackgroundPlate
---

<!-- stitch:props v1 -->
- id: p_position
  name: position
  type: enum
  values: ["Level 1", "Level 2"]
  default: "Level 1"
- id: p_type
  name: type
  type: enum
  values: [Primary, Secondary, Colored, Border]
  default: Primary
<!-- /stitch:props v1 -->

<!-- stitch:slots v1 -->
- id: s_children
  name: children
<!-- /stitch:slots v1 -->

# BackgroundPlate.md — AlfaBank

## Overview

Фон-карточка для группировки контента в зоне Body — Left. В Figma Corp Components — компонент `[D] BackgroundPlate` (desktop) и `[M] BackgroundPlate` (mobile) с тремя property: `Position` (Level 1/2), `BackgroundColor`/`PageColor`, `Type` (Primary/Secondary/Colored/Border). Прод-реализация живёт в закрытой библиотеке `arui-private`.

## Источник Figma

`~/Library/CloudStorage/GoogleDrive-sweeptrip@gmail.com/My Drive/Claude/Web __ Corp Components.fig`
Страница: `BackgroundPlate` (node `11057:102322`) в файле `xmQbbWGUauDCW9x0tUF961`.

## Идентификация

| Поле | Значение |
|---|---|
| Имя в Figma | `[D] BackgroundPlate` (desktop) · `[M] BackgroundPlate` (mobile) |
| Подкомпоненты-стили | `[D] Style Level 1`, `[D] Style Level 2`, `[M] Style Level 1` |
| Родительский паттерн | `🚧 Компонент :: BackgroundPlate` (status «в разработке») — файл `AkUjEqep5bg3EK6ESpbLwk`, node `1:211` |
| Платформы | АБ · ~~АБМ~~ (faded) · MobileWeb · Адаптив |
| Прод-библиотека | `arui-private` (закрытая корпоративная) |
| Жаргон / алиасы | «Подложка», `BackgroundPlate`, `BgPlate` |

## Position (Property #1 — уровень вложенности)

| Уровень | Default background | Corner radius | Семантика |
|---|---|---|---|
| Level 1 (outer) | `base-bg-alt/secondary` = `#FFFFFF` | **16px** | Внешний слой — основные смысловые блоки страницы |
| Level 2 (inner) | `base-bg-alt/tertiary` = `#F2F3F5` | **12px** | Внутренний — только поверх Level 1 |

🟠 «Могут быть исключения только в самостоятельных компонентах».

## BackgroundColor / PageColor (Property #2)

Имя property отличается между уровнями.

**Level 1 — `BackgroundColor` (лейбл по цвету Page):**

| Option | Page | Bg плашки |
|---|---|---|
| `base-bg-alt (gray)` | серая `#f2f2f2` | `#FFFFFF` |
| `base-bg (white)` | белая | `#F2F3F5` |

**Level 2 — `PageColor` (лейбл по цвету самой плашки):**

| Option | Page | Bg плашки |
|---|---|---|
| `Grey` | белая | `#F2F3F5` |
| `White` | серая | `#FFFFFF` |

Логика: чередование white↔grey при вложенности.
🟠 «Значение определяем один раз для всех подложек на странице. Какой фон у основной страницы — такой вариант и должен быть у всех».

## Type (Property #3 — визуальный стиль)

**Level 1 — 4 значения:**

| Type | Background | Border |
|---|---|---|
| `Primary` | `#FFFFFF` (`base-bg-alt/secondary`) | — |
| `Secondary` | `#263758` 6% translucent (`neutral-translucent/100`) | — |
| `Colored` | `#E4F0FF` (`status-muted/info`) | `#263758` 6%, 1px |
| `Border` | transparent | `#0F1937` 10% (`neutral-translucent/300`), 1px |

**Level 2 — 3 значения (нет `Secondary`):**

| Type | Background | Border |
|---|---|---|
| `Primary` | `#F2F3F5` (`base-bg-alt/tertiary`) | — |
| `Colored` | `#E4F0FF` | — |
| `Border` | transparent | `#0F1937` 10%, 1px |

🟠 «Для Level 2 не существует стиля Secondary».

## Mobile вариант — [M] BackgroundPlate

| Свойство | Значение |
|---|---|
| `[M] Style Level 1` | bg `base-bg-alt/secondary` (white) + radius **24px** |
| Padding mobile (`Paddings/mobile`) | 20 |
| Mobile spec Properties | отсутствует в Figma — есть только sample-instances |

## Кликабельность

3 state-демо для Primary / Secondary / Colored:

| State | Эффект |
|---|---|
| Default | нет тени |
| Hover (intermediate) | без выраженных изменений в demo |
| Active / clicked | `shadow/S Action/Default` — 3-layer drop shadow `#0000000A` на (0,0,1) + (0,4,8) + (0,12,16) |

Правила:
- 🟠 «Кликабельность активируется только в коде компонента»
- 🔵 «Border используется как декоративный элемент и не может быть кликабельным»

## Адаптивность Desktop → Mobile

Пример «Блок формы»:

| Desktop (1440) | Mobile (375) |
|---|---|
| outer Level 1 720×330 + TitleView + Input + 2× UniversalDateInput + inner Level 2 656×64 (custom slot) | одна `[M] BackgroundPlate` 335×346 с теми же полями, без outer wrapper |

Правила перехода:
- 🟠 «В адаптиве внутренние отступы в 32px в подобных конструкциях необходимо убирать вручную»
- 🟠 «В адаптиве необходимо вручную изменить в `BackgroudPlate` значение `Level 2` на `Level 1` в адаптиве (если не предполагается наличие Level 1)»

## Связанные токены

```
[D] CornerRadius        = 12       (Level 2)
[M] CornerRadius        = 24       (mobile)
Outer R                 = 32       (страничный border-radius)
BackgroundColor (var)   = #f2f3f5  (страничный default)

base-bg/primary         = #FFFFFF
base-bg/secondary       = #F2F3F5
base-bg/tertiary        = #FFFFFF
base-bg-alt/primary     = #F2F3F5
base-bg-alt/secondary   = #FFFFFF
base-bg-alt/tertiary    = #F2F3F5

neutral-translucent/100 = #2637580F   (Secondary fill Level 1)
neutral-translucent/300 = #0F19371A   (Border outline)
status-muted/info       = #E4F0FF     (Colored fill)

ControlBlur             = backdrop-blur radius 80
shadow/S Action/Default = 3-layer drop shadow (#0000000A на радиусах 1/8/16)
modal-bg-alt/secondary  = #FFFFFF
modal-bg/secondary      = #F2F3F5
Corporate               = #E1EAF6
```

## Отступы внутри

| Отступ | px |
|---|---|
| Title → contentTable.Row | 8 |
| Title → Input/Select/TagGroup | 20 |
| Input/Select → TagGroup | 20 |
| Input/Select → Forms :: Row/Input | 24 |
| Input/Select → следующий Title (внутри BgPlate)/Button | 32 |
| Следующий Title (внутри BgPlate) → Input/Select/TagGroup | 20 |
| TagGroup → Input | 20 |
| BgPlate padding (от собственного external края до контента) | 32 |

«Title (внутри BgPlate)» здесь = `TitleView` block-уровня (`view='small'` = DS Medium 22/26 или `view='xsmall'` = DS Small 18/22). Пропы и DevPanel-spec — в `TitleView.md` → секция «BgPlate-контекст».

## Rows внутри BgPlate (горизонтальная группировка form-инпутов)

Контент BgPlate — это **список rows** (`BgRow[]`), а не плоский список items. Row — горизонтальная группа из 1 или более form-инпутов.

**Что может быть в horizontal row** (groupable, set `GROUPABLE_KINDS`):
- `Input` (`InputDesktop`)
- `Select` (`SelectDesktop`)
- `UniversalDateInput` (`UniversalDateInputDesktop`)

**Что НЕ может стоять рядом в row** (`title`, `tabs`):
- `TitleView` (block-level)
- `TagGroup`

Эти всегда живут в собственной single-item row на всю ширину. Mixed row (например, `TagGroup + Input`) запрещены архитектурно: и в DnD (side `left`/`right` блокируется, остаются только `top`/`bottom`), и в safety-check `applyMove` (если каким-то путём пришёл invalid action — отклоняется).

- **Ширины в row:** каждый item имеет `flex: 1` → ширины равны (N items → каждый занимает `1/N` от ширины row минус gap'ы)
- **Gap между items в row:** **24px** (горизонтальный)
- **Gap между rows:** **24px** (вертикальный — переопределяет старые правила «20px после Tabs» в случае rows. Title→row и Title→следующий row — оставить 20/32 как в таблице выше; пока не реализовано на уровне DnD-компонента, фиксированы 24px row-to-row)

**DnD-перетаскивание** (реализация в `src/components/BgPlateRowsDnd.tsx`):

- Тащишь item за тело DevPanelWrapper → over другой item
- Курсор в верхней четверти target → drop сверху (новая row над target row)
- Курсор в нижней четверти target → drop снизу (новая row под target row)
- Курсор в центральной зоне, левее центра → встать слева от target в его row *(только если оба groupable)*
- Курсор правее центра → встать справа от target в его row *(только если оба groupable)*

Если src или target — `title`/`tabs`, либо в target row уже есть `title`/`tabs`, то left/right drop невозможен и компонент автоматически фолбэчит на top/bottom (по знаку `dy`). `canGroup` callback DnD-компонента инкапсулирует это правило.

**Визуальный признак при drag-over** — полупрозрачная плашка с пунктирным border (`#7dd3fc` accent) той ширины и высоты, в которую упадёт src-item:
- left/right → плашка занимает 50% по ширине, прижата к нужной стороне target item
- top/bottom → горизонтальная полоса 8px над/под item с solid-границей

## Контекст применения

- Используется только в зоне Body → Left (см. `PageStructure.md`)
- Отступ между BgPlate карточками в Left: 24px
- В Right запрещено — там IsleBlock

## Связь с другими компонентами

- `[D] Plate` (без префикса `Background`) — info-плашка warning/info/negative (в Figma это другой компонент, не путать)
- `[D][Corporate] Plate` h=80 — info-плашка с border + Title 18/22 + Caption 14/20
- `Паттерн :: ContentCardWrapper` — упоминается в Guidelines как «обёртка контента внутри BgPlate», на странице BackgroundPlate не описан

## API реализации

Реализация: `src/components/BackgroundPlate.tsx` → экспорты `BackgroundPlate`, `BackgroundPlateView`

```tsx
import { BackgroundPlate, BackgroundPlateView } from '../components/BackgroundPlate';

<BackgroundPlate view={BackgroundPlateView.Primary} showSkeleton={false} enableHover={true}>
  {/* контент */}
</BackgroundPlate>
```

Пропы:
- `view: BackgroundPlateView` — Primary · Secondary · Colored · Dropzone · Border
- `showSkeleton?: boolean` — заменяет весь плейт на `<div>` цвета `neutral-translucent/100` (`#2637580F` = `#263758` + alpha 6%) с `border-radius: 16`. Соответствует loading-стейту из Figma «Сценарии» (file `pczuwshD4kyGcqq089R4WO`, node `12015:78234` — `SkeletonBody`). Спецификация:
  - **Никакой белой подложки и отступов.** В режиме loading плейта-как-карточки нет — есть только серый прямоугольник цвета `neutral-translucent/100` поверх фона страницы (`#F2F3F5`), визуальный результат ≈ `#E6E8EC`.
  - Background через CSS-переменную `var(--color-light-neutral-translucent-100)`; не использовать `Skeleton` из core-components (он рассчитан на наложение на белый фон + анимацию).
  - Размер скелетона сохраняется по children (визуально скрытые через `visibility: hidden`, но держат высоту/ширину) — высота не меняется относительно реального content.
  - В Figma вкладка Selection colors показывает hex без alpha-канала (`#263758`) — но реальный CSS-цвет включает alpha `0F` (6%): `#2637580F`.
- `enableHover?: boolean` — анимация подъёма при наведении (отключена для Border)

## Пропсы в DevPanel

| Проп | Метка | Контрол | Значения |
|------|-------|---------|----------|
| view | Вид | cycle | Primary → Secondary → Colored → Dropzone → Border |
| showSkeleton | Скелетон | toggle | — |
| enableHover | Hover-анимация | toggle | — |

### Do
- Использовать только в зоне Body — Left
- Передавать view явно через BackgroundPlateView enum
- Использовать showSkeleton при загрузке данных карточки

### Don't
- Don't создавать собственный контейнер вместо BackgroundPlate для карточек в Left
- Don't включать enableHover для view="Border"

## TBD

1. **Translucent vs solid** — `Secondary` Level 1 = `#263758 6%` (полупрозрачный). Поверх какого фона использовать — над сплошным или над transparent?
2. **Когда Type=Colored применяется** — `#E4F0FF` (`status-muted/info`) — это info-семантика. Только для информационных блоков?
3. **Mobile Properties** — отсутствует в spec. Имеет ли `[M] BackgroundPlate` те же Position/PageColor/Type или упрощённый набор?
4. **Hover state** — Default → Active в demo есть, промежуточное Hover визуально не отличается. Существует ли Hover отдельно?
5. **`📕 Passport`** — на этой странице отсутствует (есть только `PatternTitle` в шапке через PatternTitle template). Статус компонента в Figma — «Можно использовать» (из соседней CorporatePage `PatternTitle`)

<!-- Phase 14 drift test trigger -->

