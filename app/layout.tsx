import type { Metadata } from "next";
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
  title: "CourseCal",
  description: "Easily compare your course schedule with friends.",
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
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
