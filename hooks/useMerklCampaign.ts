import { useEffect, useState } from "react";

type MerklCampaign = {
    apr: number;
    tvl: number;
    isLive: boolean;
}

export const useMerklCampaign = () => {

    const [merklData, setMerkleData] = useState<MerklCampaign | undefined>(undefined);

    useEffect(() => {
        async function getMerkl() {
            const res = await fetch("https://api.merkl.xyz/v3/campaigns?chainIds=1");
            const data = await res.json();
            const campaigns = data["1"]["2_0x8B238f615c1f312D22A65762bCf601a37f1EeEC7"];
            for (const campaign of Object.values(campaigns) as MerklCampaign[]) {
                if (campaign.isLive) {
                    setMerkleData(campaign);
                    break;
                }
            }
        }
        getMerkl();
    }, [])

    return { currentCampaign: merklData };
}