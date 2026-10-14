import { Link, useParams } from "react-router";
import { ApplicationDetail } from "../components/ApplicationDetail";
import { useApplications } from "../hooks/useApplications";

export function ApplicationPage() {
  const { id } = useParams();
  const { applications, loading, error, update, remove, reload } =
    useApplications();

  if (loading) return <p role="status">Loading…</p>;

  if (error) {
    return (
      <div role="alert">
        <p>{error}</p>
        <button type="button" onClick={() => void reload()}>
          Try again
        </button>
      </div>
    );
  }

  const application = applications.find((a) => a.id === id);

  if (!application) {
    return (
      <section>
        <h1>We could not find that application</h1>
        <Link to="/">Back to all applications</Link>
      </section>
    );
  }

  return (
    <ApplicationDetail
      key={application.id}
      application={application}
      onUpdate={(changes) => update(application.id, changes)}
      onDelete={() => remove(application.id)}
    />
  );
}