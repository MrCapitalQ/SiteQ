import { Link } from "react-router-dom";
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
        <h2>Instructions</h2>
        Have something you want to watch that's not on the Jellyfin server? A request system is available to request
        new content to be added.

        <ol className="list-decimal ml-8 my-4 space-y-2">
          <li>
            On Android, Windows, iOS, iPad, or MacOS, open the Jellyfin app that was installed using the {" "}
            <Link to="/jellyfin/setup">recommended setup instructions</Link>. Alternatively, open a browser and go to
            <ServerLinkBadge mode="navigate" />.
          </li>
          <li>
            Click or tap the search button at the top and search for the content you want to request. Content that can
            be requested will appear in the "Discover" section.
          </li>
          <li>Click or tap on the content you want to request to view more details and to request it.</li>
          <li>
            Click or tap the "Request" button and follow the prompts. Approved content that has already had a digital
            release will usually become available within one to seven days. Content not yet released or still in
            theaters will generally become available some time after digital release.
          </li>
        </ol>
      </div>
    </Page >
  )
}
