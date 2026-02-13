import { useDetectBrowser } from "@/hooks/use-detect-browser";
import { useDetectPlatform } from "@/hooks/use-detect-platform";
import type { AccordionItemProps } from "@base-ui/react";
import { CircleUserRoundIcon, EllipsisVerticalIcon, HelpCircleIcon, MenuIcon, SettingsIcon } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";
import { AlertDescription, AlertTitle } from "../ui/alert";
import { AlertInfo, AlertWarning } from "../ui/alert-variants";
import { Button } from "../ui/button";
import { Page } from "../ui/page";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { InstallLinkBadge } from "./install-link-badge";
import { ServerLinkBadge } from "./server-link-badge";

const platform = useDetectPlatform();
const browser = useDetectBrowser();

function scrollToAccordionItem(id: string) {
  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
}

export function JellyfinSetup() {
  const location = useLocation();
  const [accordionValue, setAccordionValue] = useState<string[]>([])

  useEffect(() => {
    const hash = location.hash.slice(1); // Remove '#' from hash
    if (hash) {
      setAccordionValue([hash]);
      scrollToAccordionItem(hash);
    }
  }, [location]);

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
          recommendations for this particular server based on personal testing. Hover over or tap the{" "}
          <HelpCircleIcon className="inline size-4 -translate-y-1/8" />
          {" "}throughout to see the reasoning behind each recommendation.
        </p>

        <AlertInfo>
          <AlertTitle>
            Consider sharing your feedback so this page can be improved.
          </AlertTitle>
        </AlertInfo>

        <Accordion value={accordionValue} onValueChange={setAccordionValue}>
          <SectionAccordionItem id="android">
            <AccordionTrigger><h4>Android</h4></AccordionTrigger>
            <AccordionContent>
              <p className="text-pretty">
                On Android devices, it is recommended to install Jellyfin as a web app through the Microsoft Edge
                or Google Chrome browsers for the best experience.{" "}

                <HintPopover>
                  <div>
                    Using a browser avoids known bugs with the official app and adds the ability for
                    picture-in-picture and background playback.
                  </div>
                  <div>
                    Edge and Chrome are the recommended browsers because it can play more media formats directly
                    compared to other browsers. This avoids the need for "transcoding" where it can strain the
                    server and lead to playback issues like loss of HDR.
                  </div>
                </HintPopover>
              </p>

              {
                !browser.isEdge && !browser.isChrome &&
                <small className="muted">
                  Note: This does <b>not</b> require you to switch to Edge or Chrome as your default browser.
                </small>
              }

              <Tabs defaultValue="simple" className="mt-2">
                <TabsList variant="line">
                  <TabsTrigger value="simple">Simple Install</TabsTrigger>
                  <TabsTrigger value="manual">Manual Install</TabsTrigger>
                </TabsList>
                <TabsContent value="simple">
                  {
                    platform === 'Android'
                      ? ((browser.isEdge || browser.isChrome)
                        ? <>
                          This method will install Jellyfin on your current Android device. For a different Android
                          device, go to this page on that device or follow the "Manual Install" steps.

                          <ol className="list-decimal ml-8 mt-2 space-y-2">
                            <li>
                              <div>Tap the link below and follow the prompts to install Jellyfin.</div>

                              <InstallLinkBadge />
                            </li>
                            <li><SignInStep suggestPasswordChange={true} /></li>
                          </ol>
                        </>
                        : <>
                          Open this page in Edge or Chrome to see the simple install steps. Alternatively, you can
                          follow the "Manual Install" steps instead.
                        </>
                      )
                      : <>
                        You're not currently on an Android device. Open this page on an Android device to see the
                        simple install steps. Alternatively, you can follow the "Manual Install" steps instead.
                      </>
                  }

                </TabsContent>
                <TabsContent value="manual">
                  <ol className="list-decimal ml-8 space-y-2">
                    <li>
                      In Edge or Chrome, go to <ServerLinkBadge />.
                    </li>
                    <li><SignInStep suggestPasswordChange={true} /></li>
                    <li>
                      Start the install process based on your browser.

                      <ul className="my-2">
                        <li>
                          In Edge, tap the hamburger menu (<MenuIcon className="inline size-4 -translate-y-1/8" />) at
                          the bottom right and tap "Add to phone." You may need to scroll to find this option.
                        </li>
                        <li>
                          In Chrome, tap the more menu (
                          <EllipsisVerticalIcon className="inline size-4 -translate-y-1/8" />) at the top right and tap
                          "Add to Home screen."
                        </li>
                      </ul>
                    </li>
                    <li>
                      Follow the prompts to install it as an app and it will appear as an app on your homescreen or
                      apps drawer.
                    </li>
                  </ol>
                </TabsContent>
              </Tabs>
            </AccordionContent>
          </SectionAccordionItem>
          <SectionAccordionItem id="ios">
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
                <li><SignInStep suggestPasswordChange={true} /></li>
              </ol>

              The Jellyfin community also recommends the third-party Infuse app as an alternative but requires the
              premium version for features like 4K and HDR playback.
            </AccordionContent>
          </SectionAccordionItem>
          <SectionAccordionItem id="web-os">
            <AccordionTrigger><h4>LG TV with WebOS</h4></AccordionTrigger>
            <AccordionContent>
              The official Jellyfin app is recommended on LG TVs with WebOS.

              <ol className="list-decimal ml-8 my-4 space-y-2">
                <li>Search for Jellyfin in the apps catalog and install the app.</li>
                <li>
                  Open the app, enter <ServerLinkBadge /> as the server address, and connect.
                </li>
                <li><SignInStep /></li>
              </ol>

              <AlertWarning className="my-2">
                <AlertTitle>Some newer LG TVs have playback issues with the default settings.</AlertTitle>
                <AlertDescription>
                  If you experience video playback issues, especially with Dolby Vision content, try disabling the
                  "Prefer fMP4 HLS Media Container" option. To find this option, select the user icon
                  (<CircleUserRoundIcon className="inline size-4 -translate-y-1/8" />) at the top right, then playback,
                  then scroll down to the "Advanced" section.
                </AlertDescription>
              </AlertWarning>
            </AccordionContent>
          </SectionAccordionItem>
          <SectionAccordionItem id="google-tv">
            <AccordionTrigger><h4>Google TV or Amazon Fire TV</h4></AccordionTrigger>
            <AccordionContent>
              <div className="text-pretty">
                On Google TV devices or devices based on Google TV like some Amazon Fire TV, it is recommended to
                access Jellyfin using the third-party Wholphin app for the best experience.{" "}

                <HintPopover>
                  On these platforms, Wholphin has become the main recommendation in the Jellyfin community. At the
                  time of writing, the official app is not recommended due usability and playback issues including but
                  not limited to the following.

                  <ul className="my-0">
                    <li>Audio language selection is not respected.</li>
                    <li>Subtitle selection is not remembered when going to the next episode.</li>
                    <li>No support for multi-part episodes.</li>
                  </ul>
                </HintPopover>
              </div>

              <ol className="list-decimal ml-8 my-4 space-y-2">
                <li>Search for Wholphin in the apps catalog and install the app.</li>
                <li>
                  Open the app, enter <ServerLinkBadge /> as the server address, and connect.
                </li>
                <li><SignInStep /></li>
                <li>
                  Open the left sidebar and select the settings icon (
                  <SettingsIcon className="inline size-4 -translate-y-1/8" />) then select "Advanced Settings". Under
                  the "Playback Backend" section, adjust the following.

                  <ul className="my-0">
                    <li className="text-pretty">
                      <b>Disable</b> the "Always downmix to stereo" toggle and <b>enable</b> the "Device supports
                      AC3/Dolby Digital" toggle.{" "}

                      <HintPopover>
                        This is a workaround for a bug on some devices that can cause a loss of HDR and Dolby Vision if
                        the content has surround sound audio. If this causes unplayable content, revert it back to
                        disabled and enabled respectively.
                      </HintPopover>
                    </li>
                    <li className="text-pretty">
                      If you plan on using subtitles, <b>enable</b> both the "Direct play AAS subtitles" and "Direct
                      play PGS subtitles" toggles.{" "}

                      <HintPopover>
                        This allows displaying subtitles in ASS and PGS formats without losing HDR or Dolby Vision and
                        reduces strain on the server.
                      </HintPopover>
                    </li>
                  </ul>

                  <AlertWarning className="my-2">
                    <AlertTitle>These settings should be applied after each time Wholphin is installed.</AlertTitle>
                  </AlertWarning>

                  <small className="muted">
                    Settings recommendations are highly suggested based on trial and error but your experiences may
                    vary. Revert settings to defaults if you encounter issues.
                  </small>
                </li>
              </ol>
            </AccordionContent>
          </SectionAccordionItem>
          <SectionAccordionItem id="tizen">
            <AccordionTrigger><h4>Samsung TV with Tizen</h4></AccordionTrigger>
            <AccordionContent>
              On Samsung TVs running Tizen, there are currently no specific recommendations. However the official
              Jellyfin app is available on supported models.

              <ol className="list-decimal ml-8 my-4 space-y-2">
                <li>Search for Jellyfin in the apps catalog and install the app.</li>
                <li>
                  Open the app, enter <ServerLinkBadge /> as the server address, and connect.
                </li>
                <li><SignInStep /></li>
              </ol>
            </AccordionContent>
          </SectionAccordionItem>
          <SectionAccordionItem id="apple-tv">
            <AccordionTrigger><h4>Apple TV</h4></AccordionTrigger>
            <AccordionContent>
              On Apple TV, the official Swiftfin app is available but is problematic according the Jellyfin community.
              Instead, the third-party Infuse app is recommended as an alternative but requires the premium version for
              features like 4K and HDR playback.
            </AccordionContent>
          </SectionAccordionItem>
          <SectionAccordionItem id="windows">
            <AccordionTrigger><h4>Windows</h4></AccordionTrigger>
            <AccordionContent>
              <p className="text-pretty">
                On Windows devices, it is recommended to install Jellyfin as a web app through the Microsoft Edge
                or Google Chrome browsers for the best experience.{" "}

                <HintPopover>
                  <div>
                    Using a browser avoids known bugs with the official app and adds the ability for picture-in-picture
                    and HDR playback.
                  </div>
                  <div>
                    Edge and Chrome are the recommended browsers because it can play more media formats directly
                    compared to other browsers. This avoids the need for "transcoding" where it can strain the
                    server and lead to playback issues like loss of HDR.
                  </div>
                </HintPopover>
              </p>

              {
                !browser.isEdge && !browser.isChrome &&
                <small className="muted">
                  Note: This does <b>not</b> require you to switch to Edge or Chrome as your default browser.
                </small>
              }

              <Tabs defaultValue="simple" className="mt-2">
                <TabsList variant="line">
                  <TabsTrigger value="simple">Simple Install</TabsTrigger>
                  <TabsTrigger value="manual">Manual Install</TabsTrigger>
                </TabsList>
                <TabsContent value="simple">
                  {
                    platform === 'Windows'
                      ? ((browser.isEdge || browser.isChrome)
                        ? <>
                          This method will install Jellyfin on your current Windows device. For a different Windows
                          device, go to this page on that device or follow the "Manual Install" steps.

                          <ol className="list-decimal ml-8 mt-2 space-y-2">
                            <li>
                              <div>Click the link below and follow the prompts to install Jellyfin.</div>
                              <InstallLinkBadge />
                            </li>
                            <li><SignInStep suggestPasswordChange={true} /></li>
                          </ol>
                        </>
                        : <>
                          Open this page in Edge or Chrome to see the simple install steps. Alternatively, you can
                          follow the "Manual Install" steps instead.
                        </>
                      )
                      : <>
                        You're not currently on a Windows device. Open this page on a Windows device to see the simple
                        install steps. Alternatively, you can follow the "Manual Install" steps instead.
                      </>
                  }
                </TabsContent>
                <TabsContent value="manual">
                  <ol className="list-decimal ml-8 space-y-2">
                    <li>
                      In Edge or Chrome, go to <ServerLinkBadge />.
                    </li>
                    <li><SignInStep suggestPasswordChange={true} /></li>
                    <li>
                      To install Jellyfin as an app, click the "Install Jellyfin" icon inside the address bar on the
                      right.
                    </li>
                    <li>Follow the prompts to install the app and it will appear in your list of apps.</li>
                  </ol>
                </TabsContent>
              </Tabs>
            </AccordionContent>
          </SectionAccordionItem>
          <SectionAccordionItem id="mac">
            <AccordionTrigger><h4>MacOS</h4></AccordionTrigger>
            <AccordionContent>
              <p className="text-pretty">
                On MacOS devices, there are currently no specific recommendations. However, Jellyfin can be accessed
                using the Safari browser.{" "}

                <HintPopover>
                  <div>
                    Using a browser avoids known bugs with the official app and adds the ability for picture-in-picture
                    and HDR playback.
                  </div>
                  <div>
                    According to the official Jellyfin documentation, the Safari browser has the most complete support
                    for HDR content compared to other browsers
                  </div>
                </HintPopover>
              </p>

              <small className="muted">
                Note: This does <b>not</b> require you to switch to Safari as your default browser.
              </small>

              <ol className="list-decimal ml-8 my-4 space-y-2">
                <li>
                  In the Safari browser, go to <ServerLinkBadge />.
                </li>
                <li><SignInStep suggestPasswordChange={true} /></li>
                <li>
                  To install Jellyfin as an app, click "File" &gt; "Add to Dock."
                </li>
                <li>Follow the prompts to install the app and it will appear in your apps folder.</li>
              </ol>
            </AccordionContent>
          </SectionAccordionItem>
        </Accordion>
      </div >
    </Page >
  )
}

