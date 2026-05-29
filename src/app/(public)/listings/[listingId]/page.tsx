import { PageSection } from "@/components/shell/PageSection";
import { PublicListingView } from "@/features/listings/PublicListingView";
import { getListingById } from "@/lib/api/listings";

type ListingDetailPageProps = {
  params: Promise<{ listingId: string }>;
};

export default async function ListingDetailPage({
  params,
}: ListingDetailPageProps) {
  const { listingId } = await params;
  const listing = await getListingById(listingId);

  return (
    <PageSection>
      <PublicListingView listing={listing} />
    </PageSection>
  );
}
