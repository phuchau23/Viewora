"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Promotion,
  PromotionListResponse,
  PromotionService,
} from "@/lib/api/service/fetchPromotion";

export default function PromotionsPage() {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        setLoading(true);
        const response: PromotionListResponse =
          await PromotionService.getPromotions();
        setPromotions(response.data.items);
      } catch (err) {
        setError("Failed to load promotions. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchPromotions();
  }, []);

  if (loading) {
    return <div className="container px-4 py-8 md:py-12">Loading...</div>;
  }

  if (error) {
    return <div className="container px-4 py-8 md:py-12">{error}</div>;
  }

  return (
    <div className="container px-20 py-8 md:py-12">
      <div className="flex flex-col gap-6">
        <h1 className="text-3xl font-bold text-orange">Promotions & Offers</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {promotions.map((promo) => (
            <Card
              key={promo.id}
              className="overflow-hidden group relative cursor-pointer rounded-2xl shadow-lg"
              style={{
                aspectRatio: "3/4",
                minHeight: 0,
                height: "450px",
                maxHeight: "540px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-end",
                transition: "box-shadow 0.2s",
              }}
            >
              <div className="relative w-full h-full">
                <Image
                  src={promo.image}
                  alt={promo.title}
                  fill
                  className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                  priority={false}
                  sizes="(max-width: 768px) 100vw, 33vw"
                  style={{
                    borderRadius: "16px",
                  }}
                />
                {/* Overlay info */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6 rounded-2xl">
                  <div>
                    <h3 className="text-xl font-semibold mb-2 text-white">
                      {promo.title}
                    </h3>
                    <p className="text-white mb-2">Code: {promo.code}</p>
                    <p className="text-white mb-2">
                      Discount: {promo.discountPrice} {promo.discountTypeEnum}
                    </p>
                    <p className="text-white mb-4">
                      Minimum Order: ${promo.minOrderValue}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-white">
                        Valid until:{" "}
                        {new Date(promo.endTime).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                      <Button
                        asChild
                        size="sm"
                        className="bg-orange-500 text-white hover:bg-orange-300"
                      >
                        <Link href={`/user/promotions/${promo.id}`}>
                          Learn More
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
              {/* Hiển thị info trên mobile */}
              <CardContent className="p-6 block md:hidden">
                <h3 className="text-xl font-semibold mb-2">{promo.title}</h3>
                <p className="text-muted-foreground mb-2">Code: {promo.code}</p>
                <p className="text-muted-foreground mb-2">
                  Discount: {promo.discountPrice} {promo.discountTypeEnum}
                </p>
                <p className="text-muted-foreground mb-4">
                  Minimum Order: ${promo.minOrderValue}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Valid until:{" "}
                    {new Date(promo.endTime).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                  <Button asChild disabled={!promo.id}>
                    <Link href={`/user/promotions/${promo.id}`}>
                      Learn More
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
