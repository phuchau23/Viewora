"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import { Role, RoleCreateRequest } from "@/lib/api/service/fetchRole";
import { useRoles, useCreateRole, useDeleteRole } from "@/hooks/useRole";
import { useQueryClient } from "@tanstack/react-query";

// Mock data

export default function RoleManagement() {
  const queryClient = useQueryClient();
  const { roles } = useRoles();
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const { mutate: deleteRole, isSuccess, isError } = useDeleteRole();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });
  const { mutate: createRole } = useCreateRole();

  // Filter roles based on search term
  const filteredRoles = roles
    ?.filter((role) => role.status === true) // Lọc chỉ status = true
    .filter((role) =>
      role.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

  // Reset form data
  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
    });
  };

  // Handle create role
  // const handleCreate = () => {
  //   const payload = {
  //     name: formData.name,
  //     description: formData.description,
  //   };

  //   createRole(payload, {
  //     onSuccess: () => {
  //       setIsCreateOpen(false);
  //       resetForm();
  //       queryClient.invalidateQueries({ queryKey: ["roles"] });
  //       // Optional: Có thể refetch roles tại đây nếu chưa có query invalidate
  //     },
  //     onError: (error) => {
  //       console.error("Create role failed", error);
  //     },
  //   });
  // };

  const handleCreate = () => {
    const form = new FormData();
    form.append("name", formData.name);
    form.append("description", formData.description);

    createRole(form, {
      onSuccess: () => {
        setIsCreateOpen(false);
        setFormData({ name: "", description: "" }); // resetForm()
        queryClient.invalidateQueries({ queryKey: ["roles"] });
      },
      onError: (error) => {
        console.error("Create role failed", error);
      },
    });
  };

  // Handle edit role
  // const handleEdit = (role: Role) => {
  //   setEditingRole(role);
  //   setFormData({
  //     name: role.name,
  //     description: role.description,
  //   });
  //   setIsEditOpen(true);
  // };

  // Handle update role
  // const handleUpdate = () => {
  //   if (!editingRole) return;

  //   const updatedRoles = roles?.map((role) =>
  //     role.roleId === editingRole.roleId
  //       ? {
  //           ...role,
  //           name: formData.name,
  //           description: formData.description,
  //         }
  //       : role
  //   );
  //   setRoles(updatedRoles);
  //   setIsEditOpen(false);
  //   setEditingRole(null);
  //   resetForm();
  // };

  // Handle delete role
  const handleDelete = (id: number) => {
    deleteRole(id, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["roles"] }); // Làm mới danh sách
      },
      onError: (error) => {
        console.error("Delete role failed", error);
      },
    });
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Role Management</CardTitle>
          <CardDescription>
            Manage user roles and permissions for your application
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Header Actions */}
          <div className="flex justify-between items-center mb-6">
            <div className="relative w-72">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search roles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
              <DialogTrigger asChild>
                <Button onClick={resetForm}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Role
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Role</DialogTitle>
                  <DialogDescription>
                    Add a new role to your system. Fill in the details below.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Role Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      placeholder="Enter role name"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="description">Description</Label>
                    <Input
                      id="description"
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                      placeholder="Enter description"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setIsCreateOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleCreate}
                    disabled={!formData.name.trim()}
                  >
                    Create Role
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {/* Roles Table */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Role Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Created Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRoles?.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center py-8 text-muted-foreground"
                    >
                      {searchTerm
                        ? "No roles found matching your search."
                        : "No roles available."}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredRoles?.map((role) => (
                    <TableRow key={role.roleId}>
                      <TableCell>{role.name}</TableCell>
                      <TableCell>{role.description}</TableCell>
                      <TableCell>
                        {new Date(role.dateCreate).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Badge variant={role.status ? "default" : "secondary"}>
                          {role.status ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          {/* <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(role)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button> */}
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="outline" size="sm">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle className="text-xl font-semibold text-red-600">
                                  Delete Role
                                </AlertDialogTitle>
                                <AlertDialogDescription className="text-sm text-muted-foreground mt-2">
                                  Are you sure you want to delete the role{" "}
                                  <strong className="text-black">
                                    &quot;{role.name}&quot;
                                  </strong>
                                  ? <br />
                                  This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>

                              <AlertDialogFooter className="mt-4 flex justify-end gap-2">
                                <AlertDialogCancel asChild>
                                  <Button variant="outline">Cancel</Button>
                                </AlertDialogCancel>
                                <Button
                                  variant="destructive"
                                  onClick={() => handleDelete(role.roleId)}
                                >
                                  Delete
                                </Button>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Edit Dialog */}
          <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Role</DialogTitle>
                <DialogDescription>
                  Update the role details below.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-name">Role Name</Label>
                  <Input
                    id="edit-name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="Enter role name"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-description">Description</Label>
                  <Input
                    id="edit-description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        description: e.target.value,
                      })
                    }
                    placeholder="Enter description"
                  />
                </div>
              </div>
              {/* <DialogFooter>
                <Button variant="outline" onClick={() => setIsEditOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleUpdate} disabled={!formData.name.trim()}>
                  Update Role
                </Button>
              </DialogFooter> */}
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    </div>
  );
}
