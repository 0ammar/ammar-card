"use client";

import { useEffect, useState } from "react";
import styles from "./Intro.module.scss";

const NAME  = "AMMAR ARAB";
const TITLE = "SOFTWARE ENGINEER";

type Stage = "idle" | "line" | "name" | "title" | "leave";

export default function Intro({ onDone }: { onDone: () => void }) {
  const [stage,    setStage]    = useState<Stage>("idle");
  const [nameChars, setNameChars] = useState<{ ch: string; on: boolean }[]>(
    () => NAME.split("").map(ch => ({ ch, on: false }))
  );
  const [titleOn,  setTitleOn]  = useState(false);
  const [leaving,  setLeaving]  = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setStage("line"), 200);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (stage === "line") {
      const t = setTimeout(() => setStage("name"), 900);
      return () => clearTimeout(t);
    }

    if (stage === "name") {
      let i = 0;
      const reveal = () => {
        if (i >= NAME.length) { setStage("title"); return; }
        const idx = i++;
        setNameChars(prev => {
          const n = [...prev];
          n[idx] = { ...n[idx], on: true };
          return n;
        });
        setTimeout(reveal, NAME[idx] === " " ? 60 : 80);
      };
      const t = setTimeout(reveal, 100);
      return () => clearTimeout(t);
    }

    if (stage === "title") {
      const t1 = setTimeout(() => setTitleOn(true), 100);
      const t2 = setTimeout(() => setStage("leave"), 1200);
      return () => { clearTimeout(t1); clearTimeout(t2); };
    }

    if (stage === "leave") {
      const t = setTimeout(() => {
        setLeaving(true);
        setTimeout(onDone, 650);
      }, 80);
      return () => clearTimeout(t);
    }
  }, [stage, onDone]);

  return (
    <div className={`${styles.intro} ${leaving ? styles.leaving : ""}`} aria-hidden="true">

      <div className={styles.noise} />

      <div className={styles.cornerTL} />
      <div className={styles.cornerTR} />
      <div className={styles.cornerBL} />
      <div className={styles.cornerBR} />

      <div className={styles.hLine} data-active={stage !== "idle" ? "true" : "false"} />
      <div className={styles.vLine} data-active={stage !== "idle" ? "true" : "false"} />

      <div className={styles.center}>
        <p className={styles.name}>
          {nameChars.map((c, i) =>
            c.ch === " "
              ? <span key={i} className={styles.space} />
              : (
                <span
                  key={i}
                  className={`${styles.nameChar} ${c.on ? styles.nameOn : ""}`}
                  style={{ transitionDelay: `${i * 0.02}s` }}
                >
                  {c.ch}
                </span>
              )
          )}
        </p>

        <div className={`${styles.titleWrap} ${titleOn ? styles.titleOn : ""}`}>
          <span className={styles.titleLine} />
          <span className={styles.titleText}>{TITLE}</span>
          <span className={styles.titleLine} />
        </div>
      </div>

      <div className={`${styles.bottom} ${titleOn ? styles.bottomOn : ""}`}>
        <span className={styles.dot} />
        <span className={styles.bottomText}>ammararab.com</span>
        <span className={styles.dot} />
      </div>

    </div>
  );
}