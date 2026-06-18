import type { AccordionItemProps } from "@base-ui/react";
import { ArrowRightIcon, HomeIcon, PowerIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation } from "react-router";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";
import { Page } from "../ui/page";

function scrollToAccordionItem(id: string) {
  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
}

export function MaisonNoixMedia() {
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
      <title>Maison Noix - Media and TV</title>
      <div>
        <h1>Media and TV</h1>
        <p className="lead">
          A library of movies, shows, and live TV is available for your enjoyment.
        </p>
      </div>

      <div className="flex flex-col space-y-4">
        <h2>What's On?</h2>
        <p>
          Each TV is set up with access to a personal media library of movies and shows as well as local live TV.
        </p>

        <ul className="my-0">
          <li>
            To watch a movie or show, use the <strong>Wholphin</strong> app with the provided Guest account to browse
            what's available in the library.
          </li>
          <li>To watch local live TV, use the <strong>HDHomeRun</strong> app on the TV.</li>
        </ul>
      </div >

      <div className="flex flex-col space-y-4">
        <h2>How to Watch</h2>

        <Accordion value={accordionValue} onValueChange={setAccordionValue}>
          <SectionAccordionItem id="guest-bedroom">
            <AccordionTrigger>
              <div>
                <h4>Guest Bedroom</h4>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <p className="text-pretty">
                Use the white Onn remote to control the TV in the guest bedroom. Use the home
                (<HomeIcon className="inline size-4 -translate-y-1/8" />) button to see available apps.
              </p>
            </AccordionContent>
          </SectionAccordionItem>
          <SectionAccordionItem id="living-room">
            <AccordionTrigger>
              <div>
                <h4>Living Room</h4>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <p className="text-pretty">
                Use the silver Hisense remote to control the TV mounted over the fireplace in the living room. Use
                the home (<HomeIcon className="inline size-4 -translate-y-1/8" />) button to turn it on instead of the
                power button. Use the power (<PowerIcon className="inline size-4 -translate-y-1/8" />) button to put
                the TV to sleep when you're done.
              </p>
            </AccordionContent>
          </SectionAccordionItem>
          <SectionAccordionItem id="media-room">
            <AccordionTrigger>
              <div>
                <h4>Media Room</h4>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <p className="text-pretty">
                Use the black LG remote to control the TV. This TV is an OLED so do not leave it on a static image for
                extended periods (like a paused video or on a menu). Turn off the TV when not actively watching
                something. Do not use the home button to see available apps. Instead, use the back
                (<ArrowRightIcon className="inline size-4 -translate-y-1/8 rotate-180" />) button until you return to
                the apps screen.
              </p>
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
