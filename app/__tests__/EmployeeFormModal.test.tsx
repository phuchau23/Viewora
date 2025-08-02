import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { EmployeeFormModal } from "../(admin)/admin/employees/components/employee-form-modal";

const mockOnClose = jest.fn();
const mockOnSubmit = jest.fn();

const initialData = {
  position: "Dev",
  department: "IT",
  workLocation: "HCM",
  baseSalary: 1000,
  account: {
    email: "old@mail.com",
    fullName: "Old User",
    dateOfBirth: "1990-01-01",
    gender: "Male",
    phoneNumber: "0123456789",
    role: "Admin",
  },
};

describe("EmployeeFormModal", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders add mode with empty form", () => {
    render(
      <EmployeeFormModal
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        title="Add Employee"
        submitText="Add"
        mode="add"
      />
    );
    expect(screen.getByText("Add Employee")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter position")).toHaveValue("");
    expect(screen.getByText("Add")).toBeInTheDocument();
  });

  it("renders edit mode with initialData", () => {
    render(
      <EmployeeFormModal
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        title="Edit Employee"
        submitText="Save"
        mode="edit"
        initialData={initialData as any}
      />
    );
    expect(screen.getByDisplayValue("Dev")).toBeInTheDocument();
    expect(screen.getByDisplayValue("old@mail.com")).toBeInTheDocument();
    expect(screen.getByText("Save")).toBeInTheDocument();
  });

  it("shows validation errors when fields are empty", async () => {
    render(
      <EmployeeFormModal
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        title="Add Employee"
        submitText="Add"
        mode="add"
      />
    );
    fireEvent.click(screen.getByText("Add"));
    await waitFor(() => {
      expect(screen.getByText("Position is required")).toBeInTheDocument();
      expect(screen.getByText("Department is required")).toBeInTheDocument();
      expect(screen.getByText("Work Location is required")).toBeInTheDocument();
      expect(screen.getByText("Email is required")).toBeInTheDocument();
      expect(screen.getByText("Password is required")).toBeInTheDocument();
    });
  });

  it("shows error for invalid email", async () => {
    render(
      <EmployeeFormModal
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        title="Add Employee"
        submitText="Add"
        mode="add"
      />
    );
    fireEvent.change(screen.getByLabelText(/Email/), {
      target: { value: "invalidEmail" },
    });
    fireEvent.click(screen.getByText("Add"));
    await waitFor(() =>
      expect(
        screen.getByText("Please enter a valid email address")
      ).toBeInTheDocument()
    );
  });

  it("toggles password visibility", () => {
    render(
      <EmployeeFormModal
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        title="Add Employee"
        submitText="Add"
        mode="add"
      />
    );
    const toggleButton = screen.getByRole("button", { name: "" }); // Eye icon button
    const passwordInput = screen.getByPlaceholderText("Enter password");
    expect(passwordInput).toHaveAttribute("type", "password");
    fireEvent.click(toggleButton);
    expect(passwordInput).toHaveAttribute("type", "text");
  });

  it("calls onClose when Back clicked", () => {
    render(
      <EmployeeFormModal
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        title="Add Employee"
        submitText="Add"
        mode="add"
      />
    );
    fireEvent.click(screen.getByText("Back"));
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it("submits valid form and calls onSubmit + onClose", async () => {
    render(
      <EmployeeFormModal
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        title="Add Employee"
        submitText="Add"
        mode="add"
      />
    );

    fireEvent.change(screen.getByPlaceholderText("Enter position"), {
      target: { value: "Developer" },
    });
    fireEvent.change(screen.getByPlaceholderText("Enter department"), {
      target: { value: "IT" },
    });
    fireEvent.change(screen.getByPlaceholderText("Enter work location"), {
      target: { value: "HCM" },
    });
    fireEvent.change(screen.getByPlaceholderText("Enter base salary"), {
      target: { value: "1000" },
    });
    fireEvent.change(screen.getByPlaceholderText("Enter email"), {
      target: { value: "user@mail.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Enter full name"), {
      target: { value: "John Doe" },
    });
    fireEvent.change(screen.getByLabelText(/Date of Birth/), {
      target: { value: "1990-01-01" },
    });
    fireEvent.change(screen.getByPlaceholderText("Enter phone number"), {
      target: { value: "0123456789" },
    });
    fireEvent.change(screen.getByPlaceholderText("Enter password"), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByText("Add"));
    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledTimes(1);
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
  });
});
