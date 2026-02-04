import { cn } from "@/lib/utils";

export function Page({ className, ...props }: React.ComponentProps<"div">) {
    return (
        <div className={cn("h-full w-full max-w-4xl mx-auto p-4 sm:p-8", className)} {...props}></div>
    );
}
