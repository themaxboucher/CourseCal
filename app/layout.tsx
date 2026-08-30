import { Analytics } from "@vercel/analytics/next";
import type { Metadata, Viewport } from "next";
import {
  Outfit,
  Merriweather,
  Caveat,
  Fredoka,
  Stick_No_Bills,
  Pixelify_Sans,
} from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const fredoka = Fredoka({
  variable: "--font-fredoka",
  subsets: ["latin"],
});

const merriweather = Merriweather({
  variable: "--font-merriweather",
  subsets: ["latin"],
});

const stickNoBills = Stick_No_Bills({
  variable: "--font-stick-no-bills",
  subsets: ["latin"],
});

const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
});

const pixelifySans = Pixelify_Sans({
  variable: "--font-pixelify-sans",
  subsets: ["latin"],
});

const sfPro = localFont({
  src: [
    {
      path: "../public/fonts/SF-Pro-Text-Semibold.otf",
      weight: "600",
      style: "normal",
    },
  ],
  variable: "--font-sf-pro",
});

const sfProSoft = localFont({
  src: [
    {
      path: "../public/fonts/SF-Pro-Semibold-Soft.otf",
      weight: "600",
      style: "normal",
    },
  ],
  variable: "--font-sf-pro-soft",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} - Compare your schedule with friends`,
    // Every nested page sets a bare page name; this is what turns it into a
    // tab title that still says whose app it is.
    template: `%s · ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  authors: [{ name: "Max Boucher", url: "https://maxboucher.com" }],
  creator: "Max Boucher",
  publisher: SITE_NAME,
  keywords: [
    "UCalgary schedule",
    "University of Calgary",
    "class schedule",
    "timetable",
    "schedule sharing",
    "student planner",
    "CourseCal",
  ],
  category: "education",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: `${SITE_NAME} - Compare your schedule with friends`,
    description: SITE_DESCRIPTION,
    url: "/",
    locale: "en_CA",
    // Image comes from `app/opengraph-image.tsx`.
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} - Compare your schedule with friends`,
    description: SITE_DESCRIPTION,
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon-192.png", type: "image/png", sizes: "192x192" },
      { url: "/icon-512.png", type: "image/png", sizes: "512x512" },
    ],
    apple: [{ url: "/apple-icon.png", sizes: "180x180" }],
  },
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: SITE_NAME,
    statusBarStyle: "default",
  },
  // Course codes and room numbers get mistaken for phone numbers and dates on
  // iOS, which then renders them as tappable blue links inside the schedule.
  formatDetection: { telephone: false, date: false, address: false },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export const viewport: Viewport = {
  // Matches `--background` in `globals.css` for each theme, so the browser
  // chrome on mobile blends into the page instead of flashing white.
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FFFFFF" },
    { media: "(prefers-color-scheme: dark)", color: "#09090B" },
  ],
  colorScheme: "light dark",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`
          ${outfit.variable} 
          ${fredoka.variable} 
          ${merriweather.variable} 
          ${caveat.variable} 
          ${pixelifySans.variable} 
          ${stickNoBills.variable} 
          ${sfPro.variable} 
          ${sfProSoft.variable} 
          font-sans antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
