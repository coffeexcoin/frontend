"use client";

import { useState } from "react";
import { formatEther } from "viem";

// import { MintedNft_OrderBy, OrderDirection, useAllDnftMintsQuery } from "@/gql";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { shortAddr } from "@/lib/utils";

interface Props {
  className?: string;
}

const perPage = 15;

export default function ClaimsTable({ className }: Props) {
  // const [page, setPage] = useState(0);
  // const [sortBy, setSortBy] = useState<MintedNft_OrderBy>(
  //   MintedNft_OrderBy.DNftId
  // );
  // const [sortDir, setSortDir] = useState<OrderDirection>(OrderDirection.Asc);
  // const [filterOwned, setFilterOwned] = useState<boolean>(false);

  // const { pushModal } = useModal();
  // const [{ data }] = useAllDnftMintsQuery({
  //   variables: {
  //     numResults: perPage,
  //     skip: page * perPage,
  //     orderBy: sortBy,
  //     orderDirection: sortDir,
  //   },
  // });

  // const openModal = useCallback(() => {
  //   pushModal(
  //     <DnftModalContent
  //       dnft={{
  //         id: "0",
  //         minter: `0x${"0".repeat(40)}`,
  //         price: parseEther("0.97").toString(),
  //       }}
  //     />
  //   );
  // }, [pushModal]);

  // const handleHeaderClick = (id: MintedNft_OrderBy) => {
  //   if (id === sortBy) {
  //     setSortDir(
  //       sortDir === OrderDirection.Asc
  //         ? OrderDirection.Desc
  //         : OrderDirection.Asc
  //     );
  //   } else {
  //     setSortBy(id);
  //     setSortDir(OrderDirection.Asc);
  //   }
  // };

  // const crColor = (cr: number): string => {
  //   switch (true) {
  //     case cr < 20:
  //       return "text-red-500";
  //     case cr < 30:
  //       return "text-yellow-500";
  //     case cr < 40:
  //       return "text-green-500";
  //     default:
  //       return "text-green-500";
  //   }
  // };

  return (
    <div className={className}>
      {/* <div className="flex flex-row gap-3 px-2 pb-3">
        <p
          onClick={() => setFilterOwned(false)}
          className={`text-sm ${
            !filterOwned ? "text-foreground" : "text-muted-foreground"
          } cursor-pointer`}
        >
          All
        </p>
        <p
          onClick={() => setFilterOwned(true)}
          className={`text-sm ${
            filterOwned ? "text-foreground" : "text-muted-foreground"
          } cursor-pointer`}
        >
          Mine
        </p>
      </div>
      <Separator />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">User</TableHead>
            <TableHead>dNFT ID</TableHead>
            <TableHead>Contribution</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.mintedNfts.map((mint) => (
            <TableRow key={mint.DNft_id}>
              <TableCell className="font-medium">
                {shortAddr(mint.to)}
              </TableCell>
              <TableCell>#{mint.DNft_id}</TableCell>
              <TableCell>{formatEther(mint.price)} ETH</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="w-full max-w-none flex justify-center align-center mt-4 gap-8">
        <div className="w-8 text-center">
          {page !== 0 && (
            <p
              className="text-md text-muted-foreground hover:text-foreground cursor-pointer"
              onClick={() => setPage(page - 1)}
            >
              prev
            </p>
          )}
        </div>
        <p className="text-md text-center">{page + 1}</p>
        <div className="w-8 text-center">
          {data?.mintedNfts.length === perPage && (
            <p
              className="text-md text-muted-foreground hover:text-foreground cursor-pointer justify-self-end"
              onClick={() => setPage(page + 1)}
            >
              next
            </p>
          )}
        </div>
      </div> */}
    </div>
  );
}
