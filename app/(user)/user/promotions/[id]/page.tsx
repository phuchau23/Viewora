// app/(user)/user/promotions/[id]/page.tsx

type PageProps = {
  params: {
    id: string;
  };
};

export default function Page({ params }: PageProps) {
  return <div>Promotion ID: {params.id}</div>;
}

export async function generateMetadata({ params }: PageProps) {
  return {
    title: `Promotion ${params.id}`,
  };
}
