import { AlertTriangleIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { Page } from "../ui/page";
import { ServerLinkBadge } from "./server-link-badge";

export function JellyfinIssues() {
  return (
    <Page className="space-y-8">
      <title>Report Jellyfin Issues</title>
      <div>
        <h1>Report Issues</h1>
        <p className="lead">Report problems with movies and TV shows.</p>
      </div>

      <div className="flex flex-col space-y-4">
        <h2>Instructions</h2>
        If you are having issues with a particular movie or TV show, a reporting system is available.

        <ol className="list-decimal ml-8 my-4 space-y-2">
          <li>
            Issue reporting is only available in the mobile and desktop apps that were installed using the{" "}
            <Link to="/jellyfin/setup">recommended setup instructions</Link> or in the browser at{" "}
            <ServerLinkBadge mode="navigate" />.
          </li>
          <li>
            Go to the details page of a movie, a TV show, a season of a TV show, or an episode of of a TV show.
          </li>
          <li>
            Click or tap on the report issue icon (<AlertTriangleIcon className="inline size-4 -translate-y-1/8" />).
          </li>
          <li>
            Select an issue type. Add a detailed description of the problem, including what type of device and the app you're
            experiencing the problem on.
          </li>
          <li>
            Make sure everything is filled out correctly and submit the issue.
          </li>
        </ol>
      </div>

      <div className="flex flex-col space-y-4">
        <h3>What Can Be Reported?</h3>
        Here are some examples of things you might want to report. This list is not exhaustive.

        <ul className="mt-4">
          <li>Video not playing or appearing incorrectly.</li>
          <li>Audio not playing or not matching selected language.</li>
          <li>Episode intro skip starting or ending at the wrong time.</li>
          <li>Wrong movie or episode playing.</li>
        </ul>
      </div>
    </Page >
  )
}
