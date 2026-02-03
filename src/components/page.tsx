import { cn } from "@/lib/utils";

export function Page({ className, ...props }: React.ComponentProps<"div">) {
    return (
        <div className={cn("h-full w-full p-8 sm:p-16", className)} {...props}></div>
    );
}
