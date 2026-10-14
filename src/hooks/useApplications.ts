import { useCallback, useEffect, useState } from "react";
import {
  createApplication,
  deleteApplication,
  fetchApplications,
  updateApplication,
} from "../api/applications";
import type { Application, NewApplication } from "../types";

export function useApplications() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    try {
      const data = await fetchApplications();
      setApplications(data);
      setError(null);
    } catch {
      setError("Something went wrong loading your applications.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let ignore = false;

    fetchApplications()
      .then((data) => {
        if (ignore) return;
        setApplications(data);
        setError(null);
      })
      .catch(() => {
        if (ignore) return;
        setError("Something went wrong loading your applications.");
      })
      .finally(() => {
        if (ignore) return;
        setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, []);

  const add = useCallback(
    async (input: NewApplication) => {
      const created = await createApplication(input);
      await reload();
      return created;
    },
    [reload],
  );

  const update = useCallback(
    async (id: string, changes: Partial<Application>) => {
      const updated = await updateApplication(id, changes);
      await reload();
      return updated;
    },
    [reload],
  );

  const remove = useCallback(
    async (id: string) => {
      await deleteApplication(id);
      await reload();
    },
    [reload],
  );

  return { applications, loading, error, add, update, remove, reload };
}