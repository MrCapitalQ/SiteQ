import { Link } from "react-router-dom";
import { Page } from "./ui/page";

export function Home() {
  return (
    <Page>
      <title>Home</title>
      <h1>Home Page</h1>

      <ul className="list-disc">
        <li><Link to="/jellyfin/welcome">Jellyfin</Link></li>
      </ul>
    </Page>
  );
}
