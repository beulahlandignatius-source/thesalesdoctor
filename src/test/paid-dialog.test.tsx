import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

const { upload } = vi.hoisted(() => ({ upload: vi.fn() }));
vi.mock("@/lib/payment-proof.functions", () => ({ uploadPaymentProof: upload }));
vi.mock("@/components/site", () => ({ btnClass: (_variant: string, _size: string, className: string) => className }));

import { PaidDialog } from "@/components/paid-dialog";

afterEach(() => { cleanup(); vi.clearAllMocks(); delete window.__lovableEvents; });

describe("Private Sales Clinic payment step", () => {
  it("provides both provider checkout links and requires a screenshot before continuing", async () => {
    const onDone = vi.fn();
    render(<PaidDialog who={{ name: "Client", email: "client@example.com" }} onDone={onDone} />);
    fireEvent.click(screen.getByRole("button", { name: "I’VE PAID" }));

    const links = await screen.findAllByRole("link", { name: /Open payment link/ });
    expect(links[0]).toHaveAttribute("href", "https://buy.stripe.com/9B600lb5Vgslcake8y2ZO0L");
    expect(links[1]).toHaveAttribute("href", "https://flutterwave.com/pay/kyqfrin1z57j");
    expect(screen.getByText(/does not confirm payment/i)).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /continue to booking/i }));
    expect(await screen.findByRole("alert")).toHaveTextContent("Please add a screenshot of your payment.");
    expect(onDone).not.toHaveBeenCalled();
    expect(upload).not.toHaveBeenCalled();
  });

  it("uploads a selected provider screenshot for admin review before continuing", async () => {
    const onDone = vi.fn();
    upload.mockResolvedValue({ ok: true });
    const { container } = render(<PaidDialog who={{ name: "Client", email: "client@example.com" }} onDone={onDone} />);
    fireEvent.click(screen.getByRole("button", { name: "I’VE PAID" }));
    fireEvent.click(screen.getByRole("button", { name: "Flutterwave · NGN" }));

    const fileInput = document.body.querySelector('input[type="file"]');
    if (!fileInput) throw new Error("Payment screenshot input missing");
    fireEvent.change(fileInput, { target: { files: [new File(["receipt"], "payment.png", { type: "image/png" })] } });
    fireEvent.click(screen.getByRole("button", { name: /upload & continue to booking/i }));

    await waitFor(() => expect(upload).toHaveBeenCalledOnce());
    expect(upload).toHaveBeenCalledWith({ data: expect.objectContaining({ name: "Client", email: "client@example.com", provider: "flutterwave", contentType: "image/png" }) });
    expect(onDone).toHaveBeenCalledOnce();
  });
});