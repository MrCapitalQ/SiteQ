import { Page } from "../ui/page";

export function MaisonNoixWifi() {
  return (
    <Page className="mx-auto space-y-8">
      <title>Maison Noix - Guest Wi-Fi</title>
      <div>
        <h1>Guest Wi-Fi</h1>
        <p className="lead">Wi-Fi is on the house!</p>
      </div>

      <div className="flex flex-col space-y-4">
        <h2>How to Connect</h2>
        <p>
          Cellular data service can be spotty in this area so a guest Wi-Fi is available for your convenience. The
          network connection details can be found around the house. Each has a QR code that mobile devices can scan to
          automatically connect as well as the network name and password printed out for manual entry on other devices
          like laptops. Look for it in the following locations:
        </p>

        <ul className="my-0">
          <li>The framed printout at the top of the stairs</li>
          <li>Various cork coasters usually on the dining or coffee table</li>
        </ul>

        <p>
          After connecting, you will be prompted to continue. After continuing, you will have access for a week.
        </p>
      </div>
    </Page>
  )
}
