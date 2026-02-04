import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster } from "sonner";
import { Home } from "./components/home";
import { JellyfinWelcome } from "./components/jellyfin-welcome";
import { NotFound } from "./components/not-found";
import { ThemeProvider } from "./components/theme-provider";

export function App() {
  return (
    <ThemeProvider storageKey="vite-ui-theme">
      <BrowserRouter basename="/">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="jellyfin/welcome" element={<JellyfinWelcome />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
      <Toaster />
    </ThemeProvider>
  );
}

export default App;
