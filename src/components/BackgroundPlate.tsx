import { useState } from 'react';
import { Skeleton } from '@alfalab/core-components/skeleton';
import { DevPanelWrapper, type PropSpec, type AddOption } from '@local/devpanel';

export enum BackgroundPlateView {
  Primary = 'primary',
  Secondary = 'secondary',
  Colored = 'colored',
  Dropzone = 'dropzone',
  Border = 'border',
}

interface BackgroundPlateProps {
  view: BackgroundPlateView;
  showSkeleton?: boolean;
  enableHover?: boolean;
  children?: React.ReactNode;
  onDuplicate?: () => void;
  onDelete?: () => void;
  addOptions?: AddOption[];
}

const viewStyles: Record<BackgroundPlateView, React.CSSProperties> = {
  [BackgroundPlateView.Primary]: { background: 'var(--color-light-base-bg-primary)' },
  [BackgroundPlateView.Secondary]: { background: 'var(--color-light-base-bg-secondary)' },
  [BackgroundPlateView.Colored]: { background: 'var(--color-light-accent-primary-minor)' },
  [BackgroundPlateView.Dropzone]: { background: 'transparent', border: '2px dashed var(--color-light-border-primary)' },
  [BackgroundPlateView.Border]: { background: 'transparent', border: '1px solid var(--color-light-border-primary)' },
};

const DEV_SPEC: PropSpec[] = [
  { name: 'view', label: 'Вид', control: 'cycle', values: ['primary', 'secondary', 'colored', 'dropzone', 'border'] },
  { name: 'showSkeleton', label: 'Скелетон', control: 'toggle', default: true },
  { name: 'enableHover', label: 'Hover-анимация', control: 'toggle', default: true },
];

function BackgroundPlateContent({ view, showSkeleton, enableHover, children }: BackgroundPlateProps) {
  const [hovered, setHovered] = useState(false);
  const canHover = enableHover && view !== BackgroundPlateView.Border;

  return (
    <div
      style={{
        borderRadius: 'var(--border-radius-16)',
        padding: showSkeleton ? 0 : 'var(--gap-32)',
        transition: 'box-shadow 0.2s ease, transform 0.2s ease',
        boxShadow: canHover && hovered ? '0 8px 24px rgba(0,0,0,0.12)' : 'none',
        transform: canHover && hovered ? 'translateY(-2px)' : 'none',
        cursor: canHover ? 'pointer' : 'default',
        overflow: 'visible',
        ...viewStyles[view],
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Skeleton
        visible={!!showSkeleton}
        animate={false}
        style={{ background: 'var(--color-light-base-bg-secondary)' }}
        borderRadius={16}
      >
        {children}
      </Skeleton>
    </div>
  );
}

export function BackgroundPlate(props: BackgroundPlateProps) {
  const { children, onDuplicate, onDelete, addOptions, ...rest } = props;
  return (
    <DevPanelWrapper
      title="BackgroundPlate"
      spec={DEV_SPEC}
      baseProps={rest as Record<string, unknown>}
      onDuplicate={onDuplicate}
      onDelete={onDelete}
      addOptions={addOptions}
      render={(p) => (
        <BackgroundPlateContent {...(p as Omit<BackgroundPlateProps, 'children' | 'onDuplicate' | 'onDelete' | 'addOptions'>)}>
          {children}
        </BackgroundPlateContent>
      )}
    />
  );
}
