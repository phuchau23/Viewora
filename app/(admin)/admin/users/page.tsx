"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Search,
  MoreHorizontal,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Download,
  Users,
  UserCheck,
  UserX,
  Shield,
  Trash2,
  Eye,
  RotateCcw,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { UserDetailsModal } from "./components/user-detail-modal";
import { useDeleteUser, useUsers } from "@/hooks/useUsers";
import { User, UserSearchParams } from "@/lib/api/service/fetchUser";
import { formatDate } from "@/utils/dates/formatDate";
import { exportToCSV } from "@/utils/export/exportToCSV";

export default function UserManagerPage() {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const { toast } = useToast();
  const [searchParams] = useState<UserSearchParams>({
    pageNumber: 1,
    pageSize: 10,
  });

  const { users, isLoading, isError, error } = useUsers(searchParams);
  const deleteUserMutation = useDeleteUser();

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error: {error?.message}</div>;

  const getRoleColor = (role: string) => {
    switch (role) {
      case "Admin":
        return "destructive";
      case "Manager":
        return "default";
      case "Moderator":
        return "secondary";
      default:
        return "outline";
    }
  };
  const getStatusColor = (isActive: boolean) =>
    isActive ? "default" : "secondary";
  const getRoleIcon = (role: string) => {
    switch (role) {
      case "Admin":
        return <Shield className="h-4 w-4" />;
      case "Manager":
        return <UserCheck className="h-4 w-4" />;
      case "Moderator":
        return <Users className="h-4 w-4" />;
      default:
        return <UserX className="h-4 w-4" />;
    }
  };

  const handleViewDetails = (user: User) => {
    setSelectedUser(user);
    setIsDetailsModalOpen(true);
  };
  const handleDeleteClick = (user: User) => {
    setSelectedUser(user);
    setIsDeleteDialogOpen(true);
  };
  const handleDeleteUser = async () => {
    if (!selectedUser) return;
    try {
      await deleteUserMutation.mutateAsync(selectedUser.id);
      setIsDeleteDialogOpen(false);
      toast({
        title: selectedUser.isActive
          ? t("toastDeactivateTitle")
          : t("toastRestoreTitle"),
        description: selectedUser.isActive
          ? t("toastDeactivateDesc", { name: selectedUser.fullName })
          : t("toastRestoreDesc", { name: selectedUser.fullName }),
      });
      setSelectedUser(null);
    } catch (error) {
      toast({
        title: t("toastErrorTitle"),
        description: selectedUser.isActive
          ? t("toastErrorDeactivateDesc")
          : t("toastErrorRestoreDesc"),
        variant: "destructive",
      });
    }
  };

  const filteredUsers =
    users?.filter((user) => {
      const s = searchTerm.toLowerCase();
      const matchesSearch =
        user.fullName.toLowerCase().includes(s) ||
        user.email.toLowerCase().includes(s) ||
        user.phoneNumber.toLowerCase().includes(s);
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "Active" && user.isActive) ||
        (statusFilter === "Inactive" && !user.isActive);
      return matchesSearch && matchesStatus;
    }) ?? [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {t("usertitle")}
          </h1>
          <p className="text-muted-foreground">{t("userdescription")}</p>
        </div>
        <Button
          variant="outline"
          onClick={() => {
            if (!filteredUsers.length) return;
            exportToCSV(
              "users.csv",
              [
                "Full Name",
                "Email",
                "Phone",
                "Address",
                "Role",
                "Status",
                "Joined Date",
              ],
              filteredUsers,
              (u) => [
                u.fullName,
                u.email,
                u.phoneNumber,
                u.address,
                u.role?.name ?? "N/A",
                u.isActive ? t("active") : t("inactive"),
                formatDate(u.createdAt?.toString() || ""),
              ]
            );
          }}
        >
          <Download className="mr-2 h-4 w-4" /> {t("export")}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t("usersearchTitle")}</CardTitle>
          <CardDescription>{t("searchDescription")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t("usersearchPlaceholder")}
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder={t("filterStatus")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("allStatus")}</SelectItem>
                <SelectItem value="Active">{t("active")}</SelectItem>
                <SelectItem value="Inactive">{t("inactive")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <div className="space-y-4">
            {filteredUsers.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between p-6 border rounded-lg hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback>
                      {user.fullName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-semibold text-lg">{user.fullName}</h3>
                      <Badge
                        variant={getRoleColor(user.role?.name)}
                        className="flex items-center space-x-1"
                      >
                        {getRoleIcon(user.role?.name)}{" "}
                        <span>{user.role?.name}</span>
                      </Badge>
                      <Badge variant={getStatusColor(user.isActive)}>
                        {user.isActive ? t("active") : t("inactive")}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <Mail className="h-3 w-3" />
                        <span>{user.email}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Phone className="h-3 w-3" />
                        <span>{user.phoneNumber}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-3 w-3" />
                        <span>{user.address}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-3 w-3" />
                        <span>
                          {t("joined", {
                            date: formatDate(user.createdAt?.toString() || ""),
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewDetails(user)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleViewDetails(user)}>
                        <Eye className="mr-2 h-4 w-4" /> {t("viewDetails")}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDeleteClick(user)}
                        className="text-destructive"
                      >
                        {user.isActive ? (
                          <>
                            <Trash2 className="mr-2 h-4 w-4" />{" "}
                            {t("deactivateUser")}
                          </>
                        ) : (
                          <>
                            <RotateCcw className="mr-2 h-4 w-4" />{" "}
                            {t("restoreUser")}
                          </>
                        )}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <UserDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => {
          setIsDetailsModalOpen(false);
          setSelectedUser(null);
        }}
        user={selectedUser}
        onDelete={() => {
          setIsDetailsModalOpen(false);
          handleDeleteUser();
        }}
      />

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("confirmTitle")}</AlertDialogTitle>
            <AlertDialogDescription>
              {selectedUser?.isActive
                ? t("confirmDescDeactivate", { name: selectedUser?.fullName })
                : t("confirmDescRestore", { name: selectedUser?.fullName })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setSelectedUser(null)}>
              {t("cancel")}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteUser}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {selectedUser?.isActive
                ? t("confirmDeactivate")
                : t("confirmRestore")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
