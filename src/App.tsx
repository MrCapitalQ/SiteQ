import { createBrowserRouter, Outlet, RouterProvider, ScrollRestoration } from "react-router-dom";
import { Toaster } from "sonner";
import { Home } from "./components/home";
import { JellyfinRequests } from "./components/jellyfin/requests";
import { JellyfinSecurity } from "./components/jellyfin/security";
import { JellyfinSetup } from "./components/jellyfin/setup";
import { JellyfinWelcome } from "./components/jellyfin/welcome";
import { ThemeProvider } from "./components/theme-provider";

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
      { path: "/", element: <Home /> },
      { path: "/jellyfin/welcome", element: <JellyfinWelcome /> },
      { path: "/jellyfin/setup", element: <JellyfinSetup /> },
      { path: "/jellyfin/requests", element: <JellyfinRequests /> },
      { path: "/jellyfin/security", element: <JellyfinSecurity /> }
    ]
  }
],
  { basename: "/" });

export default App;
