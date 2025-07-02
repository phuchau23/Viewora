"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { useRouter, useSearchParams } from "next/navigation";
import SnackService, {
  Snack,
  SnackListResponse,
} from "@/lib/api/service/fetchSnack";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

export default function SnacksPage() {
  const [snacks, setSnacks] = useState<Snack[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSnack, setSelectedSnack] = useState<Snack | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const itemId = searchParams.get("items");

  // Effect to fetch all snacks
  useEffect(() => {
    const fetchAllSnacks = async () => {
      try {
        setLoading(true);
        const response: SnackListResponse = await SnackService.getSnacks(
          1,
          1000
        );
        setSnacks(response.data.items);
      } catch (err) {
        setError("Failed to load snacks. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchAllSnacks();
  }, []);

  // Effect to fetch a single snack when itemId changes
  useEffect(() => {
    const fetchSingleSnack = async (id: string) => {
      if (!id) return;

      try {
        const snack = await SnackService.getSnackById(id);
        setSelectedSnack(snack.data);
        setIsModalOpen(true);
        // We can choose to handle this error silently or with a toast if preferred,
        // as the main page loading error already covers general fetching issues.
      } catch (err) {
        console.error("Failed to fetch single snack:", err);
      }
    };

    if (itemId) {
      fetchSingleSnack(itemId);
    } else {
      setIsModalOpen(false);
      setSelectedSnack(null);
    }
  }, [itemId]);

  const handleCardClick = useCallback(
    async (snackId: string) => {
      try {
        const snack = await SnackService.getSnackById(snackId);
        setSelectedSnack(snack.data);
        setIsModalOpen(true);
        // Prevent scroll to top when opening the modal
        router.replace(`/user/snacks?items=${snackId}`, { scroll: false });
      } catch (err) {
        console.error("Failed to fetch single snack on click:", err);
      }
    },
    [router]
  );

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedSnack(null);
    // Prevent scroll to top when closing the modal
    router.replace("/user/snacks", { scroll: false });
  }, [router]);

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white dark:bg-gray-950 text-center text-red-600 dark:text-red-400">
        {error}
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white dark:bg-gray-950 text-gray-700 dark:text-gray-300">
        Loading snacks...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 px-8 py-8 text-gray-900 dark:text-white md:px-48 md:py-12 relative">
      <div className="flex flex-col items-center gap-10 relative z-10">
        {/* Header Section */}
        <div className="text-center relative z-20">
          <h1
            className="mb-4 text-5xl font-extrabold tracking-tight text-orange-600 dark:text-orange-400 md:text-5xl"
          >
            Our Delicious Snacks & Combos
          </h1>
          <p
            className="mx-auto max-w-3xl text-center text-lg text-gray-700 dark:text-gray-300 md:text-xl"
          >
            Explore a world of delightful treats and perfect pairings for your
            movie experience. We have something for every craving!
          </p>
        </div>

        {/* --- Snacks Grid View --- */}
        <div className="grid w-full grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 mt-8">
          {snacks.map((snack) => (
            <Card
              key={snack.id}
              className="group relative flex h-full transform flex-col overflow-hidden rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-lg transition-all duration-300 hover:scale-[1.02] hover:border-orange-500 hover:shadow-xl dark:hover:ring-2 dark:hover:ring-orange-500 dark:hover:ring-offset-2 dark:hover:ring-offset-gray-950 cursor-pointer"
              onClick={() => handleCardClick(snack.id)}
            >
              <div
                className="relative w-full overflow-hidden rounded-t-lg"
                style={{ paddingTop: "100%" }}
              >
                {/* Fix 1: Ensure snack.image is treated as string */}
                {snack.image && (
                  <Image
                    src={snack.image as string}
                    alt={snack.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
                    loading="lazy"
                  />
                )}
              </div>
              {/* Added flex, items-center, justify-center to center content */}
              <div className="flex-grow flex items-center justify-center p-2 relative">
                <h3 className="relative z-10 font-semibold text-gray-900 dark:text-white mb-1 text-center truncate">
                  {snack.name}
                </h3>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Allergy Disclaimer */}
      <div className="mt-16 rounded-lg bg-white dark:bg-gray-800 p-6 text-center text-sm text-gray-700 dark:text-gray-400 shadow-inner relative z-10">
        <p className="mb-2 text-base font-semibold text-orange-600 dark:text-orange-400">
          Allergy Disclaimer
        </p>
        <p>
          Please be aware that our snacks may contain or come into contact with
          common allergens, such as dairy, eggs, wheat, soy, tree nuts, and
          peanuts.
        </p>
        <p className="mt-1">
          We cannot guarantee that any of our products are free from allergens
          as we use shared equipment and facilities.
        </p>
        <p className="mt-3 text-orange-500 dark:text-orange-300">
          For specific allergy concerns, please contact our staff directly
          before making your purchase.
        </p>
      </div>

      {/* Snack Details Modal */}
      <Dialog open={isModalOpen} onOpenChange={handleCloseModal}>
        <DialogContent className="sm:max-w-[600px] dark:bg-gray-800 dark:text-white">
          <DialogHeader>
            <VisuallyHidden>
              <DialogTitle>
                {selectedSnack ? `${selectedSnack.name} Details` : "Snack Details"}
              </DialogTitle>
            </VisuallyHidden>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
            {selectedSnack ? (
              <>
                {/* Changed this line: Added 'h-48 w-48 mx-auto' for mobile sizing */}
                <div className="relative h-48 w-48 mx-auto aspect-square md:h-auto md:w-full">
                  {/* Fix 2: Ensure selectedSnack.image is treated as string */}
                  {selectedSnack.image && (
                    <Image
                      src={selectedSnack.image as string}
                      alt={selectedSnack.name}
                      fill
                      className="object-cover rounded-md"
                      sizes="(max-width: 768px) 100vw, 50vw"
                      loading="lazy"
                    />
                  )}
                </div>
                <div className="flex flex-col justify-center gap-1">
                  <h2 className="text-4xl font-bold text-gray-900 dark:text-white">
                    {selectedSnack.name}
                  </h2>
                  <p>
                    <strong className="text-gray-700 dark:text-gray-300 text-2xl">
                      Price:
                    </strong>{" "}
                    <span className="text-orange-600 dark:text-orange-400 font-bold text-2xl">
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                        currencyDisplay: "code",
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0,
                      }).format(selectedSnack.price)}
                    </span>
                  </p>
                  <p className="mt-4 text-gray-700 dark:text-gray-300">
                    Purchase minimum: <span className="text-gray-600 dark:text-gray-400">1</span>
                  </p>
                  <p className="text-gray-700 dark:text-gray-300">
                    Purchase limit: <span className="text-gray-600 dark:text-gray-400">Unlimited</span>
                  </p>
                  <p className="mt-2 text-gray-700 dark:text-gray-300">
                    Refund: <span className="text-gray-600 dark:text-gray-400">Not Allowed</span>
                  </p>
                  <p className="mt-2 text-gray-700 dark:text-gray-300">
                    Available at <span className="text-orange-600 dark:text-orange-400">2</span> branches:
                  </p>
                  <ul className="list-disc list-inside ml-4 text-gray-600 dark:text-gray-400">
                    <li>Viewora Thủ Đức</li>
                    <li>Viewora Gò Vấp</li>
                  </ul>
                </div>
              </>
            ) : (
              <div className="md:col-span-2 text-center text-gray-500">
                No snack selected.
              </div>
            )}
          </div>
          <div className="text-center text-gray-500 text-sm mt-4">
            Snacks and combos can be purchased after selecting a seat.
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}