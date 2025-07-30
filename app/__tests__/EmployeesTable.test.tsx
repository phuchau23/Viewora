import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Employee } from "@/lib/api/service/fetchEmployees";
import { EmployeesTable } from "../(admin)/admin/employees/components/employees-table";

const mockMutate = jest.fn();
jest.mock("@/hooks/useEmployees", () => ({
  useUpdateEmployeeStatus: jest.fn(() => ({
    mutate: mockMutate,
  })),
}));

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
      fullName: "John Doe",
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
      fullName: "Jane Smith",
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

describe("EmployeesTable", () => {
  const onView = jest.fn();
  const onEdit = jest.fn();
  const onDelete = jest.fn();
  const setPagination = jest.fn();

  const renderTable = () =>
    render(
      <EmployeesTable
        data={mockEmployees}
        onView={onView}
        onEdit={onEdit}
        onDelete={onDelete}
        pagination={{ pageIndex: 0, pageSize: 10 }}
        setPagination={setPagination}
        pageCount={1}
      />
    );

  it("renders employees list", () => {
    renderTable();
    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("Jane Smith")).toBeInTheDocument();
    expect(screen.getByText("john@example.com")).toBeInTheDocument();
    expect(screen.getByText("jane@example.com")).toBeInTheDocument();
  });

  it("filters employees by search", () => {
    renderTable();
    const input = screen.getByPlaceholderText("Search employees...");
    fireEvent.change(input, { target: { value: "Jane" } });
    expect(screen.getByText("Jane Smith")).toBeInTheDocument();
    expect(screen.queryByText("John Doe")).not.toBeInTheDocument();
  });

  it("calls onView when view button clicked", () => {
    renderTable();
    const viewBtn = screen.getAllByRole("button", { name: "" })[0]; // first Eye button
    fireEvent.click(viewBtn);
    expect(onView).toHaveBeenCalled();
  });

  it("calls updateEmployeeStatus when delete icon clicked", () => {
    renderTable();
    const trashButton = screen.getAllByRole("button")[2]; // Trash button
    fireEvent.click(trashButton);
    expect(mockMutate).toHaveBeenCalledWith({ id: "E001" });
  });
});
