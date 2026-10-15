import { Link, Outlet } from "react-router";
import { Briefcase, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./ThemeToggle";

export function Layout() {
  return (
    <div className="flex min-h-dvh flex-col">
      {/* Glass nav: translucent, blurred, and stuck to the top while scrolling */}
      <header className="sticky top-0 z-40 border-b border-foreground/10 bg-background/70 shadow-sm shadow-black/5 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between gap-3 px-4">
          <div className="flex items-center gap-6">
            <Link
              to="/"
              className="flex items-center gap-2.5 font-semibold tracking-tight"
            >
              <span className="flex size-9 items-center justify-center rounded-2xl bg-linear-to-br from-amber-400 to-amber-600 text-black shadow-md shadow-amber-500/30">
                <Briefcase aria-hidden="true" className="size-5" />
              </span>
              <span className="text-lg">Applied</span>
            </Link>
            
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button
              asChild
              size="lg"
              className="rounded-xl font-semibold shadow-md shadow-amber-500/25"
            >
              <Link to="/new">
                <Plus aria-hidden="true" />
                <span className="hidden sm:inline">Add application</span>
                <span className="sm:hidden">Add</span>
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">
        <Outlet />
      </main>

      <footer className="mt-auto border-t border-foreground/10 bg-card/60 backdrop-blur">
        <div className="mx-auto flex max-w-5xl flex-col gap-4 px-4 py-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <span className="flex size-8 items-center justify-center rounded-xl bg-linear-to-br from-amber-400 to-amber-600 text-black">
              <Briefcase aria-hidden="true" className="size-4" />
            </span>
            <div>
              <p className="text-sm font-semibold">Applied</p>
              <p className="text-xs text-muted-foreground">
                Your job search, in one place.
              </p>
            </div>
          </div>

          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Applied · Built with React, TypeScript
            and Tailwind
          </p>
        </div>
      </footer>
    </div>
  );
}