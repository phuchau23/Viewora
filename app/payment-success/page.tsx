'use client'
import { useRouter } from 'next/navigation';

export default function PaymentSuccess() {
  const router = useRouter();

  const handleGoHome = () => {
    router.push('/');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg text-center max-w-md w-full">
        <div className="text-green-500 text-6xl mb-4">✔</div>
        <h1 className="text-2xl font-semibold text-gray-800 mb-2">Thanh toán thành công!</h1>
        <p className="text-gray-600 mb-6">
          Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi. Đơn hàng đã được xử lý thành công.
        </p>
        <button
          onClick={handleGoHome}
          className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg transition duration-300"
        >
          Quay về trang chủ
        </button>
      </div>
    </div>
  );
}
