# IsleBlock.md — AlfaBank
## Overview
Контейнер контента в Right-колонке страницы. Generic роль с двумя возможными видами: навигационный (Steps wrapper) и информационный. Правила порядка и количества — в `PageStructure.md` → Right.

## Виды

### Навигационный
Реализация — Steps wrapper (детали ниже). Используется для навигации внутри экрана (пошаговый процесс или фиксированные шаги).
Если в Right присутствует навигационный IsleBlock — он всегда первый в стеке. Максимум один.

### Информационный
Карточка-обёртка с тем же стилем что у навигационного (`borderRadius 16`, `bg primary`), но без Steps внутри — произвольный контент.

Типы контента (Alfa Guidelines):
- инфо-блок (пояснение или дополнительная информация)
- реклама
- саммари формы (итог введённых данных)

Заголовок секции — `TitleView` Small (опционально, общее правило для любого IsleBlock).

Padding обёртки — **TBD** (уточняется отдельно от навигационного варианта).

**Правило размещения (Alfa Guidelines):** правый блок менее заметен — НЕ размещать в IsleBlock важный контент.

## IsleBlock (навигационный — Steps wrapper)

## Компонент

`Steps` из `@alfalab/core-components/steps`. Субпакета `/desktop` нет — один компонент для всех платформ.

## Импорт

```tsx
import { Steps } from '@alfalab/core-components/steps';
```

Corp-темы для `steps` нет (в пакете только `mobile.css`) — дополнительный импорт не нужен.

## Использование с обёрткой

`Steps` не включает белую карточку — обёртка обязательна:

```tsx
import { Steps } from '@alfalab/core-components/steps';

<div style={{
  borderRadius: 'var(--border-radius-16)',
  background: 'var(--color-light-base-bg-primary)',
  paddingTop: 'var(--gap-32)',
  paddingBottom: 'calc(var(--gap-32) + var(--gap-4))',
  paddingLeft: 'var(--gap-24)',
  paddingRight: 'var(--gap-24)',
}}>
  <Steps isVerticalAlign={true} ordered={false} activeStep={1}>
    <div>Шаг 1</div>
    <div>Шаг 2</div>
  </Steps>
</div>
```

## Виды индикаторов

| Индикатор | Проп | Описание |
|-----------|------|----------|
| Completed | автоматически | `stepNumber < activeStep` + `isMarkCompletedSteps=true` |
| Positive | `checkIsStepPositive={(n) => ...}` | зелёная галочка |
| Negative | `checkIsStepError={(n) => ...}` | красный восклицательный знак |
| CriticalError | `checkIsStepCriticalError={(n) => ...}` | красный крест |
| Warning | `checkIsStepWarning={(n) => ...}` | оранжевый восклицательный знак |
| Waiting | `checkIsStepWaiting={(n) => ...}` | серые часы |
| Custom | `checkIsStepCustom={(n) => ({ content, iconColor, className })}` | произвольный индикатор |

## Важно: приоритет индикаторов

`isPositive` проверяется ДО `isStepCompleted` в исходнике Step. Если оба true — победит `isPositive`.
Поэтому `checkIsStepPositive` не использовать для пройденных шагов — `isMarkCompletedSteps` справляется сам.

## Маппинг Figma → пропсы

| Figma | Проп | Значение |
|-------|------|----------|
| Вертикальный список | `isVerticalAlign` | `true` |
| Нет номеров, только иконки | `ordered` | `false` |
| Active шаг | `activeStep` | номер шага |
| Пройденные → Completed | `isMarkCompletedSteps` | `true` (default) |
| Шаги кликабельны | `interactive` | `true` / `false` |

## Пример — статичный

```tsx
<Steps isVerticalAlign={true} ordered={false} activeStep={2}>
  <div>Текст</div>
  <div>Текст</div>
  <div>Текст</div>
</Steps>
```

## Пример — интерактивный

```tsx
const [activeStep, setActiveStep] = useState(1);

<Steps
  isVerticalAlign={true}
  ordered={false}
  activeStep={activeStep}
  isMarkCompletedSteps={true}
  interactive={true}
  onChange={setActiveStep}
>
  <div>Текст</div>
  <div>Текст</div>
  <div>Текст</div>
</Steps>
```

Children — любой ReactNode (div, span, текст). `Steps` сам оборачивает каждый child в индикатор. Передавать `<Step>` напрямую нельзя — получатся двойные иконки.

## Карточка-обёртка (BackgroundPlate)

`Steps` не включает белую карточку — её делать вручную:

```tsx
<div style={{
  borderRadius: 'var(--border-radius-16)',
  background: 'var(--color-light-base-bg-primary)',
  paddingTop: 'var(--gap-32)',
  paddingBottom: 'calc(var(--gap-32) + var(--gap-4))',
  paddingLeft: 'var(--gap-24)',
  paddingRight: 'var(--gap-24)',
}}>
  <Steps ...>...</Steps>
</div>
```

## Отступы IsleContent до краёв карточки

- Сверху: **32px** (TopPadding 24 + SpacingVertical 8)
- Снизу: **36px** (SpacingVertical 12 + BottomPadding 24) → `calc(var(--gap-32) + var(--gap-4))`
- Слева/справа: **24px** → `var(--gap-24)`

## Пропсы в DevPanel

| Проп | Метка | Контрол | Значения |
|------|-------|---------|----------|
| activeStep | Активный шаг | number | 0 |
| ordered | Нумерация | toggle | — |
| isMarkCompletedSteps | Отмечать пройденные | toggle | — |
| interactive | Кликабельность | toggle | — |

### Do
- Всегда оборачивать Steps в белую карточку вручную — Steps не включает её
- Передавать children как div/span/текст — Steps сам оборачивает в индикатор

### Don't
- Don't передавать <Step> напрямую в children — получатся двойные иконки
- Don't использовать checkIsStepPositive для пройденных шагов — isMarkCompletedSteps справляется сам
- Don't искать /desktop субпакет — его нет, один компонент для всех платформ
