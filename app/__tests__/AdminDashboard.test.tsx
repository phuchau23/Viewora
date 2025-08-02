import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import AdminDashboard from "../(admin)/admin/dashboard/page";

// Mock icon components (để tránh lỗi render từ lucide-react)
jest.mock("lucide-react", () => ({
  Users: (props: any) => <svg data-testid="icon-users" {...props}></svg>,
  Ticket: (props: any) => <svg data-testid="icon-ticket" {...props}></svg>,
  TrendingUp: (props: any) => (
    <svg data-testid="icon-trending" {...props}></svg>
  ),
  AlertCircle: (props: any) => <svg data-testid="icon-alert" {...props}></svg>,
}));

describe("AdminDashboard", () => {
  it("renders page title and subtitle", () => {
    render(<AdminDashboard />);
    expect(screen.getByText("Admin Dashboard")).toBeInTheDocument();
    expect(
      screen.getByText(/Welcome to your administration panel/i)
    ).toBeInTheDocument();
  });

  it("renders statistic cards with values", () => {
    render(<AdminDashboard />);
    expect(screen.getByText("Total Users")).toBeInTheDocument();
    expect(screen.getByText("1,234")).toBeInTheDocument();
    expect(screen.getByText("Open Tickets")).toBeInTheDocument();
    expect(screen.getByText("23")).toBeInTheDocument();
    expect(screen.getByText("System Health")).toBeInTheDocument();
    expect(screen.getByText("98.5%")).toBeInTheDocument();
    expect(screen.getByText("Alerts")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
  });

  it("renders recent activity items", () => {
    render(<AdminDashboard />);
    expect(screen.getByText("Recent Activity")).toBeInTheDocument();
    expect(screen.getByText("New user registered")).toBeInTheDocument();
    expect(screen.getByText("Ticket #1234 resolved")).toBeInTheDocument();
    expect(screen.getByText("System backup completed")).toBeInTheDocument();
  });

  it("renders quick actions with links", () => {
    render(<AdminDashboard />);
    expect(screen.getByText("Quick Actions")).toBeInTheDocument();
    const userLink = screen.getByText("Manage Users").closest("a");
    const ticketLink = screen.getByText("View Tickets").closest("a");
    expect(userLink).toHaveAttribute("href", "/admin/user-manager");
    expect(ticketLink).toHaveAttribute("href", "/admin/tickets");
  });

  it("renders all icons correctly", () => {
    render(<AdminDashboard />);
    expect(screen.getByTestId("icon-users")).toBeInTheDocument();
    expect(screen.getByTestId("icon-ticket")).toBeInTheDocument();
    expect(screen.getByTestId("icon-trending")).toBeInTheDocument();
    expect(screen.getByTestId("icon-alert")).toBeInTheDocument();
  });
});
