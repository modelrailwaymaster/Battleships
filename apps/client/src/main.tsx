import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { ToastProvider } from "./components/Toast.tsx";
import TopNavBar from "./components/TopNavBar.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <TopNavBar></TopNavBar>
    <ToastProvider>
      <App />
    </ToastProvider>
  </StrictMode>,
);
