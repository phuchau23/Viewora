export function formatVND(amount: number): string {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0, // không hiện phần thập phân
    }).format(amount);
  }
  
  // Ví dụ:
  console.log(formatVND(123456789)); // "123.456.789 ₫"