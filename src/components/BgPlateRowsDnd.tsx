import React, { useState, type CSSProperties, type ReactNode } from 'react';
import {
  DndContext,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  useDraggable,
  useDroppable,
  pointerWithin,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
} from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';

export type Side = 'top' | 'bottom' | 'left' | 'right';
export type DnDRow<ItemT> = { id: number; items: ItemT[] };

export type MoveAction = {
  srcRowId: number;
  srcItemId: number;
  destRowId: number;
  destItemId: number;
  side: Side;
};

const ACCENT = '#7dd3fc';
const INDICATOR_PHANTOM: CSSProperties = {
  position: 'absolute',
  background: 'rgba(125, 211, 252, 0.18)',
  border: `2px dashed ${ACCENT}`,
  borderRadius: 10,
  pointerEvents: 'none',
  zIndex: 5,
};

type Indicator = { rowId: number; itemId: number; side: Side } | null;

type ItemData = { rowId: number; itemId: number };

function computeSide(
  activeRect: { left: number; top: number; width: number; height: number } | null,
  overRect: { left: number; top: number; width: number; height: number },
  canGroup: boolean,
): Side {
  if (!activeRect) return 'bottom';
  const activeCx = activeRect.left + activeRect.width / 2;
  const activeCy = activeRect.top + activeRect.height / 2;
  const overCx = overRect.left + overRect.width / 2;
  const overCy = overRect.top + overRect.height / 2;
  const dx = activeCx - overCx;
  const dy = activeCy - overCy;
  if (canGroup && Math.abs(dx) > Math.abs(dy)) return dx >= 0 ? 'right' : 'left';
  return dy >= 0 ? 'bottom' : 'top';
}

export function BgPlateRowsDnd<ItemT extends { id: number }>({
  rows, onMove, renderItem, itemGap = 'var(--gap-24)', canGroup, getRowGap,
}: {
  rows: DnDRow<ItemT>[];
  onMove: (action: MoveAction) => void;
  renderItem: (row: DnDRow<ItemT>, item: ItemT, isFirstRow: boolean) => ReactNode;
  itemGap?: string;
  /** Можно ли поставить src item рядом с dest item в одной row. Если нет — drop side ограничивается top/bottom. */
  canGroup?: (srcRowId: number, srcItemId: number, destRowId: number, destItemId: number) => boolean;
  /** Кастомный gap между rows. Решает на основе содержимого предыдущей и текущей row.
   * По умолчанию `var(--gap-24)`. Используется для правил типа «TabsSecondary → Input/Select/Date: 20px». */
  getRowGap?: (prevRow: DnDRow<ItemT>, currentRow: DnDRow<ItemT>) => string;
}) {
  const [indicator, setIndicator] = useState<Indicator>(null);
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor),
  );

  const onDragStart = (e: DragStartEvent) => setActiveId(String(e.active.id));

  const onDragOver = (e: DragOverEvent) => {
    const { active, over } = e;
    if (!over || active.id === over.id) { setIndicator(null); return; }
    const overData = over.data.current as ItemData | undefined;
    const activeData = active.data.current as ItemData | undefined;
    if (!overData || !activeData) { setIndicator(null); return; }
    const overRect = over.rect;
    const activeRect = active.rect.current.translated;
    if (!overRect) { setIndicator(null); return; }
    const allowGroup = canGroup
      ? canGroup(activeData.rowId, activeData.itemId, overData.rowId, overData.itemId)
      : true;
    const side = computeSide(activeRect, overRect, allowGroup);
    setIndicator({ rowId: overData.rowId, itemId: overData.itemId, side });
  };

  const onDragEnd = (e: DragEndEvent) => {
    const { active, over } = e;
    setActiveId(null);
    const ind = indicator;
    setIndicator(null);
    if (!over || !ind) return;
    const activeData = active.data.current as ItemData | undefined;
    if (!activeData) return;
    if (activeData.rowId === ind.rowId && activeData.itemId === ind.itemId) return;
    onMove({
      srcRowId: activeData.rowId,
      srcItemId: activeData.itemId,
      destRowId: ind.rowId,
      destItemId: ind.itemId,
      side: ind.side,
    });
  };

  const onDragCancel = () => { setIndicator(null); setActiveId(null); };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={pointerWithin}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDragEnd={onDragEnd}
      onDragCancel={onDragCancel}
    >
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {rows.map((row, rowIdx) => {
          const isFirst = rowIdx === 0;
          const marginTop = isFirst
            ? 0
            : (getRowGap ? getRowGap(rows[rowIdx - 1], row) : 'var(--gap-24)');
          return (
            <div
              key={row.id}
              style={{
                display: 'flex',
                gap: itemGap,
                marginTop,
                alignItems: 'stretch',
              }}
            >
              {row.items.map(item => {
                const itemIndicator =
                  indicator && indicator.rowId === row.id && indicator.itemId === item.id
                    ? indicator.side
                    : null;
                return (
                  <Cell
                    key={item.id}
                    rowId={row.id}
                    itemId={item.id}
                    indicator={itemIndicator}
                    isDragging={activeId === `item-${row.id}-${item.id}`}
                  >
                    {renderItem(row, item, isFirst)}
                  </Cell>
                );
              })}
            </div>
          );
        })}
      </div>
    </DndContext>
  );
}

function Cell({
  rowId, itemId, indicator, isDragging, children,
}: {
  rowId: number;
  itemId: number;
  indicator: Side | null;
  isDragging: boolean;
  children: ReactNode;
}) {
  const id = `item-${rowId}-${itemId}`;
  const data: ItemData = { rowId, itemId };
  const drag = useDraggable({ id, data });
  const drop = useDroppable({ id, data });

  const setRef = (node: HTMLElement | null) => {
    drag.setNodeRef(node);
    drop.setNodeRef(node);
  };

  const style: CSSProperties = {
    flex: 1,
    minWidth: 0,
    position: 'relative',
    transform: CSS.Translate.toString(drag.transform),
    opacity: isDragging ? 0.4 : 1,
    cursor: 'grab',
  };

  const phantomStyle = (side: Side): CSSProperties => {
    const base: CSSProperties = { ...INDICATOR_PHANTOM };
    if (side === 'left')   return { ...base, left: -12, top: 0, bottom: 0, width: '50%' };
    if (side === 'right')  return { ...base, right: -12, top: 0, bottom: 0, width: '50%' };
    if (side === 'top')    return { ...base, left: 0, right: 0, top: -16, height: 8, borderStyle: 'solid' };
    return { ...base, left: 0, right: 0, bottom: -16, height: 8, borderStyle: 'solid' };
  };

  // Исключаем из drag элементы с data-no-dnd (например, EditableText span внутри label).
  // Без этого PointerSensor перехватывает pointerdown на любом потомке и блокирует click.
  const dragListeners = drag.listeners ?? {};
  const wrappedListeners: typeof dragListeners = {
    ...dragListeners,
    onPointerDown: (e: React.PointerEvent) => {
      if ((e.target as HTMLElement).closest('[data-no-dnd]')) return;
      dragListeners.onPointerDown?.(e);
    },
  };

  return (
    <div ref={setRef} style={style} {...wrappedListeners} {...drag.attributes}>
      {children}
      {indicator && <div style={phantomStyle(indicator)} />}
    </div>
  );
}
