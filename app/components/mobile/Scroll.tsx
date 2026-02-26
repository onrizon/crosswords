import styles from '@/styles/mobile/Scroll.module.css';
import classNames from 'classnames';
import type { ReactNode } from 'react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

const MIN_HEIGHT = 30;
const RELEVANCIA = 2;

interface ScrollProps {
  children: ReactNode;
  forceUpdate?: number;
  margin?: number;
  scale?: number;
  scrollBottom?: boolean;
  fixedTrack?: boolean;
}

function Scroll({
  children,
  forceUpdate = 0,
  margin = 4,
  scale = 1,
  scrollBottom = false,
  fixedTrack = false,
}: ScrollProps) {
  const [data, setData] = useState<{
    top: number;
    scroll: boolean;
    scrollType: string | null;
    height: number;
  }>({
    top: margin,
    scroll: false,
    scrollType: null,
    height: MIN_HEIGHT,
  });
  const [timerResize, setTimerResize] = useState<ReturnType<typeof setTimeout> | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);
  const scrollElements = useRef<HTMLDivElement>(null);
  const scrollTrack = useRef<HTMLDivElement>(null);

  const scrollBarPos = useCallback(() => {
    const el = scrollElements.current;
    if (!el) return;
    const { offsetHeight, scrollTop, scrollHeight } = el;
    const topMax = scrollHeight - offsetHeight;
    const height = Math.max(offsetHeight - topMax, MIN_HEIGHT);
    const top =
      margin +
      Math.ceil((offsetHeight - margin * 2 - height) * (scrollTop / topMax));

    let scrollType = null;
    if (topMax > RELEVANCIA) {
      if (scrollTop >= topMax - RELEVANCIA) scrollType = 'bottom';
      else if (scrollTop <= RELEVANCIA) scrollType = 'top';
      else scrollType = 'middle';

      setData({ top, scrollType, height, scroll: true });
    }
  }, [margin]);

  const calcHeight = useCallback(() => {
    const el = scrollElements.current;
    if (!el) return;
    const { offsetHeight, scrollHeight } = el;

    if (scrollHeight > offsetHeight) {
      scrollBarPos();
    } else setData((prev) => ({ ...prev, scroll: false }));
  }, [scrollBarPos]);

  const resize = useCallback(() => {
    if (timerResize) clearTimeout(timerResize);
    setTimerResize(setTimeout(() => calcHeight(), 100));
  }, [calcHeight, timerResize]);

  const scrollbarStart = useCallback(
    (e: React.MouseEvent | React.TouchEvent, touch = false, vertical = true, invertido = false) => {
      let elem: HTMLDivElement | null = null;
      let start = 0;
      let top = 0;
      let max = 0;
      let attrScroll = 'scrollTop' as const;
      let coord = 'clientY' as const;
      let dif = 0;

      if (vertical) {
        elem = scrollTrack.current;
        const ev = e as React.MouseEvent & React.TouchEvent;
        start = ev.touches ? ev.touches[0].clientY : ev.clientY;
        if (!elem || !scrollElements.current) return;
        top = elem.offsetTop;
        max = scrollElements.current.offsetHeight - elem.offsetHeight;
        attrScroll = 'scrollTop';
        coord = 'clientY';
        dif =
          scrollElements.current.scrollHeight -
          scrollElements.current.offsetHeight;
      }

      const move = (moveEv: MouseEvent | TouchEvent) => {
        const el = scrollElements.current;
        if (!el || elem === null) return;
        let pos: number;
        const moveCoord = (moveEv as TouchEvent).touches
          ? (moveEv as TouchEvent).touches[0][coord]
          : (moveEv as MouseEvent)[coord];
        if (!invertido)
          pos = top + (moveCoord - start) / scale;
        else
          pos = top + (start - moveCoord) / scale;

        if (pos <= 0) pos = 0;
        else if (pos >= max) pos = max;
        else moveEv.preventDefault();

        (el as unknown as Record<string, number>)[attrScroll] = (dif * pos) / max;
      };
      const end = () => {
        if (!touch) {
          document.removeEventListener('mousemove', move, false);
          document.removeEventListener('mouseup', end, false);
        } else {
          document.removeEventListener('touchmove', move, false);
          document.removeEventListener('touchend', end, false);
          document.removeEventListener('touchcancel', end, false);
        }
      };

      if (!touch) {
        document.addEventListener('mousemove', move, false);
        document.addEventListener('mouseup', end, false);
      } else {
        document.addEventListener('touchmove', move, false);
        document.addEventListener('touchend', end, false);
        document.addEventListener('touchcancel', end, false);
      }
    },
    [scale]
  );

  useEffect(() => {
    const track = scrollTrack.current;
    const elements = scrollElements.current;
    if (!track || !elements) return;

    const handleMouseDown = (e: MouseEvent) => {
      scrollbarStart(e as unknown as React.MouseEvent, false, true);
      e.stopPropagation();
      e.preventDefault();
    };
    const handleTouchStart = (e: TouchEvent) => {
      scrollbarStart(e as unknown as React.TouchEvent, true, true);
      e.stopPropagation();
      e.preventDefault();
    };
    const handleScroll = (e: Event) => {
      scrollBarPos();
      e.stopPropagation();
    };
    const handleWheel = (e: WheelEvent) => {
      const multiply = e.deltaMode === 1 ? 15 : 1;
      elements.scrollTop = elements.scrollTop + e.deltaY * scale * multiply;
      e.preventDefault();
    };

    track.addEventListener('mousedown', handleMouseDown, false);
    track.addEventListener('touchstart', handleTouchStart, false);
    elements.addEventListener('scroll', handleScroll, false);
    elements.addEventListener('wheel', handleWheel, false);
    window.addEventListener('resize', resize, false);

    return () => {
      if (timerResize) clearTimeout(timerResize);
      track.removeEventListener('mousedown', handleMouseDown, false);
      track.removeEventListener('touchstart', handleTouchStart, false);
      elements.removeEventListener('scroll', handleScroll, false);
      elements.removeEventListener('wheel', handleWheel, false);
      window.removeEventListener('resize', resize, false);
    };
  }, [resize, scale, scrollBarPos, scrollbarStart, timerResize]);

  useEffect(() => {
    const elem = scrollElements.current;
    if (elem && scrollBottom) elem.scrollTop = elem.scrollHeight;
    const id = requestAnimationFrame(() => calcHeight());
    return () => cancelAnimationFrame(id);
  }, [calcHeight, children, forceUpdate, scrollBottom]);

  return useMemo(
    () => (
      <div
        className={classNames(
          styles.scroll,
          { over: data.scroll || fixedTrack },
          data.scrollType
        )}
        ref={scrollRef}
      >
        <div className={styles.scrollElements} ref={scrollElements}>
          {children}
        </div>
      </div>
    ),
    [data.scroll, data.scrollType, children, fixedTrack]
  );
}

export default Scroll;