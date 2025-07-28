"use client";

import { useState } from "react";
import { BadgePercent, X } from "lucide-react";
import { usePromotions } from "@/hooks/usePromotions";
import { Promotion } from "@/lib/api/service/fetchPromotion";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";

interface Props {
  selectedCode: string;
  onSelect: (code: Partial<Promotion>) => void;
  totalPrice: number;
}

export default function PromoCodeSelector({
  selectedCode,
  onSelect,
  totalPrice,
}: Props) {
  const { data: promoData } = usePromotions();
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className="flex justify-between items-center border p-2 rounded-md cursor-pointer hover:bg-muted transition">
          <span>{selectedCode || "Chọn mã giảm giá"}</span>
        </div>
      </DialogTrigger>

      <DialogContent className="max-w-md">
        <DialogHeader className="flex flex-row justify-between items-center">
          <DialogTitle>Chọn mã giảm giá</DialogTitle>
          <DialogClose asChild>
        
          </DialogClose>
        </DialogHeader>

        <div className="space-y-3 max-h-80 overflow-y-auto">
          {promoData?.promotions
            .filter((promo) => promo.statusActive === "Active")
            .map((promo) => {
              const notEnough = totalPrice < promo.minOrderValue;

              return (
                <div
                  key={promo.id}
                  className={`border p-3 rounded-md flex items-start gap-3 ${
                    notEnough
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:border-blue-500 cursor-pointer"
                  }`}
                  onClick={() => {
                    if (notEnough) return;
                    onSelect({
                      id: promo.id,
                      code: promo.code,
                      title: promo.title,
                      discountPrice: promo.discountPrice,
                      discountTypeEnum: promo.discountTypeEnum,
                      endTime: promo.endTime,
                      minOrderValue: promo.minOrderValue,
                      maxDiscountValue: promo.maxDiscountValue,
                    });
                    setOpen(false);
                  }}
                >
                  <BadgePercent className="text-blue-500 mt-1" />
                  <div>
                    <div className="font-semibold">{promo.code}</div>
                    <div className="text-sm text-gray-600">
                      {promo.discountPrice}
                      {promo.discountTypeEnum === "Percent" ? "%" : "đ"}
                    </div>
                    <div className="text-xs text-gray-400">
                      HSD: {promo.endTime}
                    </div>
                    {notEnough && (
                      <div className="text-xs text-red-500 mt-1">
                        Cần tối thiểu{" "}
                        {promo.minOrderValue.toLocaleString()}đ để áp dụng
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
        </div>
      </DialogContent>
    </Dialog>
  );
}
