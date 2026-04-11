import { getPublicProfile } from "@/lib/api/profiles";
import { PageSection } from "@/components/shell/PageSection";
import { PublicProfileView } from "@/features/profiles/PublicProfileView";

type AgentProfilePageProps = {
  params: Promise<{ agentUserId: string }>;
};

export default async function AgentProfilePage({ params }: AgentProfilePageProps) {
  const { agentUserId } = await params;
  const profile = await getPublicProfile(agentUserId);

  return (
    <PageSection>
      <PublicProfileView profile={profile} />
    </PageSection>
  );
}
