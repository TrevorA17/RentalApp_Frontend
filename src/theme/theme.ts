"use client";

import { createTheme } from "@mui/material/styles";

// Modern utility palette. Brand teal kept as the accent; warm cream removed in
// favor of slate-neutral surfaces. Fraunces is reserved for marketing accents
// only — utility UI uses Inter.

export const appTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#0e6b73",
      dark: "#0a4248",
      light: "#5ba2a8",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#c86b2a",
      dark: "#8e4818",
      light: "#e9a169",
      contrastText: "#ffffff",
    },
    background: {
      default: "#f8fafc",
      paper: "#ffffff",
    },
    text: {
      primary: "#0f172a",
      secondary: "#475569",
      disabled: "#94a3b8",
    },
    divider: "rgba(15, 23, 42, 0.08)",
    grey: {
      50: "#f8fafc",
      100: "#f1f5f9",
      200: "#e2e8f0",
      300: "#cbd5e1",
      400: "#94a3b8",
      500: "#64748b",
      600: "#475569",
      700: "#334155",
      800: "#1e293b",
      900: "#0f172a",
    },
  },
  shape: {
    borderRadius: 10,
  },
  typography: {
    fontFamily: 'var(--font-sans), -apple-system, "Segoe UI", sans-serif',
    h1: {
      fontSize: "2.75rem",
      fontWeight: 700,
      lineHeight: 1.1,
      letterSpacing: "-0.025em",
    },
    h2: {
      fontSize: "2rem",
      fontWeight: 700,
      lineHeight: 1.2,
      letterSpacing: "-0.02em",
    },
    h3: {
      fontSize: "1.5rem",
      fontWeight: 700,
      lineHeight: 1.25,
      letterSpacing: "-0.015em",
    },
    h4: {
      fontSize: "1.25rem",
      fontWeight: 700,
      lineHeight: 1.3,
      letterSpacing: "-0.01em",
    },
    h5: {
      fontSize: "1.0625rem",
      fontWeight: 700,
      lineHeight: 1.35,
    },
    h6: {
      fontSize: "0.9375rem",
      fontWeight: 700,
      lineHeight: 1.4,
    },
    subtitle1: {
      fontSize: "0.9375rem",
      fontWeight: 500,
    },
    subtitle2: {
      fontSize: "0.8125rem",
      fontWeight: 600,
    },
    body1: { fontSize: "0.9375rem", lineHeight: 1.5 },
    body2: { fontSize: "0.875rem", lineHeight: 1.5 },
    button: {
      textTransform: "none",
      fontWeight: 600,
      letterSpacing: 0,
    },
    overline: {
      fontWeight: 700,
      letterSpacing: "0.08em",
    },
  },
  components: {
    MuiPaper: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: {
          backgroundImage: "none",
          border: "1px solid rgba(15, 23, 42, 0.08)",
        },
        outlined: {
          borderColor: "rgba(15, 23, 42, 0.08)",
        },
      },
    },
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: {
          borderRadius: 8,
          paddingInline: 16,
          minHeight: 40,
          fontWeight: 600,
          boxShadow: "none",
        },
        sizeLarge: { minHeight: 48, paddingInline: 22 },
        sizeSmall: { minHeight: 32, paddingInline: 12, fontSize: "0.8125rem" },
        outlined: { borderWidth: 1 },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          letterSpacing: 0,
          borderRadius: 6,
        },
        sizeSmall: { height: 22 },
      },
    },
    MuiTextField: {
      defaultProps: { size: "small" },
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 8,
            backgroundColor: "#ffffff",
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiCard: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: {
          border: "1px solid rgba(15, 23, 42, 0.08)",
          borderRadius: 12,
        },
      },
    },
    MuiAppBar: {
      defaultProps: { elevation: 0, color: "inherit" },
      styleOverrides: {
        root: {
          backgroundColor: "#ffffff",
          borderBottom: "1px solid rgba(15, 23, 42, 0.08)",
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: { fontWeight: 600 },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          fontSize: "0.75rem",
          backgroundColor: "#0f172a",
        },
        arrow: { color: "#0f172a" },
      },
    },
  },
});
