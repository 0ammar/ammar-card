"use client";

import { useEffect, useState } from "react";
import styles from "./Intro.module.scss";
import { ParticleBackground } from "@/components";

const NAME = "AMMAR ARAB";
const SUB = "SOFTWARE ENGINEER";

export default function Intro({ onDone }: { onDone: () => void }) {
  const [revealed, setRevealed] = useState<boolean[]>(() => Array(NAME.length).fill(false));
  const [subOn, setSubOn] = useState(false);
  const [barOn, setBarOn] = useState(false);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];

    NAME.split("").forEach((_, i) => {
      timers.push(setTimeout(() => {
        setRevealed(prev => { const n = [...prev]; n[i] = true; return n; });
      }, 80 + i * 35));
    });

    const afterName = 80 + NAME.length * 35;

    timers.push(setTimeout(() => setBarOn(true), afterName + 80));
    timers.push(setTimeout(() => setSubOn(true), afterName + 180));
    timers.push(setTimeout(() => {
      setLeaving(true);
      setTimeout(onDone, 550);
    }, afterName + 1000));

    return () => timers.forEach(clearTimeout);
  }, [onDone]);

  return (
    <div className={`${styles.intro} ${leaving ? styles.leaving : ""}`} aria-hidden="true">
      <ParticleBackground />
      <div className={styles.vignette} />
      <div className={styles.center}>
        <h1 className={styles.name}>
          {NAME.split("").map((ch, i) => (
            <span
              key={i}
              className={[
                styles.char,
                revealed[i] ? styles.revealed : "",
                ch === " " ? styles.space : "",
              ].join(" ")}
            >
              {ch}
            </span>
          ))}
        </h1>
        <div className={`${styles.bar} ${barOn ? styles.barOn : ""}`} />
        <p className={`${styles.sub} ${subOn ? styles.subOn : ""}`}>{SUB}</p>
      </div>
    </div>
  );
}