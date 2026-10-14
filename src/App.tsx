import { useEffect, useState } from "react";
import { Briefcase } from "lucide-react";
import { Route, Routes } from "react-router";
import { Layout } from "./components/Layout";
import { ApplicationsPage } from "./pages/ApplicationsPage";
import { ApplicationPage } from "./pages/ApplicationPage";
import { NewApplicationPage } from "./pages/NewApplicationPage";
import { NotFoundPage } from "./pages/NotFoundPage";

function App() {
  const [loaderVisible, setLoaderVisible] = useState(true);
  const [loaderExiting, setLoaderExiting] = useState(false);

  useEffect(() => {
    const exitTimer = window.setTimeout(() => setLoaderExiting(true), 2600);
    const finishTimer = window.setTimeout(() => setLoaderVisible(false), 3000);

    return () => {
      window.clearTimeout(exitTimer);
      window.clearTimeout(finishTimer);
    };
  }, []);

  return (
    <>
      <Routes>
        {/* Layout route: header renders once, pages swap inside <Outlet /> */}
        <Route element={<Layout />}>
          <Route index element={<ApplicationsPage />} />
          <Route path="applications/:id" element={<ApplicationPage />} />
          <Route path="new" element={<NewApplicationPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>

      {loaderVisible && (
        <div
          role="status"
          aria-label="Loading Applied"
          className={`fixed inset-0 z-[100] grid place-items-center bg-background/95 px-4 backdrop-blur-md transition-opacity duration-[400ms] ${
            loaderExiting ? "opacity-0" : "opacity-100"
          }`}
        >
          <div className="startup-loader__content flex flex-col items-center">
            <span className="mb-5 flex size-20 items-center justify-center rounded-3xl bg-linear-to-br from-amber-400 to-amber-600 text-black shadow-xl shadow-amber-500/30">
              <Briefcase aria-hidden="true" className="size-9" />
            </span>
            <h1 className="font-heading text-3xl font-bold tracking-tight">
              Applied
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Loading your workspace
            </p>
            <div
              aria-hidden="true"
              className="mt-7 h-1 w-44 overflow-hidden rounded-full bg-muted"
            >
              <span className="startup-loader__progress block h-full rounded-full bg-primary" />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default App;