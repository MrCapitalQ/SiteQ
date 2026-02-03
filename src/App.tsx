import { ComponentExample } from "@/components/component-example";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Home } from "./components/home";
import { NotFound } from "./components/not-found";
import { ThemeProvider } from "./components/theme-provider";

export function App() {
    return (
        <ThemeProvider storageKey="vite-ui-theme">
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="example" element={<ComponentExample />} />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </BrowserRouter>
        </ThemeProvider>
    );
}

export default App;
