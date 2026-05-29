import Container from "@mui/material/Container";
import type { PropsWithChildren } from "react";

export function PageSection({ children }: PropsWithChildren) {
  return (
    <Container maxWidth="xl" sx={{ py: { xs: 4, md: 7 } }}>
      {children}
    </Container>
  );
}
