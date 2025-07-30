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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Mail,
  Phone,
  Calendar,
  User,
  MapPin,
  IdCard,
  CalendarClock,
  Trash2,
} from "lucide-react";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();
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
        return t("gender.male");
      case 1:
        return t("gender.female");
      default:
        return t("gender.other");
    }
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return t("na");
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
          {value || t("na")}
        </p>
      </div>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] rounded-lg shadow-lg bg-white dark:bg-black">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold dark:text-white">
            {t("UserDetailstitle")}
          </DialogTitle>
          <DialogDescription className="text-gray-500 dark:text-gray-400">
            {t("UserDetailsdescription")}
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
            label={t("email")}
            value={user.email}
          />
          <InfoItem
            icon={<Phone className="h-4 w-4" />}
            label={t("phone")}
            value={user.phoneNumber}
          />
          <InfoItem
            icon={<Calendar className="h-4 w-4" />}
            label={t("dob")}
            value={formatDate(user.dateOfBirth)}
          />
          <InfoItem
            icon={<User className="h-4 w-4" />}
            label={t("gender.title")}
            value={getGender(user.gender)}
          />
          <InfoItem
            icon={<IdCard className="h-4 w-4" />}
            label={t("identityCard")}
            value={user.identityCard}
            fullWidth
          />
          <InfoItem
            icon={<MapPin className="h-4 w-4" />}
            label={t("address")}
            value={user.address}
            fullWidth
          />
          <InfoItem
            icon={<CalendarClock className="h-4 w-4" />}
            label={t("createdAt")}
            value={formatDate(user.createdAt)}
            fullWidth
          />
        </div>

        <DialogFooter className="mt-6 flex justify-between">
          <div className="flex space-x-2">
            <Button variant="destructive" onClick={onDelete} size="sm">
              <Trash2 className="mr-1 h-3.5 w-3.5" />
              {t("delete")}
            </Button>
          </div>
          <Button variant="outline" onClick={onClose} size="sm">
            {t("close")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
