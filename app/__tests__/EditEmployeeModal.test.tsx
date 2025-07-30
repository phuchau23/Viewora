import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { EditEmployeeModal } from "../(admin)/admin/employees/components/editEmployee";

// Mock hook useUpdateEmployee
const mockMutate = jest.fn();
jest.mock("@/hooks/useEmployees", () => ({
  useUpdateEmployee: () => ({ mutate: mockMutate }),
}));

const initialData = {
  id: "123",
  Position: "Developer",
  Department: "IT",
  WorkLocation: "HQ",
  BaseSalary: 1000,
  Account: {
    Email: "test@mail.com",
    FullName: "John Doe",
    DateOfBirth: "2000-01-01",
    Gender: "Male",
    PhoneNumber: "123456789",
  },
};

describe("EditEmployeeModal", () => {
  const onClose = jest.fn();
  const onSubmit = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders modal when open", () => {
    render(
      <EditEmployeeModal
        isOpen={true}
        onClose={onClose}
        onSubmit={onSubmit}
        initialData={initialData as any}
      />
    );
    expect(screen.getByText("Edit Employee")).toBeInTheDocument();
    expect(
      screen.getByText("Update employee information.")
    ).toBeInTheDocument();
  });

  it("calls updateEmployee and onClose when submitted", async () => {
    render(
      <EditEmployeeModal
        isOpen={true}
        onClose={onClose}
        onSubmit={onSubmit}
        initialData={initialData as any}
      />
    );

    fireEvent.change(screen.getByPlaceholderText("Enter position"), {
      target: { value: "Manager" },
    });
    fireEvent.change(screen.getByPlaceholderText("Enter department"), {
      target: { value: "HR" },
    });
    fireEvent.change(screen.getByPlaceholderText("Enter work location"), {
      target: { value: "Branch Office" },
    });
    fireEvent.change(screen.getByPlaceholderText("Enter base salary"), {
      target: { value: "2000" },
    });

    fireEvent.click(screen.getByText("Update Employee"));
    await waitFor(() => expect(mockMutate).toHaveBeenCalledTimes(1));
    expect(onClose).toHaveBeenCalled();
  });

  it("updates form fields correctly", () => {
    render(
      <EditEmployeeModal
        isOpen={true}
        onClose={onClose}
        onSubmit={onSubmit}
        initialData={initialData as any}
      />
    );

    const positionInput = screen.getByPlaceholderText("Enter position");
    fireEvent.change(positionInput, { target: { value: "Team Lead" } });
    expect(positionInput).toHaveValue("Team Lead");

    const departmentInput = screen.getByPlaceholderText("Enter department");
    fireEvent.change(departmentInput, { target: { value: "Finance" } });
    expect(departmentInput).toHaveValue("Finance");
  });

  it("calls onClose when Back button clicked", () => {
    render(
      <EditEmployeeModal
        isOpen={true}
        onClose={onClose}
        onSubmit={onSubmit}
        initialData={initialData as any}
      />
    );
    fireEvent.click(screen.getByText("Back"));
    expect(onClose).toHaveBeenCalled();
  });
});
