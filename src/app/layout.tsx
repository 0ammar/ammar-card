import type { Metadata } from "next";
import Script from "next/script";
import { Providers } from "./providers";
import "@/styles/globals.scss";

export const metadata: Metadata = {
  metadataBase: new URL("https://ammararab.com"),
  title: "Ammar Arab — Software Engineer",
  description: "Software Engineer specializing in React, Next.js, TypeScript, Node.js, NestJS, and React Native.",
  keywords: ["Ammar Arab", "Software Engineer", "React Developer", "Next.js", "TypeScript", "React Native", "Node.js", "NestJS", "Jordan", "Amman"],
  authors: [{ name: "Ammar Arab", url: "https://ammararab.com" }],
  robots: { index: true, follow: true },
  openGraph: {
    title: "Ammar Arab — Software Engineer",
    description: "Building web & mobile applications end-to-end.",
    url: "https://ammararab.com",
    siteName: "Ammar Arab",
    images: [{ url: "/me-1.png", width: 400, height: 400, alt: "Ammar Arab" }],
    type: "profile",
  },
  twitter: {
    card: "summary",
    title: "Ammar Arab — Software Engineer",
    description: "Building web & mobile applications end-to-end.",
    images: ["/me-1.png"],
  },
  alternates: { canonical: "https://ammararab.com" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Ammar Arab",
  jobTitle: "Software Engineer",
  email: "contact@ammararab.com",
  telephone: "+962788482930",
  url: "https://ammararab.com",
  image: "https://ammararab.com/me-1.png",
  sameAs: ["https://linkedin.com/in/0ammar", "https://github.com/0ammar"],
  knowsAbout: ["React.js", "Next.js", "TypeScript", "Node.js", "NestJS", "React Native"],
  address: { "@type": "PostalAddress", addressLocality: "Amman", addressCountry: "JO" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');if(t==='light'||t==='dark'){document.documentElement.setAttribute('data-theme',t);}else{var s=window.matchMedia('(prefers-color-scheme:dark)').matches?'dark':'light';document.documentElement.setAttribute('data-theme',s);}}catch(e){document.documentElement.setAttribute('data-theme','light');}})();`,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}