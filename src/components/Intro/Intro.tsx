"use client";
import { useEffect, useRef, useState } from "react";
import styles from "./Intro.module.scss";

const NAME = "AMMAR ARAB";
const SUB  = "SOFTWARE ENGINEER";

export default function Intro({ onDone }: { onDone: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [revealed, setRevealed] = useState<boolean[]>(() => Array(NAME.length).fill(false));
  const [subOn,    setSubOn]    = useState(false);
  const [barOn,    setBarOn]    = useState(false);
  const [leaving,  setLeaving]  = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    let W = (canvas.width  = window.innerWidth);
    let H = (canvas.height = window.innerHeight);

    const pts = Array.from({ length: 55 }, () => ({
      x:  Math.random() * W,
      y:  Math.random() * H,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
    }));

    const MAX_D = 130;
    let raf: number;

    const draw = () => {
      const bg = getComputedStyle(document.documentElement).getPropertyValue("--bg").trim() || "#0a0a0a";
      ctx.fillStyle = bg;
      ctx.globalAlpha = 1;
      ctx.fillRect(0, 0, W, H);

      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[i].x - pts[j].x;
          const dy = pts[i].y - pts[j].y;
          const d  = Math.sqrt(dx * dx + dy * dy);
          if (d < MAX_D) {
            ctx.globalAlpha = (1 - d / MAX_D) * 0.12;
            ctx.strokeStyle = "#3164f4";
            ctx.lineWidth   = 0.5;
            ctx.beginPath();
            ctx.moveTo(pts[i].x, pts[i].y);
            ctx.lineTo(pts[j].x, pts[j].y);
            ctx.stroke();
          }
        }
        ctx.globalAlpha = 0.35;
        ctx.fillStyle   = "#3164f4";
        ctx.beginPath();
        ctx.arc(pts[i].x, pts[i].y, 1.5, 0, Math.PI * 2);
        ctx.fill();
        pts[i].x += pts[i].vx;
        pts[i].y += pts[i].vy;
        if (pts[i].x < 0 || pts[i].x > W) pts[i].vx *= -1;
        if (pts[i].y < 0 || pts[i].y > H) pts[i].vy *= -1;
      }

      raf = requestAnimationFrame(draw);
    };

    const onResize = () => { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; };
    window.addEventListener("resize", onResize);
    raf = requestAnimationFrame(draw);

    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", onResize); };
  }, []);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];

    NAME.split("").forEach((_, i) => {
      timers.push(setTimeout(() => {
        setRevealed(prev => { const n = [...prev]; n[i] = true; return n; });
      }, 80 + i * 35));
    });

    const afterName = 80 + NAME.length * 35;

    timers.push(setTimeout(() => setBarOn(true),  afterName + 80));
    timers.push(setTimeout(() => setSubOn(true),   afterName + 180));
    timers.push(setTimeout(() => {
      setLeaving(true);
      setTimeout(onDone, 550);
    }, afterName + 1000));

    return () => timers.forEach(clearTimeout);
  }, [onDone]);

  return (
    <div className={`${styles.intro} ${leaving ? styles.leaving : ""}`} aria-hidden="true">
      <canvas ref={canvasRef} className={styles.canvas} />
      <div className={styles.vignette} />
      <div className={styles.center}>
        <h1 className={styles.name}>
          {NAME.split("").map((ch, i) => (
            <span
              key={i}
              className={[
                styles.char,
                revealed[i]  ? styles.revealed : "",
                ch === " "   ? styles.space    : "",
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