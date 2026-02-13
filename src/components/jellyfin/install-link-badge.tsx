import { ExternalLinkIcon } from "lucide-react"
import { Link } from "react-router-dom"
import { Button } from "../ui/button"

export function InstallLinkBadge() {
  const url = 'https://jellyfin.mr-q.me/web/install.html'

  return (
    <Button nativeButton={false} render={
      <Link to={url} target="_blank">
        Install Jellyfin <ExternalLinkIcon data-icon="inline-end" />
      </Link>
    } />
  )
}
