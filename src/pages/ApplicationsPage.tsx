import { useState } from "react";
import { Link } from "react-router";
import { seedApplications } from "../data/seed";
import { ApplicationList } from "../components/ApplicationList";
import { FilterBar } from "../components/FilterBar";
import { StageSummary } from "../components/StageSummary";
import { countByStage } from "../lib/applications";
import type { StageFilter } from "../types";

export function ApplicationsPage() {
  const [search, setSearch] = useState("");
  const [stage, setStage] = useState<StageFilter>("all");

  const applications = [...seedApplications].sort((a, b) =>
    b.createdAt.localeCompare(a.createdAt),
  );
  const counts = countByStage(applications); // whole record, ignores filters

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

  return (
    <section>
      <h1>Your applications</h1>
      <StageSummary counts={counts} />
      <FilterBar
        search={search}
        onSearchChange={setSearch}
        stage={stage}
        onStageChange={setStage}
      />

      {applications.length === 0 ? (
        <div>
          <p>Nothing here yet.</p>
          <Link to="/new">Add your first application</Link>
        </div>
      ) : visible.length === 0 ? (
        <div>
          <p>No applications match your search or filter.</p>
          <button type="button" onClick={clearFilters}>
            Clear filters
          </button>
        </div>
      ) : (
        <ApplicationList applications={visible} />
      )}
    </section>
  );
}