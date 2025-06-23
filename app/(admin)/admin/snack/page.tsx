// pages/fetch-snacks.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Download, Plus, Shield } from "lucide-react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { useSnacks } from "@/hooks/useSnacks";
import { Snack } from "@/lib/api/service/fetchSnack";
import AddSnackForm from "./components/add-snack";
import EditSnackForm from "./components/edit-snack";

export default function FetchSnacksPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [pageIndex] = useState(1);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [selectedSnack, setSelectedSnack] = useState<Snack | null>(null);
  const {
    data,
    isLoading,
    isError,
    delete: deleteSnack,
  } = useSnacks(pageIndex, 10);
  const queryClient = useQueryClient();
  const isAdmin = true; // Replace with actual auth check

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Shield className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Access Denied</h3>
            <p className="text-muted-foreground text-center">
              Only Admins can access snack management.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const snacks = data?.snacks || [];
  const filteredSnacks = snacks.filter((snack) =>
    snack.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = (id: string) => {
    toast(
      <div>
        <div className="font-semibold mb-2">
          Are you sure you want to delete this snack?
        </div>
        <div className="flex gap-2 mt-4">
          <Button
            size="sm"
            className="bg-red-500 text-white hover:bg-red-600"
            onClick={() => {
              deleteSnack(id, {
                onSuccess: () => {
                  toast.success("Snack deleted successfully!", {
                    duration: 4000,
                    position: "top-right",
                    className: "bg-white text-blue-600 border border-blue-300",
                  });
                  queryClient.invalidateQueries({ queryKey: ["snacks"] });
                },
                onError: (error: any) => {
                  toast.error(error.message || "Failed to delete snack", {
                    duration: 4000,
                    position: "top-right",
                    className: "bg-white text-blue-600 border border-blue-300",
                  });
                },
              });
              toast.dismiss();
            }}
          >
            Delete
          </Button>
          <Button size="sm" variant="outline" onClick={() => toast.dismiss()}>
            Cancel
          </Button>
        </div>
      </div>,
      {
        duration: 8000,
        position: "top-right",
        className: "bg-white text-blue-600 border border-blue-300",
      }
    );
  };

  const handleEdit = (snack: Snack) => {
    setSelectedSnack(snack);
    setShowEditForm(true);
    setShowAddForm(false);
  };

  return (
    <div className="container mx-auto py-2 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Snack Management
          </h1>
          <p className="text-muted-foreground">
            Manage snacks with advanced features
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button
            onClick={() => {
              setShowAddForm(!showAddForm);
              setShowEditForm(false);
              setSelectedSnack(null);
            }}
            className="bg-orange-500 text-white hover:bg-orange-600"
          >
            {showAddForm ? (
              "Cancel"
            ) : (
              <>
                <Plus className="mr-2 h-4 w-4" />
                Add Snack
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="mb-6">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value.slice(0, 28))}
          placeholder="Search by snack name..."
          className="p-2 border rounded-md w-full md:w-1/3"
        />
      </div>

      {showAddForm && <AddSnackForm onCancel={() => setShowAddForm(false)} />}

      <Card>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-5">
            {filteredSnacks.map((snack) => (
              <div
                key={snack.id}
                className="flex flex-col border rounded-xl shadow-sm hover:shadow-md transition bg-card text-card-foreground"
              >
                <div
                  className="cursor-pointer"
                  onClick={() => setPreviewImage(snack.image)}
                  title="Click to view larger"
                >
                  <Image
                    src={snack.image}
                    alt={snack.name}
                    width={400}
                    height={200}
                    className="rounded-t-xl object-cover w-full h-40"
                  />
                </div>
                <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">{snack.name}</h3>
                    <p className="text-sm">Price: {snack.price} VND</p>
                    <p className="text-sm">
                      Status: {snack.isAvailable ? "Available" : "Unavailable"}
                    </p>
                  </div>
                  <div className="flex space-x-2 mt-4">
                    <Button
                      onClick={() => handleEdit(snack)}
                      className="bg-blue-500 text-white hover:bg-blue-600"
                      size="sm"
                    >
                      Edit
                    </Button>
                    <Button
                      onClick={() => handleDelete(snack.id)}
                      className="bg-red-500 text-white hover:bg-red-600"
                      size="sm"
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {previewImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
          onClick={() => setPreviewImage(null)}
        >
          <div
            className="relative max-w-3xl w-full flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-2 right-2 bg-white rounded-full p-2 shadow hover:bg-gray-200 z-10"
              onClick={() => setPreviewImage(null)}
            >
              <span className="text-xl font-bold text-gray-700">×</span>
            </button>
            <Image
              src={previewImage}
              alt="Preview"
              width={900}
              height={500}
              className="rounded-xl object-contain max-h-[80vh] w-auto"
            />
          </div>
        </div>
      )}

      {showEditForm && selectedSnack && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="max-w-2xl w-full">
            <EditSnackForm
              snack={selectedSnack}
              onCancel={() => {
                setShowEditForm(false);
                setSelectedSnack(null);
              }}
              onSuccess={() => {
                setShowEditForm(false);
                setSelectedSnack(null);
                queryClient.invalidateQueries({ queryKey: ["snacks"] });
                queryClient.invalidateQueries({
                  queryKey: ["snack", selectedSnack.id],
                });
                queryClient.refetchQueries({ queryKey: ["snacks"] });
                queryClient.refetchQueries({
                  queryKey: ["snack", selectedSnack.id],
                });
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
