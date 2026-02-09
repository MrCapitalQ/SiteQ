import { useDetectEdge } from "@/hooks/use-detect-edge"
import { ExternalLinkIcon } from "lucide-react"
import { Link } from "react-router-dom"
import { Button } from "../ui/button"

export function InstallLinkBadge() {
  const url = 'https://jellyfin.mr-q.me/web/install.html'
  const isEdge = useDetectEdge();

  return (
    <Button nativeButton={false} render={
      <Link to={isEdge ? url : `microsoft-edge:${url}`} target="_blank">
        Install Jellyfin {!isEdge && 'in Edge'} <ExternalLinkIcon data-icon="inline-end" />
      </Link>
    } />
  )
}
