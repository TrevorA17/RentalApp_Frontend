import { Suspense } from "react";
import { PageSection } from "@/components/shell/PageSection";
import { LoginForm } from "@/features/auth/LoginForm";

export default function LoginPage() {
  return (
    <PageSection>
      <Suspense fallback={null}>
        <LoginForm />
      </Suspense>
    </PageSection>
  );
}
