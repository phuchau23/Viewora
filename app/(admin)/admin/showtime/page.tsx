"use client";

import React, { useState } from "react";
import { useDeleteShowTime, useShowTime } from "@/hooks/useShowTime";
import { Calendar, Clock, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import CreateShowtimeForm from "./components/CreateShowtimeForm";
import { toast } from "@/hooks/use-toast";
import ConfirmDialog from "@/components/ui/confirmDialog";

export default function ShowTimeDashboard() {
  const { showTime, isLoading, error } = useShowTime();
  const [isOpen, setIsOpen] = useState(false);
  const { mutateAsync: deleteMutation } = useDeleteShowTime();
  const [selectedToDelete, setSelectedToDelete] = useState<string | null>(null);

  if (isLoading) return <p className="text-center py-10">Loading...</p>;
  if (error)
    return (
      <p className="text-center text-red-500 py-10">
        ❌ Failed to load showtimes.
      </p>
    );

  return (
    <div className="relative flex min-h-screen bg-gray-50 dark:bg-background transition-colors">
      {/* Main content */}
      <div
        className={`flex-1 px-4 sm:px-6 py-8 transition-all duration-300 ${
          isOpen ? "md:w-3/4" : "w-full"
        }`}
      >
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
            🎬 Showtime Dashboard
          </h1>
          <Button onClick={() => setIsOpen(true)}>+ Add Showtime</Button>
        </div>

        {/* 👨‍💻 TABLE - Desktop only */}
        <div className="hidden md:block">
          <div className="w-full rounded-xl border dark:border-gray-700 shadow-md bg-white dark:bg-background">
            <table className="w-full text-sm">
              <thead className="bg-gray-100 dark:bg-[#112]">
                <tr>
                  {[
                    "Movie",
                    "Branch",
                    "Room",
                    "Start",
                    "End",
                    "Duration",
                    "Action",
                  ].map((header) => (
                    <th
                      key={header}
                      className="px-6 py-3 text-left font-semibold text-gray-700 dark:text-gray-300"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {showTime.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                      {item.movie?.name}
                      <div className="text-xs text-gray-500">
                        {item.movie?.movieType?.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-800 dark:text-gray-200">
                      {item.room?.branch?.name}
                      <div className="text-xs text-gray-500">
                        {item.room?.branch?.address}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-700 dark:text-gray-300">
                      Room {item.room?.roomNumber} • {item.room?.roomType?.name}
                    </td>
                    <td className="px-6 py-4 text-gray-700 dark:text-gray-300">
                      <div className="flex items-center gap-1">
                        <Calendar size={14} />
                        {new Date(item.startTime).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                        <Clock size={14} />
                        {new Date(item.startTime).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-700 dark:text-gray-300">
                      {new Date(item.endTime).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className="px-6 py-4 text-gray-700 dark:text-gray-300">
                      {item.movie?.duration} phút
                    </td>
                    <td className="px-6 py-4">
                      <Button
                        variant="destructive"
                        onClick={() => setSelectedToDelete(item.id)}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 📱 CARD LIST - Mobile only */}
        <div className="block md:hidden space-y-4">
          {showTime.map((item) => (
            <div
              key={item.id}
              className="rounded-lg border dark:border-gray-700 shadow bg-white dark:bg-gray-900 p-4 space-y-2"
            >
              <div className="text-lg font-semibold text-gray-900 dark:text-white">
                {item.movie?.name}
              </div>
              <div className="text-sm text-gray-500">
                {item.movie?.movieType?.name}
              </div>
              <div className="text-sm text-gray-700 dark:text-gray-300">
                📍 {item.room?.branch?.name} - {item.room?.branch?.address}
              </div>
              <div className="text-sm text-gray-700 dark:text-gray-300">
                🏠 Room {item.room?.roomNumber} • {item.room?.roomType?.name}
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-700 dark:text-gray-300">
                  🕒{" "}
                  {new Date(item.startTime).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
                <span className="text-gray-700 dark:text-gray-300">
                  ⏱ {item.movie?.duration} phút
                </span>
              </div>
              <Button
                variant="destructive"
                onClick={() => setSelectedToDelete(item.id)}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Slide-over panel */}
      {isOpen && (
        <div className="fixed inset-y-0 right-0 w-full max-w-md bg-white dark:bg-gray-900 shadow-xl z-50 transform transition-transform duration-300 border-l border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Add Showtime
            </h2>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="p-4 overflow-y-auto max-h-[calc(100vh-64px)]">
            <CreateShowtimeForm onSuccess={() => setIsOpen(false)} />
          </div>
        </div>
      )}

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        open={!!selectedToDelete}
        onCancel={() => setSelectedToDelete(null)}
        onConfirm={async () => {
          if (!selectedToDelete) return;
          try {
            await deleteMutation(selectedToDelete);
            toast({
              title: "🗑️ Xoá suất chiếu thành công",
            });
          } catch (error) {
            toast({
              title: "❌ Xoá thất bại",
              description: "Vui lòng thử lại.",
            });
          } finally {
            setSelectedToDelete(null);
          }
        }}
      />
    </div>
  );
}
