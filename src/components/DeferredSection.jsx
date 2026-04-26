import React, { useEffect, useRef, useState } from "react";

/**
 * Defers mounting heavy sections until near viewport.
 * Helps reduce initial JS work and improves Lighthouse performance.
 */
const DeferredSection = ({ children, minHeight = 280, rootMargin = "300px" }) => {
  const anchorRef = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!anchorRef.current || visible) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin, threshold: 0.01 }
    );

    observer.observe(anchorRef.current);
    return () => observer.disconnect();
  }, [visible, rootMargin]);

  return (
    <div ref={anchorRef} style={{ minHeight: visible ? undefined : minHeight }}>
      {visible ? children : null}
    </div>
  );
};

export default DeferredSection;
