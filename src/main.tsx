import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Toaster } from "sonner";

import App from "./App";
import "./index.css";
import { AuthProvider } from "./contexts/AuthContext";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <App />

      <Toaster
        position="top-right"
        richColors
        closeButton
        duration={4000}
      />
    </AuthProvider>
  </StrictMode>
);