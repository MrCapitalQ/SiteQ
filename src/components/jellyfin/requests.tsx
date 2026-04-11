import { Link } from "react-router";
import { Page } from "../ui/page";
import { ServerLinkBadge } from "./server-link-badge";

export function JellyfinRequests() {
  return (
    <Page className="mx-auto space-y-8">
      <title>Jellyfin Requests</title>
      <div>
        <h1>Request New Content</h1>
        <p className="lead">Request movies and TV shows to watch.</p>
      </div>

      <div className="flex flex-col space-y-4">
        <h2>Request New Movies or Shows</h2>
        Have something you want to watch that's not on the Jellyfin server? A request system is available to request
        new content to be added.

        <ol className="list-decimal ml-8 my-4 space-y-2">
          <li>
            Requesting new content is only available in the mobile and desktop apps that were installed using the{" "}
            <Link to="/jellyfin/setup" viewTransition>recommended setup instructions</Link> or in the browser at{" "}
            <ServerLinkBadge mode="navigate" />.
          </li>
          <li>
            Click or tap the search button at the top and search for the content you want to request. Content that can
            be requested will appear in the "Discover on Seerr" section.
          </li>
          <li>Click or tap on the content you want to request to view more details and to request it.</li>
          <li>
            Click or tap the "Request" button and follow the prompts. Approved content that has already had a digital
            release will usually become available within one to seven days. Content not yet released or still in
            theaters will generally become available some time after digital release.
          </li>
        </ol>
      </div>

      <div className="flex flex-col space-y-4">
        <h2>Request More Seasons for a Shows</h2>
        Some shows may be available but are missing seasons. Requesting more seasons cannot be done from the show's
        details page but can be done using the search feature.

        <ol className="list-decimal ml-8 my-4 space-y-2">
          <li>
            Click or tap the search button at the top and search the show you want to request more seasons for as if
            you're requesting the show for the first time.
          </li>
          <li>
            Click or tap on the show you want that appears in the "Discover on Seerr" section, not the "Shows" section.
          </li>
          <li>
            Click or tap the "Request more" or "Request missing" button and follow the prompts to request additional
            season.
          </li>
        </ol>
      </div>
    </Page >
  )
}
