"use client";

import { useRef, useEffect, useState } from "react";
import styles from "./ParticleBackground.module.scss";

const COUNT = 70;
const MAX_D = 140;
const SPEED = 0.38;
const ACCENT = "#3164f4";

export default function ParticleBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [hidden, setHidden] = useState(false);

    useEffect(() => {
        const vv = window.visualViewport;
        if (!vv) return;
        const onViewport = () => setHidden(vv.scale > 1.05);
        vv.addEventListener("resize", onViewport);
        return () => vv.removeEventListener("resize", onViewport);
    }, []);

    useEffect(() => {
        if (hidden) return;
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d", { alpha: false });
        if (!ctx) return;

        let W = canvas.width = window.innerWidth;
        let H = canvas.height = window.innerHeight;

        type Pt = { x: number; y: number; vx: number; vy: number; r: number; pulse: number; pulseSpeed: number };

        const pts: Pt[] = Array.from({ length: COUNT }, () => ({
            x: Math.random() * W,
            y: Math.random() * H,
            vx: (Math.random() - 0.5) * SPEED,
            vy: (Math.random() - 0.5) * SPEED,
            r: Math.random() * 1.2 + 0.8,
            pulse: Math.random() * Math.PI * 2,
            pulseSpeed: Math.random() * 0.02 + 0.008,
        }));

        let raf: number;

        const draw = () => {
            const style = getComputedStyle(document.documentElement);
            const bg = style.getPropertyValue("--bg").trim() || "#0a0a0a";
            const isDark = bg.startsWith("#0") || bg === "rgb(10,10,10)";
            const baseAlpha = isDark ? 0.18 : 0.09;
            const dotAlpha = isDark ? 0.55 : 0.30;

            ctx.fillStyle = bg;
            ctx.globalAlpha = 1;
            ctx.fillRect(0, 0, W, H);

            for (let i = 0; i < pts.length; i++) {
                pts[i].pulse += pts[i].pulseSpeed;

                for (let j = i + 1; j < pts.length; j++) {
                    const dx = pts[i].x - pts[j].x;
                    const dy = pts[i].y - pts[j].y;
                    const d = Math.sqrt(dx * dx + dy * dy);
                    if (d < MAX_D) {
                        const alpha = (1 - d / MAX_D) * baseAlpha;
                        ctx.globalAlpha = alpha;
                        ctx.strokeStyle = ACCENT;
                        ctx.lineWidth = 0.7;
                        ctx.beginPath();
                        ctx.moveTo(pts[i].x, pts[i].y);
                        ctx.lineTo(pts[j].x, pts[j].y);
                        ctx.stroke();
                    }
                }

                const pulse = Math.sin(pts[i].pulse) * 0.4 + 0.6;
                ctx.globalAlpha = dotAlpha * pulse;
                ctx.fillStyle = ACCENT;
                ctx.beginPath();
                ctx.arc(pts[i].x, pts[i].y, pts[i].r * pulse, 0, Math.PI * 2);
                ctx.fill();

                pts[i].x += pts[i].vx;
                pts[i].y += pts[i].vy;
                if (pts[i].x < 0 || pts[i].x > W) pts[i].vx *= -1;
                if (pts[i].y < 0 || pts[i].y > H) pts[i].vy *= -1;
            }

            raf = requestAnimationFrame(draw);
        };

        const onResize = () => {
            W = canvas.width = window.innerWidth;
            H = canvas.height = window.innerHeight;
        };
        window.addEventListener("resize", onResize);
        raf = requestAnimationFrame(draw);

        return () => {
            cancelAnimationFrame(raf);
            window.removeEventListener("resize", onResize);
        };
    }, [hidden]);

    if (hidden) return null;

    return (
        <canvas
            ref={canvasRef}
            className={styles.canvas}
            aria-hidden="true"
        />
    );
}