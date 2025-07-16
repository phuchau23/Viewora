"use client";
import React from "react";

interface Props {
  paymentMethod: "vnpay" | "momo" | null;
  setPaymentMethod: (method: "vnpay" | "momo") => void;
}

const PaymentMethodSelector: React.FC<Props> = ({ paymentMethod, setPaymentMethod }) => {
  return (
    <div className="mb-6">
      <h2 className="text-base font-semibold text-gray-800 mb-3 text-center">Chọn phương thức thanh toán:</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* VNPay Option */}
        <div
          onClick={() => setPaymentMethod("vnpay")}
          className={`cursor-pointer border rounded-xl px-6 py-6 flex flex-col items-center justify-center text-center shadow-sm hover:shadow-md transition ${
            paymentMethod === "vnpay" ? "border-orange-500 bg-orange-50" : "border-gray-300"
          }`}
        >
          <img src="/vnpay-logo-inkythuatso-01.png" alt="VNPay" className="w-14 h-14 object-contain mb-2" />
          <span className="text-base font-medium text-gray-800">VNPay</span>
        </div>

        {/* MoMo Option */}
        <div
          onClick={() => setPaymentMethod("momo")}
          className={`cursor-pointer border rounded-xl px-6 py-6 flex flex-col items-center justify-center text-center shadow-sm hover:shadow-md transition ${
            paymentMethod === "momo" ? "border-pink-500 bg-pink-50" : "border-gray-300"
          }`}
        >
          <img src="https://upload.wikimedia.org/wikipedia/vi/f/fe/MoMo_Logo.png" alt="MoMo" className="w-14 h-14 object-contain mb-2" />
          <span className="text-base font-medium text-gray-800">MoMo</span>
        </div>
      </div>

      {!paymentMethod && (
        <p className="text-sm text-red-600 mt-3 text-center">
          Vui lòng chọn một phương thức thanh toán để tiếp tục.
        </p>
      )}
    </div>
  );
};

export default PaymentMethodSelector;