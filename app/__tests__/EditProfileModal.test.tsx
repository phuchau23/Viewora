import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { I18nextProvider } from "react-i18next";
import i18next from "i18next";
import { toast } from "sonner";
import EditProfileModal from "../(user)/user/account/components/Editprofile";
import { useUpdateProfile } from "@/hooks/useUsers";

jest.mock("@/hooks/useUsers", () => ({
  useUpdateProfile: jest.fn(),
  useChangePassword: jest.fn(),
}));

jest.mock("sonner", () => ({
  toast: { success: jest.fn(), error: jest.fn() },
}));

jest.mock("i18next", () => ({
  t: (key: string) => key,
  changeLanguage: jest.fn(),
  language: "en",
}));

const mockOnClose = jest.fn();
const mockOnSave = jest.fn();

const defaultUser = {
  fullName: "John Doe",
  email: "john.doe@example.com",
  phoneNumber: "1234567890",
  avatar: null,
  address: "123 Main St",
  dateOfBirth: "1990-01-01",
  gender: 0,
};

const setup = (props = {}) =>
  render(
    <I18nextProvider i18n={i18next}>
      <EditProfileModal
        user={defaultUser}
        isOpen={true}
        onClose={mockOnClose}
        onSave={mockOnSave}
        {...props}
      />
    </I18nextProvider>
  );

describe("EditProfileModal", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders form with initial values", () => {
    setup();
    expect(screen.getByDisplayValue("John Doe")).toBeInTheDocument();
    expect(
      screen.getByDisplayValue("john.doe@example.com")
    ).toBeInTheDocument();
    expect(screen.getByDisplayValue("1234567890")).toBeInTheDocument();
  });

  it("validates required fields", async () => {
    setup({
      user: {
        ...defaultUser,
        fullName: "",
        email: "",
        phoneNumber: "",
        address: "",
        dateOfBirth: "",
        gender: undefined,
      },
    });
    fireEvent.click(screen.getByText("modal.saveChanges"));
    await waitFor(() => {
      expect(
        screen.getByText("validation.fullNameRequired")
      ).toBeInTheDocument();
      expect(screen.getByText("validation.emailRequired")).toBeInTheDocument();
      expect(
        screen.getByText("validation.phoneNumberRequired")
      ).toBeInTheDocument();
      expect(
        screen.getByText("validation.dateOfBirthRequired")
      ).toBeInTheDocument();
      expect(screen.getByText("validation.genderRequired")).toBeInTheDocument();
      expect(
        screen.getByText("validation.addressRequired")
      ).toBeInTheDocument();
    });
  });

  it("updates gender select value", async () => {
    setup();
    const genderSelect = screen.getByRole("combobox");
    fireEvent.change(genderSelect, { target: { value: "1" } });
    expect((genderSelect as HTMLSelectElement).value).toBe("1");
  });

  it("handles avatar file upload", async () => {
    setup();
    const file = new File(["dummy"], "avatar.png", { type: "image/png" });
    const fileInput = screen.getByLabelText("modal.avatar") as HTMLInputElement;
    fireEvent.change(fileInput, { target: { files: [file] } });
    expect(fileInput.files?.[0]).toStrictEqual(file);
  });

  it("submits successfully", async () => {
    (useUpdateProfile as jest.Mock).mockReturnValue({
      mutate: (_data: any, { onSuccess }: any) =>
        onSuccess({ code: 200, statusCode: "Success" }),
      isPending: false,
    });
    const reloadMock = jest
      .spyOn(window.location, "reload")
      .mockImplementation(() => {});
    setup();
    fireEvent.click(screen.getByText("modal.saveChanges"));
    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith("toast.updateSuccess");
      expect(mockOnSave).toHaveBeenCalled();
      expect(reloadMock).toHaveBeenCalled();
    });
    reloadMock.mockRestore();
  });

  it("handles API error response", async () => {
    (useUpdateProfile as jest.Mock).mockReturnValue({
      mutate: (_data: any, { onSuccess }: any) =>
        onSuccess({ code: 400, statusCode: "Error", message: "Update failed" }),
      isPending: false,
    });
    setup();
    fireEvent.click(screen.getByText("modal.saveChanges"));
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("toast.updateFailed");
    });
  });

  it("handles API onError callback", async () => {
    (useUpdateProfile as jest.Mock).mockReturnValue({
      mutate: (_data: any, { onError }: any) =>
        onError({ message: "Server error" }),
      isPending: false,
    });
    setup();
    fireEvent.click(screen.getByText("modal.saveChanges"));
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("toast.updateFailed");
    });
  });

  it("closes modal when cancel button clicked", async () => {
    setup();
    fireEvent.click(screen.getByText("modal.cancel"));
    expect(mockOnClose).toHaveBeenCalled();
  });
});
