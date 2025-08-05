"use client";

import { useState } from "react";
import { BadgePercent, X } from "lucide-react";
import { useGetPromotionsAvailable } from "@/hooks/usePromotions";
import { Promotion } from "@/lib/api/service/fetchPromotion";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { useTranslation } from "react-i18next";

interface Props {
  selectedCode: string;
  onSelect: (code: Partial<Promotion>) => void;
  totalPrice: number;
  userId: string;
}

export default function PromoCodeSelector({
  selectedCode,
  onSelect,
  totalPrice,
  userId,
}: Props) {
  const { t } = useTranslation();
  const { data: promoData } = useGetPromotionsAvailable(userId);
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className="flex justify-between items-center border p-2 rounded-md cursor-pointer hover:bg-muted transition">
          <span>{selectedCode || t("promo.select")}</span>
        </div>
      </DialogTrigger>

      <DialogContent className="max-w-md">
        <DialogHeader className="flex flex-row justify-between items-center">
          <DialogTitle>{t("promo.title")}</DialogTitle>
          <DialogClose asChild></DialogClose>
        </DialogHeader>

        <div className="space-y-3 max-h-80 overflow-y-auto">
          {promoData?.promotions?.length ? (
            promoData.promotions.map((promo) => {
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
                      {promo.discountTypeEnum === "Percent"
                        ? "%"
                        : t("currency")}
                    </div>
                    <div className="text-xs text-gray-400">
                      {t("promo.expire")}: {promo.endTime}
                    </div>
                    {notEnough && (
                      <div className="text-xs text-red-500 mt-1">
                        {t("promo.minOrder", {
                          value: promo.minOrderValue.toLocaleString(),
                        })}
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-sm text-gray-500 text-center">
              Không có khuyến mãi khả dụng.
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
