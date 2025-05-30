"use client";

import { useState, useEffect } from "react";
import {
  type Cinema,
  cinemas,
  formatCurrency,
  type Movie,
  movies,
  sampleUser,
  type Showtime,
  showtimes,
  type User,
} from "@/lib/data";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Heart,
  Building,
  Bell,
  BellOff,
  Film,
  Star,
  CreditCard,
  Edit3,
  Ticket,
  UserIcon,
} from "lucide-react";
import EditProfileModal from "./components/Editprofile";

const fetchUserData = async (userId: string): Promise<User | null> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return sampleUser;
};

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

interface ProfilePageProps {
  userId: string;
}

export default function ProfilePage({ userId }: ProfilePageProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("personal");
  const [theme] = useState<"light" | "dark">("dark"); // Default to dark, no toggle

  useEffect(() => {
    const loadUserData = async () => {
      try {
        setLoading(true);
        const userData = await fetchUserData(userId);
        setUser(userData);
      } catch (err) {
        setError("Failed to load user data.");
      } finally {
        setLoading(false);
      }
    };
    loadUserData();
  }, [userId]);

  const handleSaveProfile = async (updatedUser: User) => {
    try {
      setUser(updatedUser);
    } catch (error) {
      throw new Error("Failed to update profile");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-300"></div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="flex flex-col justify-center items-center h-screen text-center">
        <div className="text-6xl mb-4">😞</div>
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Oops! Something went wrong
        </h2>
        <p className="text-muted-foreground">{error || "User not found."}</p>
      </div>
    );
  }

  const totalBookings = user.bookingHistory?.length || 0;
  const totalSpent =
    user.bookingHistory?.reduce(
      (sum, booking) => sum + booking.totalAmount,
      0
    ) || 0;
  const totalTickets =
    user.bookingHistory?.reduce((sum, booking) => sum + booking.tickets, 0) || 0;

  const totalMoviesWatched = totalBookings || 42;
  const totalReviewsWritten = 28;
  const favoriteTheaters = user.preferences?.preferredCinemas?.length || 3;
  const loyaltyPoints = 1250;

  const renderContent = () => {
    switch (activeTab) {
      case "personal":
        return (
          <Card className="mb-6 border-0 bg-card shadow-md rounded-lg">
            <CardHeader className="p-4 flex justify-between items-center">
              <CardTitle className="text-lg font-semibold text-card-foreground bg-muted bg-zinc-400 px-6 py-2 rounded-t-md text-left w-full">
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-muted-foreground text-sm">Firstname</p>
                  <p className="text-card-foreground">{user.firstName}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">Lastname</p>
                  <p className="text-card-foreground">{user.lastName}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">Email</p>
                  <p className="text-card-foreground">{user.email}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">Phone</p>
                  <p className="text-card-foreground">{user.phone}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">Gender</p>
                  <p className="text-card-foreground">{user.sex}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">Date of Birth</p>
                  <p className="text-card-foreground">
                    {/* {new Date(user.dateOfBirth).toLocaleDateString()} */}
                  </p>
                </div>
              </div>
            </CardContent>
            <Card className="mb-6 border-0 bg-card shadow-md rounded-lg">
              <CardHeader className="p-4 flex justify-between items-center">
              <CardTitle className="text-lg font-semibold text-card-foreground bg-muted bg-zinc-400 px-6 py-2 rounded-t-md text-left w-full">
                  Address
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-muted-foreground text-sm">Flat/House No./Bldg/Apt</p>
                    <p className="text-card-foreground">{user.address?.houseNo}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-sm">Street/Area/Village</p>
                    <p className="text-card-foreground">{user.address?.street}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-sm">Town/City</p>
                    <p className="text-card-foreground">{user.address?.city}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-sm">Pincode</p>
                    <p className="text-card-foreground">{user.address?.pincode}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-sm">Landmark</p>
                    <p className="text-card-foreground">{user.address?.landmark}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-sm">State</p>
                    <p className="text-card-foreground">{user.address?.state}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Card>
        );
      case "Points":
        return (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
            <Card className="border-0 bg-card shadow-md rounded-lg text-center p-4">
              <div className="w-10 h-10 bg-orange-300 rounded-full flex items-center justify-center mx-auto mb-2">
                <Film className="w-5 h-5 text-black" />
              </div>
              <h3 className="text-lg font-semibold text-orange-300">{totalMoviesWatched}</h3>
              <p className="text-xs text-muted-foreground">Movies Watched</p>
            </Card>
            <Card className="border-0 bg-card shadow-md rounded-lg text-center p-4">
              <div className="w-10 h-10 bg-orange-300 rounded-full flex items-center justify-center mx-auto mb-2">
                <Star className="w-5 h-5 text-black" />
              </div>
              <h3 className="text-lg font-semibold text-orange-300">{totalReviewsWritten}</h3>
              <p className="text-xs text-muted-foreground">Reviews Written</p>
            </Card>
            <Card className="border-0 bg-card shadow-md rounded-lg text-center p-4">
              <div className="w-10 h-10 bg-orange-300 rounded-full flex items-center justify-center mx-auto mb-2">
                <Building className="w-5 h-5 text-black" />
              </div>
              <h3 className="text-lg font-semibold text-orange-300">{favoriteTheaters}</h3>
              <p className="text-xs text-muted-foreground">Favorite Theaters</p>
            </Card>
            <Card className="border-0 bg-card shadow-md rounded-lg text-center p-4">
              <div className="w-10 h-10 bg-orange-300 rounded-full flex items-center justify-center mx-auto mb-2">
                <CreditCard className="w-5 h-5 text-black" />
              </div>
              <h3 className="text-lg font-semibold text-orange-300">{loyaltyPoints}</h3>
              <p className="text-xs text-muted-foreground">Loyalty Points</p>
            </Card>
          </div>
        );
      case "preferences":
        return (
          <Card className="border-0 bg-card shadow-md rounded-lg">
            <CardHeader className="p-4">
            <CardTitle className="text-lg font-semibold text-card-foreground bg-muted bg-zinc-400 px-6 py-2 rounded-t-md text-left w-full">
            Preferences & Saved Movies
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              {user.preferences && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Heart className="w-4 h-4 text-orange-300" />
                    <h3 className="font-semibold text-orange-300">Favorite Genres</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {user.preferences.favoriteGenres.map((genre, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="bg-orange-300 text-black"
                      >
                        {genre}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex items-center gap-2">
                    <Building className="w-4 h-4 text-orange-300" />
                    <h3 className="font-semibold text-orange-300">Preferred Cinemas</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {user.preferences.preferredCinemas.map((id, index) => {
                      const cinema = cinemas.find((c) => c.id === id);
                      return (
                        <Badge
                          key={index}
                          variant="outline"
                          className="border-orange-300 text-orange-300"
                        >
                          {cinema?.name || "Unknown"}
                        </Badge>
                      );
                    })}
                  </div>
                  <div className="flex items-center gap-2">
                    {user.preferences.notifications ? (
                      <Bell className="w-4 h-4 text-orange-300" />
                    ) : (
                      <BellOff className="w-4 h-4 text-muted-foreground" />
                    )}
                    <h3 className="font-semibold text-orange-300">Notifications</h3>
                  </div>
                  <Badge
                    variant={user.preferences.notifications ? "default" : "secondary"}
                    className={
                      user.preferences.notifications
                        ? "bg-orange-300 text-black"
                        : "bg-muted text-card-foreground"
                    }
                  >
                    {user.preferences.notifications ? "Enabled" : "Disabled"}
                  </Badge>
                </div>
              )}
              <div className="border-t border-muted pt-4">
                <h3 className="font-semibold text-orange-300 mb-2">Saved Movies</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">The Last Guardian</span>
                    <span className="text-xs text-muted-foreground">Coming June 15, 2025</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Whispers in the Dark</span>
                    <span className="text-xs text-muted-foreground">Coming June 22, 2025</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Crown of Thorns</span>
                    <span className="text-xs text-muted-foreground">Coming July 5, 2025</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      case "booking":
        return (
          user.bookingHistory &&
          user.bookingHistory.length > 0 && (
            <Card className="border-0 bg-card shadow-md rounded-lg">
              <CardHeader className="p-4">
              <CardTitle className="text-lg font-semibold text-card-foreground bg-muted bg-zinc-400 px-6 py-2 rounded-t-md text-left w-full">
                  Complete Booking History
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="overflow-x-auto">
                  <div className="rounded-lg border border-muted">
                    <table className="w-full bg-card rounded-lg overflow-hidden">
                      <thead>
                        <tr className="bg-orange-500 text-white">
                          <th className="text-left p-3 font-semibold">Movie</th>
                          <th className="text-left p-3 font-semibold">Cinema</th>
                          <th className="text-left p-3 font-semibold">Date & Time</th>
                          <th className="text-left p-3 font-semibold">Tickets</th>
                          <th className="text-left p-3 font-semibold">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {user.bookingHistory.map((booking, index) => {
                          const showtime = showtimes.find((s) => s.id === booking.showtimeId);
                          if (!showtime) return null;
                          const { movieTitle, cinemaName } = getMovieAndCinema(showtime, movies, cinemas);
                          return (
                            <tr
                              key={booking.showtimeId}
                              className="border-b border-muted hover:bg-orange-100/20 transition"
                            >
                              <td className="p-3">
                                <div className="font-medium text-card-foreground">{movieTitle}</div>
                              </td>
                              <td className="p-3 text-muted-foreground">{cinemaName}</td>
                              <td className="p-3">
                                <div className="text-card-foreground">{showtime.date}</div>
                                <div className="text-sm text-muted-foreground">{showtime.time}</div>
                              </td>
                              <td className="p-3">
                                <Badge
                                  variant="outline"
                                  className="border-orange-300 text-orange-300"
                                >
                                  {booking.tickets}
                                </Badge>
                              </td>
                              <td className="p-3">
                                <span className="font-semibold text-orange-300">
                                  {formatCurrency(booking.totalAmount)}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        );
      default:
        return null;
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${theme === "light" ? "bg-background text-foreground" : "bg-background text-foreground"}`}>
      <div className="container mx-auto p-6 max-w-6xl">
        {/* Profile Header */}
        <Card className="mb-8 overflow-hidden border-0 shadow-xl bg-card text-card-foreground">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row items-center lg:items-start gap-6">
              <Avatar className="w-24 h-24 border-4 border-muted">
                <AvatarImage src={user.avatar || "/profile1.png"} alt="User Avatar" />
                <AvatarFallback className="text-2xl bg-muted text-orange-300">
                  {`${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 text-center lg:text-left">
                <div className="flex justify-between items-center">
                  <div>
                    <h1 className="text-3xl font-bold mb-1">{`${user.firstName} ${user.lastName}`}</h1>
                    <p className="text-muted-foreground">{`${user.address?.city}, ${user.address?.state}, ${user.address?.country}`}</p>
                  </div>
                  <Button
                    variant="secondary"
                    className="bg-transparent text-orange-300 border border-orange-300 hover:bg-orange-300 hover:text-black"
                    onClick={() => setIsEditModalOpen(true)}
                  >
                    <Edit3 className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Horizontal Navigation Bar */}
        <div className="mb-6">
          <nav className="flex flex-wrap gap-4 border-b border-muted">
            <button
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                activeTab === "personal"
                  ? "border-b-2 border-orange-300 text-orange-300"
                  : "text-muted-foreground hover:text-orange-300"
              }`}
              onClick={() => setActiveTab("personal")}
            >
              <UserIcon className="w-4 h-4" />
              Personal Information
            </button>
            <button
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                activeTab === "Points"
                  ? "border-b-2 border-orange-300 text-orange-300"
                  : "text-muted-foreground hover:text-orange-300"
              }`}
              onClick={() => setActiveTab("Points")}
            >
              <Film className="w-4 h-4" />
              Points
            </button>
            <button
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                activeTab === "preferences"
                  ? "border-b-2 border-orange-300 text-orange-300"
                  : "text-muted-foreground hover:text-orange-300"
              }`}
              onClick={() => setActiveTab("preferences")}
            >
              <Heart className="w-4 h-4" />
              Preferences & Saved Movies
            </button>
            <button
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                activeTab === "booking"
                  ? "border-b-2 border-orange-300 text-orange-300"
                  : "text-muted-foreground hover:text-orange-300"
              }`}
              onClick={() => setActiveTab("booking")}
            >
              <Ticket className="w-4 h-4" />
              Booking History
            </button>
          </nav>
        </div>

        {/* Dynamic Content */}
        {renderContent()}

        {/* Edit Profile Modal */}
        <EditProfileModal
          user={user}
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSave={handleSaveProfile}
        />
      </div>
    </div>
  );
}