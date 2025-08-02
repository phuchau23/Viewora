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
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Plus, Trash2, Search } from "lucide-react";
import { Role } from "@/lib/api/service/fetchRole";
import { useRoles, useCreateRole, useDeleteRole } from "@/hooks/useRole";
import { useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

export default function RoleManagement() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { roles } = useRoles();
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const { mutate: deleteRole } = useDeleteRole();

  const [formData, setFormData] = useState({ name: "", description: "" });
  const { mutate: createRole } = useCreateRole();

  const filteredRoles = roles
    ?.filter((role) => role.status === true)
    .filter((role) =>
      role.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const resetForm = () => setFormData({ name: "", description: "" });

  const handleCreate = () => {
    const form = new FormData();
    form.append("name", formData.name);
    form.append("description", formData.description);

    createRole(form, {
      onSuccess: () => {
        setIsCreateOpen(false);
        resetForm();
        queryClient.invalidateQueries({ queryKey: ["roles"] });
      },
    });
  };

  const handleDelete = (id: number) => {
    deleteRole(id, {
      onSuccess: () => queryClient.invalidateQueries({ queryKey: ["roles"] }),
    });
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{t("role.title")}</CardTitle>
          <CardDescription>{t("role.description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-6">
            <div className="relative w-72">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder={t("role.searchPlaceholder")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
              <DialogTrigger asChild>
                <Button onClick={resetForm}>
                  <Plus className="h-4 w-4 mr-2" />
                  {t("role.addRole")}
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{t("role.createRoleTitle")}</DialogTitle>
                  <DialogDescription>
                    {t("role.createRoleDescription")}
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">{t("role.roleName")}</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      placeholder={t("role.roleName")}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="description">
                      {t("role.descriptionField")}
                    </Label>
                    <Input
                      id="description"
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                      placeholder={t("role.descriptionField")}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setIsCreateOpen(false)}
                  >
                    {t("role.cancel")}
                  </Button>
                  <Button
                    onClick={handleCreate}
                    disabled={!formData.name.trim()}
                  >
                    {t("role.create")}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("role.table.name")}</TableHead>
                  <TableHead>{t("role.table.description")}</TableHead>
                  <TableHead>{t("role.table.createdDate")}</TableHead>
                  <TableHead>{t("role.table.status")}</TableHead>
                  <TableHead className="text-right">
                    {t("role.table.actions")}
                  </TableHead>
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
                        ? t("role.noRolesFound")
                        : t("role.noRolesAvailable")}
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
                          {role.status ? t("role.active") : t("role.inactive")}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle className="text-xl font-semibold text-red-600">
                                {t("role.deleteTitle")}
                              </AlertDialogTitle>
                              <AlertDialogDescription className="text-sm text-muted-foreground mt-2">
                                {t("role.deleteDescription", {
                                  name: role.name,
                                })}
                              </AlertDialogDescription>
                            </AlertDialogHeader>

                            <AlertDialogFooter className="mt-4 flex justify-end gap-2">
                              <AlertDialogCancel asChild>
                                <Button variant="outline">
                                  {t("role.cancel")}
                                </Button>
                              </AlertDialogCancel>
                              <Button
                                variant="destructive"
                                onClick={() => handleDelete(role.roleId)}
                              >
                                {t("role.delete")}
                              </Button>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
