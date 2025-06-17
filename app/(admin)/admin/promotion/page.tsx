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
import { Promotion } from "@/lib/api/service/fetchPromotion";
import { usePromotions } from "@/hooks/usePromotions";
import AddPromotionForm from "./components/add-promotion";
import EditPromotionForm from "./components/edit-promotion";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

export default function FetchPromotionsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [pageIndex] = useState(1);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editPromotion, setEditPromotion] = useState<Promotion | null>(null);
  const {
    data,
    isLoading,
    isError,
    delete: deletePromotion,
  } = usePromotions(pageIndex, 10);
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
              Only Admins can access promotion management.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const promotions = data?.promotions || [];
  const filteredPromotions = promotions.filter(
    (promo) =>
      promo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      promo.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = (id: string) => {
    toast(
      <div>
        <div className="font-semibold mb-2">
          Are you sure you want to delete this promotion?
        </div>
        <div className="flex gap-2 mt-4">
          <Button
            size="sm"
            className="bg-red-500 text-white hover:bg-red-600"
            onClick={() => {
              deletePromotion(id, {
                onSuccess: () => {
                  toast.success("Promotion deleted successfully!", {
                    duration: 4000,
                    position: "top-right",
                    className: "bg-white text-blue-600 border border-blue-300",
                  });
                  queryClient.invalidateQueries({ queryKey: ["promotions"] });
                },
                onError: (error: any) => {
                  toast.error(error.message || "Failed to delete promotion", {
                    duration: 4000,
                    position: "top-right",
                    className: "bg-white text-blue-600 border border-blue-300",
                  });
                },
              });
              toast.dismiss(); // close confirm toast
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

  return (
    <div className="container mx-auto py-2 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Promotion Management
          </h1>
          <p className="text-muted-foreground">
            Manage promotions with advanced features
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
              setEditPromotion(null);
            }}
            className="bg-orange-500 text-white hover:bg-orange-600"
          >
            {showAddForm ? (
              "Cancel"
            ) : (
              <>
                <Plus className="mr-2 h-4 w-4" />
                Add Promotion
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
          placeholder="Search by title or code..."
          className="p-2 border rounded-md w-full md:w-1/3"
        />
      </div>

      {showAddForm && (
        <AddPromotionForm onCancel={() => setShowAddForm(false)} />
      )}

      <Card>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-5">
            {filteredPromotions.map((promo) => (
              <div
                key={promo.id}
                className="flex flex-col border rounded-xl shadow-sm hover:shadow-md transition bg-card text-card-foreground"
              >
                <div
                  className="cursor-pointer"
                  onClick={() => setPreviewImage(promo.image)}
                  title="Click để xem hình lớn"
                >
                  <Image
                    src={promo.image}
                    alt={promo.title}
                    width={400}
                    height={200}
                    className="rounded-t-xl object-cover w-full h-40"
                  />
                </div>
                <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">{promo.title}</h3>
                    <p className="text-sm">Code: {promo.code}</p>
                    <p className="text-sm">
                      Discount: {promo.discountPrice}
                      {promo.discountTypeEnum === "Percent" ? "%" : " VND"}
                    </p>
                    <p className="text-sm">
                      Start: {new Date(promo.startTime).toLocaleString()}
                    </p>
                    <p className="text-sm">
                      End: {new Date(promo.endTime).toLocaleString()}
                    </p>
                    <p className="text-sm">
                      Discount Type: {promo.discountTypeId?.name || "None"}
                    </p>
                    <p className="text-sm">Status: {promo.statusActive}</p>
                  </div>
                  <div className="flex space-x-2 mt-4">
                    <Button
                      onClick={() => {
                        setEditPromotion(promo);
                        setShowEditForm(true);
                        setShowAddForm(false);
                      }}
                      size="sm"
                    >
                      Edit
                    </Button>
                    <Button
                      onClick={() => handleDelete(promo.id)}
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

      {/* Modal xem hình lớn */}
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
              <span className="text-xl font-bold text-gray-700">&times;</span>
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

      {showEditForm && editPromotion && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="max-w-2xl w-full">
            <EditPromotionForm
              promotion={editPromotion}
              onCancel={() => {
                setShowEditForm(false);
                setEditPromotion(null);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
