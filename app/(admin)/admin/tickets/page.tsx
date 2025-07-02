"use client";

import { useEffect, useState, useCallback, ChangeEvent } from "react";
import { Card } from "@/components/ui/card"; // Assuming you have a Card component
import Image from "next/image";
import { useRouter, useSearchParams, usePathname } from "next/navigation"; // Import useRouter, useSearchParams, and usePathname

// Define the API response types based on your provided JSON
interface User {
  id: string;
  fullName: string;
  email: string;
  role: string;
  phoneNumber: string;
}

interface Movie {
  id: string;
  name: string;
  duration: string;
}

interface RoomType {
  id: string;
  name: string;
}

interface Room {
  id: string;
  roomNumber: number;
  roomType: RoomType;
}

interface Branch {
  id: string;
  name: string;
  address: string;
  phoneNumber: string;
  room: Room;
}

interface ShowTime {
  id: string;
  movie: Movie;
  branch: Branch;
  startTime: string;
  endTime: string;
}

interface Price {
  id: string;
  timeInDay: string;
  amount: number;
}

interface SeatType {
  id: string;
  name: string;
  price: Price;
}

interface Seat {
  id: string;
  row: string;
  number: number;
  seatType: SeatType;
}

interface Snack {
  id: string;
  name: string;
  price: number;
  image: string;
}

interface SnackSelection {
  id: string;
  snack: Snack;
  quantity: number;
  unitPrice: number;
}

interface DiscountType {
  id: string;
  name: string;
}

interface Promotion {
  id: string;
  title: string;
  code: string;
  discountPrice: number;
  discountTypeEnum: string;
  discountType: DiscountType;
  maxDiscountValue: number;
  minOrderValue: number;
}

export interface Booking {
  id: string;
  user: User;
  showTime: ShowTime;
  seats: Seat[];
  snackSelections: SnackSelection[];
  promotion: Promotion | null; // Promotion can be null
  totalPrice: string;
  createdAt: string;
  qrCodeUrl: string; // Base64 encoded string
}

export interface BookingListResponse {
  code: number;
  statusCode: string;
  message: string;
  data: {
    items: Booking[];
    totalItems: number;
    currentPage: number;
    totalPages: number;
    pageSize: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
  };
}

export interface SingleBookingResponse {
  code: number;
  statusCode: string;
  message: string;
  data: Booking;
}

// Booking Service to fetch data
const BookingService = {
  getBookings: async (
    page: number = 1,
    pageSize: number = 100
  ): Promise<BookingListResponse> => {
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
    if (!API_BASE_URL) {
      throw new Error("NEXT_PUBLIC_API_BASE_URL is not defined in .env.local");
    }
    const url = new URL(`${API_BASE_URL}/bookings`);
    url.searchParams.append("page", page.toString());
    url.searchParams.append("pageSize", pageSize.toString());

    const response = await fetch(url.toString());
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  },
  getBookingById: async (id: string): Promise<SingleBookingResponse> => {
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
    if (!API_BASE_URL) {
      throw new Error("NEXT_PUBLIC_API_BASE_URL is not defined in .env.local");
    }
    const response = await fetch(`${API_BASE_URL}/bookings/${id}`);
    if (!response.ok) {
      // Throw error specifically if not found (404) or other HTTP errors
      const errorData = await response.json().catch(() => ({})); // Try to parse error message
      throw new Error(
        `HTTP error! status: ${response.status}, message: ${
          errorData.message || response.statusText
        }`
      );
    }
    return response.json();
  },
};

// Booking Detail Modal Component
interface BookingDetailModalProps {
  bookingId: string;
  onClose: () => void;
}

