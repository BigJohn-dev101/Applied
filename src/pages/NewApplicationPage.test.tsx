import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router";
import { describe, expect, it, vi } from "vitest";
import { NewApplicationPage } from "./NewApplicationPage";

// The form only needs `add`. Mocking the hook keeps this test away from
// localStorage and the 300 ms delay.
vi.mock("../hooks/useApplications", () => ({
  useApplications: () => ({ add: vi.fn() }),
}));

function renderForm() {
  render(
    <MemoryRouter>
      <NewApplicationPage />
    </MemoryRouter>,
  );
}

describe("NewApplicationPage", () => {
  it("shows an error under each required field when submitted empty", async () => {
    const user = userEvent.setup();
    renderForm();

    await user.click(screen.getByRole("button", { name: /save application/i }));

    // Company and job title are empty, so exactly two messages appear.
    expect(await screen.findAllByRole("alert")).toHaveLength(2);

    // Each message is attached to its own field for screen readers.
    const company = screen.getByLabelText("Company");
    expect(company).toHaveAttribute("aria-invalid", "true");
    expect(company).toHaveAccessibleDescription("Company is required");
    expect(screen.getByLabelText("Job title")).toHaveAccessibleDescription(
      "Job title is required",
    );
  });

  it("clears a field's error once it is fixed", async () => {
    const user = userEvent.setup();
    renderForm();

    await user.click(screen.getByRole("button", { name: /save application/i }));
    await screen.findAllByRole("alert");

    await user.type(screen.getByLabelText("Company"), "Vodacom");

    expect(screen.getByLabelText("Company")).not.toHaveAttribute("aria-invalid");
    expect(screen.queryByText("Company is required")).not.toBeInTheDocument();
    // The other field is still broken, so it is still marked.
    expect(screen.getByLabelText("Job title")).toHaveAttribute(
      "aria-invalid",
      "true",
    );
  });
});