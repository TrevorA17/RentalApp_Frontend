import { PageSection } from "@/components/shell/PageSection";
import { PlaceholderPage } from "@/components/shell/PlaceholderPage";

type ListingDetailPageProps = {
  params: Promise<{ listingId: string }>;
};

export default async function ListingDetailPage({ params }: ListingDetailPageProps) {
  const { listingId } = await params;

  return (
    <PageSection>
      <PlaceholderPage
        eyebrow="Listing Detail"
        title={`Listing ${listingId}`}
        description="This page will show pricing, media, amenities, poster summary, save action, and inquiry flow."
        primaryHref="/listings"
        primaryLabel="Back To Listings"
      />
    </PageSection>
  );
}
