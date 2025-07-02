"use client";
import { useState } from "react";
import { CreditCard, Smartphone, Wallet, CheckCircle } from "lucide-react";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import React from "react";

const paymentMethods = [
  {
    id: "cash",
    label: "Thanh toán tiền mặt",
    icon: <Wallet className="w-5 h-5 text-orange-500" />,
  },
  {
    id: "vnpay",
    label: "Thanh toán qua VNPAY",
    icon: <CreditCard className="w-5 h-5 text-blue-500" />,
  },
  {
    id: "momo",
    label: "Thanh toán qua MoMo",
    icon: <Smartphone className="w-5 h-5 text-fuchsia-500" />,
  },
];

export default function PaymentLayout({
  originalTotal,
  finalPrice,
  promotionCode,
  discountAmount,
}: {
  originalTotal: number;
  finalPrice: number;
  promotionCode: string;
  discountAmount: number;
}) {
  const [selected, setSelected] = useState("vnpay");

  return (
    <div className="min-h-screen bg-orange-50 flex items-center justify-center">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-5xl">
        {/* LEFT CARD: Phương thức + Tổng tiền */}
        <Card className="bg-white rounded-xl shadow-lg p-4 space-y-6">
          <CardTitle className="text-xl bold text-orange-600 text-center pt-2 ">
            Chọn phương thức thanh toán
          </CardTitle>
          <Separator orientation="horizontal" />
          <CardDescription>
            <div className="space-y-3">
              {paymentMethods.map((method) => (
                <button
                  key={method.id}
                  onClick={() => setSelected(method.id)}
                  className={`w-full flex justify-between items-center border rounded-xl p-4 transition shadow-sm ${
                    selected === method.id
                      ? "bg-white border-orange-500 ring-2 ring-orange-300"
                      : "bg-orange-100 hover:bg-orange-200"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {method.icon}
                    <span className="font-medium text-sm">{method.label}</span>
                  </div>
                  {selected === method.id && (
                    <CheckCircle className="text-orange-500 w-5 h-5" />
                  )}
                </button>
              ))}
            </div>
          </CardDescription>
          <div className="pt-6 border-t">
            <CardTitle className="text-lg font-medium mb-2">
              Tổng thanh toán
            </CardTitle>
            <div className="flex justify-between">
              <span>Ghế + Combo</span>
              <span>{originalTotal.toLocaleString()}đ</span>
            </div>
            <div className="flex justify-between text-green-600">
              <span>Mã {promotionCode}</span>
              <span>- {discountAmount.toLocaleString()}đ</span>
            </div>
            <div className="flex justify-between font-bold text-lg mt-2">
              <span>Thành tiền:</span>
              <span className="text-orange-600">{finalPrice.toLocaleString()}đ</span>
            </div>
          </div>

          <button className="w-full bg-orange-500 text-white py-3 rounded-full font-semibold hover:bg-orange-600 transition mt-4">
            Xác nhận thanh toán
          </button>
        </Card>

        {/* RIGHT CARD: Thông tin đặt vé */}
        {/* <Card className="bg-white rounded-xl shadow-lg p-6 space-y-4">
          <CardHeader className="text-lg font-semibold text-orange-600 border-b pb-2 mb-3">
            <CardTitle>Chi tiết đặt vé</CardTitle>
          </CardHeader>
          <CardDescription>
            <div className="grid grid-cols-2 gap-y-3 text-sm">
              <span className="text-gray-500">Rạp:</span>
              <span className="font-medium text-right">Cinema Thủ Đức</span>

              <span className="text-gray-500">Phim:</span>
              <span className="font-medium text-right">Kungfu Panda 4</span>

              <span className="text-gray-500">Giờ chiếu:</span>
              <span className="font-medium text-right">13:39</span>

              <span className="text-gray-500">Ghế:</span>
              <span className="font-medium text-right">E5 - VIP</span>

              <span className="text-gray-500">Combo:</span>
              <span className="font-medium text-right">Chesse Corn x1</span>
            </div>
          </CardDescription>
        </Card>
      </div>
    </div>
  );
}
