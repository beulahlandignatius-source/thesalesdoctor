import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { XraySubmissionModal } from "@/components/xray-submission-modal";
afterEach(cleanup);
describe("X-Ray scanner handoff", () => {
  it("keeps completion inside the modal until the visitor opens their report", async () => {
    const onComplete = vi.fn();
    render(<XraySubmissionModal alreadyComplete onComplete={onComplete} />);
    expect(onComplete).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole("button", { name: "View my X-Ray report" }));
    await waitFor(() => expect(onComplete).toHaveBeenCalledOnce());
  });
  it("allows Escape to continue once completion is confirmed", async () => {
    const onComplete = vi.fn();
    render(<XraySubmissionModal alreadyComplete onComplete={onComplete} />);
    await waitFor(() => expect(screen.getByRole("button", { name: "View my X-Ray report" })).toHaveFocus());
    fireEvent.keyDown(screen.getByRole("dialog"), { key: "Escape" });
    await waitFor(() => expect(onComplete).toHaveBeenCalledOnce());
  });
  it("prevents Escape from leaving during the submission receipt", () => {
    const onComplete = vi.fn();
    render(<XraySubmissionModal onComplete={onComplete} />);
    fireEvent.keyDown(screen.getByRole("dialog"), { key: "Escape" });
    expect(onComplete).not.toHaveBeenCalled();
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuemin", "0");
  });
});