"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { FaAddressBook, FaEnvelope, FaGithub, FaLinkedin, FaWhatsapp } from "react-icons/fa";
import { FiCopy, FiDownload, FiMoon, FiPhone, FiSun } from "react-icons/fi";
import {
  SiGit, SiJavascript, SiNestjs, SiNextdotjs,
  SiNodedotjs, SiPostgresql, SiPrisma, SiReact,
  SiRedux, SiSass, SiTailwindcss, SiTypescript, SiVercel,
} from "react-icons/si";
import { TbDeviceMobileCode } from "react-icons/tb";
import { useTheme } from "@/context/ThemeContext";
import { CONTACTS, PROFILE, TECH_STACK, type ActionId, type Phase } from "./page.logic";
import styles from "./page.module.scss";

const CONTACT_ICONS: Record<string, React.ReactNode> = {
  email: <FaEnvelope size={16} />,
  whatsapp: <FaWhatsapp size={16} />,
  linkedin: <FaLinkedin size={16} />,
  github: <FaGithub size={16} />,
  vcf: <FaAddressBook size={16} />,
};

const TECH_ICONS: Record<string, React.ReactNode> = {
  nextjs: <SiNextdotjs size={17} />,
  react: <SiReact size={17} />,
  typescript: <SiTypescript size={17} />,
  javascript: <SiJavascript size={17} />,
  nodejs: <SiNodedotjs size={17} />,
  nestjs: <SiNestjs size={17} />,
  reactnative: <TbDeviceMobileCode size={17} />,
  redux: <SiRedux size={17} />,
  tailwind: <SiTailwindcss size={17} />,
  scss: <SiSass size={17} />,
  postgresql: <SiPostgresql size={17} />,
  prisma: <SiPrisma size={17} />,
  git: <SiGit size={17} />,
  vercel: <SiVercel size={17} />,
};

function LoadingDot() {
  return (
    <span className={styles.loadingDot} aria-hidden="true">
      <span /><span /><span />
    </span>
  );
}

