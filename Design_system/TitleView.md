# TitleView.md — AlfaBank
## Overview
Заголовочная зона страницы. Первая зона в CorporateContent, присутствует всегда.

## TitleView

Реализация: `src/components/TitleView.tsx` → экспорт `TitleView`

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

## Пропы

- `heading: string` — основной заголовок (обязательный)
- `view?: 'medium' | 'large' | 'xLarge'` — размер заголовка, по умолчанию `large`
- `subtitle?: string` — подзаголовок под heading, отступ 8px
- `statusLabel?: string` — зелёный бейдж над заголовком (например «Одобрено»)
- `titleAddon?: ReactNode` — произвольный контент рядом с заголовком (справа от текста)
- `rightAddon?: ReactNode` — контент у правого края строки заголовка
- `filterCompanySelectProps?: { options, selected, placeholder? }` — кнопка выбора компании под заголовком
- `titleStatusProps?: { type: 'positive' | 'negative' | 'attention'; title: string; text: string }` — статусный блок с цветной левой полоской, отступ 20px сверху
- `buttonsGroup?: ReactNode` — группа кнопок, отступ 24px сверху
- `showSkeleton?: boolean` — скелетон-состояние загрузки

## Пропсы в DevPanel

| Проп | Метка | Контрол | Значения |
|------|-------|---------|----------|
| heading | Заголовок | input | — |
| view | Размер | cycle | medium → large → xLarge |
| subtitle | Подзаголовок | toggle+input | "Подзаголовок" |
| statusLabel | Статус-бейдж | toggle+input | "Одобрено" |
| titleAddon | Доп. элемент | node | |
| rightAddon | Правый аддон | node | |
| filterCompanySelectProps | Выбор компании | node | |
| titleStatusProps | Статусный блок | node | |
| buttonsGroup | Кнопки | node | |
| showSkeleton | Скелетон | toggle | |

## Используемые компоненты

- `Title` из `@alfalab/core-components/typography/title`
- `Text` из `@alfalab/core-components/typography/text`
- `Link` из `@alfalab/core-components/link`
- `StatusBadge` из `@alfalab/core-components/status-badge`
- `ButtonDesktop` из `@alfalab/core-components/button/desktop` + `@alfalab/core-components-themes/button/corp.css`
- `DotsHorizontalMIcon` из `@alfalab/icons-glyph/DotsHorizontalMIcon`
- `DiamondsSIcon` из `@alfalab/icons-glyph/DiamondsSIcon`

### Do
- Всегда ставить TitleView первой зоной в CorporateContent
- Передавать heading — единственный обязательный проп
- Использовать showSkeleton при загрузке данных страницы

### Don't
- Don't создавать заголовочную зону страницы вручную — всегда TitleView
- Don't размещать TitleView внутри Body или BackgroundPlate
