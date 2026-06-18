import { MoonIcon, SunIcon, SunriseIcon, SunsetIcon } from "lucide-react";
import { Page } from "../ui/page";

export function MaisonNoixPets() {
  return (
    <Page className="mx-auto space-y-8">
      <title>Maison Noix - Petcare Guide</title>
      <div>
        <h1>Petcare Guide</h1>
        <p className="lead">How to tend to the furballs and keep their tails wagging.</p>
      </div>

      <div className="flex flex-col space-y-4">
        <h2>Schedule</h2>
        <p>
          Unless otherwise specified, leashes, food, and treats are found in the closet at the top of the stairs.
          Jett's food is in the bottom storage container with white kibbles. Milo's food is in the container on top of
          Jett's. The scoops found inside each container are specific to each dog and should not be interchanged.
        </p>

        <h3><SunriseIcon className="inline -translate-y-1/8" /> Morning ~7-8am</h3>
        <div className="mt-0 mb-8">
          <ul className="my-0">
            <li>
              The dogs go out for a full bathroom break, giving them a chance to do all of their business and walk
              around.
            </li>
            <li>
              When they come back in, they're given their breakfasts.
              <ul className="my-0">
                <li>Milo - 1 scoop of his kibbles</li>
                <li>Jett - 1.25 scoops of her kibbles filled with hot water</li>
              </ul>
            </li>
          </ul>
        </div>

        <h3><SunIcon className="inline -translate-y-1/8" /> Mid-day</h3>
        <div className="mt-0 mb-8">
          <ul className="my-0">
            <li>
              When possible, the dogs can go out for a bathroom break and playtime between their morning and evening
              outings. This is especially important if their evening bathroom break is expected to be later than usual.
            </li>
          </ul>
        </div>

        <h3><SunsetIcon className="inline -translate-y-1/8" /> Evening ~4-5pm</h3>
        <div className="mt-0 mb-8">
          <ul className="my-0">
            <li>
              The dogs go out for a full bathroom break, giving them a chance to do all of their business and walk
              around.
            </li>
            <li>
              When they come back in, they're given their dinners.
              <ul className="my-0">
                <li>Milo - 1 scoop of his kibbles and a joint supplement tablet</li>
                <li>Jett - 1.25 scoops of her kibbles filled with hot water</li>
              </ul>
            </li>
          </ul>
        </div>

        <h3><MoonIcon className="inline -translate-y-1/8" /> Night ~8-9pm</h3>
        <div className="mt-0 mb-8">
          <ul className="my-0">
            <li>
              The dogs go out for a quick bathroom break, just enough to let them relieve themselves so they do not
              have to go overnight.
            </li>
            <li>
              When they come back in, they're given their bedtime treats.
              <ul className="my-0">
                <li>Milo - A peeled carrot segment from the refrigerator</li>
                <li>Jett - A probiotic and a few minutes with the peanut chew</li>
              </ul>
            </li>
            <li>When they're done, they're called to their beds where they will sleep for the night.</li>
          </ul>
        </div>
      </div>
    </Page>
  )
}
