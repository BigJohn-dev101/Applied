import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { ArrowLeft, Briefcase } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FieldError } from "../components/FieldError";
import { NativeSelect } from "../components/NativeSelect";
import { useApplications } from "../hooks/useApplications";
import { toISODate } from "../lib/applications";
import { STAGES, STAGE_LABELS } from "../lib/stages";
import { isFutureDate, isValidUrl } from "../lib/validation";
import type { NewApplication, Stage } from "../types";

// Form fields are all text, even the optional ones (empty string = not given).
type FormValues = {
  company: string;
  role: string;
  link: string;
  dateSent: string;
  stage: Stage;
  notes: string;
};

export function NewApplicationPage() {
  const navigate = useNavigate();
  const { add } = useApplications();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const today = toISODate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    defaultValues: {
      company: "",
      role: "",
      link: "",
      dateSent: today,
      stage: "wishlist",
      notes: "",
    },
  });

  const companyInputRef = useRef<HTMLInputElement | null>(null);
  const { ref: companyRegisterRef, ...companyField } = register("company", {
    validate: (value) => value.trim().length >= 2 || "Company is required",
  });

  useEffect(() => {
    companyInputRef.current?.focus();
  }, []);

  async function onSubmit(values: FormValues) {
    setSubmitError(null);
    const input: NewApplication = {
      company: values.company.trim(),
      role: values.role.trim(),
      link: values.link.trim() || undefined,
      dateSent: values.dateSent,
      stage: values.stage,
      notes: values.notes.trim() || undefined,
    };
    try {
      await add(input);
      navigate("/");
    } catch {
      setSubmitError("Something went wrong saving. Please try again.");
    }
  }

  return (
    <section className="mx-auto w-full max-w-xl">
      <Link
        to="/"
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft aria-hidden="true" className="size-4" />
        Back to all applications
      </Link>

      <div className="relative">
        {/* Soft amber glow behind the card */}
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
              Add an application
            </h1>
            <CardDescription>
              Keep track of a job you have applied for or want to.
            </CardDescription>
          </CardHeader>

          {/* noValidate turns off the browser's own pop-up messages so ours show */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            className="flex flex-col gap-6"
          >
            <CardContent className="space-y-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="company">Company</Label>
                <Input
                  id="company"
                  type="text"
                  className="h-10"
                  {...companyField}
                  ref={(el) => {
                    companyRegisterRef(el);
                    companyInputRef.current = el;
                  }}
                  aria-invalid={errors.company ? "true" : undefined}
                  aria-describedby={
                    errors.company ? "company-error" : undefined
                  }
                />
                <FieldError
                  id="company-error"
                  message={errors.company?.message}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="role">Job title</Label>
                <Input
                  id="role"
                  type="text"
                  className="h-10"
                  {...register("role", {
                    validate: (value) =>
                      value.trim().length >= 2 || "Job title is required",
                  })}
                  aria-invalid={errors.role ? "true" : undefined}
                  aria-describedby={errors.role ? "role-error" : undefined}
                />
                <FieldError id="role-error" message={errors.role?.message} />
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="link">Link to the advert (optional)</Label>
                <Input
                  id="link"
                  type="url"
                  className="h-10"
                  {...register("link", {
                    validate: (value) =>
                      value.trim() === "" ||
                      isValidUrl(value.trim()) ||
                      "That does not look like a link",
                  })}
                  aria-invalid={errors.link ? "true" : undefined}
                  aria-describedby={errors.link ? "link-error" : undefined}
                />
                <FieldError id="link-error" message={errors.link?.message} />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="dateSent">Date sent</Label>
                  <Input
                    id="dateSent"
                    type="date"
                    max={today}
                    className="h-10"
                    {...register("dateSent", {
                      required: "Date sent is required",
                      validate: (value) =>
                        !isFutureDate(value) ||
                        "You cannot have sent it tomorrow",
                    })}
                    aria-invalid={errors.dateSent ? "true" : undefined}
                    aria-describedby={
                      errors.dateSent ? "dateSent-error" : undefined
                    }
                  />
                  <FieldError
                    id="dateSent-error"
                    message={errors.dateSent?.message}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="stage">Stage</Label>
                  <NativeSelect
                    id="stage"
                    className="h-10"
                    {...register("stage")}
                  >
                    {STAGES.map((s) => (
                      <option key={s} value={s}>
                        {STAGE_LABELS[s]}
                      </option>
                    ))}
                  </NativeSelect>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="notes">Notes (optional)</Label>
                <Textarea id="notes" {...register("notes")} />
              </div>

              {submitError && (
                <p
                  role="alert"
                  className="border-l-4 border-amber-600 pl-2 text-sm font-medium"
                >
                  {submitError}
                </p>
              )}
            </CardContent>

            <CardFooter className="flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <Link
                to="/"
                className={buttonVariants({
                  variant: "outline",
                  size: "lg",
                  className: "h-10 w-full sm:w-auto",
                })}
              >
                Cancel
              </Link>
              <Button
                type="submit"
                size="lg"
                disabled={isSubmitting}
                className="h-10 w-full font-semibold shadow-md shadow-amber-500/25 sm:w-auto sm:px-6"
              >
                {isSubmitting ? "Saving…" : "Save application"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </section>
  );
}