import { Suspense } from "react";
import { PageSection } from "@/components/shell/PageSection";
import { ListingsBrowseView } from "@/features/listings/ListingsBrowseView";

export default function ListingsPage() {
  return (
    <PageSection>
      <Suspense fallback={null}>
        <ListingsBrowseView />
      </Suspense>
    </PageSection>
  );
}
