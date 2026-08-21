import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard"
import { CheckIcon, CopyIcon, ExternalLinkIcon } from "lucide-react"
import type { ReactNode } from "react"
import { Link } from "react-router"
import { Badge } from "../ui/badge"
import { Button } from "../ui/button"

export function LinkBadge({ to, mode = 'copy', children }: { to: string, mode?: 'copy' | 'navigate', children: ReactNode }) {
  const { copyToClipboard, isCopied } = useCopyToClipboard()

  return (
    <Badge render={
      mode === 'navigate'
        ? <Link className="!no-underline" to={to} target="_blank">{children} <ExternalLinkIcon data-icon="inline-end" /></Link>
        : (
          <Button size="icon-xs" onClick={() => copyToClipboard(to)}>
            {children} {isCopied ? <CheckIcon data-icon="inline-end" /> : <CopyIcon data-icon="inline-end" />}
          </Button>
        )
    } />
  )
}
