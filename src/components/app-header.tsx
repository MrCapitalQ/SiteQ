import { cn } from "@/lib/utils";
import { ChevronsRightIcon } from "lucide-react";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";

export function AppHeader({ title }: { title?: ReactNode }) {
	return (
		<header className="bg-background/75 sticky top-0 z-50 flex w-full h-(--header-height) items-center border-b backdrop-blur">
			<div className="flex w-full items-center gap-2 px-4 sm:px-8">
				<Link to={"/"} className="text-4xl font-extrabold no-underline">Q</Link>
				{title &&
					<>
						<ChevronsRightIcon />
						{title}
					</>
				}
			</div>
		</header>
	)
}

export function AppHeaderTitle({ className, ...props }: React.ComponentProps<"div">) {
	return <div className={cn("text-xl font-bold", className)}
		{...props} />
}
