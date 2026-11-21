"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Lays its children out at a fixed `width` and zooms them down to fit a narrower container, so a
 * letter-size sheet previews whole on a phone instead of being cropped. Zoom (unlike a transform)
 * shrinks the layout box too, so nothing below is left with a gap. Print always uses full size.
 */
export function FitToWidth({ width, className, children }: { width: number; className?: string; children: React.ReactNode }) {
  const outer = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  useEffect(() => {
    const el = outer.current;
    if (!el) return;
    const fit = () => setScale(Math.min(1, el.clientWidth / width));
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    return () => ro.disconnect();
  }, [width]);
  return (
    <div ref={outer} className="w-full">
      <div
        className={`[zoom:var(--fit)] print:w-auto! print:[zoom:1] ${className ?? ""}`}
        style={{ width: scale < 1 ? width : undefined, "--fit": scale } as React.CSSProperties}
      >
        {children}
      </div>
    </div>
  );
}
