import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { XraySubmissionModal } from "@/components/xray-submission-modal";
afterEach(cleanup);
describe("X-Ray scanner handoff", () => {
  it("keeps completion inside the modal until the visitor opens their report", async () => {
    const onComplete = vi.fn();
    render(<XraySubmissionModal alreadyComplete onComplete={onComplete} />);
    expect(onComplete).not.toHaveBeenCalled();
    fireEvent.keyDown(screen.getByRole("dialog"), { key: "Escape" });
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "View my X-Ray report" }));
    await waitFor(() => expect(onComplete).toHaveBeenCalledOnce());
  });
});