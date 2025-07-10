import { BrowserRouter } from "react-router";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./App.css";

import ThemeProvider from "./components/ThemeProvider/index.tsx";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </BrowserRouter>
);
