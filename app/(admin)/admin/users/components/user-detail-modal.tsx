"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Mail,
  Phone,
  Calendar,
  User,
  MapPin,
  IdCard,
  CalendarClock,
} from "lucide-react";
import { Edit, Trash2 } from "lucide-react";

interface User {
  username: string;
  password: string;
  fullName: string;
  email: string;
  dateOfBirth: string | null;
  phoneNumber: string;
  avatar: string;
  identityCard: string;
  address: string;
  gender: number;
  createdAt: string | null;
}

interface UserDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  onDelete: () => void;
}

export function UserDetailsModal({
  isOpen,
  onClose,
  user,
  onDelete,
}: UserDetailsModalProps) {
  if (!user) return null;

  const getInitials = (fullName: string) =>
    fullName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();

  const getGender = (gender: number) => {
    switch (gender) {
      case 0:
        return "Male";
      case 1:
        return "Female";
      default:
        return "Other";
    }
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleDateString();
  };

  const InfoItem = ({
    icon,
    label,
    value,
    fullWidth = false,
  }: {
    icon: React.ReactNode;
    label: string;
    value: string | number | null;
    fullWidth?: boolean;
  }) => (
    <div
      className={`flex items-center space-x-3 ${
        fullWidth ? "col-span-2" : ""
      } bg-gray-50 dark:bg-background rounded-md p-2 shadow-sm`}
    >
      <div className="text-primary dark:text-primary/80">{icon}</div>
      <div>
        <p className="text-[10px] font-semibold uppercase text-gray-400 dark:text-gray-500">
          {label}
        </p>
        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
          {value || "N/A"}
        </p>
      </div>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] rounded-lg shadow-lg bg-white dark:bg-black">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold dark:text-white">
            User Details
          </DialogTitle>
          <DialogDescription className="text-gray-500 dark:text-gray-400">
            Complete personal information of the user.
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center space-x-4 mb-5">
          <Avatar className="h-14 w-14 ring-2 ring-primary ring-offset-2">
            <AvatarFallback className="bg-primary/20 text-primary font-extrabold text-2xl dark:text-white">
              {getInitials(user.fullName)}
            </AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              {user.fullName}
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <InfoItem
            icon={<Mail className="h-4 w-4" />}
            label="Email"
            value={user.email}
          />
          <InfoItem
            icon={<Phone className="h-4 w-4" />}
            label="Phone"
            value={user.phoneNumber}
          />
          <InfoItem
            icon={<Calendar className="h-4 w-4" />}
            label="Date of Birth"
            value={formatDate(user.dateOfBirth)}
          />
          <InfoItem
            icon={<User className="h-4 w-4" />}
            label="Gender"
            value={getGender(user.gender)}
          />
          <InfoItem
            icon={<IdCard className="h-4 w-4" />}
            label="Identity Card"
            value={user.identityCard}
            fullWidth
          />
          <InfoItem
            icon={<MapPin className="h-4 w-4" />}
            label="Address"
            value={user.address}
            fullWidth
          />
          <InfoItem
            icon={<CalendarClock className="h-4 w-4" />}
            label="Created At"
            value={formatDate(user.createdAt)}
            fullWidth
          />
        </div>

        <DialogFooter className="mt-6 flex justify-between">
          <div className="flex space-x-2">
            <Button variant="destructive" onClick={onDelete} size="sm">
              <Trash2 className="mr-1 h-3.5 w-3.5" />
              Delete
            </Button>
          </div>
          <Button variant="outline" onClick={onClose} size="sm">
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
