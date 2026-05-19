# TabsView.md — AlfaBank
## Overview
Опциональная зона между TitleView и Body. Переключает содержимое Body по вкладкам. Если вкладок нет — Body идёт сразу после TitleView.

## TabsView

## Tabs

Импорт: `@alfalab/core-components/tabs`

```tsx
import { Tabs, Tab } from '@alfalab/core-components/tabs';

<Tabs
  selectedId={activeTab}
  onChange={(_, { selectedId }) => setActiveTab(selectedId as string)}
>
  <Tab title='Описание' id='description' />
  <Tab title='Разработчику' id='dev' />
  <Tab title='Обновления' id='updates' />
</Tabs>
```

## Пропы Tabs

- `selectedId: string | number` — активный таб
- `onChange: (event, { selectedId }) => void` — обработчик переключения
- `view?: 'primary' | 'secondary'` — primary (линия, default) · secondary (теги)
- `size?: 'xxs' | 'xs' | 's' | 'm' | 'l' | 'xl'` — высота заголовков
- `keepMounted?: boolean` — рендерить неактивные табы в DOM
- `scrollable?: boolean` — горизонтальный скролл заголовков
- `showSkeleton?: boolean` — скелетон

## Пропы Tab

- `id: string | number` — обязательный идентификатор
- `title: ReactNode` — заголовок таба
- `children?: ReactNode` — контент таба
- `rightAddons?: ReactNode` — слот справа от заголовка
- `disabled?: boolean`
- `hidden?: boolean`

## Важно

Требует `resolve.dedupe: ['react', 'react-dom']` в `vite.config.ts` — иначе крашится с «Invalid hook call» из-за дублирующегося React.

## Полоска снизу — full-width родителя

`.tabs__component` PrimaryTabList имеет `display: inline-flex; min-width: 100%`, а полоска под табами (`::before` с `width: 100%`) берёт ширину **родительского** контейнера. Значит:

**Обязательное правило:** ставить Tabs внутри обёртки с `width: 100%` (или другим способом гарантировать full-width родителя). Иначе полоска обрезается под контент.

```tsx
// ✓ Правильно — полоска на всю ширину зоны
<div style={{ width: '100%' }}>
  <Tabs view='primary' ...>
    <Tab title='Раздел 1' id='1' />
  </Tabs>
</div>

// ✗ Неправильно — display:flex даёт shrink-to-fit
<div style={{ display: 'flex' }}>
  <Tabs view='primary' ...>...</Tabs>
</div>
```

Сами табы остаются естественной ширины (по контенту) благодаря `inline-flex` на самой `.tabs__component` — стрейчится только полоска.

## Пропсы в DevPanel

| Проп | Метка | Контрол | Значения |
|------|-------|---------|----------|
| view | Вид | cycle | primary → secondary |
| size | Размер | cycle | xxs → xs → s → m → l → xl |
| showSkeleton | Скелетон | toggle | — |
| scrollable | Скролл заголовков | toggle | — |

### Do
- Добавить resolve.dedupe: ['react', 'react-dom'] в vite.config.ts перед использованием
- Ставить TabsView между TitleView и Body, когда страница имеет вкладки
- Оборачивать Tabs в `<div style={{ width: '100%' }}>` (или равноценное) — полоска должна растягиваться на всю ширину зоны

### Don't
- Don't пропускать resolve.dedupe — Tabs крашится с «Invalid hook call»
- Don't использовать TabsView для фильтрации внутри карточки — для этого TagGroup
- Don't ставить Tabs внутрь Body или BackgroundPlate
- Don't оборачивать TabsView в `display: flex` без `flex: 1` — shrink-to-fit обрежет нижнюю полоску
