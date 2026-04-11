"use client";

import { createTheme } from "@mui/material/styles";

export const appTheme = createTheme({
  palette: {
    primary: {
      main: "#135d66",
      dark: "#0d3d43",
      light: "#4f8f97",
    },
    secondary: {
      main: "#d97b29",
      dark: "#9d571c",
      light: "#eba76b",
    },
    background: {
      default: "#f3f6fb",
      paper: "#fffaf4",
    },
    text: {
      primary: "#13223a",
      secondary: "#4d5b73",
    },
  },
  shape: {
    borderRadius: 18,
  },
  typography: {
    fontFamily: '"Segoe UI", "Helvetica Neue", sans-serif',
    h1: {
      fontSize: "3rem",
      fontWeight: 700,
      lineHeight: 1.1,
    },
    h2: {
      fontSize: "2.2rem",
      fontWeight: 700,
    },
    h3: {
      fontSize: "1.5rem",
      fontWeight: 700,
    },
    button: {
      textTransform: "none",
      fontWeight: 600,
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          border: "1px solid rgba(19, 34, 58, 0.08)",
          boxShadow: "0 22px 44px rgba(19, 34, 58, 0.08)",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 999,
          paddingInline: 18,
        },
      },
    },
  },
});
