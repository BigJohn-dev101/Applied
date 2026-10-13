import { Route, Routes } from "react-router";
import { Layout } from "./components/Layout";
import { ApplicationsPage } from "./pages/ApplicationsPage";
import { ApplicationPage } from "./pages/ApplicationPage";
import { NewApplicationPage } from "./pages/NewApplicationPage";
import { NotFoundPage } from "./pages/NotFoundPage";

function App() {
  return (
    <Routes>
      {/* Layout route: header renders once, pages swap inside <Outlet /> */}
      <Route element={<Layout />}>
        <Route index element={<ApplicationsPage />} />
        <Route path="applications/:id" element={<ApplicationPage />} />
        <Route path="new" element={<NewApplicationPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default App;