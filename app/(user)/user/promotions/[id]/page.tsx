import PromotionDetailPage from "./components/page";

export default function Page({ params }: { params: { id: string } }) {
  return <PromotionDetailPage params={params} />;
}
