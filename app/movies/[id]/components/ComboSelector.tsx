import React from "react";
import { Snack } from "@/lib/api/service/fetchSnack";

interface Props {
  availableCombos: Snack[];
  selectedCombos: Snack[];
  updateComboQuantity: (combo: Snack, quantity: number) => void;
}

export default function ComboSelector({
  availableCombos,
  selectedCombos,
  updateComboQuantity,
}: Props) {
  const getQuantity = (comboId: string) =>
    selectedCombos.find((c) => c.id === comboId)?.quantity || 0;

  // Giá ảo cố định dựa theo id
  const getOriginalPrice = (price: number, id: string) => {
    const seed = id.charCodeAt(0) % 10;
    const percent = 10 + (seed % 11); // 10–20%
    return Math.round(price * (1 + percent / 100));
  };

  return (
    <div>
      <h3 className="text-xl font-bold mb-6 ">Chọn Combo</h3>
      <div className="space-y-4">
        {availableCombos.map((combo) => {
          const quantity = getQuantity(combo.id);
          const originalPrice = getOriginalPrice(combo.price, combo.id);

          return (
            <div
              key={combo.id}
              className="flex items-center gap-4 p-4 border rounded-lg bg-white dark:bg-neutral-800 shadow-sm"
            >
              <img
                src={combo.image}
                alt={combo.name}
                className="w-16 h-16 object-cover rounded-md border"
              />
              <div className="flex-1">
                <div className="font-medium text-base">{combo.name}</div>
                <div className="text-sm text-gray-500 line-through">
                  {originalPrice.toLocaleString()} VND
                </div>
                <div className="text-orange-500 font-semibold">
                  {combo.price.toLocaleString()} VND
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateComboQuantity(combo, quantity - 1)}
                  className="w-8 h-8 rounded-full dark:bg-neutral-700 hover:bg-neutral-600 flex items-center justify-center text-lg"
                  disabled={quantity <= 0}
                >
                  -
                </button>
                <div className="w-6 text-center">{quantity}</div>
                <button
                  onClick={() => updateComboQuantity(combo, quantity + 1)}
                  className="w-8 h-8 rounded-full dark:bg-neutral-700 hover:bg-neutral-600 flex items-center justify-center text-lg"
                >
                  +
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
