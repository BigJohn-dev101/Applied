import { useState } from "react";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { ApplicationList } from "../components/ApplicationList";
import { FilterBar } from "../components/FilterBar";
import { StageSummary } from "../components/StageSummary";
import { useApplications } from "../hooks/useApplications";
import { countByStage } from "../lib/applications";
import type { StageFilter } from "../types";

export function ApplicationsPage() {
  const [search, setSearch] = useState("");
  const [stage, setStage] = useState<StageFilter>("all");

  const { applications: stored, loading, error, reload } = useApplications();

  
  const applications = [...stored].sort((a, b) =>
    b.createdAt.localeCompare(a.createdAt),
  );
  const counts = countByStage(applications); 

  const query = search.trim().toLowerCase();
  const visible = applications.filter((a) => {
    const matchesStage = stage === "all" || a.stage === stage;
    const matchesSearch =
      query === "" ||
      a.company.toLowerCase().includes(query) ||
      a.role.toLowerCase().includes(query);
    return matchesStage && matchesSearch;
  });

  function clearFilters() {
    setSearch("");
    setStage("all");
  }

  if (loading) {
    return (
      <p role="status" className="text-muted-foreground">
        Loading…
      </p>
    );
  }

  if (error) {
    return (
      <div role="alert" className="space-y-3">
        <p>{error}</p>
        <Button type="button" variant="outline" onClick={() => void reload()}>
          Try again
        </Button>
      </div>
    );
  }

  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-bold">Applications Summary</h1>
      <StageSummary counts={counts} />
      <FilterBar
        search={search}
        onSearchChange={setSearch}
        stage={stage}
        onStageChange={setStage}
      />

      {applications.length === 0 ? (
        <div className="space-y-3 rounded-lg border border-dashed p-8 text-center">
          <p>Nothing here yet.</p>
          <Button asChild>
            <Link to="/new">Add your first application</Link>
          </Button>
        </div>
      ) : visible.length === 0 ? (
        <div className="space-y-3 rounded-lg border border-dashed p-8 text-center">
          <p>No applications match your search or filter.</p>
          <Button type="button" variant="outline" onClick={clearFilters}>
            Clear filters
          </Button>
        </div>
      ) : (
        <ApplicationList applications={visible} />
      )}
    </section>
  );
}