import { Page } from "./page";

export function NotFound() {
    return (
        <Page className="flex flex-col justify-center h-full">
            <h1 className="text-center">404 Not Found</h1>
            <p className="text-center">
                We couldn't find the page you were looking for.
            </p>
        </Page>
    );
}
