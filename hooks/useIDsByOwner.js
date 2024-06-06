import {useContractReads} from "wagmi";
import {useEffect, useState} from "react";
import DnftAbi from "@/abis/DNft.json";
import {dNftAddress} from "@/generated";
import {defaultChain} from "@/lib/config";

export default function useIDsByOwner(owner, balance) {
  const [tokenIds, setTokenIds] = useState([]);
  const [calls, setCalls] = useState([]);

  const {refetch, data: tokens} = useContractReads({
    contracts: calls,
    // enabled: false,
    onSuccess: (data) => {
      setTokenIds(data);
    },
    select: (data) => {
      return data;
    },
  });

  useEffect(() => {
    let _calls = [];
    // for (let i = 0; i < parseInt(balance); i++) {
    for (let i = 0; i < balance; i++) {
      _calls.push({
        address: dNftAddress[defaultChain.id],
        functionName: "tokenOfOwnerByIndex",
        abi: DnftAbi,
        args: [owner, i],
      });
    }
    setCalls(_calls);
  }, [balance]);

  useEffect(() => {
    refetch();
    /**
     * If there are no calls to be made, we automatically know that there are
     * not any token ids to be fetched.
     */
    // calls.length > 0 ? refetch() : setTokenIds([]);
  }, [calls]);

  return {tokens};
}
