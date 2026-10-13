import { Link, useParams } from "react-router";
import { seedApplications } from "../data/seed";
import { StageBadge } from "../components/StageBadge";
import { daysSince, formatDaysAgo, needsNudge } from "../lib/applications";

export function ApplicationPage() {
  const { id } = useParams();
  const application = seedApplications.find((a) => a.id === id);

  if (!application) {
    return (
      <section>
        <h1>We could not find that application</h1>
        <Link to="/">Back to all applications</Link>
      </section>
    );
  }

  const days = daysSince(application.dateSent);
  const nudge = needsNudge(application);

  return (
    <section>
      <Link to="/">← Back to all applications</Link>
      <h1>{application.company}</h1>
      <p>{application.role}</p>
      <StageBadge stage={application.stage} />
      <p>
        {application.stage === "wishlist"
          ? "Not sent yet"
          : `Sent ${application.dateSent} · ${formatDaysAgo(days)}`}
        {application.link && (
          <>
            {" · "}
            <a href={application.link} target="_blank" rel="noreferrer">
              View the advert ↗
            </a>
          </>
        )}
      </p>
      {nudge && <p>Needs a nudge</p>}
      <h2>Notes</h2>
      <p>{application.notes ?? "No notes yet."}</p>
      {/* Stage change, notes editing and delete arrive in Step 04 */}
    </section>
  );
}