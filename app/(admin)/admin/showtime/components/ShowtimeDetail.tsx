import {
  Film,
  X,
  Users,
  MapPin,
  Calendar,
  DollarSign,
  Star,
  Edit,
  Trash2,
  Clock,
} from "lucide-react";
import { useDeleteShowTime } from "@/hooks/useShowTime";

interface ShowtimeDetailModalProps {
  showtime: any;
  isOpen: boolean;
  onClose: () => void;
}

export const ShowtimeDetailModal: React.FC<ShowtimeDetailModalProps> = ({
  showtime,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !showtime) return null;

  const formatTime = (timeString: string) => {
    const date = new Date(timeString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  const formatDate = (timeString: string) => {
    const date = new Date(timeString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "nowShowing":
        return "bg-green-100 text-green-800";
      case "inComing":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getMovieTypeColor = (type: string) => {
    switch (type) {
      case "IMAX":
        return "bg-purple-100 text-purple-800";
      case "3D":
        return "bg-indigo-100 text-indigo-800";
      case "4DX":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const { mutateAsync: deleteShowTime } = useDeleteShowTime();

  const handleDeleteShowtime = async () => {
    deleteShowTime(showtime.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-background rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-4 sm:p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-4 sm:mb-6">
            <div className="flex-1">
              <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-2">
                {showtime.movie.name}
              </h2>
              <div className="flex flex-wrap items-center gap-2 mb-2 sm:mb-3">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                    showtime.movie.status
                  )}`}
                >
                  {showtime.movie.status}
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${getMovieTypeColor(
                    showtime.movie.movieType?.name ?? "undefined"
                  )}`}
                >
                  {showtime.movie.movieType?.name}
                </span>
                <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-medium">
                  {showtime.movie.age}
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X size={24} className="text-gray-600" />
            </button>
          </div>

          {/* Movie Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
            <div className="space-y-3 sm:space-y-4">
              <div>
                <h3 className="font-semibold text-foreground mb-2">
                  Movie Information
                </h3>
                <div className="space-y-1 sm:space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Film size={16} className="text-gray-500" />
                    <span className="text-gray-600">Director:</span>
                    <span className="font-medium">
                      {showtime.movie.director}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users size={16} className="text-gray-500" />
                    <span className="text-gray-600">Cast:</span>
                    <span className="font-medium">{showtime.movie.actor}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={16} className="text-gray-500" />
                    <span className="text-gray-600">Duration:</span>
                    <span className="font-medium">
                      {showtime.movie.duration} minutes
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star size={16} className="text-gray-500" />
                    <span className="text-gray-600">Rating:</span>
                    <span className="font-medium">
                      {showtime.movie.rate}/10
                    </span>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">
                  Description
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {showtime.movie.description}
                </p>
              </div>
            </div>

            <div className="space-y-3 sm:space-y-4">
              <div>
                <h3 className="font-semibold text-foreground mb-2">
                  Venue Information
                </h3>
                <div className="space-y-1 sm:space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <MapPin size={16} className="text-gray-500" />
                    <span className="text-gray-600">Branch:</span>
                    <span className="font-medium">
                      {showtime.room.branch.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600 ml-6">Address:</span>
                    <span className="font-medium">
                      {showtime.room.branch.address}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600 ml-6">Room:</span>
                    <span className="font-medium">
                      Room {showtime.room.roomNumber} (
                      {showtime.room.roomType.name})
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users size={16} className="text-gray-500" />
                    <span className="text-gray-600">Capacity:</span>
                    <span className="font-medium">
                      {showtime.room.capacity} seats
                    </span>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">
                  Showtime Details
                </h3>
                <div className="space-y-1 sm:space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar size={16} className="text-gray-500" />
                    <span className="text-gray-600">Date:</span>
                    <span className="font-medium">
                      {formatDate(showtime.startTime)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={16} className="text-gray-500" />
                    <span className="text-gray-600">Time:</span>
                    <span className="font-medium">
                      {formatTime(showtime.startTime)} -{" "}
                      {formatTime(showtime.endTime)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign size={16} className="text-gray-500" />
                    <span className="text-gray-600">Base Price:</span>
                    <span className="font-medium text-green-600">
                      ${showtime.basePrice}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 pt-4 border-t border-gray-200">
            <button
              onClick={onClose}
              className="px-4 py-2 text-foreground hover:text-gray-800 transition-colors"
            >
              Close
            </button>
            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium flex items-center gap-2 transition-colors">
              <Edit size={16} />
              Edit Showtime
            </button>
            <button
              onClick={handleDeleteShowtime}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium flex items-center gap-2 transition-colors"
            >
              <Trash2 size={16} />
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
