"use client";

import { usePromotions } from "@/hooks/usePromotions";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  Gift,
  Percent,
  AlertCircle,
  Copy,
} from "lucide-react";
import { useState, useEffect } from "react";
import Image from "next/image";
import { toast } from "@/hooks/use-toast";
import { Toast } from "@radix-ui/react-toast";
import { formatVND } from "@/utils/price/formatPrice";

interface Promotion {
  id: string;
  title: string;
  image: string;
  startTime: string;
  endTime: string;
  code: string;
  discountPrice: number;
  discountTypeEnum: string;
  discountTypeId: { id: string; name: string } | null;
  maxDiscountValue: number;
  minOrderValue: number;
  discountUserNum: number;
  statusActive: string;
  createdAt: string;
  updatedAt: string | null;
}

export default function PromotionsSection() {
  const { data, isLoading, isError, error } = usePromotions(1, 6);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-slide functionality
  useEffect(() => {
    if (!data?.promotions?.length) return;

    const timer = setInterval(() => {
      setCurrentSlide(
        (prev) => (prev + 1) % Math.ceil(data.promotions.length / 3)
      );
    }, 5000);

    return () => clearInterval(timer);
  }, [data?.promotions?.length]);

  const nextSlide = () => {
    if (!data?.promotions?.length) return;
    setCurrentSlide(
      (prev) => (prev + 1) % Math.ceil(data.promotions.length / 3)
    );
  };

  const prevSlide = () => {
    if (!data?.promotions?.length) return;
    setCurrentSlide(
      (prev) =>
        (prev - 1 + Math.ceil(data.promotions.length / 3)) %
        Math.ceil(data.promotions.length / 3)
    );
  };

  const formatTimeRemaining = (endTime: string) => {
    const now = new Date();
    const endDate = new Date(endTime);
    const diff = endDate.getTime() - now.getTime();

    if (diff <= 0) return "Expired";

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    if (days > 0) return `${days}d ${hours}h left`;
    return `${hours}h left`;
  };

  const formatDiscount = (promotion: Promotion) => {
    if (promotion.discountTypeEnum === "PERCENTAGE") {
      return `${promotion.discountPrice}% OFF`;
    } else if (promotion.discountTypeEnum === "FIXED_AMOUNT") {
      return `${formatVND(promotion.discountPrice)} OFF`;
    }
    return `${formatVND(promotion.discountPrice)} OFF`;
  };

  if (isLoading) {
    return (
      <section className="py-16 px-4 bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <Skeleton className="h-8 w-64 mx-auto mb-4" />
            <Skeleton className="h-4 w-96 mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="h-48 w-full" />
                <CardContent className="p-6">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full mb-4" />
                  <Skeleton className="h-10 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <Alert className="max-w-md mx-auto">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Failed to load promotions. Please try again later.
            </AlertDescription>
          </Alert>
        </div>
      </section>
    );
  }

  if (!data?.promotions?.length) {
    return (
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <Gift className="h-16 w-16 mx-auto text-gray-400 mb-4" />
          <h2 className="text-2xl font-bold text-gray-600 mb-2">
            No Promotions Available
          </h2>
          <p className="text-gray-500">Check back soon for exciting offers!</p>
        </div>
      </section>
    );
  }

  const promotions = data.promotions as Promotion[];
  const slidesToShow = 3;
  const totalSlides = Math.ceil(promotions.length / slidesToShow);

  return (
    <section className="py-16 px-4 mt-12 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-200 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-200 rounded-full opacity-20 animate-pulse delay-1000"></div>
      </div>

      <div className="max-w-7xl mx-auto relative">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-600 to-pink-600 text-white px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Gift className="h-4 w-4" />
            Special Offers
          </div>
          <h2 className="text-4xl font-bold bg-gradient-to-r from-orange-600 via-pink-600 to-orange-600 bg-clip-text text-transparent mb-4">
            Limited Time Promotions
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Don&apos;t miss out on these incredible deals! Save big on your
            favorite items.
          </p>
        </div>

        {/* Promotions Carousel */}
        <div className="relative">
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {Array.from({ length: totalSlides }).map((_, slideIndex) => (
                <div key={slideIndex} className="w-full flex-shrink-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-2">
                    {promotions
                      .slice(
                        slideIndex * slidesToShow,
                        (slideIndex + 1) * slidesToShow
                      )
                      .map((promotion) => (
                        <Card
                          key={promotion.id}
                          className="group overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 bg-white/80 backdrop-blur-sm"
                        >
                          <div className="relative overflow-hidden">
                            <div className="aspect-video bg-gradient-to-br from-purple-400 via-pink-400 to-orange-400 relative">
                              {promotion.image ? (
                                <Image
                                  src={promotion.image || "/placeholder.svg"}
                                  alt={promotion.title}
                                  fill
                                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                                />
                              ) : (
                                <div className="flex items-center justify-center h-full">
                                  <Percent className="h-16 w-16 text-white/80" />
                                </div>
                              )}
                            </div>

                            {/* Discount Badge */}
                            <div className="absolute top-4 left-4">
                              <Badge className="bg-red-500 hover:bg-red-600 text-white font-bold text-lg px-3 py-1 animate-pulse">
                                {formatDiscount(promotion)}
                              </Badge>
                            </div>

                            {/* Status Badge */}
                            <div className="absolute top-4 right-4">
                              <Badge
                                variant={
                                  promotion.statusActive === "ACTIVE"
                                    ? "default"
                                    : "secondary"
                                }
                                className={
                                  promotion.statusActive === "ACTIVE"
                                    ? "bg-green-500 text-white"
                                    : "bg-gray-500 text-white"
                                }
                              >
                                {promotion.statusActive}
                              </Badge>
                            </div>

                            {/* Promo Code */}
                            <div className="absolute bottom-4 left-4">
                              <Badge
                                variant="outline"
                                className="bg-white/90 text-gray-700 font-mono"
                              >
                                CODE: {promotion.code}
                              </Badge>
                            </div>
                          </div>

                          <CardContent className="p-6">
                            <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-orange-600 transition-colors">
                              {promotion.title}
                            </h3>

                            {/* Discount Details */}
                            <div className="space-y-2 mb-4">
                              {promotion.minOrderValue > 0 && (
                                <p className="text-sm text-gray-600">
                                  Min. order:{" "}
                                  <span className="font-semibold">
                                    {formatVND(promotion.minOrderValue)}
                                  </span>
                                </p>
                              )}
                              {promotion.maxDiscountValue > 0 &&
                                promotion.discountTypeEnum === "PERCENTAGE" && (
                                  <p className="text-sm text-gray-600">
                                    Max. discount:{" "}
                                    <span className="font-semibold">
                                      {formatVND(promotion.maxDiscountValue)}
                                    </span>
                                  </p>
                                )}
                              {promotion.discountTypeId && (
                                <p className="text-sm text-orange-600 font-medium">
                                  {promotion.discountTypeId.name}
                                </p>
                              )}
                            </div>

                            {/* Usage Stats */}
                            <div className="flex items-center gap-2 mb-4 text-sm text-blue-600">
                              <Gift className="h-4 w-4" />
                              <span>
                                {promotion.discountUserNum} people used this
                                offer
                              </span>
                            </div>

                            {/* Time remaining */}
                            <div className="flex items-center gap-2 mb-4 text-sm text-orange-600">
                              <Clock className="h-4 w-4" />
                              <span className="font-medium">
                                {formatTimeRemaining(promotion.endTime)}
                              </span>
                            </div>

                            <Button
                              onClick={() => {
                                navigator.clipboard.writeText(promotion.code);
                                toast({
                                  title: "Đã sao chép",
                                  description:
                                    "Mã khuyến mãi đã được sao chép vào clipboard.",
                                });
                              }}
                              className="w-2/4 mx-auto bg-gradient-to-r from-orange-600 to-pink-600 hover:from-orange-700 hover:to-pink-700 text-white font-semibold py-2 px-4 rounded-lg transform transition-all duration-200 hover:scale-105 flex items-center justify-center gap-2"
                            >
                              <Copy className="w-4 h-4" />
                              <span className="tracking-wide">
                                {promotion.code}
                              </span>
                            </Button>
                          </CardContent>
                        </Card>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Arrows */}
          {totalSlides > 1 && (
            <>
              <Button
                variant="outline"
                size="icon"
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white/80 backdrop-blur-sm hover:bg-white shadow-lg"
                onClick={prevSlide}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white/80 backdrop-blur-sm hover:bg-white shadow-lg"
                onClick={nextSlide}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>

        {/* Slide Indicators */}
        {totalSlides > 1 && (
          <div className="flex justify-center gap-2 mt-8">
            {Array.from({ length: totalSlides }).map((_, index) => (
              <button
                key={index}
                className={`w-3 h-3 rounded-full transition-all duration-200 ${
                  index === currentSlide
                    ? "bg-orange-600 scale-125"
                    : "bg-gray-300 hover:bg-gray-400"
                }`}
                onClick={() => setCurrentSlide(index)}
              />
            ))}
          </div>
        )}

        {/* Call to Action */}
        <div className="text-center mt-12">
          <Button
            size="lg"
            className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold px-8 py-3 rounded-full transform transition-all duration-200 hover:scale-105 shadow-lg"
          >
            View All Promotions
          </Button>
        </div>
      </div>
    </section>
  );
}
