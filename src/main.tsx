import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { Theme } from "@radix-ui/themes";
import { router } from "./app/router/routes";
import AppProviders from "@/app/providers/AppProviders";
import "./shared/styles/globals.css";
import "@radix-ui/themes/styles.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AppProviders>
      <Theme>
        <RouterProvider router={router} />
      </Theme>
    </AppProviders>
  </StrictMode>
);