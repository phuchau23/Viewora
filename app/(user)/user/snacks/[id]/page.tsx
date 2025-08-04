import SnackDetailPage from "./components/SnackDetailPage";

export default function SnackPage({ params }: { params: { id: string } }) {
  return <SnackDetailPage params={params} />;
}
export async function generateMetadata({ params }: { params: { id: string } }) {
  return {
    title: `Snack ${params.id}`,
  };
}
