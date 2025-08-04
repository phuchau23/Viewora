import SnackDetailPage from "./components/SnackDetailPage";

type PageProps = {
  params: {
    id: string;
  };
};

export default function Page({ params }: PageProps) {
  return <SnackDetailPage params={params} />;
}
