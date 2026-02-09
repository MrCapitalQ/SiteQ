import { Link } from "react-router-dom";
import { Page } from "../ui/page";
import { ServerLinkBadge } from "./server-link-badge";

export function JellyfinSecurity() {
  return (
    <Page className="mx-auto space-y-8">
      <title>Jellyfin Sign-in and Security</title>
      <div>
        <h1>Sign-in and Security</h1>
        <p className="lead">
          Get signed in and stay safe.
        </p>
      </div>

      <div className="flex flex-col space-y-4">
        <h2 id="change-password">Change Your Password</h2>
        You are given an initial password that should be changed as soon as possible. It is not recommended to continue
        using that password for security reasons.

        <ol className="list-decimal ml-8 my-4 space-y-2">
          <li>
            On Android, Windows, iOS, iPad, or MacOS, open the Jellyfin app that was installed using the {" "}
            <Link to="/jellyfin/setup">recommended setup instructions</Link>. Alternatively, open a browser and go
            to <ServerLinkBadge mode="navigate" />.
          </li>
          <li>Click or tap the user icon in the top right.</li>
          <li>
            Click or tap "Profile" and set a new strong your password.
          </li>
        </ol>
      </div>

      <div className="flex flex-col space-y-4">
        <h2 id="quick-connect">Quick Connect</h2>
        If you've already signed in on one device, you can use Quick Connect to sign in on subsequent devices without
        needing to enter in a username or password.

        <ol className="list-decimal ml-8 my-4 space-y-2">
          <li>
            On the device you want to sign into, choose to sign in with Quick Connect. It should display a
            six digit code.
          </li>
          <li>
            On the device that you're already signed into, click or tap the user icon in the
            top right.
          </li>
          <li>Click or tap "Quick Connect."</li>
          <li>Enter the six digit code from the device you're trying to sign into and click or tap "Authorize."</li>
        </ol>
      </div>
    </Page >
  )
}
