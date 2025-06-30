"use client";

import { type User, cinemas } from "@/utils/data";
import { Badge } from "@/components/ui/badge";
import { Heart, Building, Bell, BellOff } from "lucide-react";
import {
  ProfileDataResponse,
  ProfileResponse,
} from "@/lib/api/service/fetchUser";

interface PreferencesProps {
  user: ProfileDataResponse;
}

export default function Preferences({ user }: PreferencesProps) {
  return (
    // <div className="bg-gray-100 p-4 rounded-lg">
    //   <h2 className="text-lg font-semibold mb-2">Preferences & Saved Movies</h2>
    //   {user.preferences && (
    //     <div className="space-y-4">
    //       <div className="space-y-2">
    //         <div className="flex items-center gap-2">
    //           <Heart className="w-4 h-4 text-gray-600" />
    //           <h3 className="font-semibold text-gray-600">Favorite Genres</h3>
    //         </div>
    //         <div className="flex flex-wrap gap-2">
    //           {user.preferences.favoriteGenres.map((genre, index) => (
    //             <Badge
    //               key={index}
    //               variant="secondary"
    //               className="bg-gray-100 text-gray-600"
    //             >
    //               {genre}
    //             </Badge>
    //           ))}
    //         </div>
    //       </div>
    //       <div className="space-y-2">
    //         <div className="flex items-center gap-2">
    //           <Building className="w-4 h-4 text-gray-600" />
    //           <h3 className="font-semibold text-gray-600">Preferred Cinemas</h3>
    //         </div>
    //         <div className="flex flex-wrap gap-2">
    //           {user.preferences.preferredCinemas.map((id, index) => {
    //             const cinema = cinemas.find((c) => c.id === id);
    //             return (
    //               <Badge
    //                 key={index}
    //                 variant="outline"
    //                 className="border-gray-600 text-gray-600"
    //               >
    //                 {cinema?.name || "Unknown"}
    //               </Badge>
    //             );
    //           })}
    //         </div>
    //       </div>
    //       <div className="space-y-2">
    //         <div className="flex items-center gap-2">
    //           {user.preferences.notifications ? (
    //             <Bell className="w-4 h-4 text-gray-600" />
    //           ) : (
    //             <BellOff className="w-4 h-4 text-gray-500" />
    //           )}
    //           <h3 className="font-semibold text-gray-600">Notifications</h3>
    //         </div>
    //         <Badge
    //           variant={user.preferences.notifications ? "default" : "secondary"}
    //           className={
    //             user.preferences.notifications
    //               ? "bg-gray-100 text-gray-600"
    //               : "bg-gray-200 text-gray-500"
    //           }
    //         >
    //           {user.preferences.notifications ? "Enabled" : "Disabled"}
    //         </Badge>
    //       </div>
    //     </div>
    //   )}
    //   <div className="border-t border-gray-300 pt-4 mt-4">
    //     <h3 className="font-semibold text-gray-600 mb-2">Saved Movies</h3>
    //     <div className="space-y-2">
    //       <div className="flex items-center justify-between">
    //         <span className="text-gray-600">The Last Guardian</span>
    //         <span className="text-xs text-gray-500">Coming June 15, 2025</span>
    //       </div>
    //       <div className="flex items-center justify-between">
    //         <span className="text-gray-600">Whispers in the Dark</span>
    //         <span className="text-xs text-gray-500">Coming June 22, 2025</span>
    //       </div>
    //       <div className="flex items-center justify-between">
    //         <span className="text-gray-600">Crown of Thorns</span>
    //         <span className="text-xs text-gray-500">Coming July 5, 2025</span>
    //       </div>
    //     </div>
    //   </div>
    // </div>
    <div>Hello</div>
  );
}
