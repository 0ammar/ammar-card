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
    "// TODO: sleep (never merged)",
    "const bug = null; // fixed 2:47am",
    "border: 1px solid red; /* debug mode */",
    "console.log('it works on my machine');",
    "return <Component style={{ perfect: true }} />;",
    "zsh: command not found: giving-up",
    "ssh root@server 'pm2 restart all'",
    "npx create-next-app@latest --typescript",
    "const ui = css`clean · minimal · pixel-perfect`;",
    "module.exports = { clean: true, fast: true };",
    "yarn add framer-motion && animate everything",
    "docker build -t ammararab/app:latest .",
];

interface Column {
    x: number;
    y: number;
    speed: number;
    lineIdx: number;
    alpha: number;
    fontSize: number;
}

export default function Intro({ onDone }: { onDone: () => void }) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [nameChars, setNameChars] = useState<string[]>(() => Array(NAME.length).fill("·"));
    const [subChars, setSubChars] = useState<string[]>(() => Array(SUB.length).fill(" "));
    const [locked, setLocked] = useState<boolean[]>(() => Array(NAME.length).fill(false));
    const [subOn, setSubOn] = useState(false);
    const [lineOn, setLineOn] = useState(false);
    const [leaving, setLeaving] = useState(false);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let raf: number;
        let W = canvas.width = window.innerWidth;
        let H = canvas.height = window.innerHeight;
        const columns: Column[] = [];

        const isLight = () => {
            const bg = getComputedStyle(document.documentElement).getPropertyValue("--bg").trim();
            return bg === "#ffffff" || bg.startsWith("#f");
        };

        const buildColumns = () => {
            columns.length = 0;
            const spacing = 260;
            const count = Math.ceil(W / spacing) + 2;
            for (let i = 0; i < count; i++) {
                columns.push({
                    x: (W / count) * i + Math.random() * 30 - 15,
                    y: Math.random() * H - H,
                    speed: 0.4 + Math.random() * 0.5,
                    lineIdx: Math.floor(Math.random() * CODE_LINES.length),
                    alpha: 0.5 + Math.random() * 0.4,
                    fontSize: 12 + Math.floor(Math.random() * 3),
                });
            }
        };

        buildColumns();

        const draw = () => {
            const light = isLight();
            const bg = getComputedStyle(document.documentElement).getPropertyValue("--bg").trim() || (light ? "#ffffff" : "#0a0a0a");

            ctx.fillStyle = bg;
            ctx.fillRect(0, 0, W, H);

            for (const col of columns) {
                col.y += col.speed;
                if (col.y > H + 80) {
                    col.y = -60;
                    col.lineIdx = Math.floor(Math.random() * CODE_LINES.length);
                    col.alpha = 0.5 + Math.random() * 0.4;
                }

                ctx.font = `${col.fontSize}px 'Fira Code', 'Courier New', monospace`;
                ctx.globalAlpha = col.alpha;
                ctx.shadowBlur = col.alpha > 0.75 ? 8 : 0;
                ctx.shadowColor = "#3b82f6";
                ctx.fillStyle = light
                    ? col.alpha > 0.75 ? "rgba(29, 78, 216, 0.9)" : "rgba(30, 64, 175, 0.65)"
                    : col.alpha > 0.75 ? "rgba(147, 197, 253, 0.95)" : "rgba(96, 165, 250, 0.65)";

                ctx.fillText(CODE_LINES[col.lineIdx], col.x, col.y);
                ctx.shadowBlur = 0;
            }

            ctx.globalAlpha = 1;

            const grad = ctx.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, Math.max(W, H) * 0.7);
            grad.addColorStop(0, light ? "rgba(255,255,255,0.72)" : "rgba(10,10,10,0.72)");
            grad.addColorStop(0.5, light ? "rgba(255,255,255,0.5)" : "rgba(10,10,10,0.5)");
            grad.addColorStop(1, light ? "rgba(255,255,255,0.1)" : "rgba(10,10,10,0.1)");
            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, W, H);

            raf = requestAnimationFrame(draw);
        };

        draw();

        const onResize = () => {
            W = canvas.width = window.innerWidth;
            H = canvas.height = window.innerHeight;
            buildColumns();
        };
        window.addEventListener("resize", onResize);
        return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", onResize); };
    }, []);

    useEffect(() => {
        const timers: ReturnType<typeof setTimeout>[] = [];
        let scramble: ReturnType<typeof setInterval> | null = null;
        let lockIdx = 0;
        const lockedArr = Array(NAME.length).fill(false);

        timers.push(setTimeout(() => setLineOn(true), 300));

        timers.push(setTimeout(() => {
            scramble = setInterval(() => {
                setNameChars(prev => prev.map((_, i) => lockedArr[i] ? NAME[i] : pick(POOL)));
            }, 40);
        }, 500));

        const lockNext = () => {
            if (lockIdx >= NAME.length) {
                if (scramble) clearInterval(scramble);
                setNameChars(NAME.split(""));
                setLocked(Array(NAME.length).fill(true));

                timers.push(setTimeout(() => {
                    setSubOn(true);
                    let si = 0;
                    const revealSub = () => {
                        if (si >= SUB.length) {
                            timers.push(setTimeout(() => { setLeaving(true); setTimeout(onDone, 800); }, 1600));
                            return;
                        }
                        const idx = si++;
                        setSubChars(prev => { const n = [...prev]; n[idx] = SUB[idx]; return n; });
                        timers.push(setTimeout(revealSub, SUB[idx] === " " ? 40 : 55));
                    };
                    timers.push(setTimeout(revealSub, 150));
                }, 250));
                return;
            }

            const i = lockIdx++;
            lockedArr[i] = true;
            setLocked([...lockedArr]);
            setNameChars(prev => { const n = [...prev]; n[i] = NAME[i]; return n; });
            timers.push(setTimeout(lockNext, 65));
        };

        timers.push(setTimeout(lockNext, 1000));

        return () => { timers.forEach(clearTimeout); if (scramble) clearInterval(scramble); };
    }, [onDone]);

    return (
        <div className={`${styles.intro} ${leaving ? styles.leaving : ""}`} aria-hidden="true">
            <canvas ref={canvasRef} className={styles.canvas} />
            <div className={styles.scanlines} />
            <div className={styles.vignette} />

            <div className={styles.center}>
                <div className={`${styles.line} ${lineOn ? styles.lineOn : ""}`} />

                <p className={styles.name}>
                    {nameChars.map((ch, i) => (
                        <span
                            key={i}
                            className={[
                                styles.char,
                                locked[i] ? styles.charLocked : "",
                                NAME[i] === " " ? styles.charSpace : "",
                            ].filter(Boolean).join(" ")}
                        >
                            {ch}
                        </span>
                    ))}
                </p>

                <div className={`${styles.line} ${lineOn ? styles.lineOn : ""}`} />

                <p className={`${styles.sub} ${subOn ? styles.subOn : ""}`}>
                    {subChars.map((ch, i) => (
                        <span
                            key={i}
                            className={`${styles.subChar} ${ch !== " " && ch !== "" ? styles.subCharOn : ""}`}
                        >
                            {ch === " " ? "\u00A0" : ch}
                        </span>
                    ))}
                </p>
            </div>
        </div>
    );
}