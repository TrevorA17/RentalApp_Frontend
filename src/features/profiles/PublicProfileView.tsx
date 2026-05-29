import Chip from "@mui/material/Chip";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { AgentRecommendationsSection } from "@/features/recommendations/AgentRecommendationsSection";
import type { AgentRecommendation, Profile } from "@/types/domain";

type PublicProfileViewProps = {
  profile: Profile;
  recommendations: AgentRecommendation[];
};

export function PublicProfileView({
  profile,
  recommendations,
}: PublicProfileViewProps) {
  return (
    <Stack spacing={3}>
      <Paper sx={{ p: { xs: 3, md: 4 } }}>
        <Stack spacing={2}>
          <Chip
            label={`${profile.role ?? "USER"}${profile.verificationStatus ? ` - ${profile.verificationStatus}` : ""}`}
            color="secondary"
            sx={{ width: "fit-content" }}
          />
          <Typography variant="h3">{profile.fullName}</Typography>
          <Typography color="text.secondary" maxWidth={720}>
            {profile.bio || "This profile has not added a public bio yet."}
          </Typography>
        </Stack>
      </Paper>

      <Paper sx={{ p: { xs: 3, md: 4 } }}>
        <Stack spacing={1.5}>
          <Typography variant="h5">Profile details</Typography>
          <Typography color="text.secondary">
            City: {profile.city || "Not provided"}
          </Typography>
          <Typography color="text.secondary">
            Service areas:{" "}
            {profile.serviceAreas && profile.serviceAreas.length > 0
              ? profile.serviceAreas.join(", ")
              : "Not provided"}
          </Typography>
          <Typography color="text.secondary">
            Company: {profile.companyName || "Not provided"}
          </Typography>
          <Typography color="text.secondary">
            Fee structure: {profile.feeStructure || "Not provided"}
          </Typography>
          <Typography color="text.secondary">
            Contact: {profile.phoneNumber || "Not provided"}
          </Typography>
        </Stack>
      </Paper>

      {profile.role === "AGENT" ? (
        <AgentRecommendationsSection
          agentUserId={profile.userId}
          initialRecommendations={recommendations}
        />
      ) : null}
    </Stack>
  );
}
