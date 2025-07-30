"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { useBookingById } from "@/hooks/useBooking";
import { Clock, Video, MapPin, Film } from "lucide-react";
import React from "react";
import { useTranslation } from "react-i18next";

interface BookingDetailModalProps {
  open: boolean;
  onClose: () => void;
  bookingId: string;
}

export function BookingDetailModal({
  open,
  onClose,
  bookingId,
}: BookingDetailModalProps) {
  const { t } = useTranslation();
  const { booking } = useBookingById(bookingId);

  if (!booking) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t("bookingdetail.title")}</DialogTitle>
          <DialogDescription>
            {t("bookingdetail.description")}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center space-x-4">
            <Avatar className="h-16 w-16">
              <AvatarFallback>
                {booking.user.fullName
                  .split(" ")
                  .map((n: string) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-lg font-semibold">{booking.user.fullName}</h3>
              <div className="text-sm text-muted-foreground">
                {booking.user.email}
              </div>
              {booking.user.phoneNumber && (
                <div className="text-sm text-muted-foreground">
                  {booking.user.phoneNumber}
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Showtime Info */}
          <div className="space-y-4">
            <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
              {t("bookingdetail.movieInfo")}
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3">
                <Film className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">
                    {t("bookingdetail.movie")}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {booking.showTime.movie.name}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">
                    {t("bookingdetail.time")}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {booking.showTime.startTime}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">
                    {t("bookingdetail.branch")}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {booking.showTime.branch.name}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Video className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">
                    {t("bookingdetail.room")}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {booking.showTime.branch.room.roomNumber} (
                    {booking.showTime.branch.room.roomType.name})
                  </p>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          <div className="flex flex-col md:flex-row gap-6">
            {/* Left: Seats + Snacks */}
            <div className="flex-1 space-y-4">
              {/* Seats */}
              <div className="space-y-2">
                <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                  {t("bookingdetail.seats")}
                </h4>
                <ul className="list-disc ml-6 text-muted-foreground text-sm">
                  {booking.seats.map((seat: any) => (
                    <li key={seat.id}>
                      {t("bookingdetail.seatRow", {
                        row: seat.row,
                        number: seat.number,
                        type: seat.seatType.name,
                      })}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Snacks */}
              {booking.snackSelections.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                    {t("bookingdetail.snacks")}
                  </h4>
                  <ul className="list-disc ml-6 text-muted-foreground text-sm">
                    {booking.snackSelections.map((snack: any) => (
                      <li key={snack.id}>
                        {t("bookingdetail.snackItem", {
                          name: snack.snack.name,
                          qty: snack.quantity,
                          price: snack.unitPrice.toLocaleString(),
                        })}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Right: QR Code */}
            {booking.qrCodeUrl && (
              <div className="flex-shrink-0 flex items-center justify-center">
                <img
                  src={`data:image/png;base64,${booking.qrCodeUrl}`}
                  alt={t("bookingdetail.qrAlt")}
                  className="w-40 h-40 rounded border shadow"
                />
              </div>
            )}
          </div>

          {/* Total Price */}
          <Separator />
          <div className="text-right font-semibold text-green-600 text-lg">
            {t("bookingdetail.total", {
              price: Number(booking.totalPrice).toLocaleString(),
            })}
          </div>
        </div>

        <DialogFooter className="pt-4">
          <Button variant="outline" onClick={onClose}>
            {t("bookingdetail.close")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
