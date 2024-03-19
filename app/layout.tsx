'use client'

import "./globals.css";
import { Inter } from "next/font/google";

import { cn } from "@/lib/utils";
import { Footer } from "@/components/ui/footer";
import { MainNav } from "@/components/ui/main-nav";
import MobileNotSupported from "@/components/ui/MobileNotSupported";
import { Providers } from "./providers";
import { TransactionModal } from "@/components/reusable/TransactionModal";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          inter.className
        )}
      >
        <Providers>
          <main className="flex flex-col min-h-screen items-center desktop-view">
            <div className="flex max-w-screen-md w-[745px] h-16 justify-start box-border">
              <MainNav className="mx-4 flex-1 max-w-screen-md" />
              <div className="ml-auto flex items-center space-x-4 mr-4">
                <w3m-button />
              </div>
            </div>
            {children}
            <Footer />
          </main>
          <MobileNotSupported />
          <TransactionModal />
        </Providers>
      </body>
    </html>
  );
}
