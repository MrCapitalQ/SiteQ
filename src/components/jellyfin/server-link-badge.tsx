import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard"
import { CheckIcon, CopyIcon, ExternalLinkIcon } from "lucide-react"
import { Link } from "react-router-dom"
import { Badge } from "../ui/badge"
import { Button } from "../ui/button"

export function ServerLinkBadge({ mode = 'copy' }: { mode?: 'copy' | 'navigate' }) {
  const url = 'https://jellyfin.mr-q.me'
  const { copyToClipboard, isCopied } = useCopyToClipboard()

  return (
    <Badge render={
      mode === 'navigate'
        ? <Link to={url} target="_blank">{url} <ExternalLinkIcon data-icon="inline-end" /></Link>
        : (
          <Button size="icon-xs" onClick={() => copyToClipboard(url)}>
            {url} {isCopied ? <CheckIcon data-icon="inline-end" /> : <CopyIcon data-icon="inline-end" />}
          </Button>
        )
    } />
  )
}
