import { ChevronRightIcon, ConciergeBellIcon, HammerIcon, KeyRoundIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { Item, ItemActions, ItemContent, ItemDescription, ItemMedia, ItemTitle } from "../ui/item";
import { Page } from "../ui/page";

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

        <Item variant="outline" render={
          <Link to="/jellyfin/setup" className="no-underline">
            <ItemMedia variant="icon">
              <HammerIcon />
            </ItemMedia>
            <ItemContent>
              <ItemTitle>Setup Guide</ItemTitle>
              <ItemDescription>
                Get set up and start streaming movies and TV shows on your devices.
              </ItemDescription>
            </ItemContent>
            <ItemActions>
              <ChevronRightIcon className="size-4" />
            </ItemActions>
          </Link>
        } />

        <Item variant="outline" render={
          <Link to="/jellyfin/requests" className="no-underline">
            <ItemMedia variant="icon">
              <ConciergeBellIcon />
            </ItemMedia>
            <ItemContent>
              <ItemTitle>Requests</ItemTitle>
              <ItemDescription>
                Learn how to request new movies and TV shows to watch.
              </ItemDescription>
            </ItemContent>
            <ItemActions>
              <ChevronRightIcon className="size-4" />
            </ItemActions>
          </Link>
        } />

        <Item variant="outline" render={
          <Link to="/jellyfin/security" className="no-underline">
            <ItemMedia variant="icon">
              <KeyRoundIcon />
            </ItemMedia>
            <ItemContent>
              <ItemTitle>Sign-in and Security</ItemTitle>
              <ItemDescription>
                Change your initial password and learn about Quick Connect.
              </ItemDescription>
            </ItemContent>
            <ItemActions>
              <ChevronRightIcon className="size-4" />
            </ItemActions>
          </Link>
        } />
      </div>
    </Page >
  )
}
