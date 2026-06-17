import { useEffect } from "react";
import { createBrowserRouter, Link, Navigate, Outlet, RouterProvider, ScrollRestoration } from "react-router";
import { AppHeader, AppHeaderTitle } from "./components/app-header";
import { Home } from "./components/home";
import { JellyfinIssues } from "./components/jellyfin/issues";
import { JellyfinRequests } from "./components/jellyfin/requests";
import { JellyfinSecurity } from "./components/jellyfin/security";
import { JellyfinSetup } from "./components/jellyfin/setup";
import { JellyfinWelcome } from "./components/jellyfin/welcome";
import { MaisonNoixPets } from "./components/maison-noix/pets";
import { MaisonNoixWelcome } from "./components/maison-noix/welcome";
import { ThemeProvider } from "./components/theme-provider";
import { Toaster } from "./components/ui/sonner";
import { useNavigationDirection } from "./hooks/use-navigation-direction";

export function App() {
  const navigationDirection = useNavigationDirection();

  useEffect(() => {
    document.documentElement.classList.remove('forward-transition', 'back-transition');
    if (navigationDirection === 'back') {
      document.documentElement.classList.add('back-transition');
    } else if (navigationDirection === 'forward') {
      document.documentElement.classList.add('forward-transition');
    }
  }, [navigationDirection])

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
          <Link to="/jellyfin" className="no-underline" viewTransition>
            Jellyfin
          </Link>
        </AppHeaderTitle>
      } />
      <Outlet />
    </>
  )
}

function MaisonNoixLayout() {
  return (
    <>
      <AppHeader title={
        <AppHeaderTitle className="bg-clip-text text-transparent bg-[linear-gradient(120deg,#EAE0D5,#5E503F)]">
          <Link to="/maison-noix" className="no-underline" viewTransition>
            Maison Noix
          </Link>
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
      },
      {
        path: "maison-noix",
        element: <MaisonNoixLayout />,
        children: [
          { index: true, element: <Navigate to={"welcome"} replace /> },
          { path: "welcome", element: <MaisonNoixWelcome /> },
          { path: "pets", element: <MaisonNoixPets /> }
        ]
      }
    ]
  }
],
  { basename: "/" });

export default App;
