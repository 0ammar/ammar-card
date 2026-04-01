"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import styles from "./NavigationLoader.module.scss";

interface NavigationLoaderProps {
  active:       boolean;
  label?:       string;
  minDuration?: number;
}

export default function NavigationLoader({ active, label = "LOADING", minDuration = 2000 }: NavigationLoaderProps) {
  const [visible,  setVisible]  = useState(false);
  const [leaving,  setLeaving]  = useState(false);
  const [progress, setProgress] = useState(0);
  const rafRef     = useRef<number | null>(null);
  const timerRef   = useRef<ReturnType<typeof setTimeout> | null>(null);
  const startedAt  = useRef<number>(0);

  const cancelAll = useCallback(() => {
    if (rafRef.current)   { cancelAnimationFrame(rafRef.current); rafRef.current = null; }
    if (timerRef.current) { clearTimeout(timerRef.current);       timerRef.current = null; }
  }, []);

  const dismiss = useCallback(() => {
    setProgress(100);
    timerRef.current = setTimeout(() => {
      setLeaving(true);
      timerRef.current = setTimeout(() => {
        setVisible(false);
        setLeaving(false);
        setProgress(0);
      }, 500);
    }, 120);
  }, []);

  useEffect(() => {
    if (active) {
      cancelAll();
      setVisible(true);
      setLeaving(false);
      setProgress(0);
      startedAt.current = Date.now();

      const tick = () => {
        setProgress(p => {
          if (p >= 100) return 100;
          if (p >= 92)  return p + 0.03;
          if (p >= 78)  return p + 0.2;
          if (p >= 55)  return p + 0.8;
          return p + 2.2;
        });
        rafRef.current = requestAnimationFrame(tick);
      };

      rafRef.current = requestAnimationFrame(tick);
      return cancelAll;
    }

    if (visible) {
      cancelAll();
      const elapsed   = Date.now() - startedAt.current;
      const remaining = Math.max(0, minDuration - elapsed);

      timerRef.current = setTimeout(() => {
        dismiss();
      }, remaining);

      return cancelAll;
    }
  }, [active]);

  useEffect(() => () => cancelAll(), []);

  if (!visible) return null;

  const pct = Math.min(100, Math.round(progress));

  return (
    <div className={`${styles.overlay} ${leaving ? styles.leaving : ""}`} aria-hidden="true">
      <div className={styles.bar}>
        <div className={styles.barFill} style={{ width: `${pct}%` }}>
          <div className={styles.barHead} />
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.rings}>
          <div className={styles.ringA} />
          <div className={styles.ringB} />
          <div className={styles.ringC}>
            <div className={styles.core} />
          </div>
        </div>
        <div className={styles.info}>
          <span className={styles.label}>{label}</span>
          <span className={styles.pct}>{pct}<small>%</small></span>
        </div>
      </div>

      <div className={styles.noise} />
    </div>
  );
}