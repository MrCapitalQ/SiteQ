import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";
import { AlertTriangleIcon, CheckIcon, CopyIcon, ExternalLinkIcon, InfoIcon } from "lucide-react";
import type { ReactNode } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./ui/hover-card";
import { Page } from "./ui/page";

export function JellyfinWelcome() {
  return (
    <Page className="mx-auto space-y-8">
      <div>
        <h1>Welcome to Q's Jellyfin Server</h1>
        <p className="lead">
          Get set up and start streaming movies and TV shows on your devices.
        </p>
      </div>

      <div className="flex flex-col space-y-4">
        <h2>Setup</h2>
        <p>
          Find the device you want to watch on below and follow the instructions to get started. There are many options
          when using Jellyfin but these are the current recommendations for this particular server based on personal
          testing.
        </p>

        <Alert>
          <InfoIcon />
          <AlertDescription className="text-pretty">
            You can help improve this page by providing feedback based on your experiences on your devices and the apps
            you use for Jellyfin.
          </AlertDescription>
        </Alert>

        <Accordion type="single" collapsible>
          <AccordionItem value="android">
            <AccordionTrigger><h4>Android</h4></AccordionTrigger>
            <AccordionContent>
              <div className="text-pretty">
                On Android devices, it is recommended to install Jellyfin as a web app using the Microsoft Edge browser
                for the best experience.

                <InfoHint>
                  On Android, the Edge browser supports a wider range of media formats compared to other browsers or
                  the official apps. This results in more content being able to be played directly without the need for
                  "transcoding." Transcoding can strain the server and lead to playback issues like loss of HDR.
                </InfoHint>
              </div>

              <ol className="list-decimal ml-8 my-4 space-y-2">
                <li>Download the Microsoft Edge browser from the Google Play Store.</li>
                <li>
                  In the Edge browser, go to <JellyfinLinkBadge />.
                </li>
                <li>
                  Sign in using your credentials or use Quick Connect if you've already signed in on a another device.

                  <ChangePasswordWarning />
                </li>
                <li>
                  To install Jellyfin as an app, tap the hamburger menu (three lines) at the bottom right and tap "Add
                  to phone." You may need to scroll to find this option.
                </li>
                <li>
                  Follow the prompts to install it as an app and add it to your home screen. You can now use Jellyfin
                  as an app from the home screen. You do not need to continue using Edge directly but it must remain
                  installed for the Jellyfin web app to work.
                </li>
              </ol>

              <div className="font-bold mt-8">Recommended Adjustments</div>
              Tap the user icon in the top right to open the menu.

              <ul className="mt-0">
                <li>In the "Playback" settings page, adjust the following.
                  <ul className="my-0">
                    <li className="text-pretty">
                      Under the "Audio Settings" section, set "Maximum Allowed Audio Channels" to "Stereo."

                      <InfoHint>
                        This prevents an issue with some content not playing due to a bug in the mobile version of
                        Edge. This can be reverted to "Auto" when the bug is fixed.
                      </InfoHint>
                    </li>
                    <li className="text-pretty">
                      Under the "Advanced" section, check "Prefer fMP4-HLS Media Container" checkbox.

                      <InfoHint>This allows proper streaming of HDR and Dolby Vision content.</InfoHint>
                    </li>
                  </ul>
                </li>
                <li>In the "Subtitles" settings page, adjust the following.
                  <ul className="my-0">
                    <li className="text-pretty">
                      Check the "Experimental PGS subtitle rendering" checkbox.

                      <InfoHint>
                        This allows displaying subtitles in PGS format without losing HDR or Dolby Vision.
                      </InfoHint>
                    </li>
                  </ul>
                </li>
              </ul>

              <small className="muted">
                These adjustments are highly recommended adjustments based on trial and error on my personal Android
                device but revert these one at a time if you experience any issues.
              </small>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="iOS">
            <AccordionTrigger><h4>iPhone or iPad</h4></AccordionTrigger>
            <AccordionContent>
              On iPhone and iPad, there are currently no specific recommendations. However, the official Jellyfin app
              is available. Please share your experiences on these devices to help improve this section.

              <ol className="list-decimal ml-8 my-4 space-y-2">
                <li>Download the Jellyfin app from the App Store.</li>
                <li>
                  Open the app, enter <JellyfinLinkBadge /> as the server address, and connect.
                </li>
                <li>
                  Sign in using your credentials or use Quick Connect if you've already signed in on another device.

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
                  Open the app, enter <JellyfinLinkBadge /> as the server address, and connect.
                </li>
                <li>
                  Sign in using your credentials or use Quick Connect if you've already signed in on another device.
                </li>
              </ol>

              <div className="font-bold mt-8">Recommended Adjustments</div>
              Select the user icon in the top right to open the menu.

              <ul className="mt-0">
                <li>In the "Playback" settings page, adjust the following.
                  <ul className="my-0">
                    <li className="text-pretty">
                      Under the "Advanced" section, check "Prefer fMP4-HLS Media Container" checkbox.

                      <InfoHint>This allows proper streaming of HDR and Dolby Vision content.</InfoHint>
                    </li>
                  </ul>
                </li>
                <li>In the "Subtitles" settings page, adjust the following.
                  <ul className="my-0">
                    <li className="text-pretty">
                      Check the "Experimental PGS subtitle rendering" checkbox.

                      <InfoHint>
                        This allows displaying subtitles in PGS format without losing HDR or Dolby Vision.
                      </InfoHint>
                    </li>
                  </ul>
                </li>
              </ul>

              <small className="muted">
                These adjustments are highly recommended adjustments based on trial and error on my personal LG TV but
                revert these one at a time if you experience any issues.
              </small>
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
                  Open the app, enter <JellyfinLinkBadge /> as the server address, and connect.
                </li>
                <li>
                  Sign in using your credentials or use Quick Connect if you've already signed in on another device.
                </li>
              </ol>

              <div className="font-bold mt-8">Recommended Adjustments</div>
              Select the "Settings" menu item in the left sidebar then "Advanced Settings."

              <ul className="mt-0">
                <li>Under the "Playback Backend" section, adjust the following.
                  <ul className="my-0">
                    <li className="text-pretty">
                      Disable the "Always downmix to stereo" toggle.

                      <InfoHint>
                        This allows proper streaming of HDR and Dolby Vision content as well as surround sound.
                      </InfoHint>
                    </li>
                    <li className="text-pretty">
                      Enable the "Device supports AC3/Dolby Digital" toggle.

                      <InfoHint>
                        This allows proper streaming of HDR and Dolby Vision content as well as surround sound.
                      </InfoHint>
                    </li>
                    <li className="text-pretty">
                      Enable the "Direct play AAS subtitles" toggle.

                      <InfoHint>
                        This allows displaying subtitles in ASS format without losing HDR or Dolby Vision.
                      </InfoHint>
                    </li>
                    <li className="text-pretty">
                      Enable the "Direct play PGS subtitles" toggle.

                      <InfoHint>
                        This allows displaying subtitles in PGS format without losing HDR or Dolby Vision.
                      </InfoHint>
                    </li>
                  </ul>
                </li>
              </ul>

              <small className="muted">
                These adjustments are highly recommended adjustments based on trial and error on my personal Google TV
                but revert these one at a time if you experience any issues.
              </small>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="tizen">
            <AccordionTrigger><h4>Samsung TV with Tizen</h4></AccordionTrigger>
            <AccordionContent>
              On Samsung TVs running Tizen, there are currently no specific recommendations. However the official
              Jellyfin app is available on supported models. Please share your experiences on these devices to help
              improve this section.

              <ol className="list-decimal ml-8 my-4 space-y-2">
                <li>Search for Jellyfin in the apps catalog and install the app.</li>
                <li>
                  Open the app, enter <JellyfinLinkBadge /> as the server address, and connect.
                </li>
                <li>
                  Sign in using your credentials or use Quick Connect if you've already signed in on another device.
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
              <div className="text-pretty">
                On Windows devices, it is recommended to access Jellyfin using the Microsoft Edge browser for the best
                experience.

                <InfoHint>
                  On Windows, the Edge browser supports a wider range of media formats compared to other browsers or
                  the official apps. This results in more content being able to be played directly without the need for
                  "transcoding." Transcoding can strain the server and lead to playback issues like loss of HDR.
                </InfoHint>
              </div>

              <ol className="list-decimal ml-8 my-4 space-y-2">
                <li>
                  In the Edge browser, go to <JellyfinLinkBadge />.
                </li>
                <li>
                  Sign in using your credentials or use Quick Connect if you've already signed in on another device.

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
              <div className="text-pretty">
                On MacOS devices, there are currently no specific recommendations. However, Jellyfin can be accessed
                using the Safari browser. Please share your experiences on these devices to help improve this section.

                <InfoHint>
                  According to the official Jellyfin documentation, the Safari browser has the most complete support
                  for HDR content compared to other browsers while the official app does not support HDR at all.
                </InfoHint>
              </div>

              <ol className="list-decimal ml-8 my-4 space-y-2">
                <li>
                  In the Safari browser, go to <JellyfinLinkBadge />.
                </li>
                <li>
                  Sign in using your credentials or use Quick Connect if you've already signed in on another device.

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

      <div className="flex flex-col space-y-4">
        <h2>Making Requests</h2>
        Have something you want to watch that's not on the Jellyfin server? A request system is available to request
        new content to be added.

        <ol className="list-decimal ml-8 my-4 space-y-2">
          <li>
            On Android, Windows, iOS, iPad, or MacOS, open the Jellyfin app that was installed using the recommended
            setup instructions. Alternatively, open a browser and go to <JellyfinLinkBadge mode="link" />.
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

      <div className="flex flex-col space-y-4">
        <h2 id="changePassword">Change Your Password</h2>
        You are given an initial password that should be changed as soon as possible. It is not recommended to continue
        using that password for security reasons.

        <ol className="list-decimal ml-8 my-4 space-y-2">
          <li>
            On Android, Windows, iOS, iPad, or MacOS, open the Jellyfin app that was installed using the recommended
            setup instructions. Alternatively, open a browser and go to <JellyfinLinkBadge mode="link" />.
          </li>
          <li>Click or tap the user icon in the top right.</li>
          <li>Click or tap "Profile" and change your password.</li>
        </ol>
      </div>
    </Page >
  )
}

function ChangePasswordWarning() {
  return (
    <Alert className="border-yellow-200 bg-yellow-50 text-yellow-900 dark:border-yellow-800 dark:bg-yellow-950 dark:text-yellow-100">
      <AlertTriangleIcon />
      <AlertTitle>Still using your initial password?</AlertTitle>
      <AlertDescription className="text-pretty">
        Now's a good time to <a href="#changePassword">change your password</a>.
      </AlertDescription>
    </Alert>
  )
}

function JellyfinLinkBadge({ mode = 'copy' }: { mode?: 'copy' | 'link' }) {
  const url = 'https://jellyfin.mr-q.me'
  const { copyToClipboard, isCopied } = useCopyToClipboard()

  return (
    <Badge asChild>
      {
        mode === 'link'
          ? <a href={url} target="_blank">{url} <ExternalLinkIcon data-icon="inline-end" /></a>
          : (
            <Button size="icon-xs" onClick={() => copyToClipboard(url)}>
              {url} {isCopied ? <CheckIcon data-icon="inline-end" /> : <CopyIcon data-icon="inline-end" />}
            </Button>
          )
      }
    </Badge>
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
