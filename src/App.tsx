import { createBrowserRouter, Navigate, Outlet, RouterProvider, ScrollRestoration } from "react-router-dom";
import { AppHeader, AppHeaderTitle } from "./components/app-header";
import { Home } from "./components/home";
import { JellyfinIssues } from "./components/jellyfin/issues";
import { JellyfinRequests } from "./components/jellyfin/requests";
import { JellyfinSecurity } from "./components/jellyfin/security";
import { JellyfinSetup } from "./components/jellyfin/setup";
import { JellyfinWelcome } from "./components/jellyfin/welcome";
import { ThemeProvider } from "./components/theme-provider";
import { Toaster } from "./components/ui/sonner";

export function App() {
  return (
    <ThemeProvider storageKey="vite-ui-theme">
      <RouterProvider router={router} />
      <Toaster />
    </ThemeProvider>
  );
}

function RootLayout() {
  return (
    <>
      <Outlet />
      <ScrollRestoration />
    </>
  )
}

function JellyfinLayout() {
  return (
    <>
      <AppHeader title={
        <AppHeaderTitle className="bg-clip-text text-transparent bg-[linear-gradient(120deg,#AA5CC3,#00A4DC)]">
          Jellyfin
        </AppHeaderTitle>
      } />
      <Outlet />
    </>
  )
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <Home /> },
      {
        path: "jellyfin",
        element: <JellyfinLayout />,
        children: [
          { index: true, element: <Navigate to={"welcome"} replace /> },
          { path: "welcome", element: <JellyfinWelcome /> },
          { path: "setup", element: <JellyfinSetup /> },
          { path: "requests", element: <JellyfinRequests /> },
          { path: "issues", element: <JellyfinIssues /> },
          { path: "security", element: <JellyfinSecurity /> }
        ]
      }
    ]
  }
],
  { basename: "/" });

export default App;
