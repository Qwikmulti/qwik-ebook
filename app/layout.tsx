import type { Metadata } from "next";
import { Playfair_Display, DM_Sans } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  weight: ["400", "600", "700"],
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const siteUrl = process.env.NEXTAUTH_URL ?? "https://your-domain.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Free UK Study Guide | Everything You Need to Know",
    template: "%s | UK Study Guide",
  },
  description:
    "Get your FREE comprehensive guide to studying and living in the United Kingdom. Step-by-step university admissions, student visa, accommodation, cost of living and more.",
  keywords: [
    "UK study guide",
    "study in UK",
    "UK student visa",
    "university admissions UK",
    "international students UK",
    "UK accommodation guide",
    "cost of living UK",
    "work while studying UK",
  ],
  authors: [{ name: "UK Study Guide" }],
  creator: "UK Study Guide",
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: siteUrl,
    siteName: "UK Study Guide",
    title: "Free UK Study & Travel Guide",
    description:
      "Your comprehensive free resource for studying and living in the United Kingdom — visas, universities, accommodation, and more.",
    images: [
      {
        url: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=1200&h=630&fit=crop&q=80",
        width: 1200,
        height: 630,
        alt: "London skyline — UK Study Guide",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free UK Study & Travel Guide",
    description:
      "Everything you need to study and thrive in the United Kingdom — download your free guide now.",
    images: [
      "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=1200&h=630&fit=crop&q=80",
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${playfair.variable} ${dmSans.variable}`}>
      <head>
        <meta name="theme-color" content="#0a0f1e" />
        <meta name="color-scheme" content="dark" />
        <link rel="preconnect" href="https://images.unsplash.com" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
      </head>
      <body style={{ fontFamily: "var(--font-body)" }}>
        {children}
        <Toaster
          position="top-right"
          expand={false}
          richColors
          toastOptions={{
            duration: 4000,
            style: {
              background: "#0f1629",
              border: "1px solid rgba(255,255,255,0.08)",
              color: "#e2e8f0",
              fontFamily: "var(--font-body)",
              fontSize: "14px",
              borderRadius: "12px",
            },
          }}
        />
      </body>
    </html>
  );
}
