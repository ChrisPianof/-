# BackgroundPlate.md — AlfaBank
## Overview
Контейнер с фоном, скруглением и паддингами. Поддерживает 5 вьюх, скелетон и hover-анимацию. Используется только в зоне Body — Left.

## BackgroundPlate

Реализация: `src/components/BackgroundPlate.tsx` → экспорты `BackgroundPlate`, `BackgroundPlateView`

```tsx
import { BackgroundPlate, BackgroundPlateView } from '../components/BackgroundPlate';

<BackgroundPlate view={BackgroundPlateView.Primary} showSkeleton={false} enableHover={true}>
  {/* контент */}
</BackgroundPlate>
```

Используется только в зоне **Body — Left** (см. `PageStructure.md`).

Пропы:
- `view: BackgroundPlateView` — Primary · Secondary · Colored · Dropzone · Border
- `showSkeleton?: boolean` — заменяет children скелетоном
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
