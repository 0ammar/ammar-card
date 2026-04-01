import type { Metadata } from "next";
import { Providers } from "./providers";
import { Analytics } from "@vercel/analytics/react";
import { GoogleAnalytics } from "@next/third-parties/google";
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
    images: [{ url: "/me-7.png", width: 400, height: 400, alt: "Ammar Arab" }],
    type: "profile",
  },
  twitter: {
    card: "summary",
    title: "Ammar Arab — Software Engineer",
    description: "Building web & mobile applications end-to-end.",
    images: ["/me-7.png"],
  },
  alternates: { canonical: "https://ammararab.com" },
  icons: {
    icon: "/me-7.png",
    apple: "/me-7.png",
    shortcut: "/me-7.png",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Ammar Arab",
  jobTitle: "Software Engineer",
  email: "contact@ammararab.com",
  telephone: "+962788482930",
  url: "https://ammararab.com",
  image: "https://ammararab.com/me-7.png",
  sameAs: [
    "https://linkedin.com/in/0ammar",
    "https://github.com/0ammar",
    "https://portfolio.ammararab.com",
  ],
  knowsAbout: ["React.js", "Next.js", "TypeScript", "Node.js", "NestJS", "React Native"],
  address: { "@type": "PostalAddress", addressLocality: "Amman", addressCountry: "JO" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');if(t==='light'||t==='dark'){document.documentElement.setAttribute('data-theme',t);}else{document.documentElement.setAttribute('data-theme','dark');}}catch(e){document.documentElement.setAttribute('data-theme','dark');}})();`,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script","YOUR_CLARITY_ID");`,
          }}
        />
      </head>
      <body>
        <Providers>{children}</Providers>
        <Analytics />
      </body>
      <GoogleAnalytics gaId="G-75JC16C5LV" />
      </html>
  );
}