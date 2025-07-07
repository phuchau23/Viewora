// app/page.tsx
import { Metadata } from "next";
import Header from "@/components/header";
import Footer from "@/components/footer";
import HomeClient from "@/components/common/homeClient";

export const metadata: Metadata = {
  title: "Đặt vé phim online | Viewora",
  description:
    "Đặt vé xem phim trực tuyến nhanh chóng, chọn ghế dễ dàng. Nhiều ưu đãi hấp dẫn và phim mới cập nhật liên tục tại Viewora.",
  openGraph: {
    title: "Đặt vé phim online | Viewora",
    description:
      "Trải nghiệm điện ảnh đỉnh cao – không bỏ lỡ khoảnh khắc nào tại Viewora.",
    url: "https://viewora.io.vn",
    images: ["/og-image.jpg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Đặt vé phim online | Viewora",
    description: "Xem lịch chiếu, chọn ghế, đặt vé tiện lợi.",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://viewora.io.vn",
  },
};

export default function HomePage() {
  return (
    <div className="max-w-screen-xl mx-auto">
      <Header />
      <HomeClient />
      <Footer />
    </div>
  );
}
