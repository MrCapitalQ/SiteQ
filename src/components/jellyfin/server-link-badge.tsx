import { LinkBadge } from "./link-badge"

export function ServerLinkBadge({ mode = 'copy' }: { mode?: 'copy' | 'navigate' }) {
  const url = 'https://jellyfin.mr-q.me'

  return (
    <LinkBadge to={url} mode={mode}>{url}</LinkBadge>
  )
}
