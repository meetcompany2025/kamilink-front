import FreightDetailsClient from "./FreightDetailsPage";

export const dynamic = "force-dynamic"; // Garante que a página é tratada como dinâmica (SSR)


export default async function FreightDetailsPage({ params }: { params: { id: string } }) {
  return <FreightDetailsClient id={params.id} />;
}
