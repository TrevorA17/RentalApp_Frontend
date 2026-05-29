import Container from "@mui/material/Container";
import type { PropsWithChildren } from "react";

export function PageSection({ children }: PropsWithChildren) {
  return (
    <Container maxWidth="lg" sx={{ py: { xs: 3, md: 4 } }}>
      {children}
    </Container>
  );
}
