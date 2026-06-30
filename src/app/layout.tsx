import type { Metadata } from "next";
import "./globals.css";
import { ClientLayout } from "@/components/layout/ClientLayout";
import { ThemeProvider } from "@/components/ThemeProvider";

export const metadata: Metadata = {
  title: "Generation Flow | AI-Powered eCommerce",
  description: "Experience the future of shopping with our AI-first eCommerce platform.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="font-sans h-full antialiased"
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-background text-foreground selection:bg-brand-purple/30">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <main className="flex-1 relative flex flex-col">
            <ClientLayout>{children}</ClientLayout>
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
