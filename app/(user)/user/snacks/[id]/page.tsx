"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/utils/utils";
import { useSnack } from "@/hooks/useSnacks";

export default function SnackDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;
  const { data, isLoading, isError, error } = useSnack(id);
  const router = useRouter();

  const [previewModal, setPreviewModal] = useState(false);

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
            {error?.message || "Snack not found or an error occurred."}
          </AlertDescription>
        </Alert>
        <Button asChild variant="outline" className="mt-8">
          <Link href="/user/snacks">Back to Snacks</Link>
        </Button>
      </div>
    );
  }

  const { snack } = data;

  const statusColors: Record<string, string> = {
    true: orangeBadge + " border border-orange-200 dark:border-orange-700",
    false: "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400",
  };

  const renderStatus = () => (
    <Badge
      className={cn(
        "text-xs font-semibold rounded-full px-4 py-1 shadow",
        statusColors[snack.isAvailable.toString()] || orangeBadge
      )}
    >
      {snack.isAvailable ? "Available" : "Unavailable"}
    </Badge>
  );

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="grid grid-cols-1 md:grid-cols-[1.1fr_1.5fr] gap-12 items-start">
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
              src={snack.image}
              alt={snack.name}
              width={380}
              height={520}
              className="object-cover w-[380px] h-[520px] transition-transform duration-300 group-hover:scale-105"
              priority
            />
            <div className="absolute top-5 left-5 z-10">{renderStatus()}</div>
            <div className="absolute bottom-2 right-2 z-10 bg-black/60 px-2 py-1 rounded text-xs text-white opacity-0 group-hover:opacity-100 transition">
              View full image
            </div>
          </div>
        </div>
        <Card
          className={cn(
            "shadow-2xl border-none rounded-3xl",
            "bg-white/80 dark:bg-zinc-950/80 backdrop-blur"
          )}
        >
          <CardContent className="p-10">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-6">
                <h1
                  className={cn(
                    "text-3xl md:text-4xl font-extrabold tracking-tight leading-tight",
                    "text-zinc-900 dark:text-white"
                  )}
                >
                  {snack.name}
                </h1>
                <Button
                  asChild
                  variant="ghost"
                  className={cn(
                    "text-base px-4 py-2 bg-zinc-50 dark:bg-zinc-800 rounded-xl border",
                    orangeBorder
                  )}
                >
                  <Link href="/user/snacks">← All Snacks</Link>
                </Button>
              </div>
              <div className="flex items-center gap-4 mb-3">
                <span
                  className={cn(
                    "text-4xl md:text-5xl font-extrabold tracking-tight",
                    orangeText
                  )}
                >
                  {snack.price} VND
                </span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="block text-zinc-500 dark:text-zinc-300 mb-1">
                    Status
                  </span>
                  <span>{snack.isAvailable ? "Available" : "Unavailable"}</span>
                </div>
              </div>
              <div className={cn("mt-8")}>
                <details
                  className={cn(
                    "rounded-xl px-5 py-4 cursor-pointer",
                    orangeBgSoft,
                    orangeText
                  )}
                >
                  <summary className="font-semibold">Details</summary>
                  <ul className="mt-3 list-disc ml-6 text-sm space-y-1">
                    <li>
                      Each combo is curated to offer the best value and may
                      include a mix of products, services, or exclusive items.
                    </li>
                    <li>
                      Combo contents and prices are fixed and may not be
                      altered, exchanged, or substituted unless specifically
                      allowed.
                    </li>
                    <li>
                      Limited availability – combos are offered on a first-come,
                      first-served basis and only while supplies last.
                    </li>
                    <li>
                      The listed price includes all applicable taxes and
                      standard packaging or service charges.
                    </li>
                    <li>
                      Photos and descriptions are for illustrative purposes
                      only; actual items may vary slightly based on
                      availability.
                    </li>
                    <li>
                      Combos cannot be split across multiple orders or redeemed
                      partially.
                    </li>
                    <li>
                      For digital or experience-based combos (e.g., movie +
                      snack), availability may depend on time slots or
                      participating venues.
                    </li>
                    <li>
                      For any questions or custom combo requests, please contact
                      our support team — we&apos;re happy to help!
                    </li>
                  </ul>
                </details>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
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
                src={snack.image}
                alt="Snack preview"
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
