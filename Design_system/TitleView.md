# TitleView.md — AlfaBank

## Overview

Заголовочный компонент по Alfa Business Guidelines (паттерн `Паттерн :: TitleView`). Используется для всех заголовков на Headline-System. Имеет 4 уровня иерархии — page → block → subsection → sub-subsection.

## Иерархия

| DS уровень (= Figma) | Размер | Компонент | Где применяется | Правила текста |
|---|---|---|---|---|
| **xLarge** | 40/48 | `<TitleView view='large' />` | Page heading. Обязателен на каждой странице | Max 700px → перенос на 2-ю строку. Max 2 строки → многоточие |
| **Large** | 30/36 | `<TitleView view='medium' />` | TBD (O-1) | TBD (O-2) |
| **Medium** | 22/26 | `<Title view='small' />` напрямую | Один на BgPlate = один на смысловой блок. Только в Left | Max = ширина Left блока → перенос на 2-ю строку. Max 2 строки → многоточие |
| **Small** | 18/22 | `<Title view='xsmall' />` напрямую | В IsleBlock — один Small. В BgPlate — сколько угодно (subsequent заголовки в блоке) | Max = ширина Left блока → перенос на 2-ю строку. Max 2 строки → многоточие |

TitleView нужен только для xLarge/Large — там сложные слоты (statusLabel/titleStatusProps/buttonsGroup/filterCompanySelect). Для Medium/Small достаточно `Title` из `@alfalab/core-components/typography/title` + опционально `Text` под ним для subtitle.

## Использование TitleView (xLarge / Large)

```tsx
import { TitleView } from '../components/TitleView';

<TitleView
  heading="Заголовок страницы"
  view="large"
  subtitle="Подзаголовок"
  statusLabel="Одобрено"
  titleAddon={<MyAddon />}
  rightAddon={<DiamondsSIcon />}
  filterCompanySelectProps={{ options, selected, placeholder: 'Компания' }}
  titleStatusProps={{ type: 'positive', title: 'Заголовок', text: 'Текст' }}
  buttonsGroup={<MyButtons />}
  showSkeleton={false}
/>
```

| Prop | Тип | Поведение |
|---|---|---|
| `heading` | `string` | required — основной заголовок |
| `view` | `'medium' \| 'large' \| 'xLarge'` | размер. `'large'` = DS xLarge, `'medium'` = DS Large |
| `subtitle` | `string` | подзаголовок, 8px от Title |
| `statusLabel` | `string` | пилюля над заголовком — это компонент `Status` (`@alfalab/core-components/status`). **Все правила по статусам — в [Status.md](Status.md)**: палитра 6 цветов (green/orange/red/blue/grey/purple — teal не использовать), 23 канонических лейбла, decision tree выбора цвета, 16 правил UX-копи и анти-лексикон. В контексте TitleView → `size=24`, `view='contrast'`, `shape='rounded'`. API передачи цвета — TBD (сейчас в коде хардкод зелёного). |
| `titleAddon` | `ReactNode` | контент справа от текста |
| `rightAddon` | `ReactNode` | контент у правого края строки |
| `filterCompanySelectProps` | `{ options, selected, placeholder? }` | селектор компании (холдинг-режим) |
| `titleStatusProps` | `{ type: 'positive' \| 'negative' \| 'attention'; title; text }` | блок с цветной полоской, 20px сверху. Title — DS Small (`Title view='xsmall'`, 18/22). Цвет: positive → зелёный, attention → оранжевый, negative → красный |
| `buttonsGroup` | `ReactNode` | группа кнопок, 24px сверху. Передавать только если кнопки относятся ко всей странице |
| `showSkeleton` | `boolean` | скелетон-состояние. Передавать `true` пока данные страницы загружаются. Скелетон повторяет структуру: плейсхолдер на каждый активный slot (statusLabel / heading / titleAddon / rightAddon / filterCompanySelect / subtitle / titleStatusProps / buttonsGroup), отступы те же. Если slot не передан — в скелетоне его тоже нет |

## Пропсы в DevPanel

Порядок — по визуальному рендеру (см. `Tools/DevPanel/_index.md` → «Порядок строк»).

