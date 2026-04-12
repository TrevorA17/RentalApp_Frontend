import { getPublicProfile } from "@/lib/api/profiles";
import { getAgentRecommendations } from "@/lib/api/recommendations";
import { PageSection } from "@/components/shell/PageSection";
import { PublicProfileView } from "@/features/profiles/PublicProfileView";

type AgentProfilePageProps = {
  params: Promise<{ agentUserId: string }>;
};

export default async function AgentProfilePage({ params }: AgentProfilePageProps) {
  const { agentUserId } = await params;
  const [profile, recommendations] = await Promise.all([
    getPublicProfile(agentUserId),
    getAgentRecommendations(agentUserId),
  ]);

  return (
    <PageSection>
      <PublicProfileView profile={profile} recommendations={recommendations} />
    </PageSection>
  );
}