export default function Home() {
  const { theme, toggle, mounted } = useTheme();
  const [phase, setPhase] = useState<Phase>("hidden");
  const [copiedId, setCopiedId] = useState<ActionId>(null);
  const [loadingId, setLoadingId] = useState<ActionId>(null);
  const longPressRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setPhase("visible"), 80);
    return () => clearTimeout(t);
  }, []);

  const doCopy = useCallback(async (value: string) => {
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      const el = document.createElement("textarea");
      el.value = value;
      Object.assign(el.style, { position: "fixed", opacity: "0", pointerEvents: "none" });
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
    }
  }, []);

  const handleCopy = useCallback(async (id: string, value: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await doCopy(value);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1600);
  }, [doCopy]);

  const handleNavigate = useCallback((
    id: string, href: string, external: boolean, download: boolean,
    e: React.MouseEvent<HTMLAnchorElement>
  ) => {
    if (download) return;
    e.preventDefault();
    setLoadingId(id);
    setTimeout(() => {
      setLoadingId(null);
      if (external) window.open(href, "_blank", "noopener,noreferrer");
      else window.location.href = href;
    }, 520);
  }, []);

  const handleLongPressStart = useCallback((id: string, value: string | null) => {
    if (!value) return;
    longPressRef.current = setTimeout(async () => {
      await doCopy(value);
      setCopiedId(`long-${id}`);
      setTimeout(() => setCopiedId(null), 1600);
    }, 600);
  }, [doCopy]);

  const handleLongPressEnd = useCallback(() => {
    if (longPressRef.current) {
      clearTimeout(longPressRef.current);
      longPressRef.current = null;
    }
  }, []);

  return (
    <>
      {/* Corner buttons OUTSIDE card to avoid overflow clip */}
      <div className={styles.wrapper}>
        <button
          className={styles.themeToggle}
          onClick={toggle}
          aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          style={{ opacity: mounted ? 1 : 0 }}
        >
          <span className={styles.themeIcon} key={theme}>
            {theme === "dark" ? <FiSun size={13} /> : <FiMoon size={13} />}
          </span>
        </button>

        <a
          href={`tel:${PROFILE.phone}`}
          className={styles.callCorner}
          aria-label="Call Ammar"
          onClick={(e) => handleNavigate("call", `tel:${PROFILE.phone}`, false, false, e)}
        >
          {loadingId === "call" ? <LoadingDot /> : <FiPhone size={14} />}
        </a>

        <article
          className={`${styles.card} ${phase === "visible" ? styles.visible : ""}`}
          aria-label="Ammar Arab — Business Card"
          suppressHydrationWarning
        >
          <div className={styles.avatarOuter}>
            <figure className={styles.avatarWrap}>
              <Image src={PROFILE.avatar} alt="Ammar Arab" width={88} height={88} className={styles.avatar} priority />
            </figure>
          </div>

          <header className={styles.identity}>
            <h1 className={styles.name}>{PROFILE.name}</h1>
            <p className={styles.jobTitle}>{PROFILE.title}</p>
            <p className={styles.bio}>{PROFILE.bio}</p>
          </header>

          <div className={styles.resumeWrap}>
            <a
              href="/Ammar_Arab_Frontend_Developer.pdf"
              download
              className={styles.resumeBtn}
              aria-label="Download Resume"
              onClick={() => { setCopiedId("resume"); setTimeout(() => setCopiedId(null), 1600); }}
            >
              {loadingId === "resume"
                ? <LoadingDot />
                : <><FiDownload size={13} /><span>Resume</span></>
              }
              <span className={styles.resumeShineInner} aria-hidden="true" />
            </a>
            {copiedId === "resume" && (
              <div className={styles.successOverlay} aria-live="polite">
                <div className={styles.successCircle}>
                  <svg viewBox="0 0 52 52" className={styles.successSvg} aria-hidden="true">
                    <circle cx="26" cy="26" r="25" className={styles.successBg} />
                    <path d="M14 26 L22 34 L38 18" className={styles.successCheck} />
                  </svg>
                  <span className={styles.successText}>Downloaded!</span>
                </div>
              </div>
            )}
          </div>

          <hr className={styles.divider} aria-hidden="true" />

          <nav className={styles.contactList} aria-label="Contact links">
            {CONTACTS.map((c, i) => (
              <div key={c.id} className={styles.contactRow} style={{ animationDelay: `${i * 0.07}s` }}>
                <a
                  href={c.href}
                  className={`${styles.contactItem} ${loadingId === c.id ? styles.loading : ""}`}
                  style={{ "--item-color": c.color } as React.CSSProperties}
                  target={c.external ? "_blank" : undefined}
                  rel={c.external ? "noopener noreferrer" : undefined}
                  download={"download" in c && c.download ? true : undefined}
                  aria-label={c.label}
                  onClick={(e) => handleNavigate(c.id, c.href, c.external ?? false, ("download" in c && !!c.download) ?? false, e)}
                  onMouseDown={() => handleLongPressStart(c.id, c.copyValue ?? null)}
                  onMouseUp={handleLongPressEnd}
                  onMouseLeave={handleLongPressEnd}
                  onTouchStart={() => handleLongPressStart(c.id, c.copyValue ?? null)}
                  onTouchEnd={handleLongPressEnd}
                >
                  <span className={styles.contactIconWrap} style={{ background: c.bg } as React.CSSProperties}>
                    {loadingId === c.id ? <LoadingDot /> : CONTACT_ICONS[c.id]}
                  </span>
                  <div className={styles.contactContent}>
                    <span className={styles.contactLabel}>{c.label}</span>
                    <span className={styles.contactValue}>{c.value}</span>
                  </div>
                  {c.copyValue && (
                    <button
                      className={styles.copyBtn}
                      onClick={(e) => handleCopy(c.id, c.copyValue!, e)}
                      aria-label={`Copy ${c.label}`}
                      title="Copy"
                    >
                      <FiCopy size={12} />
                    </button>
                  )}
                </a>
                {(copiedId === c.id || copiedId === `long-${c.id}`) && (
                  <div className={styles.successOverlay} aria-live="polite">
                    <div className={styles.successCircle}>
                      <svg viewBox="0 0 52 52" className={styles.successSvg} aria-hidden="true">
                        <circle cx="26" cy="26" r="25" className={styles.successBg} />
                        <path d="M14 26 L22 34 L38 18" className={styles.successCheck} />
                      </svg>
                      <span className={styles.successText}>Copied!</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          <hr className={styles.divider} aria-hidden="true" />

          <section aria-label="Tech Stack" className={styles.section}>
            <span className={styles.label}>Stack</span>
            <ul className={styles.techRow}>
              {TECH_STACK.map((t) => (
                <li
                  key={t.id}
                  className={styles.techIcon}
                  style={{ "--tech-color": t.color, "--tech-bg": t.bg } as React.CSSProperties}
                >
                  {TECH_ICONS[t.id]}
                  <span className={styles.techTooltip}>{t.label}</span>
                </li>
              ))}
            </ul>
          </section>

          <footer className={styles.footer}>
            <small>{PROFILE.footer}</small>
          </footer>
        </article>
      </div>

    </>
  );
}