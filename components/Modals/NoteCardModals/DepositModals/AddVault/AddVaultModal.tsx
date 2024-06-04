import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { ScrollArea } from "@/components/ui/scroll-area";
import { useReadContracts } from "wagmi";
import { Address } from "viem";
import {
  vaultManagerAbi,
  vaultManagerAddress,
  wEthVaultAbi,
} from "@/generated";
import { vaultInfo } from "@/lib/constants";
import { formatNumber, fromBigNumber } from "@/lib/utils";
import ButtonComponent from "@/components/reusable/ButtonComponent";
import { useTransactionStore } from "@/lib/store";
import { defaultChain } from "@/lib/config";
import { DialogClose } from "@/components/ui/dialog";

function AddVaultModal({
  vaults,
  tokenId,
}: {
  vaults: Address[];
  tokenId: string;
}) {
  const { data: assetPrices } = useReadContracts({
    contracts: vaults.map((vault) => ({
      address: vault,
      abi: wEthVaultAbi,
      functionName: "assetPrice",
    })),
    allowFailure: false,
  });

  const vaultSymbols = vaults.map(
    (vault) => vaultInfo.filter((info) => info.vaultAddress === vault)[0].symbol
  );

  if (vaults.length === 0) {
    return (
      <div className="flex flex-col gap-3">
        <div>You have added all available collateral types to your Note</div>
        <div className="w-[100px]">
          <DialogClose>
            <ButtonComponent>Close</ButtonComponent>
          </DialogClose>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="text-2xl font-semibold">
        Add new collateral type to your Note
      </div>
      <ScrollArea className="max-h-[600px]">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Collateral</TableHead>
              <TableHead>Oracle Price</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {vaults.map((address, i) => (
              <TableRow key={i}>
                <TableCell>{vaultSymbols[i]}</TableCell>
                <TableCell>
                  ${formatNumber(fromBigNumber(assetPrices?.at(i), 8))}
                </TableCell>
                <RowInput
                  tokenId={tokenId}
                  vaultAddress={address}
                  symbol={vaultSymbols[i]}
                />
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>
    </div>
  );
}

export default AddVaultModal;

const RowInput = ({
  tokenId,
  vaultAddress,
  symbol,
}: {
  tokenId: string;
  vaultAddress: Address;
  symbol: string;
}) => {
  const { setTransactionData } = useTransactionStore();
  return (
    <>
      <TableCell>
        <DialogClose>
          <ButtonComponent
            onClick={() =>
              setTransactionData({
                config: {
                  address: vaultManagerAddress[defaultChain.id],
                  abi: vaultManagerAbi,
                  functionName: "add",
                  args: [tokenId, vaultAddress],
                },
                description: `Add the ${symbol} vault to your Note Nº ${tokenId}`,
              })
            }
          >
            Add
          </ButtonComponent>
        </DialogClose>
      </TableCell>
    </>
  );
};
