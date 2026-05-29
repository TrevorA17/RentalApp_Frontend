"use client";

import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import { Heart } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/features/auth/AuthProvider";
import {
  getSavedListingIds,
  removeSavedListing,
  saveListing,
} from "@/lib/api/savedListings";

type SaveListingButtonProps = {
  listingId: string;
  variant?: "contained" | "outlined" | "text";
  iconOnly?: boolean;
  onSavedChange?: (saved: boolean) => void;
};

export function SaveListingButton({
  listingId,
  variant = "outlined",
  iconOnly = false,
  onSavedChange,
}: SaveListingButtonProps) {
  const { session } = useAuth();
  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const onSavedChangeRef = useRef(onSavedChange);

  useEffect(() => {
    onSavedChangeRef.current = onSavedChange;
  }, [onSavedChange]);

  useEffect(() => {
    async function loadSavedState() {
      if (!session?.accessToken) {
        setIsSaved(false);
        return;
      }

      try {
        const ids = await getSavedListingIds();
        const saved = ids.includes(listingId);
        setIsSaved(saved);
        onSavedChangeRef.current?.(saved);
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Failed to load saved listing state.";
        setErrorMessage(message);
      }
    }

    void loadSavedState();
  }, [listingId, session?.accessToken]);

  async function handleToggle() {
    if (!session?.accessToken) {
      setErrorMessage("Sign in to save listings.");
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      if (isSaved) {
        await removeSavedListing(listingId);
        setIsSaved(false);
        onSavedChangeRef.current?.(false);
      } else {
        await saveListing(listingId);
        setIsSaved(true);
        onSavedChangeRef.current?.(true);
      }
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to update saved listing state.";
      setErrorMessage(message);
    } finally {
      setIsLoading(false);
    }
  }

  if (iconOnly) {
    return (
      <Tooltip title={isSaved ? "Remove from saved" : "Save listing"}>
        <IconButton
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            void handleToggle();
          }}
          disabled={isLoading}
          sx={{
            bgcolor: "rgba(255,255,255,0.92)",
            backdropFilter: "blur(4px)",
            "&:hover": { bgcolor: "rgba(255,255,255,1)" },
          }}
          size="small"
        >
          <Heart
            size={18}
            fill={isSaved ? "#c86b2a" : "none"}
            color={isSaved ? "#c86b2a" : "#475569"}
          />
        </IconButton>
      </Tooltip>
    );
  }

  return (
    <>
      {errorMessage ? <Alert severity="info">{errorMessage}</Alert> : null}
      <Button
        variant={variant}
        color={isSaved ? "secondary" : "primary"}
        onClick={handleToggle}
        disabled={isLoading}
        startIcon={<Heart size={16} fill={isSaved ? "currentColor" : "none"} />}
      >
        {isSaved ? "Saved" : "Save listing"}
      </Button>
    </>
  );
}
