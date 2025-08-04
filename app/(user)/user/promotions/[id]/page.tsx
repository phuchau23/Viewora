type PageProps = {
  params: {
    id: string;
  };
};

import PromotionDetailPage from "./components/page";

export default function Page({ params }: PageProps) {
  return <PromotionDetailPage params={params} />;
}
