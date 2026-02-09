import { cn } from "@/lib/utils";
import { AlertTriangleIcon, CircleCheckIcon, CircleXIcon, InfoIcon } from "lucide-react";
import { Alert } from "./alert";

export function AlertInfo({ className, children, ...props }: React.ComponentProps<"div">) {
  return (
    <Alert className={cn("border-blue-500/50 bg-blue-500/20 text-blue-900 dark:text-blue-100", className)} {...props}>
      <InfoIcon />
      {children}
    </Alert>
  )
}

export function AlertSuccess({ className, children, ...props }: React.ComponentProps<"div">) {
  return (
    <Alert className={cn("border-green-500/50 bg-green-500/20 text-green-900 dark:text-green-100", className)} {...props}>
      <CircleCheckIcon />
      {children}
    </Alert>
  )
}

export function AlertWarning({ className, children, ...props }: React.ComponentProps<"div">) {
  return (
    <Alert className={cn("border-yellow-500/50 bg-yellow-500/20 text-yellow-900 dark:text-yellow-100", className)} {...props}>
      <AlertTriangleIcon />
      {children}
    </Alert>
  )
}

export function AlertError({ className, children, ...props }: React.ComponentProps<"div">) {
  return (
    <Alert className={cn("border-red-500/50 bg-red-500/20 text-red-900 dark:text-red-100", className)} {...props}>
      <CircleXIcon />
      {children}
    </Alert>
  )
}
