import HomeClient from "@/components/common/homeClient";
import ChatWidget from "@/app/chatbox/LiveChat";

export const metadata = {
  title: "Đặt vé phim online | Viewora",
  description:
    "Đặt vé xem phim trực tuyến nhanh chóng, chọn ghế dễ dàng. Ưu đãi hấp dẫn tại Viewora.",
  openGraph: {
    title: "Đặt vé phim online | Viewora",
    description: "Trải nghiệm điện ảnh đỉnh cao tại Viewora.",
    url: "https://viewora.io.vn",
    images: [
      {
        url: "https://viewora.io.vn/logo1.png",
        width: 1200,
        height: 630,
        alt: "Viewora Banner",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Đặt vé phim online | Viewora",
    description: "Xem lịch chiếu, chọn ghế, đặt vé tiện lợi.",
    images: ["https://viewora.io.vn/logo1.png"],
  },
  keywords: [
    "đặt vé phim",
    "viewora",
    "xem phim online",
    "rạp phim",
    "chọn ghế",
  ],
  robots: "index, follow",
};

export default function Page() {
  return (
    <>
      <HomeClient />
      <ChatWidget />
    </>
  );
}
