import { useEffect, useState } from "react";

import { AuthPage } from "./components/auth/AuthPage";
import { LandingPage } from "./components/LandingPage";
import { MarketingPage } from "./components/marketing/MarketingPage";
import { getPageAnalyticsProperties, trackEvent } from "./lib/analytics";
import { getMarketingLinkByPath } from "./marketing/link-catalog";

function getRoute() {
  return window.location.pathname;
}

function App() {
  const [, setRouteVersion] = useState(0);
  const route = getRoute();
  const marketingLink = getMarketingLinkByPath(route);

  useEffect(() => {
    const handleRouteChange = () => setRouteVersion((version) => version + 1);

    window.addEventListener("popstate", handleRouteChange);
    return () => window.removeEventListener("popstate", handleRouteChange);
  }, []);

  useEffect(() => {
    trackEvent("page_view", getPageAnalyticsProperties());
  }, [route]);

  if (route === "/sign-in") {
    return <AuthPage mode="sign-in" />;
  }

  if (route === "/sign-up") {
    return <AuthPage mode="sign-up" />;
  }

  if (marketingLink) {
    return <MarketingPage link={marketingLink} />;
  }

  return <LandingPage />;
}

export default App;
