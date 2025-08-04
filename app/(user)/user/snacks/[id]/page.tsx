import SnackDetailPage from "./components/SnackDetailPage";

type Props = {
  params: {
    id: string;
  };
};

export default function Page({ params }: Props) {
  return <SnackDetailPage params={params} />;
}
