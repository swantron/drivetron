import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { FamilyProvider } from "@/components/FamilyProvider";
import { ToastProvider } from "@/components/ui/Toast";
import { ChunkLoadErrorHandler } from "@/components/ChunkLoadErrorHandler";

export const metadata: Metadata = {
  metadataBase: new URL("https://drivetron.app"),
  title: "Drivetron",
  description: "Supervised driving log for Montana learner drivers",
  manifest: "/manifest.json",
  // Family data only — keep it out of search results
  robots: { index: false, follow: false },
  appleWebApp: { capable: true, statusBarStyle: "default", title: "Drivetron" },
  icons: { icon: "/icons/icon.svg", apple: "/icons/icon-192x192.png" },
};

export const viewport: Viewport = {
  themeColor: "#059669",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <AuthProvider>
          <ChunkLoadErrorHandler />
          <FamilyProvider>
            <ToastProvider>{children}</ToastProvider>
          </FamilyProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
