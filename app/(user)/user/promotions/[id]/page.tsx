// app/(user)/user/promotions/[id]/page.tsx

import PromotionDetailPage from "./components/PromotionDetailPage";

export default async function PromotionPage(props: {
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;
  return <PromotionDetailPage params={params} />;
}

export async function generateMetadata(props: {
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;
  return {
    title: `Viewora - Đặt vé xem phim`,
  };
}
