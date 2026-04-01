"use client";

import { useEffect, useState, useRef } from "react";
import styles from "./NavigationLoader.module.scss";

interface NavigationLoaderProps {
  active: boolean;
  label?: string;
}

export default function NavigationLoader({ active, label = "LOADING" }: NavigationLoaderProps) {
  const [visible, setVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);
  const [progress, setProgress] = useState(0);
  const rafRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (active) {
      setVisible(true);
      setIsLeaving(false);
      setProgress(0);

      const start = Date.now();
      const simulate = () => {
        setProgress((prev) => {
          if (prev >= 94) return prev + 0.02;
          if (prev >= 75) return prev + 0.15;
          return prev + 1.8;
        });
        rafRef.current = requestAnimationFrame(simulate);
      };

      rafRef.current = requestAnimationFrame(simulate);
    } else if (visible) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      setProgress(100);
      setIsLeaving(true);
      
      const timer = setTimeout(() => {
        setVisible(false);
        setIsLeaving(false);
      }, 600);

      return () => clearTimeout(timer);
    }

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [active, visible]);

  if (!visible) return null;

  return (
    <div className={`${styles.overlay} ${isLeaving ? styles.leaving : ""}`} aria-hidden="true">
      <div className={styles.progressContainer}>
        <div className={styles.track} />
        <div className={styles.fill} style={{ width: `${progress}%` }}>
          <div className={styles.comet} />
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.visuals}>
          <div className={styles.ringOuter} />
          <div className={styles.ringMiddle} />
          <div className={styles.ringInner}>
            <div className={styles.core} />
          </div>
        </div>

        <div className={styles.status}>
          <span className={styles.label}>{label}</span>
          <span className={styles.percentage}>{Math.round(progress)}%</span>
        </div>
      </div>

      <div className={styles.noise} />
    </div>
  );
}