import { BoneIcon, ChevronRightIcon, TvIcon, WifiIcon } from "lucide-react";
import { Link } from "react-router";
import { Item, ItemActions, ItemContent, ItemDescription, ItemMedia, ItemTitle } from "../ui/item";
import { Page } from "../ui/page";

const items = [
  {
    link: "/maison-noix/wifi",
    icon: <WifiIcon />,
    title: "Guest Wi-Fi",
    description: "Wi-Fi is on the house!"
  },
  {
    link: "/maison-noix/media",
    icon: <TvIcon />,
    title: "Media and TV",
    description: "A library of movies, shows, and live TV is available for your enjoyment."
  },
  {
    link: "/maison-noix/pets",
    icon: <BoneIcon />,
    title: "Petcare Guide",
    description: "How to tend to the furballs and keep their tails wagging."
  }
]

export function MaisonNoixWelcome() {
  return (
    <Page className="mx-auto space-y-8">
      <title>Welcome to Maison Noix</title>
      <div>
        <h1>Welcome to Maison Noix</h1>
        <p className="lead">Here's some information you might find useful while staying here.</p>
      </div>

      <div className="flex flex-col space-y-4">
        <h2>Looking for something?</h2>

        {items.map((item, i) => (
          <Item key={i} variant="outline" render={
            <Link to={item.link} viewTransition>
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