function BookingDetailModal({ bookingId, onClose }: BookingDetailModalProps) {
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showQr, setShowQr] = useState(false); // State to manage QR code visibility
  const [showBookingId, setShowBookingId] = useState(false); // New state for booking ID visibility
  const [showEmail, setShowEmail] = useState(false); // New state for email visibility

  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        setLoading(true);
        const response = await BookingService.getBookingById(bookingId);
        setBooking(response.data);
      } catch (err: any) {
        setError("Failed to load booking details.");
        console.error("Error fetching booking details:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBookingDetails();
  }, [bookingId]);

  const formatCurrency = (amount: number | string) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      currencyDisplay: "code",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(Number(amount));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      month: "numeric",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false, // Use 24-hour format
    });
  };

  const toggleBookingIdVisibility = () => {
    setShowBookingId((prev) => !prev);
  };

  const toggleEmailVisibility = () => {
    setShowEmail((prev) => !prev);
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl max-w-lg w-full text-center text-gray-700 dark:text-gray-300">
          Loading booking details...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl max-w-lg w-full text-center text-red-600 dark:text-red-400">
          {error}
          <button
            onClick={onClose}
            className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  if (!booking) {
    return null; // Should not happen if error is handled
  }

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto"
      onClick={onClose} // Click outside to close
    >
      <Card
        className="relative p-6 max-w-3xl w-full mx-auto bg-white dark:bg-gray-800 shadow-xl rounded-lg overflow-y-auto max-h-[90vh]"
        onClick={(e) => e.stopPropagation()} // Prevent clicks inside the card from closing the modal
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-2xl font-bold"
          aria-label="Close modal"
        >
          &times;
        </button>
        <h2 className="text-2xl font-bold mb-1 text-gray-900 dark:text-white">
          Booking Details
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 flex items-center">
          Booking ID:{" "}
          {showBookingId ? (
            <span className="text-gray-900 dark:text-white ml-1">
              {booking.id}
            </span>
          ) : (
            <span className="text-gray-900 dark:text-white ml-1">
              ...{booking.id.slice(-10)}
            </span>
          )}
          <button
            onClick={toggleBookingIdVisibility}
            className="ml-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
            aria-label={showBookingId ? "Hide booking ID" : "Show booking ID"}
          >
            {showBookingId ? (
              // X icon (cross)
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-4 h-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              // Eye icon
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-4 h-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            )}
          </button>
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="font-semibold text-primary">Customer Name:</p>
            <p className="text-gray-900 dark:text-white">
              {booking.user.fullName}
            </p>
          </div>
          <div>
            <p className="font-semibold text-primary flex items-center">
              Customer Email:
              <button
                onClick={toggleEmailVisibility}
                className="ml-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                aria-label={showEmail ? "Hide email" : "Show email"}
              >
                {showEmail ? (
                  // X icon (cross)
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-4 h-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                ) : (
                  // Eye icon
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-4 h-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                )}
              </button>
            </p>
            <p className="text-gray-900 dark:text-white">
              {showEmail ? booking.user.email : "**********@***.***"}
            </p>
          </div>
          <div>
            <p className="font-semibold text-primary">Movie and Duration:</p>
            <p className="text-gray-900 dark:text-white">
              {booking.showTime.movie.name} ({booking.showTime.movie.duration}{" "}
              min)
            </p>
          </div>
          <div>
            <p className="font-semibold text-primary">Branch:</p>
            <p className="text-gray-900 dark:text-white">
              {booking.showTime.branch.name}
            </p>
          </div>
          <div>
            <p className="font-semibold text-primary">Room:</p>
            <p className="text-gray-900 dark:text-white">
              Room {booking.showTime.branch.room.roomNumber} -{" "}
              {booking.showTime.branch.room.roomType.name}
            </p>
          </div>
          <div>
            <p className="font-semibold text-primary">Showtime:</p>
            <p className="text-gray-900 dark:text-white">
              {formatDate(booking.showTime.startTime)} -{" "}
              {formatDate(booking.showTime.endTime)}
            </p>
          </div>
          <div>
            <p className="font-semibold text-primary">Seats:</p>
            {/* Modified section for displaying seats as a bullet list */}
            <ul className="list-disc list-inside text-gray-900 dark:text-white">
              {booking.seats.map((seat) => (
                <li key={seat.id}>
                  {seat.row}
                  {seat.number} - {seat.seatType.name}
                </li>
              ))}
            </ul>
          </div>
          {booking.snackSelections.length > 0 && (
            <div className="md:col-span-2">
              <p className="font-semibold text-primary mt-2">Snacks:</p>
              <ul className="list-disc list-inside text-gray-900 dark:text-white">
                {booking.snackSelections.map((snackSel) => (
                  <li key={snackSel.id}>
                    {snackSel.snack.name} x {snackSel.quantity} (
                    {formatCurrency(snackSel.unitPrice)})
                  </li>
                ))}
              </ul>
            </div>
          )}
          {booking.promotion && (
            <div className="md:col-span-2">
              <p className="font-semibold text-primary mt-2">
                Promotion Applied:
              </p>
              <ul className="list-disc list-inside text-gray-900 dark:text-white">
                <li>
                  {booking.promotion.code} - Discount:{" "}
                  {formatCurrency(booking.promotion.discountPrice)}
                </li>
              </ul>
            </div>
          )}
          <div className="md:col-span-2">
            <p className="font-semibold text-primary mt-2">
              Booking Created At:
            </p>
            <p className="text-gray-900 dark:text-white">
              {formatDate(booking.createdAt)}
            </p>
          </div>
          <div className="md:col-span-2 mt-4 text-right">
            <p className="text-xl font-bold text-green-600 dark:text-green-400">
              Total Price: {formatCurrency(booking.totalPrice)}
            </p>
          </div>
          <div className="md:col-span-2 flex justify-center mt-4">
            {booking.qrCodeUrl && (
              <>
                <button
                  onClick={() => setShowQr(!showQr)}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors duration-200"
                >
                  {showQr ? "Hide QR Code" : "Show QR Code"}
                </button>
              </>
            )}
          </div>
          {showQr && booking.qrCodeUrl && (
            <div className="md:col-span-2 flex justify-center mt-4">
              <div className="p-2 border border-gray-200 dark:border-gray-700 rounded-md">
                <Image
                  src={`data:image/png;base64,${booking.qrCodeUrl}`}
                  alt="QR Code"
                  width={150}
                  height={150}
                  className="w-auto h-auto max-w-[150px] max-h-[150px]"
                />
                <p className="text-center text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Scan for ticket
                </p>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true); // For main list
  const [isSearching, setIsSearching] = useState(false); // For ID search
  const [error, setError] = useState<string | null>(null); // For main list error
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchId, setSearchId] = useState<string>(""); // State for search input
  const [searchError, setSearchError] = useState<string | null>(null); // State for search error
  const [isShaking, setIsShaking] = useState(false); // State for shaking animation
  const pageSize = 100;

  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const selectedBookingId = searchParams.get("booking");

  const fetchBookings = useCallback(
    async (page: number) => {
      try {
        setLoading(true);
        const response: BookingListResponse = await BookingService.getBookings(
          page,
          pageSize
        );
        setBookings(response.data.items);
        setCurrentPage(response.data.currentPage);
        setTotalPages(response.data.totalPages);
      } catch (err) {
        setError("Failed to load bookings. Please try again later.");
        console.error("Error fetching bookings:", err);
      } finally {
        setLoading(false);
      }
    },
    [pageSize]
  );

  useEffect(() => {
    fetchBookings(currentPage);
  }, [currentPage, fetchBookings]);

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchId(event.target.value);
    setSearchError(null); // Clear previous search error
    setIsShaking(false); // Stop shaking if user types again
  };

  const handleSearchClick = async () => {
    if (!searchId.trim()) {
      setSearchError("Please enter a Booking ID.");
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500); // Stop shaking after 0.5s
      return;
    }

    setIsSearching(true); // Set searching state for ID search
    try {
      const response = await BookingService.getBookingById(searchId.trim());
      if (response.data) {
        setSearchError(null);
        handleOpenModal(response.data.id); // Open modal with the found ID
      } else {
        setSearchError("Booking ID not found.");
        setIsShaking(true);
        setTimeout(() => setIsShaking(false), 500);
      }
    } catch (err: any) {
      // Check for 404 specifically from the error message
      if (err.message && err.message.includes("status: 404")) {
        setSearchError("Booking ID not found. Try again.");
      } else {
        setSearchError("Invalid Booking ID. Try again.");
      }
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
      console.error("Error searching booking by ID:", err);
    } finally {
      setIsSearching(false); // Reset searching state
    }
  };

  const handleOpenModal = (bookingId: string) => {
    router.push(`${pathname}?booking=${bookingId}`);
  };

  const handleCloseModal = () => {
    router.push(pathname);
  };

  // CSS for shaking animation
  const shakeAnimation = `
    @keyframes shake {
      0% { transform: translateX(0); }
      25% { transform: translateX(-5px); }
      50% { transform: translateX(5px); }
      75% { transform: translateX(-5px); }
      100% { transform: translateX(0); }
    }
  `;

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-black p-4 sm:p-6 lg:p-8 text-gray-900 dark:text-white">
      <style>{shakeAnimation}</style> {/* Inject animation CSS */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Customer Bookings</h1>
      </div>

      <div className="mb-6">
        <div className="flex items-center space-x-2">
          <div className="relative flex-grow max-w-md">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg
                className="w-5 h-5 text-gray-500 dark:text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                ></path>
              </svg>
            </div>
            <input
              type="text"
              placeholder="Access booking by ID"
              value={searchId}
              onChange={handleSearchChange}
              className={`pl-10 pr-4 py-2 w-full bg-gray-200 dark:bg-gray-700 border rounded-md focus:ring-2 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400
                ${
                  searchError
                    ? "border-red-500 focus:ring-red-500"
                    : "border-transparent focus:ring-primary"
                }
                ${isShaking ? "animate-shake" : ""}
              `}
              style={{ animation: isShaking ? "shake 0.5s" : "none" }}
            />
          </div>
          <button
            onClick={handleSearchClick}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors duration-200"
            disabled={isSearching} // Disable button while searching
          >
            {isSearching ? "Searching..." : "Search"}
          </button>
        </div>
        {searchError && (
          <p className="text-red-500 text-sm mt-2">{searchError}</p>
        )}
      </div>

      <Card className="w-full p-0 shadow-lg rounded-lg overflow-hidden bg-white dark:bg-gray-800">
        {loading && bookings.length === 0 ? ( // Show loading for main list only if no bookings are loaded yet
          <p className="text-center py-8 text-gray-500 dark:text-gray-400">
            Loading bookings...
          </p>
        ) : (
          <>
            {bookings.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Booking ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Customer Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Movie
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Branch
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Showtime
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Seats
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Total Price
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {bookings.map((booking) => (
                      <tr
                        key={booking.id}
                        onClick={() => handleOpenModal(booking.id)}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 cursor-pointer"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-700 dark:text-gray-300">
                          {
                            // Display the last 10 characters of the booking ID
                            booking.id.length > 10
                              ? "..." + booking.id.slice(-10)
                              : booking.id
                          }
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                          {booking.user.fullName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                          {booking.showTime.movie.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                          {booking.showTime.branch.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                          {new Date(booking.showTime.startTime).toLocaleString(
                            "en-US",
                            {
                              month: "numeric",
                              day: "numeric",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                              hour12: false,
                            }
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                          {booking.seats.length}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600 dark:text-green-400">
                          {new Intl.NumberFormat("vi-VN", {
                            style: "currency",
                            currency: "VND",
                            currencyDisplay: "code",
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0,
                          }).format(Number(booking.totalPrice))}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              // This handles the case where the initial fetch returns no bookings
              <p className="text-center py-8 text-gray-500 dark:text-gray-400">
                No bookings found.
              </p>
            )}
          </>
        )}
      </Card>

      {/* Pagination controls */}
      <div className="flex justify-center items-center space-x-2 mt-6">
        <button
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md opacity-50 cursor-not-allowed"
          disabled
        >
          Previous
        </button>
        <span className="px-4 py-2 bg-primary text-primary-foreground rounded-md">
          1
        </span>
        <button
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md opacity-50 cursor-not-allowed"
          disabled
        >
          Next
        </button>
      </div>

      {selectedBookingId && (
        <BookingDetailModal
          bookingId={selectedBookingId}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}