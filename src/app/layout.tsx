import type { Metadata } from "next";
import { AuthProvider } from "@/features/auth/AuthProvider";
import { ThemeRegistry } from "@/theme/ThemeRegistry";
import "./globals.css";

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
      <body>
        <ThemeRegistry>
          <AuthProvider>{children}</AuthProvider>
        </ThemeRegistry>
      </body>
    </html>
  );
}
