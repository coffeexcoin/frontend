interface Deployment {
  dnft: string;
  vaultManagerSLL: string;
  vaultSLL: string;
  dyad: string;
  vaultManager: string;
  staking: string;
  vault: string;
  weth: string;
  wsteth: string;
  payments: string;
}

export const deployments: {[id: string]: Deployment} = {
  "1": {
    dnft: "0xDc400bBe0B8B79C07A962EA99a642F5819e3b712",
    vaultManagerSLL: "0x0686d75307040EE0C86790D0a62b6c95e3E857C9",
    vaultSLL: "0x25B716D9dCc09842413161abF0F3ff336d165a87",
    dyad: "0xfd03723a9a3abe0562451496a9a394d2c4bad4ab",
    vaultManager: "0x13421d816572f61048b2c855de88807aec58494b",
    staking: "0x9D5Fd41ee4A4A09c3135936C7B1595D6b3A779d3",
    vault: "0xcF97cEc1907CcF9d4A0DC4F492A3448eFc744F6c",
    weth: "0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6",
    kerosene: "0xf3768D6e78E65FC64b8F12ffc824452130BD5394",
    payments: "0x7363936FC85575Ff59D721B2B0171584880ba55B",
    wsteth: "0x7aE80418051b2897729Cbdf388b07C5158C557A1",
    vaults: [
      {
        address: "0x4fde0131694ae08c549118c595923ce0b42f8299",
        symbol: "ETH",
        asset: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
        isWrapped: false,
        requiresApproval: false,
      },
      {
        address: "0x7e5f2b8f089a4cd27f5b6b846306020800df45bd",
        symbol: "wstETH",
        asset: "0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0",
        isWrapped: true,
        requiresApproval: true,
      },
      {
        address: "0xf3768D6e78E65FC64b8F12ffc824452130BD5394",
        symbol: "KEROSENE",
        asset: "0x48600800502a8dc7a2c42f39b21f0326ad67dc4f",
        isWrapped: false,
        requiresApproval: true,
      },
    ],
  },
  // "5": {
  //   dnft: "0x952E31dFeEB29F5398a36602E0E276F2b09B6651",
  //   vaultManagerSLL: "0x0686d75307040EE0C86790D0a62b6c95e3E857C9",
  //   vaultSLL: "0x25B716D9dCc09842413161abF0F3ff336d165a87",
  //   dyad: "0xCf0c2d6aeD80aFD8cB299e7E7F3f311F81C3a766",
  //   vaultManager: "0xf3128Ac07005a5591dF997A8fBd6a75993827144",
  //   staking: "0x9D5Fd41ee4A4A09c3135936C7B1595D6b3A779d3",
  //   vault: "0xba9591e5e7AA188Bb2eEaC0D916F0173Dc5E4701",
  //   weth: "0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6",
  //   payments: "0x4CA5aF6eCaa88DF00f37EBf08D92F65a8f9192e5",
  //   wsteth: "0x3c97a8a0210076C2841d1Cf684FeC6234fB314C1",
  // },
};

export const MAX_UINT256 =
  "115792089237316195423570985008687907853269984665640564039457584007913129639935";

export const VAULTS = [
  {
    address: "0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6",
    symbol: "WETH",
    isWrapped: false,
  },
  {
    address: "0x7aE80418051b2897729Cbdf388b07C5158C557A1",
    symbol: "wstETH",
    isWrapped: true,
  },
  {
    address: "0xf3768D6e78E65FC64b8F12ffc824452130BD5394",
    symbol: "KEROSENE",
    isWrapped: false,
  },
];
