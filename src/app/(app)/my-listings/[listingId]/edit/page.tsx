import { PlaceholderPage } from "@/components/shell/PlaceholderPage";

type EditListingPageProps = {
  params: Promise<{ listingId: string }>;
};

export default async function EditListingPage({ params }: EditListingPageProps) {
  const { listingId } = await params;

  return (
    <PlaceholderPage
      eyebrow="Module 3"
      title={`Edit Listing ${listingId}`}
      description="This route will host listing update, media management, and publish actions."
    />
  );
}
