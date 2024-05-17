import {useState, useMemo} from "react";

export default function useKerosenePrice() {
  const [kerosenePrice, setKerosenePrice] = useState(0);

  useMemo(() => {
    async function _ETH2USD() {
      const res = await fetch(
        "https://api.coingecko.com/api/v3/coins/kerosene/tickers"
      );
      const data = await res.json();
      setKerosenePrice(data.tickers[0].converted_last.usd);
    }

    _ETH2USD();
  }, []);

  return {kerosenePrice};
}

