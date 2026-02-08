import { Page } from "./ui/page";

export function Home() {
  return (
    <Page className="flex flex-col">
      <title>Home</title>
      <h1>Home Page</h1>

      <div className="flex flex-col min-[24rem]:flex-row self-center justify-center m-8 text-2xl">
        <div className="text-center">
          🚧
        </div>
        <div className="text-center">
          Under construction
        </div>
        <div className="text-center">
          🚧
        </div>
      </div>

    </Page>
  );
}
