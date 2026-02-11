import { ChevronRightIcon, ConciergeBellIcon, HammerIcon, KeyRoundIcon, MessageSquareWarningIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { Item, ItemActions, ItemContent, ItemDescription, ItemMedia, ItemTitle } from "../ui/item";
import { Page } from "../ui/page";

const items = [
  {
    link: "/jellyfin/setup",
    icon: <HammerIcon />,
    title: "Setup Guide",
    description: "Get set up and start streaming movies and TV shows on your devices."
  },
  {
    link: "/jellyfin/requests",
    icon: <ConciergeBellIcon />,
    title: "Requests",
    description: "Learn how to request new movies and TV shows to watch."
  },
  {
    link: "/jellyfin/issues",
    icon: <MessageSquareWarningIcon />,
    title: "Report Issues",
    description: "Report problems with movies and TV shows."
  },
  {
    link: "/jellyfin/security",
    icon: <KeyRoundIcon />,
    title: "Sign-in and Security",
    description: "Change your initial password and learn about Quick Connect."
  }
]

export function JellyfinWelcome() {
  return (
    <Page className="mx-auto space-y-8">
      <title>Welcome to Q's Jellyfin Server</title>
      <div>
        <h1>Welcome to Q's Jellyfin Server</h1>
        <p className="lead"><i>"He welcomes you..."</i> &mdash; Jim Halpert</p>
      </div>

      <div className="flex flex-col space-y-4">
        <h2>Where to?</h2>

        {items.map((item, i) => (
          <Item key={i} variant="outline" render={
            <Link to={item.link}>
              <ItemMedia variant="icon">{item.icon}</ItemMedia>
              <ItemContent>
                <ItemTitle>{item.title}</ItemTitle>
                <ItemDescription>{item.description}</ItemDescription>
              </ItemContent>
              <ItemActions>
                <ChevronRightIcon className="size-4" />
              </ItemActions>
            </Link>
          } />
        ))}
      </div>
    </Page >
  )
}
