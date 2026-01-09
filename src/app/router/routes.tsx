// src/app/router/routes.tsx
import { createBrowserRouter, Navigate } from "react-router-dom";
import Layout from "@/app/layout/Layout";
import HomePage from "@/pages/Home/HomePage";
import ProjectsPage from "@/pages/Projects/ProjectsPage";
import CanvasPage from "@/pages/Canvas/CanvasPage"
// import ProjectDetailPage from "@/pages/Projects/ProjectDetailPage";
import AboutPage from "@/pages/About/AboutPage";
// import ContactPage from "@/pages/Contact/ContactPage";
// import NotFoundPage from "@/pages/NotFound/NotFoundPage";

/**
 * GitHub Pages + React Router:
 * - Si vas a usar URLs limpias (/projects), necesitas 404.html fallback (recomendado).
 * - Alternativa: HashRouter (/#/projects). Aquí dejamos BrowserRouter.
 *
 * IMPORTANTE: Configura basename si tu repo NO es user.github.io.
 * Ej: https://<user>.github.io/<repo>/  => basename="/<repo>"
 */
const basename = import.meta.env.BASE_URL?.replace(/\/$/, "") || "/";

export const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <Layout />,
      //   errorElement: <NotFoundPage />,
      children: [
        { index: true, element: <HomePage /> },
        { path: "projects", element: <ProjectsPage /> },
        // { path: "projects/:id", element: <ProjectDetailPage /> },
        { path: "about", element: <AboutPage /> },
        { path: "canvas", element: <CanvasPage /> },

        // { path: "contact", element: <ContactPage /> },
        { path: "home", element: <Navigate to="/" replace /> },
        // { path: "*", element: <NotFoundPage /> },
      ],
    },
  ],
  { basename }
);
