import { PageSection } from "@/components/shell/PageSection";
import { AdminModerationHistoryView } from "@/features/admin/AdminModerationHistoryView";

export default function AdminHomePage() {
  return (
    <PageSection>
      <AdminModerationHistoryView />
    </PageSection>
  );
}