function SectionAccordionItem({ id, ...props }: AccordionItemProps) {
  return <AccordionItem id={id}
    value={id}
    onOpenChange={(value, details) => {
      if (id && value && details.reason === 'trigger-press') {
        window.history.replaceState(null, '', `#${id}`);
      } else {
        window.history.replaceState(null, '', '#');
      }
    }}
    onAnimationEnd={(e) => {
      if (id && e.animationName === 'accordion-down') {
        scrollToAccordionItem(id);
      }
    }}
    {...props} />
}

function SignInStep({ suggestPasswordChange = false }: { suggestPasswordChange?: boolean }) {
  return <>
    Sign in using your username and password or{" "}
    <Link to="/jellyfin/security#quick-connect">Quick Connect</Link>.

    {
      suggestPasswordChange &&
      <>
        {" "}Now's a good time to{" "}
        <Link to="/jellyfin/security#change-password">change your password</Link>{" "}
        if you're still using your initially given password.
      </>
    }
  </>
}

function HintPopover({ children }: { children: ReactNode }) {
  return (
    <Popover >
      <PopoverTrigger openOnHover={true} render={
        <Button variant={"link"} size={'icon-sm'} className="size-4 translate-y-1/8">
          <HelpCircleIcon />
        </Button>
      } />
      <PopoverContent>
        {children}
      </PopoverContent>
    </Popover>
  )
}
