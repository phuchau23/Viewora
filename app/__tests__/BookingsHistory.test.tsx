import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import BookingsHistory from "../(admin)/admin/bookings/page";
import { useBookingHistory, useBookingById } from "@/hooks/useBooking";

// Mock các component phụ
jest.mock("@/components/ui/dialog", () => ({
  Dialog: ({ children, open }: any) => (
    <div data-testid="Dialog" className={open ? "open" : "closed"}>
      {children}
    </div>
  ),
  DialogContent: ({ children }: any) => <div>{children}</div>,
  DialogDescription: ({ children }: any) => <div>{children}</div>,
  DialogFooter: ({ children }: any) => <div>{children}</div>,
  DialogHeader: ({ children }: any) => <div>{children}</div>,
  DialogTitle: ({ children }: any) => <div>{children}</div>,
  DialogClose: () => <button data-testid="dialog-close">Close</button>,
}));

jest.mock("@/components/ui/button", () => ({
  Button: (props: any) => <button {...props}>{props.children}</button>,
}));

jest.mock("@/components/shared/PaginationControl", () => ({
  __esModule: true,
  default: ({ onPageChange }: any) => (
    <div data-testid="PaginationControls">
      <button onClick={() => onPageChange(2)}>Next Page</button>
    </div>
  ),
}));

jest.mock("@/hooks/useBooking", () => ({
  useBookingHistory: jest.fn(),
  useBookingById: jest.fn(() => ({
    booking: {
      id: "mock-id",
      user: { fullName: "Mock User", email: "mock@example.com" },
      showTime: {
        movie: { name: "Mock Movie" },
        startTime: "2023-01-01T12:00:00Z",
        branch: {
          name: "Mock Branch",
          room: { roomNumber: "A1", roomType: { name: "VIP" } },
        },
      },
      seats: [{ seatNumber: "A1" }, { seatNumber: "A2" }],
      snackSelections: [
        { snack: { name: "Popcorn", price: 20000 }, quantity: 2 },
      ],
      totalPrice: 50000,
      qrCodeUrl: "mock-qr-url",
      createdAt: "2023-01-01",
    },
    isLoading: false,
    isError: false,
  })),
}));

describe("BookingsHistory", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("hiển thị loading khi đang tải", () => {
    (useBookingHistory as jest.Mock).mockReturnValue({
      bookings: [],
      isLoading: true,
      isError: false,
      totalPages: 0,
    });

    render(<BookingsHistory />);
    expect(screen.getByText(/loading your tickets/i)).toBeInTheDocument();
  });

  it("hiển thị lỗi khi có lỗi", () => {
    (useBookingHistory as jest.Mock).mockReturnValue({
      bookings: [],
      isLoading: false,
      isError: true,
      error: { message: "Lỗi mock" },
    });

    render(<BookingsHistory />);
    expect(screen.getByText(/Lỗi: Lỗi mock/i)).toBeInTheDocument();
  });

  it("render danh sách bookings", () => {
    (useBookingHistory as jest.Mock).mockReturnValue({
      bookings: [
        {
          id: "1",
          user: { fullName: "Nguyễn Văn A", email: "user@example.com" },
          showTime: { movie: { name: "Avengers" } },
          totalPrice: 200000,
          createdAt: "2023-01-01",
        },
      ],
      isLoading: false,
      isError: false,
      totalPages: 1,
    });

    render(<BookingsHistory />);
    expect(screen.getByText(/Nguyễn Văn A/i)).toBeInTheDocument();
    expect(screen.getByText(/Avengers/i)).toBeInTheDocument();
    expect(screen.getByText(/200,000 VNĐ/i)).toBeInTheDocument();
  });

  it("hiển thị thông báo khi không có bookings", () => {
    (useBookingHistory as jest.Mock).mockReturnValue({
      bookings: [],
      isLoading: false,
      isError: false,
      totalPages: 0,
    });

    render(<BookingsHistory />);
    expect(screen.getByText(/no bookings found/i)).toBeInTheDocument();
  });

  it("mở modal và hiển thị chi tiết booking khi click 'Chi tiết'", async () => {
    (useBookingHistory as jest.Mock).mockReturnValue({
      bookings: [
        {
          id: "mock-id",
          user: { fullName: "Nguyễn Văn B", email: "test@example.com" },
          showTime: {
            movie: { name: "Avatar" },
            startTime: "2023-01-01T12:00:00Z",
            branch: {
              name: "Mock Branch",
              room: { roomNumber: "A1", roomType: { name: "VIP" } },
            },
          },
          seats: [{ seatNumber: "A1" }, { seatNumber: "A2" }],
          snackSelections: [
            { snack: { name: "Popcorn", price: 20000 }, quantity: 2 },
          ],
          totalPrice: 150000,
          createdAt: "2023-01-01",
        },
      ],
      isLoading: false,
      isError: false,
      totalPages: 1,
    });

    render(<BookingsHistory />);
    const detailBtn = screen.getByRole("button", { name: /Chi tiết/i });
    fireEvent.click(detailBtn);

    await waitFor(() => {
      expect(screen.getByTestId("Dialog")).toBeInTheDocument();
      expect(screen.getByText(/Nguyễn Văn B/i)).toBeInTheDocument();
      expect(screen.getByText(/Avatar/i)).toBeInTheDocument();
      expect(screen.getByText(/A1, A2/i)).toBeInTheDocument();
      expect(screen.getByText(/Popcorn/i)).toBeInTheDocument();
      expect(screen.getByText(/150,000 VNĐ/i)).toBeInTheDocument();
      expect(screen.getByRole("img", { name: /qr code/i })).toHaveAttribute(
        "src",
        "mock-qr-url"
      );
    });

    const closeBtn = screen.getByTestId("dialog-close");
    fireEvent.click(closeBtn);

    await waitFor(() => {
      expect(screen.queryByTestId("Dialog")).not.toBeInTheDocument();
    });
  });

  it("handles pagination change", () => {
    (useBookingHistory as jest.Mock).mockReturnValue({
      bookings: [
        {
          id: "1",
          user: { fullName: "Nguyễn Văn A" },
          showTime: { movie: { name: "Avengers" } },
          totalPrice: 200000,
          createdAt: "2023-01-01",
        },
      ],
      isLoading: false,
      isError: false,
      totalPages: 2,
    });

    render(<BookingsHistory />);
    const nextPageBtn = screen.getByText(/Next Page/i);
    fireEvent.click(nextPageBtn);
    expect(useBookingHistory).toHaveBeenCalledWith(
      expect.objectContaining({ page: 2 })
    );
  });

  it("handles invalid booking data gracefully", () => {
    (useBookingHistory as jest.Mock).mockReturnValue({
      bookings: [
        {
          id: "2",
          user: null, // Invalid user
          showTime: { movie: null }, // Invalid movie
          totalPrice: 0,
          createdAt: "2023-01-01",
        },
      ],
      isLoading: false,
      isError: false,
      totalPages: 1,
    });

    render(<BookingsHistory />);
    expect(screen.getByText(/unknown user/i)).toBeInTheDocument(); // Adjust based on actual fallback text
    expect(screen.getByText(/unknown movie/i)).toBeInTheDocument(); // Adjust based on actual fallback text
  });
});
