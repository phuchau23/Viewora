"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Promotion,
  PromotionListResponse,
  PromotionService,
} from "@/lib/api/service/fetchPromotion";
import {
  Dialog, // Import Dialog
  DialogContent, // Import DialogContent
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"; // For accessibility of DialogTitle
import { Copy } from "lucide-react"; // Import the Copy icon

// --- Utility Functions (consider moving to a separate utils/formatters.ts file) ---
const formatCurrency = (value: number | null | undefined) => {
  if (typeof value !== "number" || isNaN(value)) return "-";
  return value.toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND",
    currencyDisplay: "code",
  });
};

const getDiscountTypeStyles = (discountType: string) => {
  switch (discountType) {
    case "Fixed":
      return "bg-blue-500";
    case "Percent":
      return "bg-green-500";
    default:
      return "bg-gray-500";
  }
};

const getDiscountNameStyles = (discountName: string) => {
  switch (discountName) {
    case "Student Discount":
      return "bg-teal-500";
    case "Happy Day":
      return "bg-purple-500";
    case "Movie Day":
      return "bg-emerald-700";
    case "Combo Ticket + Snack":
      return "bg-blue-700";
    case "Holiday Discount":
      return "bg-red-800";
    case "Payment Discount":
      return "bg-indigo-700";
    default:
      return "bg-gray-500";
  }
};

