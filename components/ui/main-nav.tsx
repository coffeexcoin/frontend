import Link from "next/link";

import { cn } from "@/lib/utils";

export function MainNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
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
