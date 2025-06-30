"use client";

import {
  type User,
  showtimes,
  movies,
  cinemas,
  formatCurrency,
  type Showtime,
  Movie,
  Cinema,
} from "@/utils/data";
import { Badge } from "@/components/ui/badge";
import { ProfileDataResponse } from "@/lib/api/service/fetchUser";

interface BookingHistoryProps {
  user: ProfileDataResponse;
}

const getMovieAndCinema = (
  showtime: Showtime,
  movies: Movie[],
  cinemas: Cinema[]
) => {
  const movie = movies.find((m) => m.id === showtime.movieId);
  const cinema = cinemas.find((c) => c.id === showtime.cinemaId);
  return {
    movieTitle: movie?.title || "Unknown",
    cinemaName: cinema?.name || "Unknown",
  };
};

export default function BookingHistory({ user }: BookingHistoryProps) {
  return (
    // <div className="bg-gray-100 p-4 rounded-lg">
    //   <h2 className="text-lg font-semibold mb-2">Complete Booking History</h2>
    //   {user.bookingHistory && user.bookingHistory.length > 0 ? (
    //     <div className="overflow-x-auto">
    //       <div className="rounded-lg border border-gray-300">
    //         <table className="w-full bg-white rounded-lg overflow-hidden">
    //           <thead>
    //             <tr className="bg-gray-300 text-black">
    //               <th className="text-left p-3 font-semibold">Movie</th>
    //               <th className="text-left p-3 font-semibold">Cinema</th>
    //               <th className="text-left p-3 font-semibold">Date & Time</th>
    //               <th className="text-left p-3 font-semibold">Tickets</th>
    //               <th className="text-left p-3 font-semibold">Total</th>
    //             </tr>
    //           </thead>
    //           <tbody>
    //             {user.bookingHistory.map((booking, index) => {
    //               const showtime = showtimes.find(
    //                 (s) => s.id === booking.showtimeId
    //               );
    //               if (!showtime) return null;
    //               const { movieTitle, cinemaName } = getMovieAndCinema(
    //                 showtime,
    //                 movies,
    //                 cinemas
    //               );
    //               return (
    //                 <tr
    //                   key={booking.showtimeId}
    //                   className="border-b border-gray-300 hover:bg-gray-50 transition"
    //                 >
    //                   <td className="p-3">
    //                     <div className="font-medium text-gray-900">
    //                       {movieTitle}
    //                     </div>
    //                   </td>
    //                   <td className="p-3 text-gray-600">{cinemaName}</td>
    //                   <td className="p-3">
    //                     <div className="text-gray-900">{showtime.date}</div>
    //                     <div className="text-sm text-gray-500">
    //                       {showtime.time}
    //                     </div>
    //                   </td>
    //                   <td className="p-3">
    //                     <Badge
    //                       variant="outline"
    //                       className="border-gray-600 text-gray-600"
    //                     >
    //                       {booking.tickets}
    //                     </Badge>
    //                   </td>
    //                   <td className="p-3">
    //                     <span className="font-semibold text-gray-600">
    //                       {formatCurrency(booking.totalAmount)}
    //                     </span>
    //                   </td>
    //                 </tr>
    //               );
    //             })}
    //           </tbody>
    //         </table>
    //       </div>
    //     </div>
    //   ) : (
    //     <p className="text-gray-600">No booking history available.</p>
    //   )}
    // </div>

    <div>Hello</div>
  );
}
