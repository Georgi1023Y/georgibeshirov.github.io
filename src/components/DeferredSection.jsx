import React, { useEffect, useRef, useState } from "react";

/**
 * Defers mounting heavy sections until near viewport.
 * Helps reduce initial JS work and improves Lighthouse performance.
 *
 * Do not put `visible` in the effect dependency array: when it flips true the effect
 * would re-run, churn observers, and can interact badly with layout + rAF (scroll/3D).
 */
const DeferredSection = ({ children, minHeight = 280, rootMargin = "300px" }) => {
  const anchorRef = useRef(null);
  const revealedRef = useRef(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (revealedRef.current) {
      return;
    }
    const el = anchorRef.current;
    if (!el) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          revealedRef.current = true;
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin, threshold: 0.01 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [rootMargin]);

  return (
    <div ref={anchorRef} style={{ minHeight: visible ? undefined : minHeight }}>
      {visible ? children : null}
    </div>
  );
};

export default DeferredSection;
