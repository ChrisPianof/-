# Components.md — AlfaBank
## Overview
Каталог готовых компонентов с минимальными примерами. Читать перед сборкой любого экрана.

## Готовые компоненты

## Иконки — ОБЯЗАТЕЛЬНО

Использовать ТОЛЬКО `@alfalab/icons-glyph`. CDNIcon не использовать — CDN-адрес нестабилен.
Поиск иконок: https://core-ds.github.io/icons-demo/

Иконки одноцветные. Цвет не форсировать — corp-тема задаёт через `currentColor`.
Если нужен явный цвет — передавать через prop `color` или CSS `color: value`.

Пакет `@alfalab/icons-glyph` уже установлен. Импорт поштучно:

```tsx
import { RocketMIcon } from '@alfalab/icons-glyph/RocketMIcon';

<RocketMIcon width={20} height={20} />
```

Цвет не форсировать — corp-тема задаёт его сама через `currentColor`.

---

## Tabs

Документация: `AlfaBank/Design_system/TabsView.md`

  Secondary-вариант (теги): `AlfaBank/Design_system/TabsSecondary.md`

```tsx
import { Tabs, Tab } from '@alfalab/core-components/tabs';

<Tabs selectedId={activeTab} onChange={(_, { selectedId }) => setActiveTab(selectedId as string)}>
  <Tab title='Описание' id='description' />
  <Tab title='Разработчику' id='dev' />
</Tabs>
```

---

## Input

Документация: `AlfaBank/Design_system/Input.md`

```tsx
import { InputDesktop } from '@alfalab/core-components/input/desktop';

<InputDesktop
  label='Название поля'
  value={value}
  onChange={(_, { value }) => setValue(value)}
/>
```

---

## Select

Документация: `AlfaBank/Design_system/Select.md`

```tsx
import { SelectDesktop } from '@alfalab/core-components/select/desktop';
import '@alfalab/core-components-themes/select/corp.css';

const options = [
  { key: 'rub', content: 'Рубль', value: 'RUB' },
  { key: 'usd', content: 'Доллар', value: 'USD' },
];

<SelectDesktop
  label="Валюта"
  options={options}
  selected={selected}
  onChange={({ selected }) => setSelected(selected)}
  block
/>
```

---

## Button

Документация: `AlfaBank/Design_system/Buttons.md`

Views: primary · secondary · tertiary · ghost · text · link. Sizes: 32–72. Всегда `/desktop` субпакет.

---

## PageLayout

Реализация: `src/App.tsx` → функция `PageLayout`

Оборачивает любой экран в Sidebar + Header + main с правильными отступами.

```tsx
<PageLayout activeItem="Платежи в работе" showBack={false}>
  <MyScreen />
</PageLayout>
```

Пропы: `activeItem?: string` — label активного пункта Sidebar; `showBack?: boolean` — кнопка «Назад» в Header

---

## TitleView

Документация: `AlfaBank/Design_system/TitleView.md`
Реализация: `src/components/TitleView.tsx` → экспорт `TitleView`

Заголовочная зона страницы. Пропы и примеры — в `TitleView.md`.

---

## Sidebar

Документация: `AlfaBank/Design_system/Sidebar.md`
Реализация: `src/components/Sidebar.tsx` → экспорт `Sidebar`

Пропы: `activeItem?: string` — label активного пункта меню

---

## Header

Документация: `AlfaBank/Design_system/Header.md`
Реализация: `src/components/Header.tsx` → экспорт `Header`

Пропы: `showBack?: boolean` — показать кнопку «Назад» слева

---

## BackgroundPlate

Документация: `AlfaBank/Design_system/BackgroundPlate.md`
Реализация: `src/components/BackgroundPlate.tsx` → экспорты `BackgroundPlate`, `BackgroundPlateView`

Контейнер с фоном, скруглением и паддингами. Пропы и примеры — в `BackgroundPlate.md`.

```tsx
import { BackgroundPlate, BackgroundPlateView } from '../components/BackgroundPlate';

<BackgroundPlate view={BackgroundPlateView.Primary}>
  {/* контент */}
</BackgroundPlate>
```

---

## IsleBlock

Документация: `AlfaBank/Design_system/IsleBlock.md`

Вертикальный степпер процесса. Пример с обёрткой — в `IsleBlock.md`.

### Do
- Читать этот файл перед сборкой любого экрана — здесь все готовые компоненты
- Использовать компоненты из этого списка без повторного исследования
- Использовать только @alfalab/icons-glyph для иконок

### Don't
- Don't использовать CDNIcon — CDN-адрес нестабилен
- Don't искать иконки вне @alfalab/icons-glyph
- Don't дублировать полную документацию — только ссылка на .md файл компонента
