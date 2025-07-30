import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";

// Mock hooks
jest.mock("@/hooks/useBranch", () => ({
  useBranch: jest.fn(),
}));
jest.mock("@/hooks/useShowTime", () => ({
  useShowtimesByBranchId: jest.fn(),
}));

import { useBranch } from "@/hooks/useBranch";
import { useShowtimesByBranchId } from "@/hooks/useShowTime";
import CinemasPage from "../(user)/user/cinemas/page";

const mockBranches = [
  {
    id: "1",
    name: "Cinema A",
    address: "123 Street, City X",
    phoneNumber: "123456789",
    totalRoom: 5,
    status: "Active",
    imageUrl: "/a.jpg",
  },
  {
    id: "2",
    name: "Cinema B",
    address: "456 Avenue, City Y",
    phoneNumber: "987654321",
    totalRoom: 3,
    status: "Active",
    imageUrl: "/b.jpg",
  },
];

const mockShowtimes = [
  {
    id: "s1",
    movie: { name: "Movie X", duration: 120, status: "Now Showing" },
    room: { roomNumber: 1 },
    startTime: "2025-07-20T10:00:00Z",
    isExpired: false,
  },
];

describe("CinemasPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useBranch as jest.Mock).mockReturnValue({
      branches: mockBranches,
      isLoading: false,
      error: null,
    });
    (useShowtimesByBranchId as jest.Mock).mockReturnValue({
      showtimes: mockShowtimes,
      isLoading: false,
      error: null,
    });
  });

  it("renders loading state", () => {
    (useBranch as jest.Mock).mockReturnValue({
      branches: [],
      isLoading: true,
      error: null,
    });
    render(<CinemasPage />);
    expect(screen.getByText(/Loading cinema list/)).toBeInTheDocument();
  });

  it("renders error state", () => {
    (useBranch as jest.Mock).mockReturnValue({
      branches: [],
      isLoading: false,
      error: { message: "Network Error" },
    });
    render(<CinemasPage />);
    expect(screen.getByText(/Error loading cinema list/)).toBeInTheDocument();
    fireEvent.click(screen.getByText(/Try Again/)); // test reload button
  });

  it("renders list of branches and opens a branch to showtimes", async () => {
    render(<CinemasPage />);
    expect(screen.getByText("Cinema A")).toBeInTheDocument();
    expect(screen.getByText("Cinema B")).toBeInTheDocument();

    // Click Cinema A card
    fireEvent.click(screen.getByText("Cinema A"));
    await waitFor(() =>
      expect(screen.getByText(/Current Movies at Cinema A/)).toBeInTheDocument()
    );
    expect(screen.getByText("Movie X")).toBeInTheDocument();
  });

  it("shows showtimes loading state", () => {
    (useShowtimesByBranchId as jest.Mock).mockReturnValueOnce({
      showtimes: [],
      isLoading: true,
      error: null,
    });
    render(<CinemasPage />);
    fireEvent.click(screen.getByText("Cinema A"));
    expect(screen.getByText(/Loading movie list/)).toBeInTheDocument();
  });

  it("shows showtimes error state", () => {
    (useShowtimesByBranchId as jest.Mock).mockReturnValueOnce({
      showtimes: [],
      isLoading: false,
      error: { message: "Showtimes Error" },
    });
    render(<CinemasPage />);
    fireEvent.click(screen.getByText("Cinema A"));
    expect(
      screen.getByText(/No showtimes available for this cinema/)
    ).toBeInTheDocument();
  });

  it("shows no movies currently showing", () => {
    (useShowtimesByBranchId as jest.Mock).mockReturnValueOnce({
      showtimes: [],
      isLoading: false,
      error: null,
    });
    render(<CinemasPage />);
    fireEvent.click(screen.getByText("Cinema A"));
    expect(screen.getByText(/No movies currently showing/)).toBeInTheDocument();
  });

  it("filters by search query and shows no results", () => {
    render(<CinemasPage />);
    fireEvent.change(screen.getByPlaceholderText(/Search cinemas/), {
      target: { value: "notfound" },
    });
    expect(
      screen.getByText(/No cinemas found matching the search criteria/)
    ).toBeInTheDocument();
    fireEvent.click(screen.getByText(/Clear Filters/));
    expect(screen.getByDisplayValue("")).toBeInTheDocument();
  });

  it("filters by location", () => {
    render(<CinemasPage />);
    fireEvent.mouseDown(screen.getByText(/Locations/)); // mở dropdown
    fireEvent.click(screen.getByText("City X"));
    expect(screen.getByText("Cinema A")).toBeInTheDocument();
  });
});