const formatDate = (dateString: string | null | undefined) => {
  if (!dateString) return "-";
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// --- Promotion Modal Content Component (no longer a full modal, just the content) ---
// This component will be rendered INSIDE DialogContent
interface PromotionModalContentProps {
  promotion: Promotion;
  onClose: () => void;
  onCopyCode: (code: string | null | undefined) => void;
}

const PromotionModalContent: React.FC<PromotionModalContentProps> = ({
  promotion,
  onClose,
  onCopyCode,
}) => {
  return (
    <>
      <DialogHeader>
        <VisuallyHidden>
          <DialogTitle>{promotion.title} Details</DialogTitle>
        </VisuallyHidden>
      </DialogHeader>

      <div className="flex flex-col items-center text-gray-900 dark:text-white pt-4">
        <div className="relative w-2/3 h-48 rounded-lg overflow-hidden mb-4">
          <Image
            src={promotion.image}
            alt={promotion.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
        <h3 className="text-3xl font-bold text-center mb-3">
          {promotion.title}
        </h3>

        {promotion.code && (
          <div
            className="flex items-center gap-2 bg-orange-500 text-white text-lg font-bold px-5 py-2 rounded-lg mb-4 cursor-copy hover:bg-orange-600 transition-colors duration-200"
            onClick={() => onCopyCode(promotion.code)}
          >
            {promotion.code} <Copy className="h-5 w-5" />
          </div>
        )}

        <p className="text-2xl font-semibold text-green-600 dark:text-green-400 mb-2">
          Discount:{" "}
          {promotion.discountTypeEnum === "Fixed"
            ? formatCurrency(promotion.discountPrice)
            : `${promotion.discountPrice}% OFF`}
        </p>

        {promotion.discountTypeEnum === "Percent" && (
          <p className="text-md text-gray-700 dark:text-gray-300 mb-1">
            Max Discount: {formatCurrency(promotion.maxDiscountValue)}
          </p>
        )}

        <p className="text-md text-gray-700 dark:text-gray-300 mb-1">
          Minimum Order Value: {formatCurrency(promotion.minOrderValue)}
        </p>

        <p className="text-md text-gray-700 dark:text-gray-300 mb-1">
          Usage Count: {promotion.discountUserNum}
        </p>
        <p className="text-md text-gray-700 dark:text-gray-300 mb-4">
          Status:{" "}
          <span
            className={`font-semibold ${
              promotion.statusActive === "Active"
                ? "text-green-500"
                : promotion.statusActive === "Expired"
                ? "text-red-500"
                : "text-yellow-500"
            }`}
          >
            {promotion.statusActive}
          </span>
        </p>
        <div className="flex flex-wrap gap-3 justify-center mt-2">
          <div
            className={`text-sm text-white px-4 py-1.5 rounded-full ${getDiscountTypeStyles(
              promotion.discountTypeEnum
            )}`}
          >
            {promotion.discountTypeEnum}
          </div>
          {promotion.discountTypeId?.name && (
            <div
              className={`text-sm text-white px-4 py-1.5 rounded-full ${getDiscountNameStyles(
                promotion.discountTypeId.name
              )}`}
            >
              {promotion.discountTypeId.name}
            </div>
          )}
        </div>

        <p className="mt-2 text-gray-700 dark:text-gray-300">
                    Usable for <span className="text-orange-600 dark:text-orange-400">2</span> branches:
        </p>
        <ul className="list-disc list-inside ml-4 text-gray-600 dark:text-gray-400">
          <li>Viewora Thủ Đức</li>
          <li>Viewora Gò Vấp</li>
        </ul>


        <p className="text-sm text-gray-600 dark:text-gray-400 mt-4">
          Starts: {formatDate(promotion.startTime)}
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Ends: {formatDate(promotion.endTime)}
        </p>
      </div>
    </>
  );
};

// --- FAQ Item Component ---
interface FAQItemProps {
  question: string;
  answer: string;
}

const FAQItem: React.FC<FAQItemProps> = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer"
      onClick={() => setIsOpen(!isOpen)}
    >
      <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-700">
        <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
          {question}
        </h4>
        <svg
          className={`w-6 h-6 text-gray-600 dark:text-gray-300 transform transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 9l-7 7-7-7"
          ></path>
        </svg>
      </div>
      <div
        className={`px-4 pb-4 bg-white dark:bg-gray-800 transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-screen opacity-100 pt-2" : "max-h-0 opacity-0"
        }`}
        style={{ overflow: "hidden" }}
      >
        <p className="text-gray-700 dark:text-gray-300">{answer}</p>
      </div>
    </div>
  );
};

// --- Main Promotions Page Component ---
export default function PromotionsPage() {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const [selectedPromotion, setSelectedPromotion] = useState<Promotion | null>(
    null
  );
  const [loadingModal, setLoadingModal] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control Radix Dialog open/close

  const router = useRouter();
  const searchParams = useSearchParams();

  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 10; // Each page contains 10 discounts

  // `handleCloseModal` will now be passed directly to Radix Dialog's `onOpenChange`
  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false); // This will trigger the Radix close animation
    // Radix Dialog handles unmounting content after animation.
    // We can directly remove the query param here.
    router.push("/user/promotions", { scroll: false });
    // Clear selected promotion after modal is visually closed or unmounted by Radix
    // This is often not strictly necessary as Radix manages its internal state,
    // but can be good for explicit state management.
    setSelectedPromotion(null);
    setModalError(null);
  }, [router]);

  const handleCopyCode = useCallback(async (code: string | undefined | null) => {
    if (!code) {
      setNotification({ message: "No discount code to copy.", type: "error" });
      return;
    }
    try {
      await navigator.clipboard.writeText(code);
      setNotification({
        message: `Code "${code}" copied to clipboard!`,
        type: "success",
      });
    } catch (err) {
      setNotification({
        message: "Failed to copy code. Please try again.",
        type: "error",
      });
      console.error("Failed to copy text: ", err);
    }
  }, []);

  // Effect to fetch the list of promotions (only runs when currentPage changes)
  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        setLoading(true);
        const response: PromotionListResponse =
          await PromotionService.getPromotions(currentPage, pageSize);
        setPromotions(response.data.items);
        setTotalPages(response.data.totalPages);
        setCurrentPage(response.data.currentPage);
      } catch (err) {
        setError("Failed to load promotions. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchPromotions();
  }, [currentPage]); // Dependency on currentPage ensures re-fetch on page change

  // Effect to handle modal display based on URL search parameter
  useEffect(() => {
    const discountId = searchParams.get("discount");

    const fetchPromotionDetails = async (id: string) => {
      setLoadingModal(true);
      setModalError(null);
      try {
        const response = await PromotionService.getPromotionById(id);
        setSelectedPromotion(response.data);
        setIsModalOpen(true); // Open Radix Dialog
      } catch (err) {
        console.error("Failed to fetch promotion details:", err);
        setModalError("Failed to load promotion details.");
        setSelectedPromotion(null);
        setIsModalOpen(false); // Close Radix Dialog on error
      } finally {
        setLoadingModal(false);
      }
    };

    if (discountId) {
      fetchPromotionDetails(discountId);
      // When modal opens, disable body scroll
      document.body.style.overflow = "hidden";
    } else {
      // When modal closes, enable body scroll
      document.body.style.overflow = "auto";
      setIsModalOpen(false); // Close Radix Dialog if URL param is removed externally
      setSelectedPromotion(null); // Clear selected promotion when no ID in URL
      setModalError(null); // Clear any previous modal errors
    }

    // Cleanup function to ensure scroll is re-enabled on component unmount
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [searchParams]); // Only re-run when searchParams change (i.e., discount param added/removed)

  // Effect to hide the notification after a few seconds
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 3000); // Hide after 3 seconds
      return () => clearTimeout(timer);
    }
  }, [notification]);

  // Generate pagination numbers
  const pageNumbers = useMemo(() => {
    const pages: (number | string)[] = [];
    if (totalPages === 0) return []; // Handle case where there are no pages

    // Always include the first page
    pages.push(1);

    // Determine the range of pages around the current page
    let startPage = Math.max(2, currentPage - 2);
    let endPage = Math.min(totalPages - 1, currentPage + 2);

    // Adjust startPage and endPage to show more pages if near boundaries
    if (currentPage <= 3) {
      endPage = Math.min(totalPages - 1, 5);
    } else if (currentPage >= totalPages - 2) {
      startPage = Math.max(2, totalPages - 4);
    }

    // Add "..." if there's a gap between 1 and startPage
    if (startPage > 2) {
      pages.push("...");
    }

    // Add pages in the calculated range
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    // Add "..." if there's a gap between endPage and totalPage
    if (endPage < totalPages - 1) {
      pages.push("...");
    }

    // Always include the last page (if it's not the same as the first or already included)
    if (totalPages > 1 && !pages.includes(totalPages)) {
      pages.push(totalPages);
    }

    return pages;
  }, [currentPage, totalPages]);

  if (error) {
    return (
      <div className="container px-4 py-8 md:py-12 text-red-600 dark:text-red-400">
        {error}
      </div>
    );
  }

  return (
    <div className="container px-4 py-8 md:py-12 min-h-screen flex flex-col">
      {notification && (
        <div
          className={`fixed top-20 left-1/2 -translate-x-1/2 px-4 py-2 rounded-lg shadow-md text-white z-[51] transition-all duration-300 ${
            notification.type === "success" ? "bg-green-500" : "bg-red-500"
          }`}
        >
          {notification.message}
        </div>
      )}

      <div className="flex flex-col gap-6 flex-grow">
        <h1 className="text-5xl font-extrabold text-orange-600 dark:text-orange-400 text-center">
          Exclusive Promotions & Offers
        </h1>
        <p className="mx-auto max-w-3xl text-center text-lg text-gray-700 dark:text-gray-300 md:text-xl">
          This is your go-to for all current promotions, special offers, and
          discounts to make your movie experience more affordable and enjoyable.
          Happy watching, and happy saving!
        </p>

        {/* Responsive grid for promotions */}
        {loading ? (
          <div className="text-center text-gray-600 dark:text-gray-400 py-10 col-span-full">
            Loading promotions...
          </div>
        ) : promotions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4 items-stretched">
            {promotions.map((promo) => (
              <Link
                key={promo.id}
                href={`/user/promotions?discount=${promo.id}`}
                passHref
                scroll={false}
              >
                <Card className="flex flex-col md:flex-row items-start p-4 md:p-6 rounded-2xl shadow-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow duration-300 cursor-pointer h-full">
                  {/* Image on the left */}
                  <div className="relative w-full md:w-1/3 lg:w-1/4 h-48 md:h-32 rounded-lg overflow-hidden flex-shrink-0 mb-4 md:mb-0 md:mr-6">
                    <Image
                      src={promo.image}
                      alt={promo.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      priority={false}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                      style={{ borderRadius: "8px" }}
                    />
                  </div>

                  {/* Main Content Area */}
                  <CardContent className="flex-grow flex flex-col justify-center w-full p-0">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white leading-tight pr-2 mb-2 line-clamp-2">
                      {promo.title}
                    </h3>
                    {/* Discount Code - moved below title and aligned left */}
                    {promo.code && (
                      <div
                        className="flex items-center gap-2 bg-orange-500 text-white text-base font-bold px-4 py-2 rounded-lg mb-2 w-fit cursor-copy hover:bg-orange-600 transition-colors duration-200" // Added hover styles and flex for icon
                        onClick={(e) => {
                          e.preventDefault(); // Prevent navigating when clicking the code box
                          handleCopyCode(promo.code);
                        }}
                      >
                        {promo.code} <Copy className="h-4 w-4" />{" "}
                        {/* Adjusted icon size */}
                      </div>
                    )}

                    <p className="text-xl font-semibold text-green-600 dark:text-green-400 mb-2">
                      {promo.discountTypeEnum === "Fixed"
                        ? formatCurrency(promo.discountPrice)
                        : `${promo.discountPrice}% OFF`}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Minimum Order: {formatCurrency(promo.minOrderValue)}
                    </p>
                    <span className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                      Valid until:{" "}
                      {new Date(promo.endTime).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                    {/* Discount Type and Discount Name */}
                    <div className="flex flex-wrap gap-2 mt-2">
                      <div
                        className={`text-sm text-white px-3 py-1 rounded-full w-fit ${getDiscountTypeStyles(
                          promo.discountTypeEnum
                        )}`}
                      >
                        {promo.discountTypeEnum}
                      </div>
                      {promo.discountTypeId?.name && (
                        <div
                          className={`text-sm text-white px-3 py-1 rounded-full w-fit ${getDiscountNameStyles(
                            promo.discountTypeId.name
                          )}`}
                        >
                          {promo.discountTypeId.name}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-600 dark:text-gray-400 py-10 col-span-full">
            No promotions available at the moment. Please check back later!
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-8">
          <Button
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            variant="outline"
          >
            Previous
          </Button>
          {pageNumbers.map((page, index) =>
            page === "..." ? (
              <span key={index} className="px-2 py-1">
                ...
              </span>
            ) : (
              <Button
                key={index}
                onClick={() => setCurrentPage(page as number)}
                variant={currentPage === page ? "default" : "outline"}
              >
                {page}
              </Button>
            )
          )}
          <Button
            onClick={() =>
              setCurrentPage((prev) => Math.min(totalPages, prev + 1))
            }
            disabled={currentPage === totalPages}
            variant="outline"
          >
            Next
          </Button>
        </div>
      )}

      {/* Promotion Detail Modal using Radix Dialog */}
      <Dialog open={isModalOpen} onOpenChange={handleCloseModal}>
        <DialogContent className="sm:max-w-[600px] dark:bg-gray-800 dark:text-white">
          {loadingModal && (
            <p className="text-gray-700 dark:text-white">
              Loading promotion details...
            </p>
          )}

          {modalError && (
            <div className="text-center">
              <p className="text-red-600 dark:text-red-400 mb-4">{modalError}</p>
              <Button onClick={handleCloseModal}>Close</Button>
            </div>
          )}

          {selectedPromotion && !loadingModal && !modalError && (
            <PromotionModalContent // Use the new content component here
              promotion={selectedPromotion}
              onClose={handleCloseModal}
              onCopyCode={handleCopyCode}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* --- FAQ Section --- */}
      <div className="mt-12 w-full max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold text-orange-600 dark:text-orange-400 text-center mb-6">
          Frequently Asked Questions
        </h2>
        <div className="flex flex-col gap-4">
          <FAQItem
            question="How do I use a promotion code?"
            answer="To use a promotion code, first, copy the code from the promotion details by clicking on the code. During the checkout process for your movie tickets or concessions, you will find a field to enter your promotion code. Paste the copied code there and apply it to see the discount reflected in your total."
          />
          <FAQItem
            question="How can I find out about current promotions?"
            answer="The best ways to stay informed are to check our official website, follow our social media channels, or inquire directly at the cinema box office."
          />
          <FAQItem
            question="What if my promotion code isn't working?"
            answer="If your promotion code isn't working, please check the following: 1) Ensure the code is entered correctly, without any typos. 2) Verify the promotion's expiry date and make sure it's still active. 3) Check if your order meets the minimum order value or any other specific conditions (e.g., specific movie, date, or time). 4) Some promotions are for single use only. If you've used it before, it might not work again. If you've checked all these and it's still not working, please contact our customer support for assistance."
          />
          <FAQItem
            question="Can I combine multiple promotions?"
            answer="Only one promotion code can be applied per transaction. Please refer to the specific terms and conditions of each promotion for details on eligibility and usage."
          />
          <FAQItem
            question="What does 'Fixed' vs 'Percent' discount mean?"
            answer="'Fixed' discount means a set amount will be deducted from your total (e.g., 50,000 VND off). 'Percent' discount means a percentage of your total will be deducted (e.g., 10% off), often with a maximum discount value specified."
          />
        </div>
      </div>
    </div>
  );
}