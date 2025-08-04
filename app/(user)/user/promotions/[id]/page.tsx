// app/(user)/user/promotions/[id]/page.tsx

import PromotionDetailPage from "./components/PromotionDetailPage";

type Props = {
  params: {
    id: string;
  };
};

export default function Page({ params }: Props) {
  return <PromotionDetailPage params={params} />;
}

export async function generateMetadata({ params }: Props) {
  return {
    title: `Promotion ${params.id}`,
  };
}
