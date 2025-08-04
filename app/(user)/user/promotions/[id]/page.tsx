// app/(user)/user/promotions/[id]/page.tsx

import PromotionDetailPage from "./components/PromotionDetailPage";

export default function PromotionPage({ params }: { params: { id: string } }) {
  return <PromotionDetailPage params={params} />;
}

export async function generateMetadata({ params }: { params: { id: string } }) {
  return {
    title: `Promotion ${params.id}`,
  };
}
