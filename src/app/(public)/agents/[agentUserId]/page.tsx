import { PageSection } from "@/components/shell/PageSection";
import { PlaceholderPage } from "@/components/shell/PlaceholderPage";

type AgentProfilePageProps = {
  params: Promise<{ agentUserId: string }>;
};

export default async function AgentProfilePage({ params }: AgentProfilePageProps) {
  const { agentUserId } = await params;

  return (
    <PageSection>
      <PlaceholderPage
        eyebrow="Agent Profile"
        title={`Agent ${agentUserId}`}
        description="This public profile route will host the trust layer: profile details, fee transparency, and recommendations."
        primaryHref="/listings"
        primaryLabel="Browse Listings"
      />
    </PageSection>
  );
}
