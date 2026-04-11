import { PageSection } from "@/components/shell/PageSection";
import { PlaceholderPage } from "@/components/shell/PlaceholderPage";

export default function LoginPage() {
  return (
    <PageSection>
      <PlaceholderPage
        eyebrow="Module 1"
        title="Login"
        description="This page is scaffolded for the auth module. Next step is wiring the login form, validation, and token handling."
        primaryHref="/register"
        primaryLabel="Go To Register"
      />
    </PageSection>
  );
}
