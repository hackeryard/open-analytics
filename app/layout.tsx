import type { Metadata } from "next";
import "./globals.css";
import { PlatformProvider } from "@/components/PlatformContext";
import AppShell from "@/components/AppShell";

export const metadata: Metadata = {
  title: "Pulse Analytics | Standalone Multi-Tenant Web Observability",
  description: "Next-generation web analytics, Real User Monitoring, behavioral UX signals, and AI-powered crash triage.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-background text-foreground antialiased selection:bg-cyan-500/30 selection:text-cyan-200">
        <PlatformProvider>
          <AppShell>
            {children}
          </AppShell>
        </PlatformProvider>
      </body>
    </html>
  );
}
