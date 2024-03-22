"use client";

import { ThemeProvider } from "@/components/theme-provider";
import {
  Client,
  Provider as UrqlProvider,
  cacheExchange,
  fetchExchange,
} from "urql";
import { NextUIProvider } from "@nextui-org/react";
import { ReactNode } from "react";
import { State, WagmiProvider } from "wagmi";
import { projectId, wagmiConfig } from "@/lib/config";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createWeb3Modal } from "@web3modal/wagmi";
import { ModalProvider } from "@/contexts/modal";

const queryClient = new QueryClient();

if (!projectId) throw new Error("Project ID is not defined");

createWeb3Modal({
  wagmiConfig,
  projectId,
  enableAnalytics: true,
  enableOnramp: true,
});

const client = new Client({
  url: process.env.NEXT_PUBLIC_SUBGRAPH_URL ?? "",
  exchanges: [cacheExchange, fetchExchange],
});

export const Providers = ({
  children,
}: {
  children: ReactNode;
}) => {
  return (
    <NextUIProvider>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
        <WagmiProvider config={wagmiConfig}>
          <QueryClientProvider client={queryClient}>
            <UrqlProvider value={client}>
              <ModalProvider>{children}</ModalProvider>
            </UrqlProvider>
          </QueryClientProvider>
        </WagmiProvider>
      </ThemeProvider>
    </NextUIProvider>
  );
};
