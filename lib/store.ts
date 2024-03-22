import { Address, Chain } from 'viem'

import { create } from 'zustand'

type TransactionConfig = {
  functionName: string
  address: Address
  abi: any
  args?: any[]
  value?: bigint
  chain?: Chain
  enabled?: boolean
}

type TransactionData = {
  config: TransactionConfig
  description: string
}

interface TransactionStore {
  transactionData?: TransactionData
  setTransactionData: (config: TransactionData | undefined) => void
}

export const useTransactionStore = create<TransactionStore>()((set) => ({
  transactionData: undefined,
  setTransactionData: (transactionData: TransactionData | undefined) =>
    set({ transactionData }),
}))
