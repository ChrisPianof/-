# Select.md — AlfaBank
## Overview
SelectDesktop из @alfalab/core-components/select/desktop. OptionShape, нестандартная onChange-сигнатура, corp-тема.

## Select

Импорт: `@alfalab/core-components/select/desktop`

```tsx
import { SelectDesktop } from '@alfalab/core-components/select/desktop';
import '@alfalab/core-components-themes/select/corp.css';

const options = [
  { key: 'rub', content: 'Рубль', value: 'RUB' },
  { key: 'usd', content: 'Доллар', value: 'USD' },
  { key: 'eur', content: 'Евро', value: 'EUR' },
];

<SelectDesktop
  label="Валюта"
  options={options}
  selected={selected}
  onChange={({ selected }) => setSelected(selected)}
  block
/>
```

## OptionShape

```ts
type OptionShape = {
  key: string;         // уникальный идентификатор
  content?: ReactNode; // отображение в списке и в поле
  disabled?: boolean;
  value?: any;         // произвольные данные, доступны в onChange
};
```

## Пропы

- `options: OptionShape[]` — список вариантов (обязательный)
- `selected?: string | OptionShape | null` — controlled
- `label?: ReactNode` — лейбл
- `labelView?: 'inner' | 'outer'` — inner (плавающий, default) · outer (над полем)
- `placeholder?: string` — плейсхолдер
- `size?: 40 | 48 | 56 | 64 | 72` — высота поля. **AlfaBank-проект: default `56`** (правило десктопных форм). У пакета default `48`, но в этом проекте 48 не использовать без явной причины.
- `block?: boolean` — **в проекте AlfaBank**: `true` → ширина 100% контейнера (BgPlate), `false` → ровно 50%. Компонент внутри всегда рендерится с `block=true`; полуширина задаётся обёрткой `<div style={{ width: '50%' }}>` в `BasePage.tsx`. Семантика DevPanel-проп `block` — на 100% vs 50%, не на natural-width пакета.
- `block?: boolean` — 100% ширины
- `multiple?: boolean` — множественный выбор; `selected` становится массивом
- `disabled?: boolean`
- `error?: ReactNode | boolean` — ошибка
- `hint?: ReactNode` — подсказка под полем
- `clear?: boolean` — крестик сброса
- `allowUnselect?: boolean` — позволяет снять выбранное значение
- `closeOnSelect?: boolean` — закрывать список после выбора (default `true`)
- `showSearch?: boolean` — поле поиска внутри списка
- `visibleOptions?: number` — кол-во видимых пунктов (5 = показывает 5.5)

## onChange

Нестандартная сигнатура — не `event`:

```tsx
onChange={({ selected, selectedMultiple }) => {
  // single: selected — выбранный OptionShape или null
  // multiple: selectedMultiple — массив OptionShape[]
  setSelected(selected);
}}
```

## Известные предупреждения

В dev-режиме консоль может выдавать `Warning: Invalid hook call` — это внутреннее поведение зависимости `downshift`. Рендер не ломает, в продакшн-билде не появляется. Игнорировать.

## Важно

- Corp-тема требует отдельного импорта `@alfalab/core-components-themes/select/corp.css` после компонента
- Всегда использовать `/desktop` субпакет — базовый рендерит мобильный вариант
- `key` в `OptionShape` — строка-идентификатор, `value` — произвольные данные (можно хранить объект, id и т.д.)
- Для групп опций: `options` принимает `GroupShape[]` с полем `{ label?: string, options: OptionShape[] }`

## Пропсы в DevPanel

| Проп | Метка | Контрол | Значения |
|------|-------|---------|----------|
| label | Лейбл | input | "Выпадающий список" |
| labelView | Вид лейбла | cycle | inner → outer |
| size | Размер | cycle | 40 → 48 → 56 → 64 → 72 |
| block | На всю ширину | toggle | — |
| multiple | Мультивыбор | toggle | — |
| disabled | Отключён | toggle | — |
| showSearch | Поиск | toggle | — |
| error | Ошибка | toggle+input | "Ошибка" |
| hint | Подсказка | toggle+input | "Подсказка" |
| clear | Кнопка сброса | toggle | — |

### Do
- Использовать SelectDesktop из /select/desktop субпакета
- Импортировать select/corp.css после компонента в том же файле
- Читать выбранное значение через `({ selected }) => ...` в onChange

### Don't
- Don't читать значение через event — нестандартная сигнатура onChange
- Don't паниковать из-за «Invalid hook call» в dev — это внутри downshift, не наш баг
- Don't использовать базовый /select без /desktop
