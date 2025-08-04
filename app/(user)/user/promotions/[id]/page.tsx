type PageProps = {
  params: {
    id: string;
  };
};

import PromotionDetailPage from "./components/PromotionDetailPage";

export default function Page({ params }: PageProps) {
  return <PromotionDetailPage params={params} />;
}
