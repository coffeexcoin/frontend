import Link from "next/link";

import {cn} from "@/lib/utils";
import useEthPrice from "@/hooks/useEthPrice";

export function MainNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const {ethPrice} = useEthPrice();

  return (
    <nav
      className={cn(
        "flex justify-start items-center space-x-4 lg:space-x-6",
        className
      )}
      {...props}
    >
      <Link
        href="/"
        className="text-2xl font-bold transition-colors hover:text-primary"
      >
        DYAD
      </Link>
      <div className="flex text-gray-200">
        <div>ETH: $</div>
        <div>{ethPrice}</div>
      </div>
      {/* <div className="flex "> */}
      {/*   <div>KEROSENE DV: $</div> */}
      {/*   <div>{ethPrice}</div> */}
      {/* </div> */}
      {/* <Link */}
      {/*   href="/vaults" */}
      {/*   className="text-sm font-bold text-muted-foreground transition-colors hover:text-primary" */}
      {/* > */}
      {/*   Vaults */}
      {/* </Link> */}
      {/* <Link
        href="/notes"
        className="text-sm font-bold text-muted-foreground transition-colors hover:text-primary"
      >
        Notes
      </Link> */}
    </nav>
  );
}
