import { Toaster } from "@/components/ui/sonner";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import EmHuPage from "./pages/EmHuPage";
import EmYouPage from "./pages/EmYouPage";
import LandingPage from "./pages/LandingPage";

const rootRoute = createRootRoute({
  component: () => (
    <>
      <Outlet />
      <Toaster position="top-center" richColors />
    </>
  ),
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: LandingPage,
});

const emYouRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/em-you",
  component: EmYouPage,
});

const emHuRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/em-hu",
  component: EmHuPage,
});

const routeTree = rootRoute.addChildren([indexRoute, emYouRoute, emHuRoute]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
