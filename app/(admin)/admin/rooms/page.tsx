"use client";

import React, { useState } from "react";
import {
  Building2,
  MapPin,
  Search,
  Filter,
  ChevronRight,
  X,
  Home,
  CheckCircle,
} from "lucide-react";
import { Dialog } from "@headlessui/react";
import { useBranch } from "@/hooks/useBranch";
import { Branch } from "@/lib/api/service/fetchBranch";
import { useRoomByBranchId } from "@/hooks/useRoom";
import RoomSeatingChart from "@/app/movies/[id]/components/seatChart";
import { useTranslation } from "react-i18next";
import SeatSelector from "@/app/movies/[id]/components/SeatSelector";
import { Seat, seatType } from "@/lib/api/service/fetchSeat";
import { useSeatOfRoomByRoomId } from "@/hooks/useSeat";

function App() {
  const { t } = useTranslation();
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showRooms, setShowRooms] = useState(false);
  const [hasImageError, setHasImageError] = useState(false);
  const [openRoomModal, setOpenRoomModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<any>(null);
  const { data: roomSeats = [], isLoading: isLoadingSeats } =
    useSeatOfRoomByRoomId(selectedRoom?.id);

  const { rooms, isLoading: loadingRooms } = useRoomByBranchId(
    selectedBranch?.id || ""
  );
  const { branches } = useBranch();

  const filteredBranches = branches?.filter(
    (branch) =>
      branch.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      branch.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleBranchClick = (branch: Branch) => {
    setSelectedBranch(branch);
    setShowRooms(true);
  };

  const closeRoomView = () => {
    setShowRooms(false);
    setSelectedBranch(null);
  };

  const openRoomChartModal = (room: any) => {
    setSelectedRoom(room);
    setOpenRoomModal(true);
  };

  const closeRoomChartModal = () => {
    setSelectedRoom(null);
    setOpenRoomModal(false);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-background">
      <header className="bg-white dark:bg-background shadow border-b dark:border-b-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <Building2 className="h-8 w-8 text-blue-600 dark:text-white" />
            <h1 className="ml-3 text-2xl font-semibold text-gray-900 dark:text-white">
              {t("room.manageBranch")}
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder={t("room.searchBranch")}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button className="inline-flex items-center px-4 py-2 text-gray-700 hover:text-blue-600 transition-colors">
              <Filter className="h-4 w-4 mr-2" />
              {t("room.filter")}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {!showRooms ? (
          <>
            <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              <StatCard
                icon={<Building2 className="text-blue-600" />}
                label={t("room.totalBranch")}
                value={branches?.length || 0}
                bg="bg-blue-100"
              />
              <StatCard
                icon={<Home className="text-purple-600" />}
                label={t("room.totalRoom")}
                value={branches?.reduce((sum, b) => sum + b.totalRoom, 0) || 0}
                bg="bg-purple-100"
              />
              <StatCard
                icon={<CheckCircle className="text-orange-600" />}
                label={t("room.active")}
                value={branches?.length || 0}
                bg="bg-orange-100"
              />
            </section>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBranches?.map((branch) => {
                const getInitials = (name: string) =>
                  name
                    .split(" ")
                    .map((word) => word.charAt(0).toUpperCase())
                    .join("")
                    .slice(0, 3);

                return (
                  <div
                    key={branch.id}
                    onClick={() => handleBranchClick(branch)}
                    className="cursor-pointer bg-white dark:bg-background rounded-xl shadow border hover:shadow-md transition-all duration-200 overflow-hidden"
                  >
                    <div className="relative h-48 bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-3xl font-bold text-white">
                      {!hasImageError ? (
                        <img
                          src={branch.address}
                          alt={branch.name}
                          className="object-cover w-full h-full"
                          onError={() => setHasImageError(true)}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-600 dark:from-blue-700 dark:to-indigo-700">
                          {getInitials(branch.name)}
                        </div>
                      )}
                      <span className="absolute top-4 right-4 bg-white bg-opacity-80 dark:bg-gray-900 px-3 py-1 rounded-full text-sm font-medium shadow text-gray-800 dark:text-white">
                        {branch.totalRoom} {t("room.room")}
                      </span>
                    </div>
                    <div className="p-5">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                          {branch.name}
                        </h3>
                        <ChevronRight className="h-5 w-5 text-gray-400 dark:text-white" />
                      </div>
                      <div className="flex items-center text-gray-500 text-sm">
                        <MapPin className="h-4 w-4 mr-2" />
                        {branch.address}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <button
                onClick={closeRoomView}
                className="flex items-center px-4 py-2 text-gray-700 hover:text-blue-600"
              >
                <ChevronRight className="h-4 w-4 mr-2 rotate-180" />
                {t("room.backToBranch")}
              </button>
              <button
                onClick={closeRoomView}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div>
              <h2 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
                {selectedBranch?.name}
              </h2>
              <p className="text-sm text-gray-500">{selectedBranch?.address}</p>
            </div>

            {loadingRooms ? (
              <p>{t("room.loadingRoom")}</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {rooms?.map((room) => (
                  <div
                    key={room.id}
                    className="p-4 rounded-lg shadow bg-white dark:bg-background border cursor-pointer"
                    onClick={() => openRoomChartModal(room)}
                  >
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {t("room.room")} {room.roomNumber}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {t("room.type")}:{" "}
                      {room.roomType?.name || t("room.unknown")}
                    </p>
                    <p className="text-sm text-gray-500">
                      {t("room.capacity")}: {room.capacity}
                    </p>
                    <p className="text-sm text-green-600">{room.status}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Modal hiện sơ đồ ghế */}
      <Dialog
        open={openRoomModal}
        onClose={closeRoomChartModal}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/40" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-7xl max-h-[90vh] overflow-y-auto bg-white dark:bg-background rounded-lg p-6 shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <Dialog.Title className="text-lg font-bold">
                {t("room.seatChart")} - {t("room.room")}{" "}
                {selectedRoom?.roomNumber}
              </Dialog.Title>
              <button
                onClick={closeRoomChartModal}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            {selectedRoom && selectedBranch && (
              <>
                {isLoadingSeats ? (
                  <div className="text-center py-10">
                    {t("Đang tải ghế...")}
                  </div>
                ) : (
                  <>
                    <div className="flex flex-col gap-4 items-center">
                      {Object.entries(
                        roomSeats.reduce(
                          (acc: Record<string, Seat[]>, seat) => {
                            acc[seat.row] = acc[seat.row] || [];
                            acc[seat.row].push(seat);
                            return acc;
                          },
                          {}
                        )
                      )
                        .sort((a, b) => a[0].localeCompare(b[0]))
                        .map(([row, rowSeats]) => (
                          <div key={row} className="flex items-center gap-4">
                            <span className="w-8 font-bold text-lg text-gray-700 dark:text-gray-300">
                              {row}
                            </span>
                            <div className="flex gap-2 flex-wrap">
                              {rowSeats
                                .sort((a, b) => a.number - b.number)
                                .map((seat) => {
                                  const type = seat.seatType?.name;
                                  const isCouple = type === seatType.couple;
                                  const color =
                                    type === seatType.vip
                                      ? "bg-red-400"
                                      : type === seatType.couple
                                      ? "bg-pink-300"
                                      : "bg-blue-400";

                                  return (
                                    <div
                                      key={seat.id}
                                      title={type}
                                      className={`rounded-md border border-white font-semibold
                            ${color} ${
                                        isCouple ? "w-20" : "w-10"
                                      } h-10 flex items-center justify-center text-sm`}
                                    >
                                      {isCouple ? "❤️" : seat.row + seat.number}
                                    </div>
                                  );
                                })}
                            </div>
                          </div>
                        ))}
                    </div>

                    <div className="mt-6 flex justify-center gap-4 text-sm flex-wrap">
                      <Legend color="bg-blue-400" label={t("Ghế Thường")} />
                      <Legend color="bg-red-400" label={t("Ghế Vip")} />
                      <Legend color="bg-pink-300" label={t("Ghế Đôi")} />
                    </div>
                  </>
                )}
              </>
            )}
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  bg,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  bg: string;
}) {
  return (
    <div className="bg-white dark:bg-background rounded-xl shadow border p-6 flex items-center">
      <div className={`p-3 rounded-lg ${bg}`}>{icon}</div>
      <div className="ml-4">
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-2xl font-semibold text-gray-900 dark:text-white">
          {value}
        </p>
      </div>
    </div>
  );
}

const Legend = ({ color, label }: { color: string; label: string }) => (
  <div className="flex items-center gap-1">
    <div className={`w-4 h-4 rounded ${color}`} />
    {label}
  </div>
);

export default App;