| Проп | Метка | Контрол | Значения |
|------|-------|---------|----------|
| statusLabel | Статус-бейдж | toggle+input | "Одобрено" (лейбл из канонического списка — см. [Status.md](Status.md)) |
| heading | Заголовок | input | "Заголовок страницы" |
| view | Размер | cycle | medium → large → xLarge |
| titleAddon | Доп. элемент | node | — |
| rightAddon | Правый аддон | node | — |
| filterCompanySelectProps | Выбор компании | node | — |
| subtitle | Подзаголовок | toggle+input | "Подзаголовок" |
| titleStatusProps | Статусный блок | node | — |
| button1 | Кнопка 1 | toggle+input | "Создать заявление" |
| button2 | Кнопка 2 | toggle+input | "Сохранить черновик" |
| button3 | Кнопка 3 | toggle+input | "Отмена" |
| button4 | Кнопка ⋯ (меню) | toggle | — |
| menuItem1 | ⋯ Пункт 1 | toggle+input | "Дублировать" |
| menuItem2 | ⋯ Пункт 2 | toggle+input | "Отменить" |
| menuItem3 | ⋯ Пункт 3 | toggle+input | "Скачать PDF" |
| showSkeleton | Скелетон | toggle | — |

`button1`/`button2`/`button3`/`button4` — синтетические DevPanel-слоты. В коде TitleView это один проп `buttonsGroup: ReactNode`; screen-обёртка собирает группу из активных кнопок.

**Состав слотов:**
- `button1` → `ButtonDesktop view='primary' size=56` (основное действие)
- `button2`, `button3` → `ButtonDesktop view='secondary' size=56`
- `button4` → `IconButtonDesktop view='secondary' size=56 icon=DotsHorizontalMIcon` (square 56×56, не растягивается под контент) + `Popover` (`zIndex` ≥ 10000, чтобы быть над DevPanel) со списком дополнительных действий (overflow-меню). У Popover нет border-radius на `.popover__inner` — добавляется через `src/corp-overrides.css` (`[class*='popover__inner']`)

**Правило:** максимум 4 кнопки в `buttonsGroup`. При необходимости >3 действий — четвёртая всегда overflow (⋯), остальное прячется в меню.

## Использование Title напрямую (Medium / Small)

```tsx
import { Title } from '@alfalab/core-components/typography/title';

// Medium (22/26) — заголовок BgPlate
<Title tag="h2" view="small" font="system" rowLimit={2}>
  Заголовок секции
</Title>

// Small (18/22) — подзаголовок внутри BgPlate / IsleBlock
<Title tag="h3" view="xsmall" font="system" rowLimit={2}>
  Подзаголовок
</Title>
```

Полезные props `Title`:
- `rowLimit?: 1 | 2 | 3` — обрезание после N строк (наше «max 2 → многоточие»)
- `showSkeleton?: boolean` — скелетон
- `color`, `weight` — для нюансов

## Spacings

| Между | px |
|---|---|
| Title → Subtitle | 8 |
| TitleStatus сверху | 20 |
| ButtonsGroup сверху | 24 |
| Header → TitleView | 40 |
| TitleView → Content / TabsView / Plate | 32 |
| TitleView → TopBar | 12 |
| Heading internal gap (Title → addon) | 16 |
| Status слот | pb-12 pt-4 |

## Цвета текста

Все 4 уровня TitleView используют **одни и те же** color tokens — варьируется только typography (размер/leading). Цвета — translucent darks с alpha-каналом, адаптируются к фону.

| Слот | Token Figma | Hex | Альфа |
|---|---|---|---|
| Title (xLarge / Large / Medium / Small) | `text/primary` | `#030306e0` | 88% |
| Subtitle | `text/secondary` | `#0404138c` | 55% |
| TitleStatus.title (bold внутри блока с полоской) | `text/primary` | `#030306e0` | 88% |
| TitleStatus.caption (описание под title) | `text/secondary` | `#0404138c` | 55% |
| StatusLabel (текст на solid цветной плашке) | `static_text_inverted/primary` | `#fffffff0` | 94% |
| TitleStatus вертикальная полоска (type=positive) | `decorative/green` | `#0cc44d` | 100% |

**CSS mapping** (core-components, гипотеза — валидировать в реализации):
- `text/primary` → `--color-light-text-primary`
- `text/secondary` → `--color-light-text-secondary`
- `static_text_inverted/primary` → `--color-light-static-text-primary-inverted`

**Источник:** `mcp__figma__get_variable_defs` на `Web__Corp Components` node `35325:33191` + варианты xLarge/Large/Medium/Small (2026-05-17).

## Источник Figma

`~/Library/CloudStorage/GoogleDrive-sweeptrip@gmail.com/My Drive/Claude/✅ Компонент __ TitleView.fig`

## Метаинформация паттерна

- **Статус:** «Можно использовать» (approved)
- **v1.0** — 20.05.2024 @dusharts — «Создание паттерна»
- **v1.1** — 20.11.2025 @dedanu — «Обновление примеров; дополнение Medium»
- **Связанные библиотеки:** Web__Corp Components, Web__Core Wrappers
- **Связанные паттерны:** `ЭтоБаза :: Широкая сетка`, `ЭтоБаза :: Кнопки и группы кнопок`
