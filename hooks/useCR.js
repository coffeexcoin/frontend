import { useEffect, useState } from "react";
import useEthPrice from "./useEthPrice";

export default function useCR(
  usdValue,
  dyadMinted,
  newCollat = 0,
  newDebt = 0
) {
  const [cr, setCR] = useState(0);

  const { ethPrice } = useEthPrice();

  useEffect(() => {
    // to uint
    usdValue = parseFloat(usdValue) / 10 ** 18;
    dyadMinted = parseFloat(dyadMinted) / 10 ** 18;
    newCollat = parseFloat(newCollat);
    newDebt = parseFloat(newDebt);

    const amountAddedInEth = newCollat * ethPrice;
    const newUsdValue = usdValue + parseFloat(amountAddedInEth);
    dyadMinted = parseFloat(dyadMinted) + parseFloat(newDebt);
    const newCR = newUsdValue / dyadMinted;
    console.log("newCR", newCR);

    // check if not nan
    if (newCR !== newCR) {
      setCR(null);
    } else {
      setCR(newCR * 100);
    }
  }, [newCollat, newDebt]);

  return { cr };
}
