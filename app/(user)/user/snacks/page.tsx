"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import SnackService, {
  Snack,
  SnackListResponse,
} from "@/lib/api/service/fetchSnack";

export default function SnacksPage() {
  const [snacks, setSnacks] = useState<Snack[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSnacks = async () => {
      try {
        setLoading(true);
        const response: SnackListResponse = await SnackService.getSnacks();
        setSnacks(response.data.items);
      } catch (err) {
        setError("Failed to load snacks. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchSnacks();
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
        <h1 className="text-3xl font-bold text-orange">Snacks & Combos</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {snacks.map((snack) => (
            <Card
              key={snack.id}
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
                  src={snack.image}
                  alt={snack.name}
                  fill
                  className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                  priority={false}
                  sizes="(max-width: 768px) 100vw, 33vw"
                  style={{
                    borderRadius: "16px",
                  }}
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6 rounded-2xl">
                  <div>
                    <h3 className="text-xl font-semibold mb-2 text-white">
                      {snack.name}
                    </h3>
                    <p className="text-white mb-2">Price: {snack.price} VND</p>
                    <p className="text-white mb-4">
                      Status: {snack.isAvailable ? "Available" : "Unavailable"}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-white">
                        Click for details
                      </span>
                      <Button
                        asChild
                        size="sm"
                        className="bg-orange-500 text-white hover:bg-orange-300"
                      >
                        <Link href={`/user/snacks/${snack.id}`}>
                          Learn More
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
              <CardContent className="p-6 block md:hidden">
                <h3 className="text-xl font-semibold mb-2">{snack.name}</h3>
                <p className="text-muted-foreground mb-2">
                  Price: {snack.price} VND
                </p>
                <p className="text-muted-foreground mb-4">
                  Status: {snack.isAvailable ? "Available" : "Unavailable"}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Click for details
                  </span>
                  <Button
                    asChild
                    size="sm"
                    className="bg-orange-500 text-white hover:bg-orange-300"
                  >
                    <Link href={`/user/snacks/${snack.id}`}>Learn More</Link>
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
