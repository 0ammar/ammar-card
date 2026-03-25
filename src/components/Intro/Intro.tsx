"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./Intro.module.scss";

const NAME = "AMMAR ARAB";
const SUB = "SOFTWARE ENGINEER";
const POOL = "ABCDEFGHIJKLMNOPQRSTUVWXYZ@#$%&01";
const pick = (s: string) => s[Math.floor(Math.random() * s.length)];

const CODE_LINES = [
  "const engineer = new FullStack({ passion: true });",
  "import { React, NextJS, TypeScript } from 'stack';",
  "git commit -m 'ship it clean, ship it fast'",
  "npm run build && vercel deploy --prod",
  "type Solution = Problem extends Hard ? Solved : Never;",
  "useEffect(() => { buildSomethingGreat(); }, []);",
  "export default function solve(problem) { return fix(it); }",
  "SELECT * FROM projects WHERE quality = 'high';",
  "const api = await fetch('/v1/make-it-work');",
  "interface Dev { skills: string[]; breaks: never; }",
  "git push origin main --force-with-lease",
  "const perf = lighthouse({ score: 100 });",
  "await Promise.all([design, code, deploy]);",
  "const bug = null;",
  "console.log('it works on my machine');",
  "return <Component style={{ perfect: true }} />;",
  "zsh: command not found: giving-up",
  "ssh root@server 'pm2 restart all'",
  "npx create-next-app@latest --typescript",
  "const ui = css`clean · minimal · pixel-perfect`;",
  "module.exports = { clean: true, fast: true };",
];

export default function Intro({ onDone }: { onDone: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouse = useRef({ x: 0, y: 0 });
  const [nameChars, setNameChars] = useState<string[]>(() => Array(NAME.length).fill("·"));
  const [locked, setLocked] = useState<boolean[]>(() => Array(NAME.length).fill(false));
  const [subOn, setSubOn] = useState(false);
  const [lineOn, setLineOn] = useState(false);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    let W = (canvas.width = window.innerWidth);
    let H = (canvas.height = window.innerHeight);

    const columns = Array.from({ length: 45 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      speed: 0.6 + Math.random() * 1.8,
      z: Math.random() * 0.5 + 0.5,
      text: CODE_LINES[Math.floor(Math.random() * CODE_LINES.length)],
    }));

    const draw = () => {
      const bg = getComputedStyle(document.documentElement).getPropertyValue("--bg").trim() || "#0a0a0a";
      ctx.fillStyle = bg;
      ctx.globalAlpha = 0.12;
      ctx.fillRect(0, 0, W, H);

      columns.forEach((col) => {
        ctx.globalAlpha = col.z * 0.35;
        ctx.font = `${Math.floor(13 * col.z)}px 'Fira Code', monospace`;
        ctx.fillStyle = "#3b82f6";

        const mx = (mouse.current.x - W / 2) * 0.015 * col.z;
        ctx.fillText(col.text, col.x + mx, col.y);

        col.y += col.speed;
        if (col.y > H + 50) {
          col.y = -30;
          col.x = Math.random() * W;
        }
      });

      raf = requestAnimationFrame(draw);
    };

    const handleMouse = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY };
    };

    window.addEventListener("mousemove", handleMouse);
    let raf = requestAnimationFrame(draw);

    const onResize = () => {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", handleMouse);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    let scramble: ReturnType<typeof setInterval> | null = null;
    let lockIdx = 0;
    const lockedArr = Array(NAME.length).fill(false);

    timers.push(setTimeout(() => setLineOn(true), 300));

    timers.push(
      setTimeout(() => {
        scramble = setInterval(() => {
          setNameChars((prev) => prev.map((_, i) => (lockedArr[i] ? NAME[i] : pick(POOL))));
        }, 45);
      }, 500)
    );

    const lockNext = () => {
      if (lockIdx >= NAME.length) {
        if (scramble) clearInterval(scramble);
        setLocked(Array(NAME.length).fill(true));
        timers.push(
          setTimeout(() => {
            setSubOn(true);
            timers.push(
              setTimeout(() => {
                setLeaving(true);
                setTimeout(onDone, 900);
              }, 1800)
            );
          }, 400)
        );
        return;
      }
      lockedArr[lockIdx] = true;
      setLocked([...lockedArr]);
      lockIdx++;
      timers.push(setTimeout(lockNext, 75));
    };

    timers.push(setTimeout(lockNext, 1200));

    return () => {
      timers.forEach(clearTimeout);
      if (scramble) clearInterval(scramble);
    };
  }, [onDone]);

  return (
    <div className={`${styles.intro} ${leaving ? styles.leaving : ""}`} aria-hidden="true">
      <canvas ref={canvasRef} className={styles.canvas} />
      <div className={styles.scanlines} />
      <div className={styles.vignette} />

      <div className={styles.center}>
        <div className={`${styles.line} ${lineOn ? styles.lineOn : ""}`} />
        <h1 className={styles.name}>
          {nameChars.map((ch, i) => (
            <span
              key={i}
              className={`${styles.char} ${locked[i] ? styles.charLocked : ""} ${
                NAME[i] === " " ? styles.charSpace : ""
              }`}
            >
              {ch}
            </span>
          ))}
        </h1>
        <div className={`${styles.line} ${lineOn ? styles.lineOn : ""}`} />
        <p className={`${styles.sub} ${subOn ? styles.subOn : ""}`}>{SUB}</p>
      </div>
    </div>
  );
}