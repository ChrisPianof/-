# UniversalDateInput.md — AlfaBank
## Overview
UniversalDateInputDesktop из `@alfalab/core-components/universal-date-input/desktop`. Универсальный инпут даты с маской ввода и опциональным календарём-пикером справа. Покрывает 5 видов: date · date-time · date-range · time · month.

**Назначение (Web :: Core):** ввод даты с клавиатуры и/или через пикер. Owner — `@vbarkalov`, статус — «Можно использовать» (готов в макетах и на фронте).

## UniversalDateInput

Импорт:

```tsx
import { UniversalDateInputDesktop } from '@alfalab/core-components/universal-date-input/desktop';
import { Calendar } from '@alfalab/core-components/calendar';
import '@alfalab/core-components-themes/universal-date-input/corp.css';
import '@alfalab/core-components-themes/calendar/corp.css';

const [value, setValue] = useState('');

<UniversalDateInputDesktop
  label="Дата контракта"
  view="date"
  picker
  Calendar={Calendar}
  value={value}
  onChange={(_date, payload) => setValue(payload.value)}
  block
/>
```

## View

Дискриминированный union — от `view` зависит сигнатура `onChange` и `value`:

- `view='date'` — одна дата · `value: Date | number | string | null` · `onChange(date, valueStr)`
- `view='date-time'` — дата + время · значение того же типа · `onChange(date, valueStr)`
- `view='date-range'` — диапазон · `value: { dateFrom, dateTo }` · `onChange({dateFrom, dateTo}, valueStr)`
- `view='time'` — только время · `value: string` (HH:mm) · `onChange(valueStr)` · picker недоступен
- `view='month'` — месяц/год · `value: string` (MM.YYYY) · `onChange(valueStr)` · picker недоступен

## Пропы

- `view: View` — обязательный, определяет тип инпута (см. выше)
- `picker?: boolean` — если `true`, справа иконка календаря, по клику открывается поповер
- `Calendar?: ForwardRefExoticComponent<CalendarProps>` — **обязателен при `picker=true`**, передавать `Calendar` из `@alfalab/core-components/calendar`
- `calendarProps?: CalendarProps` — пропсы внутреннего календаря
- `popoverProps?: PopoverProps` — пропсы поповера календаря
- `label?: ReactNode` — лейбл (плавающий по умолчанию)
- `labelView?: 'inner' | 'outer'` — наследуется из InputProps
- `size?: 48 | 56 | 64 | 72` — высота. **AlfaBank-проект: default `56`** (правило десктопных форм). У пакета default `48`, в этом проекте 48 не использовать без явной причины.
- `block?: boolean` — **в проекте AlfaBank**: `true` → ширина 100% контейнера (BgPlate), `false` → ровно 50%. Компонент внутри всегда рендерится с `block=true`; полуширина задаётся обёрткой `<div style={{ width: '50%' }}>` в `BasePage.tsx`. Семантика DevPanel-проп `block` — на 100% vs 50%, не на natural-width пакета.
- `block?: boolean` — 100% ширины
- `disabled?: boolean`
- `error?: ReactNode | boolean`
- `hint?: ReactNode`
- `minDate?: number` / `maxDate?: number` — границы дат (timestamp)
- `autoCorrection?: boolean` — автоисправление ввода, default `true`
- `value` / `defaultValue` — тип зависит от `view` (см. выше)
- `calendarOpen?: boolean` + `onCalendarOpenChange?: (open) => void` — controlled-открытие пикера
- `onInputChange?: (event, { value }) => void` — изменения по символам в маске
- `onChange?` — финальное значение (тип зависит от `view`)
- `rangeBehavior?: 'clarification' | 'reset'` — только для `view='date-range'`, default `clarification`

## onChange

Сигнатура зависит от `view`. Обрати внимание: это **не** стандартная `(event, { value })` сигнатура Input.

```tsx
// view='date' | 'date-time'
onChange={(date, value) => { /* date: Date | null, value: string */ }}

// view='date-range'
onChange={(range, value) => {
  // range: { dateFrom: Date | null, dateTo: Date | null }
  // value: string
}}

// view='time' | 'month'
onChange={(value) => { /* value: string */ }}
```

Чтобы получать изменения по символам в маске — используй `onInputChange`.

## Picker (календарь)

`picker=true` без `Calendar` — TS-ошибка (conditional types). Передавать готовый Calendar:

