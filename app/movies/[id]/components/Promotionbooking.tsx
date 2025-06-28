"use client";

import { useState } from "react";
import { Dialog } from "@headlessui/react";
import { BadgePercent, X } from "lucide-react";
import { usePromotions } from "@/hooks/usePromotions";
import { Promotion } from "@/lib/api/service/fetchPromotion";

interface Props {
  selectedCode: string;
  onSelect: (code: Partial<Promotion>) => void;
  totalPrice: number; // ✅ thêm để kiểm tra minOrderValue
}

export default function PromoCodeSelector({
  selectedCode,
  onSelect,
  totalPrice,
}: Props) {
  const [open, setOpen] = useState(false);
  const { data: promoData } = usePromotions();

  return (
    <>
      <div className="flex justify-between items-center border p-2 rounded-md">
        <span>{selectedCode || "Chọn mã giảm giá"}</span>
        <button
          className="text-blue-600 text-sm font-medium underline"
          onClick={() => setOpen(true)}
        >
          Chọn Voucher
        </button>
      </div>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/40" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-md bg-white p-5 rounded-lg shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <Dialog.Title className="text-lg font-bold">
                Chọn mã giảm giá
              </Dialog.Title>
              <button onClick={() => setOpen(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 max-h-80 overflow-y-auto">
              {promoData?.promotions.map((promo) => {
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
                      if (notEnough) return; // không cho chọn nếu chưa đủ điều kiện
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
                        {promo.discountPrice}{" "}
                        {promo.discountTypeEnum === "Percent" ? "%" : "đ"}
                      </div>
                      <div className="text-xs text-gray-400">
                        HSD: {promo.endTime}
                      </div>
                      {notEnough && (
                        <div className="text-xs text-red-500 mt-1">
                          Cần tối thiểu {promo.minOrderValue.toLocaleString()}đ
                          để áp dụng
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </>
  );
}
