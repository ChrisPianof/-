import { useState } from 'react';
import { Title } from '@alfalab/core-components/typography/title';
import { Text } from '@alfalab/core-components/typography/text';
import { Status } from '@alfalab/core-components/status';
import { DotsHorizontalMIcon } from '@alfalab/icons-glyph/DotsHorizontalMIcon';
import { EditableText } from '@local/devpanel';
import type { ReactNode } from 'react';

export const STATUS_COLOR_VALUES = ['green', 'orange', 'red', 'blue', 'grey', 'purple'] as const;
export type StatusColor = typeof STATUS_COLOR_VALUES[number];

export const STATUS_COLOR_LABELS = [
  'Approve',
  'Attention',
  'Action',
  'Process',
  'Error, Risk',
  'Neutral',
] as const;
export type StatusColorLabel = typeof STATUS_COLOR_LABELS[number];

export const STATUS_LABEL_TO_COLOR: Record<StatusColorLabel, StatusColor> = {
  'Approve':      'green',
  'Attention':    'orange',
  'Action':       'blue',
  'Process':      'purple',
  'Error, Risk':  'red',
  'Neutral':      'grey',
};

function DotsButton() {
  const [hover, setHover] = useState(false);
  return (
    <button
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        width: 56, height: 56, borderRadius: 'var(--border-radius-12)',
        background: hover ? 'rgba(15,25,55,0.16)' : 'rgba(15,25,55,0.1)',
        border: 'none', cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'background 0.15s',
      }}
    >
      <DotsHorizontalMIcon width={24} height={24} />
    </button>
  );
}

const STATUS_COLORS = {
  positive: '#0cc44d',
  negative: '#ef3124',
  attention: '#f6a821',
};

export type TitleViewProps = {
  heading: string;
  view?: 'xsmall' | 'small' | 'medium' | 'large' | 'xLarge';
  subtitle?: string;
  statusLabel?: string;
  statusColor?: StatusColor;
  leftAddon?: ReactNode;
  titleAddon?: ReactNode;
  rightAddon?: ReactNode;
  filterCompanySelectProps?: {
    options: { key: string; content: string }[];
    selected: { key: string }[];
    placeholder?: string;
  };
  titleStatusProps?: {
    type: 'positive' | 'negative' | 'attention';
    title: string;
    text: string;
  };
  buttonsGroup?: ReactNode;
  showSkeleton?: boolean;
  /** Inline-редактирование heading: при передаче heading становится редактируемым по двойному клику.
   * Коммит — на blur и Enter, отмена — Esc. Используется в DevPanel-обвязке. */
  onHeadingChange?: (value: string) => void;
  /** Inline-редактирование subtitle. Аналогично onHeadingChange. */
  onSubtitleChange?: (value: string) => void;
  /** Inline-редактирование statusLabel pill. */
  onStatusLabelChange?: (value: string) => void;
};

