import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ChangePassword from "../(user)/user/account/components/ChangePassword";
import { useChangePassword } from "@/hooks/useUsers";
import { toast } from "sonner";

jest.mock("@/hooks/useUsers", () => ({
  useChangePassword: jest.fn(),
}));
jest.mock("sonner", () => ({
  toast: { success: jest.fn(), error: jest.fn() },
}));
jest.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

describe("ChangePassword Component", () => {
  beforeEach(() => jest.clearAllMocks());

  const setup = () => render(<ChangePassword />);

  it("validates required fields", async () => {
    setup();
    fireEvent.click(
      screen.getByRole("button", { name: "modal.changePasswordButton" })
    );
    expect(
      await screen.findByText("validation.oldPasswordRequired")
    ).toBeInTheDocument();
  });

  it("shows mismatch error", async () => {
    setup();
    fireEvent.change(screen.getByLabelText("modal.currentPassword *"), {
      target: { value: "oldpass" },
    });
    fireEvent.change(screen.getByLabelText("modal.newPassword *"), {
      target: { value: "12345678" },
    });
    fireEvent.change(screen.getByLabelText("modal.confirmNewPassword *"), {
      target: { value: "diff" },
    });
    fireEvent.click(
      screen.getByRole("button", { name: "modal.changePasswordButton" })
    );
    expect(
      await screen.findByText("validation.passwordsMismatch")
    ).toBeInTheDocument();
  });

  it("toggles password visibility", () => {
    setup();
    const toggleButtons = screen.getAllByRole("button");
    fireEvent.click(toggleButtons[1]);
    fireEvent.click(toggleButtons[2]);
    fireEvent.click(toggleButtons[3]);
  });

  it("handles success flow", async () => {
    (useChangePassword as jest.Mock).mockReturnValue({
      mutate: (_: any, { onSuccess }: any) =>
        onSuccess({ code: 200, statusCode: "Success" }),
      isPending: false,
    });
    setup();
    fireEvent.change(screen.getByLabelText("modal.currentPassword *"), {
      target: { value: "oldpass" },
    });
    fireEvent.change(screen.getByLabelText("modal.newPassword *"), {
      target: { value: "12345678" },
    });
    fireEvent.change(screen.getByLabelText("modal.confirmNewPassword *"), {
      target: { value: "12345678" },
    });
    fireEvent.click(
      screen.getByRole("button", { name: "modal.changePasswordButton" })
    );

    await waitFor(() => expect(toast.success).toHaveBeenCalled());
    expect(
      await screen.findByText("modal.passwordChanged")
    ).toBeInTheDocument();
  });

  it("resets fields after success", async () => {
    (useChangePassword as jest.Mock).mockReturnValue({
      mutate: (_: any, { onSuccess }: any) =>
        onSuccess({ code: 200, statusCode: "Success" }),
      isPending: false,
    });
    setup();
    fireEvent.change(screen.getByLabelText("modal.currentPassword *"), {
      target: { value: "oldpass" },
    });
    fireEvent.change(screen.getByLabelText("modal.newPassword *"), {
      target: { value: "12345678" },
    });
    fireEvent.change(screen.getByLabelText("modal.confirmNewPassword *"), {
      target: { value: "12345678" },
    });
    fireEvent.click(
      screen.getByRole("button", { name: "modal.changePasswordButton" })
    );

    await waitFor(() => expect(toast.success).toHaveBeenCalled());
    expect(
      (screen.getByLabelText("modal.currentPassword *") as HTMLInputElement)
        .value
    ).toBe("");
  });

  it("handles API error callback", async () => {
    (useChangePassword as jest.Mock).mockReturnValue({
      mutate: (_: any, { onError }: any) => onError({ message: "Failed" }),
      isPending: false,
    });
    setup();
    fireEvent.change(screen.getByLabelText("modal.currentPassword *"), {
      target: { value: "oldpass" },
    });
    fireEvent.change(screen.getByLabelText("modal.newPassword *"), {
      target: { value: "12345678" },
    });
    fireEvent.change(screen.getByLabelText("modal.confirmNewPassword *"), {
      target: { value: "12345678" },
    });
    fireEvent.click(
      screen.getByRole("button", { name: "modal.changePasswordButton" })
    );

    await waitFor(() => expect(toast.error).toHaveBeenCalled());
    expect(await screen.findByTestId("alert")).toBeInTheDocument();
  });

  it("handles API fail response (code !== 200)", async () => {
    (useChangePassword as jest.Mock).mockReturnValue({
      mutate: (_: any, { onSuccess }: any) =>
        onSuccess({
          code: 400,
          statusCode: "Error",
          message: "Wrong password",
        }),
      isPending: false,
    });
    setup();
    fireEvent.change(screen.getByLabelText("modal.currentPassword *"), {
      target: { value: "oldpass" },
    });
    fireEvent.change(screen.getByLabelText("modal.newPassword *"), {
      target: { value: "12345678" },
    });
    fireEvent.change(screen.getByLabelText("modal.confirmNewPassword *"), {
      target: { value: "12345678" },
    });
    fireEvent.click(
      screen.getByRole("button", { name: "modal.changePasswordButton" })
    );

    await waitFor(() => expect(toast.error).toHaveBeenCalled());
    expect(await screen.findByText("Wrong password")).toBeInTheDocument();
  });

  it("disables button when pending", () => {
    (useChangePassword as jest.Mock).mockReturnValue({
      mutate: jest.fn(),
      isPending: true,
    });
    setup();
    expect(
      screen.getByRole("button", { name: "modal.changePasswordButton" })
    ).toBeDisabled();
  });
});
