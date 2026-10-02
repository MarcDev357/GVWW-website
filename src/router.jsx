import { createRootRoute, createRoute, createRouter, Outlet } from "@tanstack/react-router";
import Header from "./components/Header";
import Home from "./pages/Home";
import Work from "./pages/Work";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";

const rootRoute = createRootRoute({
  component: () => (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <Outlet />
    </div>
  ),
  notFoundComponent: NotFound,
});

const homeRoute = createRoute({ getParentRoute: () => rootRoute, path: "/", component: Home });
const workRoute = createRoute({ getParentRoute: () => rootRoute, path: "/work", component: Work });
const contactRoute = createRoute({ getParentRoute: () => rootRoute, path: "/contact", component: Contact });

const routeTree = rootRoute.addChildren([homeRoute, workRoute, contactRoute]);

export const router = createRouter({ routeTree, defaultNotFoundComponent: NotFound });
