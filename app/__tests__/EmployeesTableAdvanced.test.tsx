import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Employee } from "@/lib/api/service/fetchEmployees";
import { EmployeesTableAdvanced } from "../(admin)/admin/employees/components/employees-table-advanced";

const mockEmployees: Employee[] = [
  {
    id: "E001",
    position: "Software Engineer",
    hireDate: "2023-01-10",
    department: "IT",
    workLocation: "HCM",
    isActive: true,
    baseSalary: 1200,
    account: {
      id: "A1",
      email: "john@example.com",
      fullName: "Johnathan Doe",
      phoneNumber: "1234567890",
      dateOfBirth: "1990-01-01",
      gender: "Male",
      address: "123 Main St",
      avatar: "",
      identityCard: "123456789",
      role: "Admin",
    },
  },
  {
    id: "E002",
    position: "HR Manager",
    hireDate: "2022-05-20",
    department: "HR",
    workLocation: "Hanoi",
    isActive: false,
    baseSalary: 1500,
    account: {
      id: "A2",
      email: "jane@example.com",
      fullName: "Jane Alice Smith",
      phoneNumber: "0987654321",
      dateOfBirth: "1992-02-02",
      gender: "Female",
      address: "456 Another St",
      avatar: "",
      identityCard: "987654321",
      role: "Manager",
    },
  },
];

describe("EmployeesTableAdvanced", () => {
  const onView = jest.fn();
  const onEdit = jest.fn();
  const onDelete = jest.fn();
  const onBulkDelete = jest.fn();
  const onBulkStatusChange = jest.fn();

  const renderTable = () =>
    render(
      <EmployeesTableAdvanced
        data={mockEmployees}
        onView={onView}
        onEdit={onEdit}
        onDelete={onDelete}
        onBulkDelete={onBulkDelete}
        onBulkStatusChange={onBulkStatusChange}
      />
    );

  it("renders employee rows with account name", () => {
    renderTable();
    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("Jane Smith")).toBeInTheDocument();
    // Kiểm tra hiển thị account.fullName
    expect(screen.getByText("Johnathan Doe")).toBeInTheDocument();
    expect(screen.getByText("Jane Alice Smith")).toBeInTheDocument();
  });

  it("filters by search input", () => {
    renderTable();
    const searchInput = screen.getByPlaceholderText("Search employees...");
    fireEvent.change(searchInput, { target: { value: "Jane" } });
    expect(screen.getByText("Jane Smith")).toBeInTheDocument();
    expect(screen.queryByText("John Doe")).not.toBeInTheDocument();
  });

  it("calls onView when view button clicked", () => {
    renderTable();
    const viewButtons = screen.getAllByRole("button");
    fireEvent.click(viewButtons[0]); // button Eye row 1
    expect(onView).toHaveBeenCalledWith(mockEmployees[0]);
  });

  it("selects and bulk deletes employees", () => {
    renderTable();
    const checkboxes = screen.getAllByRole("checkbox");
    fireEvent.click(checkboxes[1]); // select John
    expect(screen.getByText("1 employee(s) selected")).toBeInTheDocument();

    const deleteButton = screen.getByRole("button", {
      name: /Delete Selected/i,
    });
    fireEvent.click(deleteButton);
    expect(onBulkDelete).toHaveBeenCalledWith([mockEmployees[0]]);
  });
});
