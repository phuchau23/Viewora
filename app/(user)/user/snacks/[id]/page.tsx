import SnackDetailPage from "./components/page";

export default function Page({ params }: { params: { id: string } }) {
  return <SnackDetailPage params={params} />;
}
