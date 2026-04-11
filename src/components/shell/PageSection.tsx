import Container from "@mui/material/Container";
import { PropsWithChildren } from "react";

export function PageSection({ children }: PropsWithChildren) {
  return (
    <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
      {children}
    </Container>
  );
}