export function TitleView({
  heading,
  view = 'large',
  subtitle,
  statusLabel,
  statusColor = 'green',
  leftAddon,
  titleAddon,
  rightAddon,
  filterCompanySelectProps,
  titleStatusProps,
  buttonsGroup,
  showSkeleton,
  onHeadingChange,
  onSubtitleChange,
  onStatusLabelChange,
}: TitleViewProps) {
  // DS level mapping for prop `view` → Title component view + heading height
  // 'xLarge' → Title 'xlarge' (54/64, вне DS-иерархии)
  // 'large'  → Title 'large'  (40/48, DS xLarge — page heading)
  // 'medium' → Title 'medium' (30/36, DS Large)
  // 'small'  → Title 'small'  (22/26, DS Medium — внутри BgPlate)
  // 'xsmall' → Title 'xsmall' (18/22, DS Small — внутри BgPlate / IsleBlock)
  const titleView = view === 'xLarge' ? 'xlarge' : view;
  const HEADING_HEIGHTS = { xLarge: 56, large: 48, medium: 36, small: 26, xsmall: 22 } as const;
  if (showSkeleton) {
    const headingHeight = HEADING_HEIGHTS[view];
    const block = (w: number | string, h: number) => ({
      width: w, height: h,
      borderRadius: 'var(--border-radius-8)',
      background: 'rgba(15,25,55,0.08)',
    });

    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', width: '100%' }}>
        {statusLabel && (
          <div style={{ paddingBottom: 'var(--gap-12)' }}>
            <div style={block(96, 24)} />
          </div>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--gap-16)', width: '100%' }}>
          {leftAddon && <div style={block(20, 20)} />}
          <div style={block(420, headingHeight)} />
          {titleAddon && <div style={block(140, 28)} />}
          {rightAddon && <div style={{ marginLeft: 'auto', ...block(28, 28) }} />}
        </div>

        {filterCompanySelectProps && (
          <div style={{ paddingTop: 'var(--gap-8)' }}>
            <div style={block(140, 28)} />
          </div>
        )}

        {subtitle && (
          <div style={{ paddingTop: 'var(--gap-8)' }}>
            <div style={block(280, 24)} />
          </div>
        )}

        {titleStatusProps && (
          <div style={{ paddingTop: 'var(--gap-20)', paddingBottom: 'var(--gap-4)', maxWidth: 720, width: '100%' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--gap-8)' }}>
              <div style={block(240, 22)} />
              <div style={block(360, 20)} />
            </div>
          </div>
        )}

        {buttonsGroup && (
          <div style={{ paddingTop: 'var(--gap-24)', display: 'flex', gap: 'var(--gap-16)' }}>
            <div style={block(200, 56)} />
            <div style={block(200, 56)} />
            <div style={block(120, 56)} />
          </div>
        )}
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', width: '100%' }}>
      {statusLabel && (
        <div style={{ paddingBottom: 'var(--gap-12)' }}>
          <Status view="contrast" color={statusColor} size={24} shape="rounded" uppercase>
            <EditableText value={statusLabel} onChange={onStatusLabelChange} />
          </Status>
        </div>
      )}

      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--gap-16)', width: '100%' }}>
        {leftAddon && <span style={{ display: 'inline-flex', alignItems: 'center' }}>{leftAddon}</span>}
        <Title tag="h1" view={titleView} font="system">
          <EditableText value={heading} onChange={onHeadingChange} />
        </Title>
        {titleAddon && <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--gap-8)' }}>{titleAddon}</div>}
        {rightAddon && <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center' }}>{rightAddon}</div>}
      </div>

      {filterCompanySelectProps && (
        <div style={{ paddingTop: 'var(--gap-8)' }}>
          <button style={{
            display: 'flex', alignItems: 'center', gap: 'var(--gap-4)',
            background: 'rgba(15,25,55,0.1)', border: 'none',
            borderRadius: 'var(--border-radius-8)',
            padding: 'var(--gap-4) var(--gap-12)', cursor: 'pointer',
            fontFamily: 'var(--font-family-system)',
            fontSize: 14, color: 'var(--color-light-text-primary)',
          }}>
            {filterCompanySelectProps.placeholder ?? 'Компания'} ▾
          </button>
        </div>
      )}

      {subtitle && (
        <div style={{ paddingTop: 'var(--gap-8)' }}>
          <Text view="primary-medium" color="secondary">
            <EditableText value={subtitle} onChange={onSubtitleChange} />
          </Text>
        </div>
      )}

      {titleStatusProps && (
        <div style={{ paddingTop: 'var(--gap-20)', paddingBottom: 'var(--gap-4)', maxWidth: 720, width: '100%' }}>
          <div style={{
            borderLeft: `2px solid ${STATUS_COLORS[titleStatusProps.type]}`,
            paddingLeft: 'var(--gap-16)', paddingTop: 'var(--gap-4)', paddingBottom: 'var(--gap-4)',
            display: 'flex', flexDirection: 'column', gap: 'var(--gap-8)',
          }}>
            <Title tag="div" view="xsmall" font="system">{titleStatusProps.title}</Title>
            <Text view="primary-small" color="primary">{titleStatusProps.text}</Text>
          </div>
        </div>
      )}

      {buttonsGroup && (
        <div style={{ paddingTop: 'var(--gap-24)' }}>{buttonsGroup}</div>
      )}
    </div>
  );
}
