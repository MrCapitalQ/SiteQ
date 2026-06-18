import { Page } from "../ui/page";

export function MaisonNoixFind() {
  return (
    <Page className="mx-auto space-y-8">
      <title>Maison Noix - Help Me Find</title>
      <div>
        <h1>Help Me Find</h1>
        <p className="lead">Where's the thing?! Find dishware, utensils, supplies, and more.</p>
      </div>

      <div className="flex flex-col space-y-4">
        <p>
          Use this to find commonly used items around the house.
        </p>

        <ul className="my-0">
          <li>
            <strong>Utensils</strong> - The top island drawer to the right of the microwave, closest to the dining room
            table.
          </li>
          <li>
            <strong>Cups</strong> - Regular cups and drinking glasses are in the upper cabinet to the left of the
            refrigerator, next to the hood vent. Wine, beer, and cocktail glasses are in the bar cabinet.
          </li>
          <li>
            <strong>Mugs</strong> - The upper cabinet above the electric kettle.
          </li>
          <li>
            <strong>Dishware</strong> - The upper cabinet above the dishwasher.
          </li>
          <li>
            <strong>Pots and Pans</strong> - The base drawers to the left of the refrigerator.
          </li>
          <li>
            <strong>Tea, Coffee, and Sweeteners</strong> - Various teas are in the top base drawer under the electric
            kettle. Coffee and sweeteners are in the top drawer of the tall lower pantry cabinet closest to the dining
            room.
          </li>
          <li>
            <strong>Water</strong> - A self-refilling filtered water pitcher and water dispenser are available in
            refrigerator's beverage center. The beverage center can be accessed by reaching under and pulling on the
            bottom right-most corner of the upper left door.
          </li>
          <li>
            <strong>Kitchen Towels</strong> - Additional kitchen towels are in the top island drawer to the left of the
            microwave, closest to the range.
          </li>
          <li>
            <strong>Trash and Recycling</strong> - The island base cabinet to the left of the microwave. The front bin
            closest to the cabinate face is for trash and the other is for recycling.
          </li>
          <li>
            <strong>Cleaning Supplies</strong> - Various cleaning products are in the base cabinet below the sink.
            Additional paper towels are in the upper cabinet above the paper towel holder. The vacuum, mop, and mop
            pads are in the closet at the top of the stairs.
          </li>
          <li>
            <strong>Toilet Paper</strong> - Additional paper towels are under the main bathroom sink.
          </li>
          <li>
            <strong>Bath Towels</strong> - Under the main bathroom sink.
          </li>
          <li>
            <strong>Linens</strong> - Spare pillow cases and sheets are in the guest bedroom's drawer closest to the
            headboard on the window side. A spare comforter is in the the guest bedroom's drawer closest to the
            headboard on the door side. An extra blank is in the guest bedroom closet.
          </li>
        </ul>
      </div>
    </Page>
  )
}
