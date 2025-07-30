import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { CreateEmployeeModal } from "../(admin)/admin/employees/components/createEmployee";

// Mock hook useCreateEmployee
const mockMutate = jest.fn();
jest.mock("@/hooks/useEmployees", () => ({
  useCreateEmployee: () => ({ mutate: mockMutate }),
}));

// Mock useToast
const mockToast = jest.fn();
jest.mock("@/hooks/use-toast", () => ({
  useToast: () => ({ toast: mockToast }),
}));

describe("CreateEmployeeModal", () => {
  const onClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders modal when open", () => {
    render(<CreateEmployeeModal isOpen={true} onClose={onClose} />);
    expect(screen.getByText("Add New Employee")).toBeInTheDocument();
    expect(
      screen.getByText(/Enter employee personal and account details/i)
    ).toBeInTheDocument();
  });

  it("resets form when opened", () => {
    const { rerender } = render(
      <CreateEmployeeModal isOpen={false} onClose={onClose} />
    );
    rerender(<CreateEmployeeModal isOpen={true} onClose={onClose} />);
    expect(screen.getByPlaceholderText("Enter position")).toHaveValue("");
  });

  it("validates empty form and shows errors", async () => {
    render(<CreateEmployeeModal isOpen={true} onClose={onClose} />);
    fireEvent.click(screen.getByText("Add Employee"));

    expect(await screen.findByText("Position is required")).toBeInTheDocument();
    expect(screen.getByText("Department is required")).toBeInTheDocument();
    expect(screen.getByText("Work Location is required")).toBeInTheDocument();
    expect(
      screen.getByText("Base Salary must be positive")
    ).toBeInTheDocument();
    expect(screen.getByText("Email is required")).toBeInTheDocument();
  });

  it("shows error for invalid email", async () => {
    render(<CreateEmployeeModal isOpen={true} onClose={onClose} />);
    fireEvent.change(screen.getByLabelText("Email *"), {
      target: { value: "invalidemail" },
    });
    fireEvent.click(screen.getByText("Add Employee"));
    expect(await screen.findByText(/valid email address/i)).toBeInTheDocument();
  });

  it("submits valid form and calls createEmployee", async () => {
    render(<CreateEmployeeModal isOpen={true} onClose={onClose} />);

    fireEvent.change(screen.getByPlaceholderText("Enter position"), {
      target: { value: "Developer" },
    });
    fireEvent.change(screen.getByPlaceholderText("Enter department"), {
      target: { value: "IT" },
    });
    fireEvent.change(screen.getByPlaceholderText("Enter work location"), {
      target: { value: "HQ" },
    });
    fireEvent.change(screen.getByPlaceholderText("Enter base salary"), {
      target: { value: "1000" },
    });
    fireEvent.change(screen.getByPlaceholderText("Enter email"), {
      target: { value: "test@mail.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Enter full name"), {
      target: { value: "John Doe" },
    });
    fireEvent.change(screen.getByLabelText("Date of Birth *"), {
      target: { value: "2000-01-01" },
    });
    fireEvent.change(screen.getByPlaceholderText("Enter phone number"), {
      target: { value: "123456789" },
    });
    fireEvent.change(screen.getByPlaceholderText("Enter password"), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByText("Add Employee"));
    await waitFor(() => expect(mockMutate).toHaveBeenCalledTimes(1));
  });

  it("toggles password visibility", () => {
    render(<CreateEmployeeModal isOpen={true} onClose={onClose} />);
    const passwordInput = screen.getByPlaceholderText("Enter password");
    const toggleButton = passwordInput.parentElement?.querySelector("button")!;
    expect(passwordInput).toHaveAttribute("type", "password");
    fireEvent.click(toggleButton);
    expect(passwordInput).toHaveAttribute("type", "text");
  });

  it("calls onClose when Back clicked", () => {
    render(<CreateEmployeeModal isOpen={true} onClose={onClose} />);
    fireEvent.click(screen.getByText("Back"));
    expect(onClose).toHaveBeenCalled();
  });
});
