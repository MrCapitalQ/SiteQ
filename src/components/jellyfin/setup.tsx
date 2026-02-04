import { AlertTriangleIcon, InfoIcon, LightbulbIcon } from "lucide-react";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { Button } from "../ui/button";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "../ui/hover-card";
import { Page } from "../ui/page";
import { ServerLinkBadge } from "./server-link-badge";

export function JellyfinSetup() {
  return (
    <Page className="mx-auto space-y-8">
      <title>Jellyfin Setup Guide</title>
      <div>
        <h1>Setup Guide</h1>
        <p className="lead">
          Get set up and start streaming movies and TV shows on your devices.
        </p>
      </div>

      <div className="flex flex-col space-y-4">
        <h2>Instructions</h2>
        <p>
          Find the device you want to watch on below and follow the instructions to get started. These are the current
          recommendations for this particular server based on personal testing. Use the{" "}
          <InfoIcon className="inline" size={16} />
          {" "}throughout to see the reasoning behind each recommendations.
        </p>

        <Alert>
          <LightbulbIcon />
          <AlertDescription className="text-pretty">
            Consider sharing your feedback on these recommendations so it can be improved.
          </AlertDescription>
        </Alert>

        <Accordion type="single" collapsible>
          <AccordionItem value="android">
            <AccordionTrigger><h4>Android</h4></AccordionTrigger>
            <AccordionContent>
              <div className="text-pretty">
                <p>On Android devices, it is recommended to install Jellyfin as a web app through the Microsoft Edge
                  browser for the best experience.

                  <InfoHint>
                    <p>
                      Using a browser avoids known bugs with the official app and adds the ability for
                      picture-in-picture and background playback.
                    </p>
                    <p>
                      Edge is the recommended browser because it can play more media formats directly compared to other
                      browsers like Chrome and Firefox. This avoids the need for "transcoding" where it can strain
                      the server and lead to playback issues like loss of HDR.
                    </p>
                  </InfoHint>
                </p>

                <small className="muted">
                  Note: This does <b>not</b> require you to switch to Edge as your default browser.
                </small>
              </div>

              <ol className="list-decimal ml-8 my-4 space-y-2">
                <li className="text-pretty">
                  <Link to="https://play.google.com/store/apps/details?id=com.microsoft.emmx">
                    Download the Microsoft Edge browser from the Google Play Store.
                  </Link>
                </li>
                <li>
                  In the Edge browser, go to <ServerLinkBadge />.
                </li>
                <li>
                  Sign in using your username and password or use{" "}
                  <Link to="/jellyfin/security#quick-connect">Quick Connect</Link>
                  {" "}if you've already signed in on a another device.

                  <ChangePasswordWarning />
                </li>
                <li>
                  To install Jellyfin as an app, tap the hamburger menu (three lines) at the bottom right and tap "Add
                  to phone." You may need to scroll to find this option.
                </li>
                <li>
                  Follow the prompts to install it as an app and it will appear as an app on your homescreen.
                </li>
              </ol>

              <div className="font-bold mt-8">Settings Recommendations</div>
              These settings are not synced and should be applied on <b>each</b> Android device. The settings menu can
              be accessed by tapping the user icon at the top right.

              <ul className="mt-0">
                <li className="text-pretty">
                  If you plan on using subtitles, go to the "Subtitles" settings page, <b>check</b> the "Experimental
                  PGS subtitle rendering" checkbox.

                  <InfoHint>
                    This allows displaying subtitles in PGS format without losing HDR or Dolby Vision and reduces
                    strain on the server.
                  </InfoHint>
                </li>
              </ul>

              <RecommendedSettingsDisclaimer />
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="iOS">
            <AccordionTrigger><h4>iPhone or iPad</h4></AccordionTrigger>
            <AccordionContent>
              On iPhone and iPad, there are currently no specific recommendations. However, the official Jellyfin app
              is available.

              <ol className="list-decimal ml-8 my-4 space-y-2">
                <li>
                  <Link to="https://apps.apple.com/us/app/jellyfin-mobile/id1480192618">
                    Download the Jellyfin app from the App Store.
                  </Link>
                </li>
                <li>
                  Open the app, enter <ServerLinkBadge /> as the server address, and connect.
                </li>
                <li>
                  Sign in using your username and password or use{" "}
                  <Link to="/jellyfin/security#quick-connect">Quick Connect</Link>
                  {" "}if you've already signed in on a another device.

                  <ChangePasswordWarning />
                </li>
              </ol>

              The Jellyfin community also recommends the third-party Infuse app as an alternative but requires the
              premium version for features like 4K and HDR playback.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="webOS">
            <AccordionTrigger><h4>LG TV with WebOS</h4></AccordionTrigger>
            <AccordionContent>
              The official Jellyfin app is recommended on LG TVs with WebOS.

              <ol className="list-decimal ml-8 my-4 space-y-2">
                <li>Search for Jellyfin in the apps catalog and install the app.</li>
                <li>
                  Open the app, enter <ServerLinkBadge /> as the server address, and connect.
                </li>
                <li>
                  Sign in using your username and password or use{" "}
                  <Link to="/jellyfin/security#quick-connect">Quick Connect</Link>
                  {" "}if you've already signed in on a another device.
                </li>
              </ol>

              <div className="font-bold mt-8">Settings Recommendations</div>
              These settings are not synced and should be applied on <b>each</b> LG TV. The settings menu can be
              accessed by selecting the user icon at the top right.

              <ul className="mt-0">
                <li className="text-pretty">
                  Go to the "Playback" settings page and in the "Advanced" section, <b>check</b> the "Prefer fMP4-HLS
                  Media Container" checkbox.

                  <InfoHint>
                    This fixes a black screen being display during playback and is required for proper streaming of
                    Dolby Vision content.
                  </InfoHint>
                </li>
                <li className="text-pretty">
                  If you plan on using subtitles, go to the "Subtitles" settings page, <b>check</b> the "Experimental
                  PGS subtitle rendering" checkbox.

                  <InfoHint>
                    This allows displaying subtitles in PGS format without losing HDR or Dolby Vision and reduces
                    strain on the server.
                  </InfoHint>
                </li>
              </ul>

              <RecommendedSettingsDisclaimer />
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="googleTV">
            <AccordionTrigger><h4>Google TV or Amazon Fire TV</h4></AccordionTrigger>
            <AccordionContent>
              <div className="text-pretty">
                On Google TV devices or devices based on Google TV like some Amazon Fire TV, it is recommended to
                access Jellyfin using the third-party Wholphin app for the best experience.

                <InfoHint>
                  On these platforms, Wholphin has become the main recommendation in the Jellyfin community. At the
                  time of writing, the official app is not recommended due usability and playback issues including but
                  not limited to the following.

                  <ul>
                    <li>Audio language selection is not respected.</li>
                    <li>Subtitle selection is not remembered when going to the next episode.</li>
                    <li>No support for multi-part episodes.</li>
                  </ul>
                </InfoHint>
              </div>

              <ol className="list-decimal ml-8 my-4 space-y-2">
                <li>Search for Wholphin in the apps catalog and install the app.</li>
                <li>
                  Open the app, enter <ServerLinkBadge /> as the server address, and connect.
                </li>
                <li>
                  Sign in using your username and password or use{" "}
                  <Link to="/jellyfin/security#quick-connect">Quick Connect</Link>
                  {" "}if you've already signed in on a another device.
                </li>
              </ol>

              <div className="font-bold mt-8">Settings Recommendations</div>
              These settings are not synced and should be applied on <b>each</b> Google TV-based device. These settings
              can be accessed from left sidebar then "Advanced Settings."

              <ul className="mt-0">
                <li>Under the "Playback Backend" section, adjust the following.
                  <ul className="my-0">
                    <li className="text-pretty">
                      <b>Disable</b> the "Always downmix to stereo" toggle and <b>enable</b> the "Device supports
                      AC3/Dolby Digital" toggle.

                      <InfoHint>
                        This is a workaround for a bug on some devices that can cause a loss of HDR and Dolby Vision if
                        the content has surround sound audio. If this causes unplayable content, revert it back to
                        disabled and enabled respectively.
                      </InfoHint>
                    </li>
                    <li className="text-pretty">
                      If you plan on using subtitles, <b>enable</b> both the "Direct play AAS subtitles" and "Direct
                      play PGS subtitles" toggles.

                      <InfoHint>
                        This allows displaying subtitles in ASS and PGS formats without losing HDR or Dolby Vision and
                        reduces strain on the server.
                      </InfoHint>
                    </li>
                  </ul>
                </li>
              </ul>

              <RecommendedSettingsDisclaimer />
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="tizen">
            <AccordionTrigger><h4>Samsung TV with Tizen</h4></AccordionTrigger>
            <AccordionContent>
              On Samsung TVs running Tizen, there are currently no specific recommendations. However the official
              Jellyfin app is available on supported models.

              <ol className="list-decimal ml-8 my-4 space-y-2">
                <li>Search for Jellyfin in the apps catalog and install the app.</li>
                <li>
                  Open the app, enter <ServerLinkBadge /> as the server address, and connect.
                </li>
                <li>
                  Sign in using your username and password or use{" "}
                  <Link to="/jellyfin/security#quick-connect">Quick Connect</Link>
                  {" "}if you've already signed in on a another device.
                </li>
              </ol>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="appleTV">
            <AccordionTrigger><h4>Apple TV</h4></AccordionTrigger>
            <AccordionContent>
              On Apple TV, the official Swiftfin app is available but is problematic according the Jellyfin community.
              Instead, the third-party Infuse app is recommended as an alternative but requires the premium version for
              features like 4K and HDR playback.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="windows">
            <AccordionTrigger><h4>Windows</h4></AccordionTrigger>
            <AccordionContent>
              <p className="text-pretty">
                On Windows devices, it is recommended to access Jellyfin through the Microsoft Edge browser for the
                best experience.

                <InfoHint>
                  <p>
                    Using a browser avoids known bugs with the official app and adds the ability for picture-in-picture
                    and HDR playback.
                  </p>
                  <p>
                    Edge is the recommended browser because it can play more media formats directly compared to other
                    browsers like Chrome and Firefox. This avoids the need for "transcoding" where it can strain
                    the server and lead to playback issues like loss of HDR.
                  </p>
                </InfoHint>
              </p>

              <small className="muted">
                Note: This does <b>not</b> require you to switch to Edge as your default browser.
              </small>

              <ol className="list-decimal ml-8 my-4 space-y-2">
                <li>
                  In the Edge browser, go to <ServerLinkBadge />.
                </li>
                <li>
                  Sign in using your username and password or use{" "}
                  <Link to="/jellyfin/security#quick-connect">Quick Connect</Link>
                  {" "}if you've already signed in on a another device.

                  <ChangePasswordWarning />
                </li>
                <li>
                  To install Jellyfin as an app, click the "App available. Install Jelly" icon on the right side of the
                  address bar.
                </li>
                <li>Follow the prompts to install the app and it will appear in your list of apps.</li>
              </ol>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="mac">
            <AccordionTrigger><h4>MacOS</h4></AccordionTrigger>
            <AccordionContent>
              <p className="text-pretty">
                On MacOS devices, there are currently no specific recommendations. However, Jellyfin can be accessed
                using the Safari browser.

                <InfoHint>
                  <p>
                    Using a browser avoids known bugs with the official app and adds the ability for picture-in-picture
                    and HDR playback.
                  </p>
                  <p>
                    According to the official Jellyfin documentation, the Safari browser has the most complete support
                    for HDR content compared to other browsers
                  </p>
                </InfoHint>
              </p>

              <small className="muted">
                Note: This does <b>not</b> require you to switch to Safari as your default browser.
              </small>

              <ol className="list-decimal ml-8 my-4 space-y-2">
                <li>
                  In the Safari browser, go to <ServerLinkBadge />.
                </li>
                <li>
                  Sign in using your username and password or use{" "}
                  <Link to="/jellyfin/security#quick-connect">Quick Connect</Link>
                  {" "}if you've already signed in on a another device.

                  <ChangePasswordWarning />
                </li>
                <li>
                  To install Jellyfin as an app, click "File" &gt; "Add to Dock."
                </li>
                <li>Follow the prompts to install the app and it will appear in your apps folder.</li>
              </ol>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div >
    </Page >
  )
}

function ChangePasswordWarning() {
  return (
    <Alert className="border-yellow-200 bg-yellow-50 text-yellow-900 dark:border-yellow-800 dark:bg-yellow-950 dark:text-yellow-100">
      <AlertTriangleIcon />
      <AlertTitle>Still using your initial password?</AlertTitle>
      <AlertDescription className="text-pretty">
        Now's a good time to <Link to="/jellyfin/security#change-password">change your password</Link>.
      </AlertDescription>
    </Alert>
  )
}

function InfoHint({ children }: { children: ReactNode }) {
  return (
    <HoverCard openDelay={10} closeDelay={100}>
      <HoverCardTrigger asChild>
        <Button variant={"link"} size={'icon-sm'} className="h-4 w-6 translate-y-1/8">
          <InfoIcon />
        </Button>
      </HoverCardTrigger>
      <HoverCardContent>
        {children}
      </HoverCardContent>
    </HoverCard>
  )
}

function RecommendedSettingsDisclaimer() {
  return (
    <small className="muted">
      Settings recommendations are highly suggested based on trial and error but your experience may vary.
      Revert settings to defaults if you encounter issues.
    </small>
  )
}
