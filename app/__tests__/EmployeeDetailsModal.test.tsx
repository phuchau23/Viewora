import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { EmployeeDetailsModal } from "../(admin)/admin/employees/components/employee-details-modal";

const employee = {
  position: "Developer",
  department: "IT",
  workLocation: "HCM",
  baseSalary: 5000,
  account: {
    email: "john.doe@mail.com",
    fullName: "John Doe",
    dateOfBirth: "1990-01-01",
    gender: "Male",
    phoneNumber: "123456789",
    role: "Admin",
  },
};

describe("EmployeeDetailsModal", () => {
  const onClose = jest.fn();
  const onEdit = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return null when employee is null", () => {
    const { container } = render(
      <EmployeeDetailsModal
        isOpen={true}
        onClose={onClose}
        onEdit={onEdit}
        employee={null}
      />
    );
    expect(container.firstChild).toBeNull();
  });

  it("should render employee details when employee is provided", () => {
    render(
      <EmployeeDetailsModal
        isOpen={true}
        onClose={onClose}
        onEdit={onEdit}
        employee={employee as any}
      />
    );

    // Check modal title and description
    expect(screen.getByText("Employee Details")).toBeInTheDocument();
    expect(
      screen.getByText("Complete information about the employee")
    ).toBeInTheDocument();

    // Check employee name and initials in AvatarFallback
    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("JD")).toBeInTheDocument();

    // Check badges and fields
    expect(screen.getAllByText("Admin")).toHaveLength(2);
    expect(screen.getByText("Developer")).toBeInTheDocument();
    expect(screen.getByText("IT")).toBeInTheDocument();
    expect(screen.getByText("HCM")).toBeInTheDocument();
    expect(screen.getByText("5000")).toBeInTheDocument();
    expect(screen.getByText("1990-01-01")).toBeInTheDocument();
    expect(screen.getByText("Male")).toBeInTheDocument();
    expect(screen.getByText("123456789")).toBeInTheDocument();
  });

  it("should call onEdit when Edit button clicked", () => {
    render(
      <EmployeeDetailsModal
        isOpen={true}
        onClose={onClose}
        onEdit={onEdit}
        employee={employee as any}
      />
    );

    fireEvent.click(screen.getByText("Edit"));
    expect(onEdit).toHaveBeenCalledTimes(1);
  });

  it("should call onClose when Close button clicked", () => {
    render(
      <EmployeeDetailsModal
        isOpen={true}
        onClose={onClose}
        onEdit={onEdit}
        employee={employee as any}
      />
    );

    fireEvent.click(screen.getByText("Close"));
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
