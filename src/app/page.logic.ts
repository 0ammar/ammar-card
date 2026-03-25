export type Phase = "hidden" | "visible";
export type ActionId = string | null;

export const PROFILE = {
  name: "Ammar Arab",
  title: "Software Engineer",
  bio: "I care about the details most developers skip.",
  footer: "© 2026 Ammar Arab",
  phone: "+962788482930",
  avatar: "/me-7.png",
} as const;

export const CONTACTS = [
  {
    id: "email",
    label: "Email",
    value: "contact@ammararab.com",
    href: "mailto:contact@ammararab.com",
    copyValue: "contact@ammararab.com",
    color: "#EA4335",
    bg: "linear-gradient(135deg,#f28b82,#EA4335)",
    external: false,
  },
  {
    id: "whatsapp",
    label: "WhatsApp",
    value: "+962 788 482 930",
    href: "https://wa.me/962788482930",
    copyValue: "+962788482930",
    color: "#25D366",
    bg: "linear-gradient(135deg,#25d366,#128c7e)",
    external: true,
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    value: "linkedin.com/in/0ammar",
    href: "https://linkedin.com/in/0ammar",
    copyValue: "https://linkedin.com/in/0ammar",
    color: "#0A66C2",
    bg: "linear-gradient(135deg,#2196f3,#0A66C2)",
    external: true,
  },
  {
    id: "github",
    label: "GitHub",
    value: "github.com/0ammar",
    href: "https://github.com/0ammar",
    copyValue: "https://github.com/0ammar",
    color: "#24292F",
    bg: "linear-gradient(135deg,#6e7681,#24292F)",
    external: true,
  },
  {
    id: "vcf",
    label: "Add to Contacts",
    value: "Save my card",
    href: "/ammar.vcf",
    copyValue: null,
    color: "#0EA5E9",
    bg: "linear-gradient(135deg,#38bdf8,#0EA5E9)",
    external: false,
    download: true,
  },
] as const;

export const TECH_STACK = [
  { id: "nextjs", label: "Next.js", color: "#ffffff", bg: "#000000" },
  { id: "react", label: "React.js", color: "#ffffff", bg: "#06b6d4" },
  { id: "typescript", label: "TypeScript", color: "#ffffff", bg: "#3178C6" },
  { id: "javascript", label: "JavaScript", color: "#ffffff", bg: "#ca8a04" },
  { id: "nodejs", label: "Node.js", color: "#ffffff", bg: "#16a34a" },
  { id: "nestjs", label: "NestJS", color: "#ffffff", bg: "#E0234E" },
  { id: "reactnative", label: "React Native", color: "#ffffff", bg: "#7c3aed" },
  { id: "redux", label: "Redux", color: "#ffffff", bg: "#764ABC" },
  { id: "tailwind", label: "Tailwind", color: "#ffffff", bg: "#0891b2" },
  { id: "scss", label: "SCSS", color: "#ffffff", bg: "#CC6699" },
  { id: "postgresql", label: "PostgreSQL", color: "#ffffff", bg: "#4169E1" },
  { id: "git", label: "Git", color: "#ffffff", bg: "#F05032" },
] as const;
