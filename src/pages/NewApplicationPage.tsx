import { Link } from "react-router";

export function NewApplicationPage() {
  return (
    <section>
      <Link to="/">← Back to all applications</Link>
      <h1>Add an application</h1>
    </section>
  );
}