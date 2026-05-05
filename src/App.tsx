import { useEffect, useState } from "react";

import { AuthPage } from "./components/auth/AuthPage";
import { LandingPage } from "./components/LandingPage";

function getRoute() {
  return window.location.pathname;
}

function App() {
  const [, setRouteVersion] = useState(0);
  const route = getRoute();

  useEffect(() => {
    const handleRouteChange = () => setRouteVersion((version) => version + 1);

    window.addEventListener("popstate", handleRouteChange);
    return () => window.removeEventListener("popstate", handleRouteChange);
  }, []);

  if (route === "/sign-in") {
    return <AuthPage mode="sign-in" />;
  }

  if (route === "/sign-up") {
    return <AuthPage mode="sign-up" />;
  }

  return <LandingPage />;
}

export default App;