```tsx
import { Calendar } from '@alfalab/core-components/calendar';
// ...
<UniversalDateInputDesktop view="date" picker Calendar={Calendar} ... />
```

Чтобы кастомизировать календарь — `calendarProps={{ minDate, maxDate, selectorView: 'month-only', ... }}`. Открытие через `picker` — нативный поповер `@alfalab/core-components/popover`.

## Размер 56 — макеты Альфы

В макетах используется `size={56}`. Скругление берётся из токена `FormControl/Desktop/CornerRadius/Size56 = 10px` — задаётся темой автоматически, руками не править. Фон поля — `neutral-translucent/300` (`#0f19371a`).

## Важно

- Corp-тема требует **двух** импортов: `universal-date-input/corp.css` (поле) + `calendar/corp.css` (поповер)
- Всегда использовать `/desktop` субпакет
- `picker=true` без `Calendar={Calendar}` — TS-ошибка, не молчаливая
- Для дат лучше работать с первым аргументом `onChange` (Date), второй (строка) — для отображения
- Чтобы сделать инпут полностью контролируемым по открытию календаря — `calendarOpen` + `onCalendarOpenChange`

## Пропсы в DevPanel

| Проп | Метка | Контрол | Значения |
|------|-------|---------|----------|
| label | Лейбл | input | "Дата контракта" |
| view | Вид | cycle | date → date-time → date-range → time → month |
| size | Размер | cycle | 48 → 56 → 64 → 72 |
| picker | Календарь-пикер | toggle | — |
| block | На всю ширину | toggle | — |
| disabled | Отключён | toggle | — |
| error | Ошибка | toggle+input | "Неверный формат" |
| hint | Подсказка | toggle+input | "ДД.ММ.ГГГГ" |
| autoCorrection | Автокоррекция | toggle | — |

### Do
- Использовать UniversalDateInputDesktop из `/universal-date-input/desktop`
- При `picker=true` импортировать и передавать `Calendar` из `/calendar`
- Импортировать оба corp.css (универсал + календарь) в файле использования
- Читать дату из первого аргумента `onChange` (`Date | null`)

### Don't
- Don't ставить `picker` без `Calendar` — TS не пропустит, рантайма не будет
- Don't использовать базовый /universal-date-input без /desktop — отрисует мобильный вариант
- Don't править скругление вручную — токен `FormControl/Desktop/CornerRadius/Size56` задаёт тема

## Disabled — замочек

С декабря 2025 во всех инпутах Альфы (включая UniversalDateInput) заблокированное состояние показывает иконку замочка в правом аддоне — по общему паттерну Core Guidelines. Это поведение реализовано в core-components, отдельно стилить не надо.

## Источник Figma

**Паспорт компонента (Web :: Core):** file `odjhWXuBVUgLfAnUI1PtMT`, node `507:25760` (карточка).
Локально: `~/Library/CloudStorage/GoogleDrive-sweeptrip@gmail.com/My Drive/Claude/Web __ Core.fig`

**Использование в паттерне:** https://www.figma.com/design/pczuwshD4kyGcqq089R4WO/Сценарии?node-id=11953-93284 → instance `[D] UniversalDateInput` (id `40000006:39557`)

**Локальный экспорт компонента** (если потребуется отдельный .fig): `~/Library/CloudStorage/GoogleDrive-sweeptrip@gmail.com/My Drive/Claude/Компонент __ UniversalDateInput.fig` — TBD, ещё не экспортирован.

## Метаинформация компонента

- **Статус:** «Можно использовать» (approved)
- **Owner:** `@vbarkalov`
- **Storybook:** https://core-ds.github.io/core-components/master/?path=/docs/universaldateinput--docs
- **GitHub:** https://github.com/core-ds/core-components/tree/master/packages/universal-date-input
- **Текущая версия пакета (в проекте):** @alfalab/core-components 50.12.0

### История изменений (по карточке Web :: Core)

| Дата | Что |
|---|---|
| Апрель 2026 | Скругления переведены на переменные |
| Март 2026 | Темизация переведена на переменные · темизированные дубли помечены как устаревшие · удалена оптическая компенсация лейблов и хинтов в мобильной версии |
| Декабрь 2025 | Заблокированное состояние всех инпутов: замочек в правом аддоне (общий паттерн) |
| Октябрь 2025 | Скругления приведены в соответствие с остальными инпутами |

Owner всех изменений — `@vbarkalov`. Полная история (9 записей) — в карточке Figma.
