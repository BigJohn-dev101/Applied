import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { ArrowLeft, Briefcase } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { Application, Stage } from "../types";
import { daysSince, formatDaysAgo, needsNudge } from "../lib/applications";
import { STAGES, STAGE_LABELS } from "../lib/stages";
import { NativeSelect } from "./NativeSelect";
import { StageBadge } from "./StageBadge";

type Props = {
  application: Application;
  onUpdate: (changes: Partial<Application>) => Promise<unknown>;
  onDelete: () => Promise<void>;
};

export function ApplicationDetail({ application, onUpdate, onDelete }: Props) {
  const navigate = useNavigate();

  // Starts from the saved notes. This component only mounts once the
  // application has loaded, so no effect is needed to copy them in.
  const [notes, setNotes] = useState(application.notes ?? "");
  const [saving, setSaving] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const days = daysSince(application.dateSent);
  const nudge = needsNudge(application);

  // One place for "a write is in flight": disables every button meanwhile.
  async function run(action: () => Promise<unknown>) {
    setSaving(true);
    setActionError(null);
    try {
      await action();
    } catch {
      setActionError("Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  function handleStageChange(value: string) {
    // Options are built from STAGES, so this value is always a Stage.
    void run(() => onUpdate({ stage: value as Stage }));
  }

  function handleSaveNotes() {
    const trimmed = notes.trim();
    void run(() => onUpdate({ notes: trimmed === "" ? undefined : trimmed }));
  }

  function handleConfirmDelete() {
    void run(async () => {
      await onDelete();
      navigate("/");
    });
  }

  return (
    <section className="mx-auto w-full max-w-2xl space-y-4">
      <Link
        to="/"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft aria-hidden="true" className="size-4" />
        Back to all applications
      </Link>

      <div className="relative">
        <div
          aria-hidden="true"
          className="absolute -inset-4 -z-10 rounded-[2rem] bg-linear-to-br from-amber-400/30 via-amber-500/10 to-transparent blur-2xl"
        />

        <Card className="gap-6 rounded-2xl py-8 shadow-2xl shadow-black/10 dark:shadow-black/40">
          <CardHeader className="justify-items-center gap-2 text-center">
            <span className="mb-1 flex size-14 items-center justify-center rounded-2xl bg-linear-to-br from-amber-400 to-amber-600 text-black shadow-lg shadow-amber-500/30">
              <Briefcase aria-hidden="true" className="size-7" />
            </span>
            <h1 className="font-heading text-2xl font-semibold tracking-tight">
              {application.company}
            </h1>
            <CardDescription>{application.role}</CardDescription>
            <div className="flex flex-wrap items-center justify-center gap-2">
              <StageBadge stage={application.stage} />
              {nudge && (
                <Badge className="bg-amber-400 text-black">Needs a nudge</Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              {application.stage === "wishlist"
                ? "Not sent yet"
                : `Sent ${application.dateSent} · ${formatDaysAgo(days)}`}
              {application.link && (
                <>
                  {" · "}
                  <a
                    href={application.link}
                    target="_blank"
                    rel="noreferrer"
                    className="text-foreground underline underline-offset-4"
                  >
                    View the advert ↗
                  </a>
                </>
              )}
            </p>
          </CardHeader>

          <CardContent className="space-y-5">
            {actionError && (
              <p
                role="alert"
                className="border-l-4 border-amber-600 pl-2 text-sm font-medium"
              >
                {actionError}
              </p>
            )}

            <div className="flex max-w-xs flex-col gap-1.5">
              <Label htmlFor="stage">Stage</Label>
              <NativeSelect
                id="stage"
                value={application.stage}
                disabled={saving}
                onChange={(e) => handleStageChange(e.target.value)}
              >
                {STAGES.map((s) => (
                  <option key={s} value={s}>
                    {STAGE_LABELS[s]}
                  </option>
                ))}
              </NativeSelect>
            </div>

            <div className="flex flex-col items-start gap-1.5">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          </CardContent>

          <CardFooter className="flex-col-reverse gap-2 sm:flex-row sm:justify-between">
            {confirmingDelete ? (
              <div
                role="group"
                aria-label="Confirm delete"
                className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center"
              >
                <p className="text-sm">Delete this application? This cannot be undone.</p>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="danger"
                    disabled={saving}
                    onClick={handleConfirmDelete}
                  >
                    Yes, delete
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    disabled={saving}
                    onClick={() => setConfirmingDelete(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <Button
                type="button"
                variant="outline"
                disabled={saving}
                onClick={() => setConfirmingDelete(true)}
              >
                Delete this application
              </Button>
            )}
            <Button
              type="button"
              disabled={saving}
              onClick={handleSaveNotes}
            >
              {saving ? "Saving…" : "Save notes"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </section>
  );
}