"use client";

import { useWeb3Modal } from "@web3modal/wagmi/react";
import { Button } from "./button";
import { useAccount } from "wagmi";

interface Props {
  className?: string;
}

export default function WalletButton({ className }: Props) {
  const { open } = useWeb3Modal();
  const { isConnected } = useAccount();
  
  if (isConnected) {
    return <w3m-account-button />;
  }

  return (
    <Button onClick={() => open()} className={className}>
      Connect Wallet
    </Button>
  );
}
