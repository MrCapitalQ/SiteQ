import { Link } from "react-router-dom";
import { Page } from "./ui/page";

export function Home() {
  return (
    <Page>
      <h1>Home Page</h1>

      <ul className="list-disc">
        <li><Link to="/jellyfin/welcome">Jellyfin</Link></li>
        <li><Link to="/example">Example</Link></li>
        <li><Link to="/not-real">Not Found</Link></li>
      </ul>
    </Page>
  );
}
