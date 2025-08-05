import SnackDetailPage from "./components/SnackDetailPage";

export default async function SnackPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  return <SnackDetailPage params={params} />;
}
export async function generateMetadata(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  return {
    title: `Snack ${params.id}`,
  };
}
