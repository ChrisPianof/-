import { useState } from 'react';
import { Title } from '@alfalab/core-components/typography/title';
import { Text } from '@alfalab/core-components/typography/text';
import { DotsHorizontalMIcon } from '@alfalab/icons-glyph/DotsHorizontalMIcon';
import type { ReactNode } from 'react';

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
  view?: 'medium' | 'large' | 'xLarge';
  subtitle?: string;
  statusLabel?: string;
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
};

export function TitleView({
  heading,
  view = 'large',
  subtitle,
  statusLabel,
  titleAddon,
  rightAddon,
  filterCompanySelectProps,
  titleStatusProps,
  buttonsGroup,
  showSkeleton,
}: TitleViewProps) {
  if (showSkeleton) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: '100%' }}>
        {[300, 180, 240].map((w, i) => (
          <div key={i} style={{
            height: i === 0 ? 36 : 20, width: w,
            borderRadius: 8, background: 'rgba(15,25,55,0.08)',
          }} />
        ))}
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', width: '100%' }}>
      {statusLabel && (
        <div style={{ paddingBottom: 'var(--gap-12)' }}>
          <span style={{
            background: '#0cc44d', color: 'rgba(255,255,255,0.94)',
            fontSize: 11, fontWeight: 700, textTransform: 'uppercase',
            borderRadius: 'var(--border-radius-pill)',
            padding: 'var(--gap-4) var(--gap-12)',
            fontFamily: 'var(--font-family-system)',
          }}>
            {statusLabel}
          </span>
        </div>
      )}

      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--gap-16)', width: '100%' }}>
        <Title tag="h1" view={view === 'xLarge' ? 'xlarge' : view === 'medium' ? 'medium' : 'large'} font="system">
          {heading}
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
          <Text view="primary-medium" color="secondary">{subtitle}</Text>
        </div>
      )}

      {titleStatusProps && (
        <div style={{ paddingTop: 'var(--gap-20)', paddingBottom: 'var(--gap-4)', maxWidth: 720, width: '100%' }}>
          <div style={{
            borderLeft: `2px solid ${STATUS_COLORS[titleStatusProps.type]}`,
            paddingLeft: 'var(--gap-16)', paddingTop: 'var(--gap-4)', paddingBottom: 'var(--gap-4)',
            display: 'flex', flexDirection: 'column', gap: 'var(--gap-8)',
          }}>
            <Title tag="div" view="small" font="system">{titleStatusProps.title}</Title>
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
