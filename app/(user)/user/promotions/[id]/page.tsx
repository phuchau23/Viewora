"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { usePromotion } from "@/hooks/usePromotions";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/utils/utils";
import { toast } from "sonner";
import { formatVND } from "@/utils/price/formatPrice";

export default function PromotionDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;
  const { data, isLoading, isError, error } = usePromotion(id);
  const router = useRouter();

  // Modal preview state
  const [previewModal, setPreviewModal] = useState(false);

  // Orange color classes for light/dark mode
  const orangeText = "text-orange-600 dark:text-orange-400";
  const orangeBgSoft = "bg-orange-100 dark:bg-orange-950";
  const orangeBorder = "border-orange-300 dark:border-orange-700";
  const orangeBadge =
    "bg-orange-100 dark:bg-orange-950 text-orange-700 dark:text-orange-400";

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col md:flex-row gap-10 animate-pulse">
          <Skeleton className="h-80 w-full md:w-1/2 rounded-3xl" />
          <div className="flex-1 space-y-8">
            <Skeleton className="h-12 w-1/2 rounded-lg" />
            <Skeleton className="h-8 w-1/5 rounded" />
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-5 w-1/3" />
            <Skeleton className="h-28 w-full rounded-xl" />
            <div className="flex gap-4">
              <Skeleton className="h-12 w-40 rounded-xl" />
              <Skeleton className="h-12 w-40 rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="container mx-auto px-4 py-16">
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {error?.message || "Promotion not found or an error occurred."}
          </AlertDescription>
        </Alert>
        <Button asChild variant="outline" className="mt-8">
          <Link href="/user/promotions">Back to Promotions</Link>
        </Button>
      </div>
    );
  }

  const { promotion } = data;

  // Status color mapping with orange for ACTIVE
  const statusColors: Record<string, string> = {
    ACTIVE: orangeBadge + " border border-orange-200 dark:border-orange-700",
    EXPIRED: "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400",
    UPCOMING:
      "bg-amber-100 dark:bg-amber-800 text-amber-700 dark:text-amber-300",
    INACTIVE: "bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300",
  };

  const renderDiscount = () => (
    <span
      className={cn(
        "text-4xl md:text-5xl font-extrabold tracking-tight",
        orangeText
      )}
    >
      {promotion.discountTypeEnum === "PERCENT"
        ? `${promotion.discountPrice}%`
        : `$${promotion.discountPrice}`}
    </span>
  );

  const renderStatus = () => (
    <Badge
      className={cn(
        "text-xs font-semibold rounded-full px-4 py-1 shadow",
        statusColors[promotion.statusActive] || orangeBadge
      )}
    >
      {promotion.statusActive}
    </Badge>
  );

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="grid grid-cols-1 md:grid-cols-[1.1fr_1.5fr] gap-12 items-start">
        {/* Left: Image & code */}
        <div className="flex flex-col items-center gap-8">
          <div
            className={cn(
              "rounded-3xl shadow-2xl overflow-hidden border-4 relative group",
              orangeBgSoft,
              orangeBorder,
              "cursor-pointer"
            )}
            onClick={() => setPreviewModal(true)}
            title="Click to view full image"
            style={{ height: 490, width: 380, maxWidth: "100%" }}
          >
            <Image
              src={promotion.image}
              alt={promotion.title}
              width={380}
              height={520}
              className="object-cover w-[380px] h-[520px] transition-transform duration-300 group-hover:scale-105"
              priority
            />
            <div className="absolute top-5 left-5 z-10">{renderStatus()}</div>
            <div className="absolute bottom-2 right-2 z-10 bg-black/60 px-2 py-1 rounded text-xs text-white opacity-0 group-hover:opacity-100 transition">
              Xem toàn hình
            </div>
          </div>
          {/* <div className="flex flex-col items-center gap-2 w-full">
            <span className="uppercase text-muted-foreground text-xs font-medium tracking-widest">
              Your Promo Code
            </span>
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  "px-5 py-2 rounded-xl font-mono font-bold text-xl tracking-widest select-all shadow border",
                  orangeBgSoft,
                  orangeText,
                  orangeBorder
                )}
              >
                {promotion.code}
              </span>
              <Button
                size="icon"
                variant="outline"
                className={cn(
                  "ml-2 rounded-xl border-2",
                  orangeBorder,
                  "hover:bg-orange-50 hover:dark:bg-orange-950"
                )}
                aria-label="Copy promotion code"
                onClick={() => {
                  navigator.clipboard.writeText(promotion.code);
                  toast.success("Promotion code copied to clipboard!", {
                    description: `Code: ${promotion.code}`,
                    duration: 2500,
                    position: "top-right",
                  });
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="22"
                  height="22"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 16h8a2 2 0 002-2V8m-2-4H8a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V8a2 2 0 00-2-2z"
                  />
                </svg>
              </Button>
            </div>
          </div> */}
        </div>
        {/* Right: Details */}
        <Card
          className={cn(
            "shadow-2xl border-none rounded-3xl",
            "bg-white/80 dark:bg-zinc-950/80 backdrop-blur"
          )}
        >
          <CardContent className="p-10">
            <div className="flex flex-col gap-6">
              {/* Header */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-6">
                <h1
                  className={cn(
                    "text-3xl md:text-4xl font-extrabold tracking-tight leading-tight",
                    "text-zinc-900 dark:text-white"
                  )}
                >
                  {promotion.title}
                </h1>
                <Button
                  asChild
                  variant="ghost"
                  className={cn(
                    "text-base px-4 py-2 bg-zinc-50 dark:bg-zinc-800 rounded-xl border",
                    orangeBorder
                  )}
                >
                  <Link href="/user/promotions">← All Promotions</Link>
                </Button>
              </div>
              {/* Discount & basic info */}
              <div className="flex items-center gap-4 mb-3">
                <span
                  className={cn(
                    "text-4xl md:text-5xl font-extrabold tracking-tight",
                    orangeText
                  )}
                >
                  {formatVND(promotion.discountPrice)}
                </span>
                <span
                  className={cn(
                    "font-bold tracking-widest ml-2 text-lg",
                    orangeText
                  )}
                >
                  Discount
                </span>
              </div>
              {/* Meta grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="block text-zinc-500 dark:text-zinc-300 mb-1">
                    Min. Order
                  </span>
                  <span className="font-semibold">
                    {formatVND(promotion.minOrderValue)}{" "}
                  </span>
                </div>
                <div>
                  <span className="block text-zinc-500 dark:text-zinc-300 mb-1">
                    Max. Discount
                  </span>
                  <span className="font-semibold">
                    {formatVND(promotion.maxDiscountValue)}{" "}
                  </span>
                </div>
                <div>
                  <span className="block text-zinc-500 dark:text-zinc-300 mb-1">
                    Valid
                  </span>
                  <span>
                    {new Date(promotion.startTime).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}{" "}
                    –{" "}
                    {new Date(promotion.endTime).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
              </div>
              {/* Optional: Terms & Conditions */}
              <div className={cn("mt-8")}>
                <details
                  className={cn(
                    "rounded-xl px-5 py-4 cursor-pointer",
                    orangeBgSoft,
                    orangeText
                  )}
                >
                  <summary className="font-semibold">
                    Terms & Conditions
                  </summary>
                  <ul className="mt-3 list-disc ml-6 text-sm space-y-1">
                    <li>
                      This promotion is applicable only during the campaign
                      period and may be subject to change or early termination
                      without prior notice.
                    </li>
                    <li>
                      Promo code must be applied at the time of checkout to be
                      valid; it cannot be applied retroactively to previous
                      orders.
                    </li>
                    <li>
                      Each user is eligible to use the promo code only once,
                      unless explicitly stated otherwise in the promotion
                      details.
                    </li>
                    <li>
                      This offer cannot be used in conjunction with other
                      discounts, vouchers, or promotional codes.
                    </li>
                    <li>
                      The promotion is valid only for orders that meet the
                      minimum order value as specified (excluding shipping fees,
                      if applicable).
                    </li>
                    <li>
                      The promo code is non-transferable, non-exchangeable, and
                      cannot be redeemed for cash or credit.
                    </li>
                    <li>
                      In case of cancellation or refund, the discount value will
                      not be refunded or re-issued.
                    </li>
                    <li>
                      We reserve the right to cancel any transaction or suspend
                      usage if fraudulent or suspicious activity is detected.
                    </li>
                    <li>
                      By participating in this promotion, users agree to abide
                      by all applicable terms and conditions.
                    </li>
                  </ul>
                </details>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      {/* Modal xem ảnh lớn */}
      <div>
        {previewModal && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
            onClick={() => setPreviewModal(false)}
          >
            <div
              className="relative max-w-3xl w-full flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="absolute top-2 right-2 bg-white rounded-full p-2 shadow hover:bg-gray-200 z-10"
                onClick={() => setPreviewModal(false)}
              >
                <span className="text-xl font-bold text-gray-700">×</span>
              </button>
              <Image
                src={promotion.image}
                alt="Promotion preview"
                width={900}
                height={700}
                className="rounded-xl object-contain max-h-[80vh] w-auto"
                priority
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
