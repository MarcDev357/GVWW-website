import { createRootRoute, createRoute, createRouter, Outlet } from "@tanstack/react-router";
import Header from "./components/Header";
import RouteMeta from "./components/RouteMeta";
import Home from "./pages/Home";
import Work from "./pages/Work";
import Contact from "./pages/Contact";
import Services from "./pages/Services";
import ServiceDetail from "./pages/ServiceDetail";
import Pricing from "./pages/Pricing";
import Process from "./pages/Process";
import Faq from "./pages/Faq";
import About from "./pages/About";
import Fit from "./pages/Fit";
import NotFound from "./pages/NotFound";

const rootRoute = createRootRoute({
  component: () => (
    <div className="min-h-screen bg-background text-foreground">
      <RouteMeta />
      <Header />
      <Outlet />
    </div>
  ),
  notFoundComponent: NotFound,
});

const homeRoute = createRoute({ getParentRoute: () => rootRoute, path: "/", component: Home });
const workRoute = createRoute({ getParentRoute: () => rootRoute, path: "/work", component: Work });
const contactRoute = createRoute({ getParentRoute: () => rootRoute, path: "/contact", component: Contact });
const servicesRoute = createRoute({ getParentRoute: () => rootRoute, path: "/services", component: Services });
const serviceDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/services/$slug",
  component: () => {
    const { slug } = serviceDetailRoute.useParams();
    return <ServiceDetail slug={slug} />;
  },
});
const pricingRoute = createRoute({ getParentRoute: () => rootRoute, path: "/pricing", component: Pricing });
const processRoute = createRoute({ getParentRoute: () => rootRoute, path: "/process", component: Process });
const faqRoute = createRoute({ getParentRoute: () => rootRoute, path: "/faq", component: Faq });
const aboutRoute = createRoute({ getParentRoute: () => rootRoute, path: "/about", component: About });
const fitRoute = createRoute({ getParentRoute: () => rootRoute, path: "/fit", component: Fit });

const routeTree = rootRoute.addChildren([
  homeRoute,
  workRoute,
  contactRoute,
  servicesRoute,
  serviceDetailRoute,
  pricingRoute,
  processRoute,
  faqRoute,
  aboutRoute,
  fitRoute,
]);

export const router = createRouter({ routeTree, defaultNotFoundComponent: NotFound });
