import { PageSection } from "@/components/shell/PageSection";
import { PlaceholderPage } from "@/components/shell/PlaceholderPage";

export default function RegisterPage() {
  return (
    <PageSection>
      <PlaceholderPage
        eyebrow="Module 1"
        title="Create an account"
        description="Registration will support renter, agent, and landlord roles in the first auth module slice."
        primaryHref="/login"
        primaryLabel="Go To Login"
      />
    </PageSection>
  );
}
