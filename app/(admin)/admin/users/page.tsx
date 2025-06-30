"use client";

import { useState } from "react";
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
  Plus,
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
  Edit,
  Trash2,
  Eye,
  RotateCcw,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
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
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const { toast } = useToast();
  const [searchParams, setSearchParams] = useState<UserSearchParams>({
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

  const getStatusColor = (isActive: boolean) => {
    return isActive ? "default" : "secondary";
  };

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
      console.log("Deleting accountId:", selectedUser.id);
      await deleteUserMutation.mutateAsync(selectedUser.id);
      setIsDeleteDialogOpen(false);
      toast({
        title: selectedUser.isActive ? "User Deactivated" : "User Restored",
        description: selectedUser.isActive
          ? `${selectedUser.fullName} has been successfully deactivated.`
          : `${selectedUser.fullName} has been successfully restored.`,
      });
      setSelectedUser(null);
    } catch (error) {
      console.log(error);
      toast({
        title: "Error",
        description: selectedUser.isActive
          ? "Failed to deactivate user. Please try again."
          : "Failed to restore user. Please try again.",
        variant: "destructive",
      });
    }
  };

  const filteredUsers =
    users && Array.isArray(users)
      ? users.filter((user) => {
          const searchTermLower = searchTerm.toLowerCase();
          const matchesSearch =
            user.fullName.toLowerCase().includes(searchTermLower) ||
            user.email.toLowerCase().includes(searchTermLower) ||
            user.phoneNumber.toLowerCase().includes(searchTermLower);
          const matchesStatus =
            statusFilter === "all" ||
            (statusFilter === "Active" && user.isActive) ||
            (statusFilter === "Inactive" && !user.isActive);
          const matchesRole = roleFilter === "all" || user.role === roleFilter;

          return matchesSearch && matchesStatus && matchesRole;
        })
      : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Manager</h1>
          <p className="text-muted-foreground">
            Create, read, update, and delete user accounts
          </p>
        </div>
        <div className="flex items-center space-x-2">
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
                (user) => [
                  user.fullName,
                  user.email,
                  user.phoneNumber,
                  user.address,
                  user.role?.name ?? "N/A",
                  user.isActive ? "Active" : "Inactive",
                  formatDate(user.createdAt?.toString() || ""),
                ]
              );
            }}
          >
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Search & Filter Users</CardTitle>
          <CardDescription>
            Find users by name, email, department, or filter by role and status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Users List */}
      <Card>
        <CardContent>
          <div className="space-y-4 mt">
            {filteredUsers?.map((user: User) => (
              <div
                key={user.id}
                className="flex items-center justify-between p-6 border rounded-lg hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-primary/10 text-primary font-semibold">
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
                        {getRoleIcon(user.role?.name)}
                        <span>{user.role?.name}</span>
                      </Badge>
                      <Badge variant={getStatusColor(user.isActive)}>
                        {user.isActive ? "Active" : "Inactive"}
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
                          Joined {formatDate(user.createdAt?.toString() || "")}
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
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDeleteClick(user)}
                        className="text-destructive"
                      >
                        {user.isActive ? (
                          <>
                            <Trash2 className="mr-2 h-4 w-4" />
                            Deactivate User
                          </>
                        ) : (
                          <>
                            <RotateCcw className="mr-2 h-4 w-4" />
                            Restore User
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

      {/* User Details Modal */}
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

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action will{" "}
              {selectedUser?.isActive ? "deactivate" : "restore"}{" "}
              <span className="font-semibold">{selectedUser?.fullName}</span>{" "}
              and {selectedUser?.isActive ? "remove" : "restore"} their access
              from the system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setSelectedUser(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteUser}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {selectedUser?.isActive ? "Deactivate User" : "Restore User"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
