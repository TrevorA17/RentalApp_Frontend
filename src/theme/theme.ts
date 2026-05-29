"use client";

import { createTheme } from "@mui/material/styles";

export const appTheme = createTheme({
  palette: {
    primary: {
      main: "#0e6b73",
      dark: "#0a4248",
      light: "#63a8ad",
    },
    secondary: {
      main: "#c86b2a",
      dark: "#8e4818",
      light: "#e9a169",
    },
    background: {
      default: "#f3f1ea",
      paper: "rgba(255, 251, 245, 0.9)",
    },
    text: {
      primary: "#162338",
      secondary: "#5a6473",
    },
  },
  shape: {
    borderRadius: 22,
  },
  typography: {
    fontFamily: 'var(--font-sans), "Segoe UI", sans-serif',
    h1: {
      fontSize: "3.35rem",
      fontWeight: 700,
      lineHeight: 1.02,
      letterSpacing: "-0.04em",
      fontFamily: "var(--font-display), Georgia, serif",
    },
    h2: {
      fontSize: "2.5rem",
      fontWeight: 700,
      letterSpacing: "-0.03em",
      fontFamily: "var(--font-display), Georgia, serif",
    },
    h3: {
      fontSize: "1.75rem",
      fontWeight: 700,
      letterSpacing: "-0.02em",
      fontFamily: "var(--font-display), Georgia, serif",
    },
    h4: {
      fontFamily: "var(--font-display), Georgia, serif",
    },
    h5: {
      fontFamily: "var(--font-display), Georgia, serif",
    },
    h6: {
      fontFamily: "var(--font-display), Georgia, serif",
    },
    button: {
      textTransform: "none",
      fontWeight: 700,
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          border: "1px solid rgba(19, 34, 58, 0.08)",
          backdropFilter: "blur(12px)",
          boxShadow: "0 24px 70px rgba(19, 34, 58, 0.08)",
          backgroundImage: "none",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 999,
          paddingInline: 18,
          minHeight: 44,
          boxShadow: "none",
          fontWeight: 700,
        },
        contained: {
          boxShadow: "0 14px 34px rgba(14, 107, 115, 0.18)",
        },
        outlined: {
          borderWidth: 1.5,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 700,
          letterSpacing: "0.02em",
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 18,
            backgroundColor: "rgba(255,255,255,0.72)",
          },
        },
      },
    },
  },
});
