import { Link, Outlet } from "react-router";

export function Layout() {
  return (
    <>
      <header>
        <Link to="/">Applied</Link>
        <Link to="/new">Add application</Link>
      </header>
      <main>
        <Outlet />
      </main>
    </>
  );
}