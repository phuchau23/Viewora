import SnackDetailPage from "./components/page";

type PageProps = {
  params: {
    id: string;
  };
};

export default function Page({ params }: PageProps) {
  return <SnackDetailPage params={params} />;
}
