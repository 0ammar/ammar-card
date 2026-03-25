"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./Intro.module.scss";

interface Particle {
    x: number; y: number;
    tx: number; ty: number;
    vx: number; vy: number;
    size: number;
    alpha: number;
    color: string;
    speed: number;
}

const ACCENT = "#2563eb";
const COLORS = [ACCENT, "#3b82f6", "#60a5fa", "#93c5fd", "#ffffff"];

function randBetween(a: number, b: number) {
    return a + Math.random() * (b - a);
}

export default function Intro({ onDone }: { onDone: () => void }) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [leaving, setLeaving] = useState(false);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let raf: number;
        let phase: "explode" | "pull" | "hold" | "shatter" | "done" = "explode";
        let phaseTimer = 0;
        const particles: Particle[] = [];
        const textParticles: Particle[] = [];

        const W = canvas.width = window.innerWidth;
        const H = canvas.height = window.innerHeight;

        const cx = W / 2;
        const cy = H / 2;

        const fontSize = Math.min(W * 0.12, 80);
        const fontSize2 = Math.min(W * 0.04, 24);

        ctx.font = `700 ${fontSize}px 'Space Grotesk', sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = "#fff";
        ctx.fillText("AMMAR ARAB", cx, cy - fontSize2);

        ctx.font = `500 ${fontSize2}px 'Inter', sans-serif`;
        ctx.fillStyle = ACCENT;
        ctx.fillText("SOFTWARE ENGINEER", cx, cy + fontSize * 0.65);

        const imgData = ctx.getImageData(0, 0, W, H);
        ctx.clearRect(0, 0, W, H);

        const STEP = Math.max(3, Math.floor(W / 220));
        for (let y = 0; y < H; y += STEP) {
            for (let x = 0; x < W; x += STEP) {
                const idx = (y * W + x) * 4;
                if (imgData.data[idx + 3] > 60) {
                    textParticles.push({
                        tx: x, ty: y,
                        x: randBetween(0, W),
                        y: randBetween(0, H),
                        vx: 0, vy: 0,
                        size: randBetween(1.2, 2.8),
                        alpha: 0,
                        color: COLORS[Math.floor(Math.random() * COLORS.length)],
                        speed: randBetween(0.06, 0.14),
                    });
                }
            }
        }

        for (let i = 0; i < 200; i++) {
            particles.push({
                x: randBetween(0, W), y: randBetween(0, H),
                tx: cx + randBetween(-W * 0.4, W * 0.4),
                ty: cy + randBetween(-H * 0.4, H * 0.4),
                vx: randBetween(-3, 3),
                vy: randBetween(-3, 3),
                size: randBetween(1, 3),
                alpha: 1,
                color: COLORS[Math.floor(Math.random() * COLORS.length)],
                speed: 0,
            });
        }

        let elapsed = 0;
        const lastTime = { val: performance.now() };

        const draw = (now: number) => {
            const dt = Math.min(now - lastTime.val, 32);
            lastTime.val = now;
            elapsed += dt;
            phaseTimer += dt;

            ctx.clearRect(0, 0, W, H);

            const bg = getComputedStyle(document.documentElement)
                .getPropertyValue("--bg").trim() || "#050505";
            ctx.fillStyle = bg;
            ctx.fillRect(0, 0, W, H);

            if (phase === "explode") {
                for (const p of particles) {
                    p.x += p.vx;
                    p.y += p.vy;
                    p.alpha = Math.max(0, p.alpha - 0.012);
                    ctx.globalAlpha = p.alpha;
                    ctx.fillStyle = p.color;
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                    ctx.fill();
                }
                for (const p of textParticles) {
                    p.alpha = Math.min(1, p.alpha + 0.018);
                    const t = p.speed;
                    p.x += (p.tx - p.x) * 0.04;
                    p.y += (p.ty - p.y) * 0.04;
                    ctx.globalAlpha = p.alpha * 0.3;
                    ctx.fillStyle = p.color;
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, p.size * 0.6, 0, Math.PI * 2);
                    ctx.fill();
                    void t;
                }
                if (phaseTimer > 600) { phase = "pull"; phaseTimer = 0; }

            } else if (phase === "pull") {
                for (const p of textParticles) {
                    p.x += (p.tx - p.x) * p.speed;
                    p.y += (p.ty - p.y) * p.speed;
                    p.alpha = Math.min(1, p.alpha + 0.03);
                    ctx.globalAlpha = p.alpha;
                    ctx.fillStyle = p.color;
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                    ctx.fill();
                }
                if (phaseTimer > 1000) { phase = "hold"; phaseTimer = 0; }

            } else if (phase === "hold") {
                for (const p of textParticles) {
                    p.x += (p.tx - p.x) * 0.2;
                    p.y += (p.ty - p.y) * 0.2;
                    const jitter = Math.sin(elapsed * 0.003 + p.tx) * 0.3;
                    ctx.globalAlpha = p.alpha;
                    ctx.fillStyle = p.color;
                    ctx.beginPath();
                    ctx.arc(p.x + jitter, p.y + jitter, p.size, 0, Math.PI * 2);
                    ctx.fill();
                }
                if (phaseTimer > 900) { phase = "shatter"; phaseTimer = 0; }

            } else if (phase === "shatter") {
                for (const p of textParticles) {
                    p.vx += randBetween(-0.4, 0.4);
                    p.vy += randBetween(-0.4, 0.4);
                    p.x += p.vx;
                    p.y += p.vy;
                    p.alpha = Math.max(0, p.alpha - 0.028);
                    ctx.globalAlpha = p.alpha;
                    ctx.fillStyle = p.color;
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                    ctx.fill();
                }
                if (phaseTimer > 600) { phase = "done"; }

            } else if (phase === "done") {
                ctx.globalAlpha = 0;
                ctx.clearRect(0, 0, W, H);
                cancelAnimationFrame(raf);
                setLeaving(true);
                setTimeout(onDone, 650);
                return;
            }

            ctx.globalAlpha = 1;
            raf = requestAnimationFrame(draw);
        };

        raf = requestAnimationFrame(draw);
        return () => cancelAnimationFrame(raf);
    }, [onDone]);

    return (
        <div className={`${styles.intro} ${leaving ? styles.leaving : ""}`} aria-hidden="true">
            <canvas ref={canvasRef} className={styles.canvas} />
        </div>
    );
}