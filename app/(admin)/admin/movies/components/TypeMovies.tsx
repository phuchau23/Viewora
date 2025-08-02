"use client";
import { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useGetTypes, useCreateType, useDeleteType } from "@/hooks/useTypes";
import { Plus, X } from "lucide-react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@radix-ui/react-alert-dialog";
import {
  AlertDialogFooter,
  AlertDialogHeader,
} from "@/components/ui/alert-dialog";
import { useSort } from "@/hooks/useSort";
import { useTranslation } from "react-i18next";

export function TypeMovies() {
  const { t } = useTranslation();
  const [newType, setNewType] = useState("");
  const { sortConfig, handleSort, sortedData } = useSort(["name"]);

  const {
    types,
    isLoading: isLoadingTypes,
    isError: isErrorTypes,
    error: errorTypes,
  } = useGetTypes();
  const { createType, isLoading: isCreating } = useCreateType();
  const { deleteType } = useDeleteType();
  const sortedTypes = sortedData(types?.data || []);

  const handleAdd = () => {
    if (newType.trim()) {
      createType(
        { name: newType },
        {
          onSuccess: () => {
            setNewType("");
          },
        }
      );
    }
  };

  const handleDelete = (id: string) => {
    deleteType(id);
  };

  if (isLoadingTypes) {
    return <div>{t("movietype.loading")}</div>;
  }

  if (isErrorTypes) {
    return <div>{t("movietype.error", { error: errorTypes })}</div>;
  }

  return (
    <div className="py-6">
      {/* Header Actions */}
      <div className="flex justify-between items-center mb-6 py-2">
        <div className="relative w-72 px-2">
          <Plus className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder={t("movietype.addPlaceholder")}
            value={newType}
            onChange={(e) => setNewType(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="secondary" onClick={handleAdd}>
          {t("movietype.addButton")}
        </Button>
      </div>
      {/* Scrollable Table */}
      <div className="h-[calc(100vh-200px)] overflow-y-auto">
        <Table>
          <TableHeader className="text-center">
            <TableRow>
              <TableHead onClick={() => handleSort("name")}>
                {t("movietype.nameColumn")}{" "}
                {sortConfig.key === "name" &&
                  (sortConfig.direction === "ascending" ? "↑" : "↓")}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedTypes?.map((type) => (
              <TableRow key={type.id}>
                <TableCell className="text-center">{type.name}</TableCell>
                <TableCell className="text-center">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="rounded-full"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-lg">
                      <AlertDialogHeader>
                        <AlertDialogTitle className="text-xl font-semibold text-red-600">
                          {t("movietype.deleteTitle")}
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-sm text-muted-foreground mt-2">
                          {t("movietype.deleteConfirm", { name: type.name })}
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter className="mt-4 flex justify-center gap-2">
                        <AlertDialogCancel asChild>
                          <Button variant="outline">
                            {t("movietype.cancel")}
                          </Button>
                        </AlertDialogCancel>
                        <Button
                          variant="destructive"
                          onClick={() => handleDelete(type.id)}
                        >
                          {t("movietype.delete")}
                        </Button>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
