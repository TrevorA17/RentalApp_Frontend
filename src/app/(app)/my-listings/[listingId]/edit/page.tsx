import { ListingForm } from "@/features/listings/ListingForm";

type EditListingPageProps = {
  params: Promise<{ listingId: string }>;
};

export default async function EditListingPage({
  params,
}: EditListingPageProps) {
  const { listingId } = await params;

  return <ListingForm mode="edit" listingId={listingId} />;
}
