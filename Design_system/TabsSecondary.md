# TabsSecondary.md — AlfaBank
## Overview
Secondary-вариант Tabs (теги) для фильтрации внутри BackgroundPlate. Не использовать для навигации между страницами — для этого TabsView.

## TabsSecondary

## Импорт

```tsx
import { Tabs, Tab } from '@alfalab/core-components/tabs';
import { SecondaryTabListDesktop } from '@alfalab/core-components/tabs/desktop';
import type { SecondaryTabListProps } from '@alfalab/core-components/tabs';
```

Corp-тема подключается автоматически через глобальный `corp.css` — отдельный импорт не нужен.

## Использование

```tsx
<Tabs
  TabList={SecondaryTabListDesktop}
  selectedId={activeTab}
  onChange={(_, { selectedId }) => setActiveTab(selectedId as string)}
>
  <Tab title='Описание' id='description' />
  <Tab title='Разработчику' id='dev' />
</Tabs>
```

## Пропы

  size — передаётся в `<Tabs>` (enum API пакета), внутри маппится в фактический tagSize (px):
    'xxs' → **32px** · 'xs' → **40px** · 's' → **48px** · 'm' → **56px** · 'l' → **64px** · 'xl' → **72px**
    **Дефолт для проекта: 40px (`'xs'`)**

  tagView — стиль тега
    'outlined' (по умолчанию) | 'filled' | 'transparent'
    **Дефолт для проекта: 'filled'**

  tagShape — форма тега
    'rounded' (по умолчанию) | 'rectangular'
    **В BgPlate-контексте AlfaBank-проекта: только `'rectangular'`.** Зафиксирован в обёртке `DynamicTabList` в `BasePage.tsx` — не выставлять иное в этой зоне.

## Передача tagView / tagShape

Передаются через обёртку — `SecondaryTabListDesktop` не принимает их напрямую через `TabList`:

```tsx
const FilledSecondaryTabList = (props: SecondaryTabListProps) => (
  <SecondaryTabListDesktop {...props} tagView="filled" tagShape="rounded" />
);

<Tabs TabList={FilledSecondaryTabList} size="xs" selectedId={activeTab} onChange={...}>
  <Tab title='Описание' id='description' />
</Tabs>
```

## Пропсы в DevPanel

| Проп | Метка | Контрол | Значения |
|------|-------|---------|----------|
| size | Размер | cycle | 32 → 40 → 48 → 56 → 64 → 72 (px) |
| tagView | Вид тега | cycle | outlined → filled → transparent |

Размер показывается в DevPanel в реальных пикселях, а не в abstract enum `xxs/xs/...`. Парсер маппит px → enum: 32→xxs · 40→xs · 48→s · 56→m · 64→l · 72→xl. `tagShape` в BgPlate-контексте не редактируется — зафиксирован в коде как `'rectangular'`.

### Do
- Использовать TabsSecondary для фильтрации и сегментации внутри BackgroundPlate
- Передавать tagView/tagShape через обёртку над SecondaryTabListDesktop

### Don't
- Don't использовать для навигации между страницами — для этого TabsView
- Don't передавать tagView/tagShape напрямую в TabList — не принимает
- Don't ставить `tagShape='rounded'` внутри BgPlate — правило AlfaBank-проекта, только `rectangular`
