import { createBrowserRouter, Navigate, Outlet, RouterProvider, ScrollRestoration } from "react-router-dom";
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

function Layout() {
  return (
    <>
      <Outlet />
      <ScrollRestoration />
    </>
  )
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      {
        path: "jellyfin",
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
