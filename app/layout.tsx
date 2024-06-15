import type { Metadata } from "next";
import { Figtree } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { Toaster } from "sonner";

import "./globals.css";

import { ThemeProvider } from "@/components/theme-provider";
import { cn } from "@/lib/utils";
import { InitialProfile } from "@/lib/InitialProfile";
import { EdgeStoreProvider } from "@/lib/edgestore";

const font = Figtree({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Spotify Clone",
  description: "Amazing Clone",
  icons: {
    icon: "/favicon.ico",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  await InitialProfile();
  return (
    <ClerkProvider appearance={{ baseTheme: dark }}>
      <html lang="en" suppressHydrationWarning>
        <body className={cn("dark:bg-black", font.className)}>
          <ThemeProvider
            attribute="class"
            forcedTheme="dark"
            disableTransitionOnChange
            storageKey="spotifyCloneTheme"
          >
            <EdgeStoreProvider>{children}</EdgeStoreProvider>
            <Toaster />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
