import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { formatUnits, parseUnits } from "viem";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function shortAddr(addr: string): string {
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

export function crColor(cr: number, max: number): string {
  try {
    switch (true) {
      case cr / max < 0.4:
        return "text-red-500";
      case cr / max < 0.7:
        return "text-yellow-500";
      case cr / max < 1:
        return "text-green-500";
      default:
        return "text-green-500";
    }
  } catch (error) {
    return "text-green-500";
  }
}

export const fromBigNumber = (
  number: bigint | string | undefined,
  decimals = 18
) => {
  if (!number || number === '.' || number === '0.') return 0
  if (typeof number === 'string') number = BigInt(number)
  return parseFloat(formatUnits(number, decimals))
}

export const toBigNumber = (number: number | string, decimals = 18) => {
  if (!number) return BigInt(0)
  return parseUnits(`${number}`, decimals)
}

const getLocale = () => {
  return typeof navigator !== 'undefined' ? navigator.language : 'en-US'
}

export const formatNumber = (amount: number | string, decimals = 2): string => {
  const locale = getLocale()
  const numberForm = parseFloat(`${amount}`)

  return new Intl.NumberFormat([locale, 'en-US'], {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(numberForm)
}
