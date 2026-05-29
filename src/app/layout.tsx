import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import { AuthProvider } from "@/features/auth/AuthProvider";
import { ThemeRegistry } from "@/theme/ThemeRegistry";
import "./globals.css";

const sansFont = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const displayFont = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
});

export const metadata: Metadata = {
  title: "RentalApp",
  description: "Rental-first house hunting platform.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${sansFont.variable} ${displayFont.variable}`}>
        <ThemeRegistry>
          <AuthProvider>{children}</AuthProvider>
        </ThemeRegistry>
      </body>
    </html>
  );
}
