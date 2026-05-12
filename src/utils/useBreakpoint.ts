import { useMatchMedia } from '@alfalab/core-components/mq';
import MqList from '@alfalab/core-components-mq/mq.json.js';

export type DeviceType = 'mobile' | 'tablet' | 'desktop';

export function useBreakpoint() {
  const [isMobile] = useMatchMedia(MqList['--mobile'], false);
  const [isTablet] = useMatchMedia(MqList['--tablet'], false);
  const [isDesktopS] = useMatchMedia(MqList['--desktop-s'], false);

  const device: DeviceType = isDesktopS ? 'desktop' : isTablet ? 'tablet' : 'mobile';

  return { device, isMobile, isTablet, isDesktop: isDesktopS };
}
