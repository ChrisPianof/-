# Input.md — AlfaBank
## Overview
InputDesktop из @alfalab/core-components/input/desktop. Нестандартная onChange-сигнатура: второй аргумент `{ value }`, не event.target.value.

## Input

Импорт: `@alfalab/core-components/input/desktop`

```tsx
import { InputDesktop } from '@alfalab/core-components/input/desktop';

<InputDesktop
  label='Название поля'
  value={value}
  onChange={(_, { value }) => setValue(value)}
/>
```

## Пропы

- `value?: string` — controlled
- `defaultValue?: string` — uncontrolled
- `label?: ReactNode` — лейбл
- `labelView?: 'inner' | 'outer'` — inner (плавающий, default) · outer (над полем)
- `size?: 40 | 48 | 56 | 64` — высота. **AlfaBank-проект: default `56`** (правило десктопных форм). У пакета default `48`, но в этом проекте 48 не использовать без явной причины.
- `block?: boolean` — **в проекте AlfaBank**: `true` → ширина 100% контейнера (BgPlate), `false` → ровно 50%. Компонент внутри всегда рендерится с `block=true`; полуширина задаётся обёрткой `<div style={{ width: '50%' }}>` в `BasePage.tsx`. Семантика DevPanel-проп `block` — на 100% vs 50%, не на natural-width пакета.
- `block?: boolean` — 100% ширины
- `type?: 'text' | 'number' | 'email' | 'password' | 'tel' | 'money'` — default `'text'`
- `clear?: boolean` — крестик очистки (виден только когда поле заполнено)
- `error?: ReactNode | boolean` — ошибка + иконка
- `success?: boolean` — иконка успеха
- `hint?: ReactNode` — подсказка под полем
- `leftAddons?: ReactNode` — слот слева
- `rightAddons?: ReactNode` — слот справа
- `bottomAddons?: ReactNode` — слот под полем
- `disabled?: boolean`
- `readOnly?: boolean`
- `disableUserInput?: boolean` — запрет ввода с клавиатуры (поле кликабельно)
- `fontWeight?: 'bold' | 'medium' | 'regular'`
- `colors?: 'default' | 'inverted'`
- `onChange?: (event, { value: string }) => void` — нестандартная сигнатура

## Важно

- `onChange` — второй аргумент `{ value }`, не `event.target.value`
- `type='number'` — символы `e`/`E` блокируются автоматически
- Приоритет right-слотов (справа → влево): Lock → `rightAddons` → success/error → clear

## Пропсы в DevPanel

| Проп | Метка | Контрол | Значения |
|------|-------|---------|----------|
| label | Лейбл | input | "Название поля" |
| labelView | Вид лейбла | cycle | inner → outer |
| size | Размер | cycle | 40 → 48 → 56 → 64 |
| block | На всю ширину | toggle | — |
| disabled | Отключён | toggle | — |
| error | Ошибка | toggle+input | "Ошибка заполнения" |
| success | Успех | toggle | — |
| hint | Подсказка | toggle+input | "Подсказка" |
| clear | Кнопка очистки | toggle | — |

### Do
- Использовать InputDesktop из /input/desktop субпакета
- Читать value через второй аргумент onChange: `(_, { value }) => setValue(value)`

### Don't
- Don't читать value через event.target.value — нестандартная сигнатура
- Don't использовать базовый /input без /desktop
