import { useDetectPlatform } from "@/hooks/use-detect-platform"
import { ExternalLinkIcon } from "lucide-react"
import { Link } from "react-router-dom"
import { Badge } from "../ui/badge"

export function InstallLinkBadge() {
  const url = 'https://jellyfin.mr-q.me/web/install.html'
  const platform = useDetectPlatform();

  return (
    <Badge className="my-1" render={
      platform.isEdge
        ? <Link to={url} target="_blank">Install Jellyfin <ExternalLinkIcon data-icon="inline-end" /></Link>
        : <Link to={`microsoft-edge:${url}`} target="_blank">Install Jellyfin in Edge <ExternalLinkIcon data-icon="inline-end" /></Link>
    } />
  )
}
