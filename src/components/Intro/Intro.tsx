"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./Intro.module.scss";

const FINAL = "AMMAR.ARAB";
const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&";

function rand(arr: string) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export default function Intro({ onDone }: { onDone: () => void }) {
  const [display,  setDisplay]  = useState(() => Array(FINAL.length).fill("·").join(""));
  const [locked,   setLocked]   = useState<boolean[]>(Array(FINAL.length).fill(false));
  const [phase,    setPhase]    = useState<"scramble" | "lock" | "hold" | "leave">("scramble");
  const [leaving,  setLeaving]  = useState(false);
  const [subtitle, setSubtitle] = useState(false);
  const frameRef  = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lockIndex = useRef(0);

  // Phase 1 — scramble random chars for 800ms
  useEffect(() => {
    if (phase !== "scramble") return;
    let elapsed = 0;
    const tick = () => {
      setDisplay(
        Array.from({ length: FINAL.length }, (_, i) =>
          locked.current?.[i] ? FINAL[i] : rand(CHARS)
        ).join("")
      );
      elapsed += 40;
      if (elapsed < 800) {
        frameRef.current = setTimeout(tick, 40);
      } else {
        setPhase("lock");
      }
    };
    frameRef.current = setTimeout(tick, 40);
    return () => { if (frameRef.current) clearTimeout(frameRef.current); };
  }, [phase]);

  // Phase 2 — lock characters one by one
  const lockedRef = useRef<boolean[]>(Array(FINAL.length).fill(false));
  useEffect(() => {
    if (phase !== "lock") return;
    const lockNext = () => {
      const i = lockIndex.current;
      if (i >= FINAL.length) {
        setPhase("hold");
        return;
      }
      lockedRef.current = [...lockedRef.current];
      lockedRef.current[i] = true;
      lockIndex.current = i + 1;
      setLocked([...lockedRef.current]);
      setDisplay(prev =>
        prev.split("").map((c, idx) =>
          lockedRef.current[idx] ? FINAL[idx] : rand(CHARS)
        ).join("")
      );
      frameRef.current = setTimeout(lockNext, 60);
    };
    frameRef.current = setTimeout(lockNext, 60);
    return () => { if (frameRef.current) clearTimeout(frameRef.current); };
  }, [phase]);

  // Phase 3 — hold, show subtitle, then leave
  useEffect(() => {
    if (phase !== "hold") return;
    setDisplay(FINAL);
    const t1 = setTimeout(() => setSubtitle(true), 200);
    const t2 = setTimeout(() => {
      setLeaving(true);
      setTimeout(onDone, 700);
    }, 1200);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [phase, onDone]);

  return (
    <div className={`${styles.intro} ${leaving ? styles.leaving : ""}`} aria-hidden="true">
      <div className={styles.grid} />
      <div className={styles.inner}>
        <p className={styles.text}>
          {display.split("").map((ch, i) => (
            <span
              key={i}
              className={`${styles.char} ${lockedRef.current[i] ? styles.locked : ""} ${ch === "." ? styles.dot : ""}`}
            >
              {ch}
            </span>
          ))}
          <span className={styles.cursor} />
        </p>
        <span className={`${styles.sub} ${subtitle ? styles.subVisible : ""}`}>
          software engineer
        </span>
      </div>
      <div className={`${styles.line} ${styles.lineTop}`} />
      <div className={`${styles.line} ${styles.lineBottom}`} />
    </div>
  );
}