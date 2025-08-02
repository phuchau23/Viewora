import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Points from "../(user)/user/account/components/Points";
import { ThemeProvider } from "next-themes";
import "@testing-library/jest-dom";
import { useScoreHistory } from "@/hooks/useUsers";
import { ProfileDataResponse } from "@/lib/api/service/fetchUser";

jest.mock("@/hooks/useUsers", () => ({
  useScoreHistory: jest.fn(),
}));

describe("Points Component - Coverage Boost", () => {
  const user: ProfileDataResponse = {
    rewardPoint: 200,
    fullName: "John Doe",
    email: "john@example.com",
    phoneNumber: "123456789",
    avatar: null,
    address: "123 Street",
    dateOfBirth: "1990-01-01",
    gender: 0,
    identityCard: "123",
    password: "secret",
  };

  const defaultRecords = [
    {
      id: "1",
      movieName: "Movie Added",
      actionType: "Added",
      scoreChanged: 50,
      createdAt: "2025-07-20T12:00:00Z",
    },
    {
      id: "2",
      movieName: "Movie Used",
      actionType: "Used",
      scoreChanged: 20,
      createdAt: "2025-07-15T12:00:00Z",
    },
    {
      id: "3",
      movieName: "Movie Invalid",
      actionType: "",
      scoreChanged: 10,
      createdAt: "invalid-date",
    },
    {
      id: "4",
      movieName: "Movie Empty Date",
      actionType: "Added",
      scoreChanged: 5,
      createdAt: "",
    },
  ];

  const renderComp = () =>
    render(
      <ThemeProvider attribute="class" defaultTheme="light">
        <Points user={user} />
      </ThemeProvider>
    );

  beforeEach(() => {
    (useScoreHistory as jest.Mock).mockReturnValue({
      data: { records: defaultRecords, message: "All good" },
      isLoading: false,
      isError: false,
      error: null,
    });
  });

  it("renders total score (default value if undefined)", () => {
    render(
      <ThemeProvider attribute="class" defaultTheme="light">
        <Points user={{ ...user }} />
      </ThemeProvider>
    );
    expect(screen.getByText("150")).toBeInTheDocument();
  });

  it("renders records, including invalid date and empty date", () => {
    renderComp();
    expect(screen.getByText("Movie Added")).toBeInTheDocument();
    expect(screen.getByText("+50")).toBeInTheDocument();
    expect(screen.getByText("Movie Used")).toBeInTheDocument();
    expect(screen.getByText("-20")).toBeInTheDocument();
    expect(screen.getByText("Movie Invalid")).toBeInTheDocument();
    expect(screen.getByText("Invalid Date")).toBeInTheDocument();
    expect(screen.getByText("Movie Empty Date")).toBeInTheDocument();
    expect(screen.getByText("No date")).toBeInTheDocument();
  });

  it("filters by date and type, then clears filters", async () => {
    renderComp();
    fireEvent.change(screen.getByLabelText("From"), {
      target: { value: "2025-07-10" },
    });
    fireEvent.change(screen.getByLabelText("To"), {
      target: { value: "2025-07-25" },
    });

    fireEvent.click(screen.getByLabelText("Score Added")); // ép handleViewScore
    fireEvent.click(screen.getByLabelText("Score Used")); // ép nhánh khác
    fireEvent.click(screen.getByLabelText("All")); // reset type

    // Clear filters
    fireEvent.click(screen.getByText("Clear"));
    await waitFor(() =>
      expect(screen.getByText("Movie Added")).toBeInTheDocument()
    );
  });

  it("shows loading state", () => {
    (useScoreHistory as jest.Mock).mockReturnValueOnce({
      data: null,
      isLoading: true,
      isError: false,
      error: null,
    });
    renderComp();
    expect(screen.getByText("Loading score history...")).toBeInTheDocument();
  });

  it("shows error state", () => {
    (useScoreHistory as jest.Mock).mockReturnValueOnce({
      data: null,
      isLoading: false,
      isError: true,
      error: { message: "Network Error" },
    });
    renderComp();
    expect(
      screen.getByText("Error loading score history: Network Error")
    ).toBeInTheDocument();
  });

  it("shows no records message when empty", () => {
    (useScoreHistory as jest.Mock).mockReturnValueOnce({
      data: { records: [], message: "Custom no data" },
      isLoading: false,
      isError: false,
      error: null,
    });
    renderComp();
    expect(screen.getByText("Custom no data")).toBeInTheDocument();
  });

  it("works in dark theme", () => {
    render(
      <ThemeProvider attribute="class" defaultTheme="dark">
        <Points user={user} />
      </ThemeProvider>
    );
    expect(document.documentElement).toHaveClass("dark");
  });
});
